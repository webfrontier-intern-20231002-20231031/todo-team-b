from fastapi.testclient import TestClient

from app.database import get_db
from app.main import app
from starlette.responses import Content

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


@temp_db
def test_get_todo():
    response = client.get("/v1/todo")
    assert response.status_code == 200
    res_js = response.json()
    assert res_js[0]["content"] == "買い物する"
    assert res_js[1]["content"] == "帰宅する"