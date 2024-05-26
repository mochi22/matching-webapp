from flask import Flask, request, jsonify, session, make_response, Blueprint
from flask_cors import CORS
import pymongo
import logging
import uuid
from datetime import timedelta

# from utils import login_required


auth_blueprint = Blueprint('auth', __name__)
# MongoDBに接続するためのクライアントを作成
client = pymongo.MongoClient("mongodb://localhost:27017/")
# データベースを選択
db = client["matchingservice_main_database"]
# コレクションを選択
users_collection = db["information_users"] #user information

@auth_blueprint.route('/login', methods=['POST'])
def login():

    # user_uuid =  request.json.get('uuid')
    username = request.json.get('username')
    password = request.json.get('password')

    # authenticated_usersからユーザー名を取得してリストに変換
    authenticated_user = list(users_collection.find({'$and': [{'username': username}, {'password': password}]}, {'_id': 0}))[0]
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
@auth_blueprint.route('/logout', methods=['POST'])
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

# 他の認証関連のエンドポイントも同様に記述する
# ユーザー登録
@auth_blueprint.route('/registeruser', methods=['POST'])
def register():
    
    # リクエストからユーザー名とパスワードを取得
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user_uuid = str(uuid.uuid4())  # 一意のUUIDを生成

    print("name, pass: ",username, password)
    # authenticated_usersからユーザー名を取得してリストに変換
    authenticated_usernames = [user['username'] for user in users_collection.find({}, {'_id': 0, 'username': 1})]

    # ユーザー名がすでに登録されているかチェック
    if username in authenticated_usernames:
        return jsonify({'message': 'Username already exists'}), 400

    # ユーザーデータを格納
    users_collection.insert_one({'username': username, 'password': password, 'user_uuid': user_uuid})

    return jsonify({'message': 'User registered successfully'})

