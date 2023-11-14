from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app

import pytest


client = TestClient(app)

@pytest.mark.run_these_todoError_and_user
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

@pytest.mark.run_these_todoError_and_user
# ユーザ情報登録に関する処理
@temp_db
def test_create_user():
    response = client.post(
        "/v1/user",
        headers={"Content-Type": "application/json"},
        json={"username": "Hanako", "email": "hanako_email@test.com", "password":"hanako"},
    )
    assert response.status_code == 200
    json_body = response.json()
    assert json_body is None


@pytest.mark.run_these_todoError_and_user
# ログイン処理
@temp_db
def test_login():
    response = client.post(
        "/v1/user/login",
        headers={"Content-Type": "application/json"},
        json={"email": "taro_email@test.com", "password":"taro"},
    )
    assert response.status_code == 200
    assert response.json() == 1

@pytest.mark.run_these_todoError_and_user
@temp_db
def test_wrongcreate_user():
    response = client.post(
        "/v1/user",
        headers={"Content-Type": "application/json"},
        json={"username": "Taro", "email": "taro_email@test.com", "password":"taro"},
    )
    assert response.status_code == 401

@pytest.mark.run_these_todoError_and_user
@temp_db
def test_wrongloginNoexist_user():
    response = client.post(
        "/v1/user/login",
        headers={"Content-Type": "application/json"},
        json={"email":"Kokusai", "password":"Kokusai"},
    )
    assert response.status_code == 401

@pytest.mark.run_these_todoError_and_user
@temp_db
def test_wrongloginPassword_user():
    response = client.post(
        "/v1/user/login",
        headers={"Content-Type": "application/json"},
        json={"email":"Taro", "password":"hanako"},
    )
    assert response.status_code == 401