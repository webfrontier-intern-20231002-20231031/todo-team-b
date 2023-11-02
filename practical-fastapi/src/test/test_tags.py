from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app

client = TestClient(app)


def temp_db(f):
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


class completedFlg:
    def __init__(self) -> None:
        self.flg = False

    def setter(self, changeTo):
        self.flg = changeTo

    def getter(self):
        return self.flg


# #PUTリクエストで利用できるようにオブジェクト作成
# todo = completedFlg()
# # id指定のTodoテーブルへのGETリクエスト正常処理テスト
# def test_read_todo_by_id():
#     response = client.get("/v1/todo/1")
#     assert response.status_code == 200
#     # assert response.json() == {
#     #     "completed": false,
#     #     "deadline": "2021-12-11T00:00:00",
#     #     "id": 1,
#     #     "content": "ミルクを買う",
#     #     "tags": []
#     #     }
#     json_body = response.json()
#     assert json_body["content"] == "ミルクを買う"
#     if json_body["completed"] == False:
#         todo.setter(True)
#     else:
#         todo.setter(False)

# # id指定のTagテーブルへのPUTリクエスト正常処理テスト
# def test_update_todoComp_by_id():
#     flgWant = todo.getter()
#     response = client.put(
#         "/v1/todo/1",
#         headers={"Content-Type":"application/json"},
#         json={"completed": flgWant}
#     )
#     assert response.status_code == 200
#     assert response.json() == {}


# # id指定のTodoテーブルへのGETリクエスト404エラーハンドリングテスト
# def test_read_todo_by_inexistent_id():
#     response = client.get("/v1/todo/400")
#     assert response.status_code == 404
#     assert response.json() == {"detail": "Todo not found"}


# # id指定のTagテーブルへのGETリクエスト正常処理テスト
# def test_read_tag_by_id():
#     response = client.get("/v1/tag/140")
#     assert response.status_code == 200
#     assert response.json() == {"id": 140, "name": "消したからいけるやろ", "todos": []}


# # id指定のTagテーブルへのGETリクエスト404エラーハンドリングテスト
# def test_read_tag_by_inexistent_id():
#     response = client.get("/v1/tag/400")
#     assert response.status_code == 404
#     assert response.json() == {"detail": "Tag not found"}


@temp_db
def test_create_tag():
    response = client.post(
        "/v1/tag",
        headers={"Content-Type": "application/json"},
        json={"name": "CreateTest"},
    )
    assert response.status_code == 200
    assert response.json() == {"id": 3, "name": "CreateTest", "todos": []}


@temp_db
# id指定のTagテーブルへのGETリクエスト正常処理テスト
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


# id指定のTagテーブルへのDELETEリクエスト正常処理テスト
@temp_db
def test_delete_tag():
    response = client.delete(
        "/v1/tag/1",
    )
    assert response.status_code == 200


# def test_read_item_bad_token():
#     response = client.get("/items/foo", headers={"X-Token": "hailhydra"})
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Invalid X-Token header"}


# def test_read_inexistent_item():
#     response = client.get("/items/baz", headers={"X-Token": "coneofsilence"})
#     assert response.status_code == 404
#     assert response.json() == {"detail": "Item not found"}


# def test_create_item():
#     response = client.post(
#         "/items/",
#         headers={"X-Token": "coneofsilence"},
#         json={"id": "foobar", "title": "Foo Bar", "description": "The Foo Barters"},
#     )
#     assert response.status_code == 200
#     assert response.json() == {
#         "id": "foobar",
#         "title": "Foo Bar",
#         "description": "The Foo Barters",
#     }


# def test_create_item_bad_token():
#     response = client.post(
#         "/items/",
#         headers={"X-Token": "hailhydra"},
#         json={"id": "bazz", "title": "Bazz", "description": "Drop the bazz"},
#     )
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Invalid X-Token header"}


# def test_create_existing_item():
#     response = client.post(
#         "/items/",
#         headers={"X-Token": "coneofsilence"},
#         json={
#             "id": "foo",
#             "title": "The Foo ID Stealers",
#             "description": "There goes my stealer",
#         },
#     )
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Item already exists"}
