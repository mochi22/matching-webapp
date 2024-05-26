from flask import Flask, request, jsonify, session, make_response, Blueprint, current_app
from flask_cors import CORS
import pymongo
import logging
import uuid
from datetime import timedelta

# from models import User
# from utils import login_required

user_blueprint = Blueprint('users', __name__)

# MongoDBに接続するためのクライアントを作成
client = pymongo.MongoClient("mongodb://localhost:27017/")
# データベースを選択
db = client["matchingservice_main_database"]
# コレクションを選択
relation_table = db["relation"] #user information
users_collection = db["information_users"] #user information




# @user_blueprint.route('/users', methods=['GET'])
# def get_users():
#     # データベースからユーザー情報を取得
#     users_data = User.get_all_users()
#     return jsonify(users_data)

# @user_blueprint.route('/users/<gender>', methods=['GET'])
# def get_users_by_gender(gender):
#     # MongoDBから特定の性別のユーザー情報を取得
#     users_data = User.get_users_by_gender(gender)
#     return jsonify(users_data)

# 他のユーザー関連のエンドポイントも同様に記述する
##### GET
# 全ユーザー情報を取得するエンドポイント
@user_blueprint.route('/users', methods=['GET', 'DELETE'])
def get_users():
    if request.method == 'GET':
        # データベースからユーザー情報を取得
        current_app.logger.info("info: called get all users")
        users_data = list(users_collection.find({}, {'_id': 0}))
        # print("kuraryu user data+", users_data)
        # list(relation_table.find({"from_user_uuid":}, {'_id': 0}))
        return jsonify(users_data)
    if request.method == 'DELETE':
        result = users_collection.delete_many({})  # データベース内の全てのユーザーを削除
        return jsonify({'message': f'{result.deleted_count} users deleted successfully'}), 200


# 特定のユーザー情報を取得するエンドポイント
@user_blueprint.route('/users/<gender>', methods=['GET'])
def get_users_by_gender(gender):
    # MongoDBから特定の性別のユーザー情報を取得
    users_data = list(users_collection.find({'gender': gender}, {'_id': 0}))
    return jsonify(users_data)


# search user with gender and hobbies
@user_blueprint.route('/users/filter=<gender>&<hobbies>', methods=['GET'])
def get_filtered_users(gender, hobbies):

    current_app.logger.info('called get_filtered_users: gender:%s, hobbies:%s', gender, hobbies)  # ログ出力

    # 必要なクエリパラメータが提供されているか確認
    if gender is not None and hobbies is not None:
        # クエリパラメータを使用してフィルタリング
        filtered_users = list(users_collection.find({'$and': [{'gender': gender}, {'hobbies': hobbies}]}, {'_id': 0}))

        current_app.logger.info('filtered users:%s',filtered_users)
        return jsonify(filtered_users)
    
    else:
        return 'Missing gender or hobbies parameters', 400  # クライアントエラーを返す場合




## delete user
@user_blueprint.route('/users/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users_collection.delete_one({'uuid': user_id})
    if result.deleted_count == 1:
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404

# ## delete all users
# @user_blueprint.route('/users', methods=['DELETE'])
# def delete_all_users():

#     result = users_collection.delete_many({})  # データベース内の全てのユーザーを削除
#     return jsonify({'message': f'{result.deleted_count} users deleted successfully'}), 200



# ユーザー情報を保存するエンドポイント
# @user_blueprint.route('/postuserinfo', methods=['POST'])
# @user_blueprint.route('/userinfo', methods=['POST'])
# def register_user():
#     user_uuid = request.headers.get('Authorization').split(' ')[1]

#     user_data = request.json
#     # user_id = str(uuid.uuid4())  # 一意のUUIDを生成
#     user_data['user_uuid'] = user_uuid  # ユーザーにIDを追加
#     # ユーザー情報をデータベースに保存
#     users_collection.insert_one(user_data)
#     return jsonify({'message': 'User data saved successfully', 'user_uuid': user_uuid}), 201
@user_blueprint.route('/self_user', methods=["GET", "PUT", "POST"])
def get_selfuser_info():
    if request.method == 'GET':
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
    elif request.method == 'PUT':
        # ユーザー情報を更新するエンドポイント
        data = request.json
        user_data = {}
        for key, value in data.items():
            user_data[key] = value
        print("user_data",user_data)
        # 更新する条件を指定
        query = {'user_uuid': user_data['user_uuid']}  # ユーザーのIDに応じて変更する
        # 更新したい内容を指定
        new_data = {'$set': user_data}
        # 更新
        result = users_collection.update_one(query, new_data)    
        print(result)
        updated = users_collection.find({'user_uuid': user_data['user_uuid']})
        print(list(updated))
        return "update user info"
    elif request.method == 'POST':
        user_uuid = request.headers.get('Authorization').split(' ')[1]
        user_data = request.json
        # user_id = str(uuid.uuid4())  # 一意のUUIDを生成
        user_data['user_uuid'] = user_uuid  # ユーザーにIDを追加
        print("kuraryu", user_uuid, user_data)
        # ユーザー情報をデータベースに保存
        # users_collection.insert_one(user_data)
        # Rest的にはput...
        new_data = {'$set': user_data}
        query = {'user_uuid': user_data['user_uuid']}  # ユーザーのIDに応じて変更する
        result = users_collection.update_one(query, new_data)
        return jsonify({'message': 'User data saved successfully', 'user_uuid': user_uuid}), 201
