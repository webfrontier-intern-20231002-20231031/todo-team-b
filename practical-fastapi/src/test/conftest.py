import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import context, sessionmaker
from sqlalchemy_utils import database_exists, drop_database

from app.database import Base
from models.tag import TagModel
from models.todo import TodoModel
from models.todo_tag import TodoTagModel
from models.user import UserModel

## ここではSQLiteを使ったユニットテストの共通部分を書く
## 関数毎で一時的にDatabaseを生成し、処理終了後に削除する
@pytest.fixture(scope="function")
def SessionLocal():
    if database_exists("sqlite:///./test_temp.db"):
        drop_database("sqlite:///./test_temp.db")
    TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
    engine = create_engine(
        TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

    assert not database_exists(TEST_SQLALCHEMY_DATABASE_URL)

    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = SessionLocal()
    new_tag = TagModel(name="コーヒーを買う")
    session.add(new_tag)
    new_tag = TagModel(name="カフェオレを作る")
    session.add(new_tag)
    session.commit()

    new_todo = TodoModel(content="買い物する")
    session.add(new_todo)
    new_todo = TodoModel(content="帰宅する")
    session.add(new_todo)
    session.commit()

    new_user = UserModel(username="Taro", email="taro_email@test.com", password="taro")
    session.add(new_user)
    session.commit()

    # リレーションの作り方
    # 呼び出す
    new_todo_tag = TodoTagModel(todo_id="1", tag_id="1")
    session.add(new_todo_tag)
    new_todo_tag = TodoTagModel(todo_id="1", tag_id="2")
    session.add(new_todo_tag)
    session.commit()

    yield SessionLocal

    drop_database(TEST_SQLALCHEMY_DATABASE_URL)
