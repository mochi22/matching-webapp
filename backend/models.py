from flask_login import UserMixin


class User(UserMixin):
    # def __init__(self, user_uuid, username, password):
    def __init__(self, user_uuid):
        self.id = user_uuid
        # self.username = username
        # self.password = password
    # def get_id(self):
    #     return str(self.id)