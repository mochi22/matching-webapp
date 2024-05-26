from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
import pymongo
import logging
import uuid
from datetime import timedelta

from user.users_views import user_blueprint
from auth.auth_views import auth_blueprint



# from models import User

app = Flask(__name__)
CORS(app)  # すべてのリクエストを許可します

# # Sessionの暗号化キー
app.secret_key = b'abcdefghijklmna'
# # セッションの永続化設定（クッキーの有効期限を設定）
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

app.register_blueprint(user_blueprint)
app.register_blueprint(auth_blueprint)


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
relation_collection = db["relation"] #user information
users_collection = db["information_users"] #user information


## End points
@app.route('/')
def index():
    return 'Hello, World! This is the response from Flask.'



# ユーザー間の関係をチェックする関数
def check_relation_status(user1_id, user2_id):
    relation = relation_collection.find_one({
        "$or": [
            {"user1_id": user1_id, "user2_id": user2_id},
            {"user1_id": user2_id, "user2_id": user1_id}
        ]
    })
    return relation

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
        favorites_uuids = authenticated_user["favorites"]#[0]  # お気に入りのユーザーデータを取得する処理を実装する
        # favorites_user = list(users_collection.find({'user_uuid': favorites_uuids[0]}, {'_id': 0}))
        favorites_users = list(users_collection.find({"user_uuid": {"$in": favorites_uuids}}, {'_id': 0}))
        return jsonify(favorites_users)
    elif request.method == 'POST':
        data = request.json
        from_user_uuid = data.get('user_uuid')
        favorite_user_uuid = data.get('favorite_user_uuid')
        state = data.get("state") #relation state
        print(from_user_uuid, favorite_user_uuid, state)
        # お気に入りに追加する処理を実装する
        users_collection.update_one({'user_uuid': from_user_uuid}, {'$addToSet': {'favorites': favorite_user_uuid}})
        # relation = check_relation_status(from_user_uuid, favorite_user_uuid)
        # if relation:
        relation_collection.insert_one({'from_user_uuid': from_user_uuid, 'to_user_uuid': favorite_user_uuid, 'state': state})
        return jsonify({'message': 'Favorite added successfully'})



@app.route('/matching', methods=["GET",'POST'])
def check_favorite():
    if request.method == 'GET':
        user_uuid = request.headers.get('Authorization').split(' ')[1]
        print("ff kuraryu", user_uuid)
        users_like_me_lists = list(relation_collection.find({'to_user_uuid':user_uuid}, {'_id': 0}))
        favorites_ids = list(users_collection.find({'user_uuid':user_uuid}, {'_id': 0}))[0]["favorites"]

        matching = []
        for i in users_like_me_lists:
            print("iii", i, i["from_user_uuid"])
            if i["from_user_uuid"] in favorites_ids:
                matching.append(list(users_collection.find({'user_uuid': i["from_user_uuid"]}, {'_id': 0}))[0]) #i["from_user_uuid"]
        #  list(users_collection.find({'$and': [{'username': username}, {'password': password}]}, {'_id': 0}))[0]
        print("ggg", matching)
        return jsonify(matching)
    elif request.method == 'POST':
        data = request.json
        user_uuid = data['user_uuid']
        target_user_uuid = data['target_user_uuid']
        favorite_list = list(users_collection.find({'user_uuid':user_uuid}, {'_id': 0}))[0]["favorites"]
        print("favorite_list:",favorite_list)
        if target_user_uuid in favorite_list.get(user_uuid, []):
            return jsonify({'is_favorite': True})
        else:
            return jsonify({'is_favorite': False})



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

if __name__ == '__main__':
    app.run(debug=True)