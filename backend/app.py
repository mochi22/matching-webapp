from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
import pymongo
import logging
import uuid
from datetime import timedelta

from models import User

app = Flask(__name__)
CORS(app)  # すべてのリクエストを許可します

# # Sessionの暗号化キー
app.secret_key = b'abcdefghijklmna'
# # セッションの永続化設定（クッキーの有効期限を設定）
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)



# ログレベルの設定
# DEBUG: 詳細なデバッグ情報
# INFO: 想定されたイベントの情報
# WARNING: 想定外の状況や問題が発生したが、処理は続行可能
# ERROR: 重大なエラーが発生し、処理が続行不可能
# CRITICAL: システムが停止し、緊急の対応が必要
logging.basicConfig(level=logging.DEBUG)



# MongoDBに接続するためのクライアントを作成
client = pymongo.MongoClient("mongodb://localhost:27017/")
# データベースを選択
db = client["matchingservice_main_database"]
# コレクションを選択
users_collection = db["information_users"] #user information
authenticated_users = db["authenticated_users"] #_id, username, password


## End points
@app.route('/')
def index():
    return 'Hello, World! This is the response from Flask.'

##### POST
# ユーザー登録
@app.route('/registeruser', methods=['POST'])
def register():
    
    # リクエストからユーザー名とパスワードを取得
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user_uuid = str(uuid.uuid4())  # 一意のUUIDを生成

    print("name, pass: ",username, password)
    # authenticated_usersからユーザー名を取得してリストに変換
    authenticated_usernames = [user['username'] for user in authenticated_users.find({}, {'_id': 0, 'username': 1})]

    # ユーザー名がすでに登録されているかチェック
    if username in authenticated_usernames:
        return jsonify({'message': 'Username already exists'}), 400

    # ユーザーデータを格納
    authenticated_users.insert_one({'username': username, 'password': password, 'user_uuid': user_uuid})

    return jsonify({'message': 'User registered successfully'})


@app.route('/login', methods=['POST'])
def login():

    # user_uuid =  request.json.get('uuid')
    username = request.json.get('username')
    password = request.json.get('password')

    # authenticated_usersからユーザー名を取得してリストに変換
    authenticated_user = list(authenticated_users.find({'$and': [{'username': username}, {'password': password}]}, {'_id': 0}))[0]
    print(authenticated_user)
    user_uuid = authenticated_user["user_uuid"]
    
    print(user_uuid, username, password)
    if user_uuid and username and password:
        session.permanent = True  # セッションを永続化する

        # user = User("sample")

        # login_user(user)
        session["username"]=username
        session["user_uuid"]=user_uuid
        # print("current",current_user.is_authenticated)
        print(session)

        return {'message': 'Login successful', 'user_uuid': user_uuid, 'session': session}, 200
    else:
        return {'message': 'Login failed'}, 401


# logout endpoint
@app.route('/logout', methods=['POST'])
def logout():
    print("sesesion",session)
    print("app logout start")
    # ログアウト処理
    # logout_user()
    session.pop('user_uuid', None)  # セッションからユーザー名を削除
    session.pop('username', None)
    session.clear()
    # ログアウト後の処理
    print(session)
    return jsonify({'message': 'Logout successful'}), 200



# ユーザー情報を保存するエンドポイント
@app.route('/postuserinfo', methods=['POST'])
def register_user():
    user_uuid = request.headers.get('Authorization').split(' ')[1]

    user_data = request.json
    # user_id = str(uuid.uuid4())  # 一意のUUIDを生成
    user_data['user_uuid'] = user_uuid  # ユーザーにIDを追加
    # ユーザー情報をデータベースに保存
    users_collection.insert_one(user_data)
    return jsonify({'message': 'User data saved successfully', 'user_uuid': user_uuid}), 201


@app.route('/favorites', methods=['POST', 'GET'])
def favorites():
    if request.method == 'GET':
        # user_uuid = data.get('user_uuid')
        user_uuid = request.headers.get('Authorization').split(' ')[1]
        # print(user_uuid)
        # お気に入りのユーザーデータを取得する処理を実装する
        authenticated_user = list(users_collection.find({'user_uuid': user_uuid}, {'_id': 0}))
        # print(authenticated_user)
        if len(authenticated_user)==1:
            authenticated_user = authenticated_user[0]
        favorites_uuid = authenticated_user["favorites"][0]  # お気に入りのユーザーデータを取得する処理を実装する
        # print("favorite uuid", favorites_uuid)
        favorites_user = list(users_collection.find({'user_uuid': favorites_uuid}, {'_id': 0}))
        # print("favorites", favorites_user)
        return jsonify(favorites_user)
    elif request.method == 'POST':
        data = request.json
        user_uuid = data.get('user_uuid')
        favorite_user_uuid = data.get('favorite_user_uuid')
        print(user_uuid, favorite_user_uuid)
        # お気に入りに追加する処理を実装する
        users_collection.update_one({'user_uuid': user_uuid}, {'$addToSet': {'favorites': favorite_user_uuid}})

        return jsonify({'message': 'Favorite added successfully'})


##### GET
# 全ユーザー情報を取得するエンドポイント
@app.route('/users', methods=['GET'])
def get_users():
    # データベースからユーザー情報を取得
    app.logger.info("info: called get all users")
    users_data = list(users_collection.find({}, {'_id': 0}))
    return jsonify(users_data)

# 特定のユーザー情報を取得するエンドポイント
@app.route('/users/<gender>', methods=['GET'])
def get_users_by_gender(gender):
    # MongoDBから特定の性別のユーザー情報を取得
    users_data = list(users_collection.find({'gender': gender}, {'_id': 0}))
    return jsonify(users_data)


# search user with gender and hobbies
@app.route('/users/filter=<gender>&<hobbies>', methods=['GET'])
def get_filtered_users(gender, hobbies):

    app.logger.info('called get_filtered_users: gender:%s, hobbies:%s', gender, hobbies)  # ログ出力

    # 必要なクエリパラメータが提供されているか確認
    if gender is not None and hobbies is not None:
        # クエリパラメータを使用してフィルタリング
        filtered_users = list(users_collection.find({'$and': [{'gender': gender}, {'hobbies': hobbies}]}, {'_id': 0}))

        app.logger.info('filtered users:%s',filtered_users)
        return jsonify(filtered_users)
    
    else:
        return 'Missing gender or hobbies parameters', 400  # クライアントエラーを返す場合


@app.route('/user_info', methods=["GET"])
def get_user_info():
    print("get user info")
    user_uuid = request.headers.get('Authorization').split(' ')[1]  # リクエストヘッダーからuser_uuidを取得
    session['user_uuid'] = user_uuid  # セッションにuser_uuidを保存
    # ここでセッションに保存されたuser_uuidを使用してデータを取得するなどの処理を行う
    authenticated_user = list(users_collection.find({'user_uuid': user_uuid}, {'_id': 0}))
    print("authenticated_user",authenticated_user)
    # username = authenticated_user["username"]
    print('Data received')
    if len(authenticated_user)==1:
        authenticated_user = authenticated_user[0]
    return authenticated_user


##### DELETE
## delete user
@app.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users_collection.delete_one({'uuid': user_id})
    if result.deleted_count == 1:
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404

## delete all users
@app.route('/users', methods=['DELETE'])
def delete_all_users():

    result = users_collection.delete_many({})  # データベース内の全てのユーザーを削除
    return jsonify({'message': f'{result.deleted_count} users deleted successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)