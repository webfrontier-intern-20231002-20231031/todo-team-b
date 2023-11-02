from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app

client = TestClient(app)


# 呼び出されるたびにデータベースを作成するデコレータ
def temp_db(f):
    # conftest.py内部のSessionLocal関数の処理内容でデータベースは対象関数実行後削除
    def func(SessionLocal, *args, **kwargs):
        def override_get_db():
            db = SessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        f(*args, **kwargs)
        app.dependency_overrides[get_db] = get_db

    return func


@temp_db
# id指定のTagテーブルへのPUTリクエスト正常処理テスト
def test_update_tag_by_id():
    response = client.put(
        "/v1/tag/1",
        headers={"Content-Type": "application/json"},
        json={"name": "ホットドックを作る"},
    )
    assert response.status_code == 200


@temp_db
# Tagテーブル一覧のGETリクエスト正常処理テスト
def test_create_tag():
    response = client.post(
        "/v1/tag",
        headers={"Content-Type": "application/json"},
        json={"name": "CreateTest"},
    )
    assert response.status_code == 200
    assert response.json() == {"id": 3, "name": "CreateTest", "todos": []}


@temp_db
# Tagテーブル一覧のGETリクエスト正常処理テスト
def test_read_tag_all():
    response = client.get("/v1/tag/")
    assert response.status_code == 200
    # assert response.json() == {"id": 1, "name": "CreateTest", "todos": []}
    json_body = response.json()
    assert json_body[0]["name"] == "コーヒーを買う"
    assert json_body[1]["name"] == "カフェオレを作る"


@temp_db
# id指定のTagテーブルへのGETリクエスト正常処理テスト
def test_read_tag_by_id():
    response = client.get("/v1/tag/1")
    assert response.status_code == 200
    # assert response.json() == {"id": 1, "name": "CreateTest", "todos": []}
    json_body = response.json()
    assert json_body["name"] == "コーヒーを買う"


@temp_db
# id指定のTagテーブルへのDELETEリクエスト正常処理テスト
def test_delete_tag():
    response = client.delete(
        "/v1/tag/1",
    )
    assert response.status_code == 200


@temp_db
# id指定のTagテーブルへのGETリクエスト404エラーハンドリングテスト
def test_read_tag_by_inexistent_id():
    response = client.get("/v1/tag/1000")
    assert response.status_code == 404
    assert response.json() == {"detail": "Tag not found"}


@temp_db
# id指定のTagテーブルへのPUTリクエスト404エラーハンドリングテスト
def test_update_tag_by_inexistent_id():
    response = client.get("/v1/tag/1000")
    assert response.status_code == 404
    assert response.json() == {"detail": "Tag not found"}


@temp_db
# id指定のTagテーブルへのDELETEリクエスト404エラーハンドリングテスト
def test_delete_tag_by_inexistent_id():
    response = client.get("/v1/tag/1000")
    assert response.status_code == 404
    assert response.json() == {"detail": "Tag not found"}


# class completedFlg:
#     def __init__(self) -> None:
#         self.flg = False

#     def setter(self, changeTo):
#         self.flg = changeTo

#     def getter(self):
#         return self.flg


# #PUTリクエストで利用できるようにオブジェクト作成
# todo = completedFlg()
