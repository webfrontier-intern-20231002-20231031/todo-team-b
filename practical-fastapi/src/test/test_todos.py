from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app
from starlette.responses import Content

import pytest

client = TestClient(app)


@pytest.mark.run_these_todo
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

@pytest.mark.run_these_todo
# 各todoが取得できることを確認
@temp_db
def test_get_todo():
    response = client.get("/v1/todo")
    assert response.status_code == 200
    res_js = response.json()
    assert res_js[0]["content"] == "買い物する"
    assert res_js[1]["content"] == "帰宅する"


@pytest.mark.run_these_todo
# 1つ目のtodoに紐づいているtagをそれぞれ確認
@temp_db
def test_get_todo_tag():
    response = client.get("/v1/todo/")
    assert response.status_code == 200
    res_js = response.json()
    assert res_js[0]["tags"][0]["id"] == 1
    assert res_js[0]["tags"][1]["name"] == "カフェオレを作る"

@pytest.mark.run_these_todo
# id指定でtodoを取得できるか確認
@temp_db
def test_get_todo_by_id():
    response = client.get("/v1/todo/1")
    assert response.status_code == 200
    res_js = response.json()
    assert res_js["content"] == "買い物する"

@pytest.mark.run_these_todo
# id指定で取得したtodoに紐づいているtagを確認
@temp_db
def test_get_todo_by_id_tag():
    response = client.get("/v1/todo/1")
    assert response.status_code == 200
    res_js = response.json()
    assert res_js["tags"][0]["id"] == 1

@pytest.mark.run_these_todo
# todoの新規作成を確認
@temp_db
def test_create_todo():
    response = client.post(
        "/v1/todo",
        json={"content": "test todo"}
    )
    assert response.status_code == 200
    res_js = response.json()
    assert res_js["content"] == "test todo"

@pytest.mark.run_these_todo
# completedの変更をチェックします
@temp_db
def test_update_todo_completed():
    response = client.put(
        "/v1/todo/1",
        json={"completed": True}
    )
    assert response.status_code == 200
    response_check = client.get("/v1/todo/1")
    assert response_check.status_code == 200
    res_js = response_check.json()
    assert res_js["completed"] == True

@pytest.mark.run_these_todo
# todoに紐づいているtagを変更する
@temp_db
def test_update_todo_change_tag():
    response = client.put(
        "/v1/todo/2",
        json={"tags": [{
            "id": 1
        }]}
    )
    assert response.status_code == 200
    response_check = client.get("/v1/todo/2")
    assert response_check.status_code == 200
    res_js = response_check.json()
    assert res_js["tags"][0]["name"] == "コーヒーを買う"

@pytest.mark.run_these_todo
# todoに新規で作成したtagを紐付ける
@temp_db
def test_update_todo_add_newtag():
    response = client.put(
        "/v1/todo/2",
        json={"tags": [{
            "name": "新規タグ"
        }]}
    )
    assert response.status_code == 200
    response_check = client.get("/v1/todo/2")
    assert response_check.status_code == 200
    res_js = response_check.json()
    assert res_js["tags"][0]["name"] == "新規タグ"

@pytest.mark.run_these_todo
# todoに紐付いているタグを削除する
@temp_db
def test_update_todo_delete_tag():
    response = client.put(
        "/v1/todo/1",
        json={"tags": [{}]}
    )
    assert response.status_code == 200
    response_check = client.get("/v1/todo/1")
    assert response_check.status_code == 200
    res_js = response_check.json()
    assert res_js["tags"] == []

@pytest.mark.run_these_todo
# todoの削除を確認
@temp_db
def test_delete_todo():
    response = client.delete("/v1/todo/1")
    assert response.status_code == 200


### error version ###

@pytest.mark.run_these_todoError_and_user
# 存在しないidを指定された時に、404が帰ってくることを確認
@temp_db
def test_get_todo_by_id_error():
    response = client.get("/v1/todo/3")
    assert response.status_code == 404

@pytest.mark.run_these_todoError_and_user
# todo作成時に存在しないキーを指定した際にエラーになることを確認
@temp_db
def test_create_todo_error():
    response = client.post(
        "/v1/todo",
        json={"contents": "test todo"}
    )
    assert response.status_code == 422

@pytest.mark.run_these_todoError_and_user
# 存在しないタグの選択
@temp_db
def test_error_update_todo():
    response = client.put(
        "/v1/todo/100",
        json={"completed": True}
    )
    assert response.status_code == 404
    response_check = client.get("/v1/todo/100")
    assert response_check.status_code == 404

@pytest.mark.run_these_todoError_and_user
# todo削除時に存在しないtodo idを指定した際にエラーになることを確認
@temp_db
def test_delete_todo_test():
    response = client.delete("/v1/todo/3")
    assert response.status_code == 200

