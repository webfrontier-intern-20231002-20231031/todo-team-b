import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, drop_database

from app.database import Base
from models.tag import TagModel


## ここではSQLiteを使ったユニットテストの共通部分を書く
## 関数毎で一時的にDatabaseを生成し、処理終了後に削除する
@pytest.fixture(scope="function")
def SessionLocal():
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

    yield SessionLocal

    drop_database(TEST_SQLALCHEMY_DATABASE_URL)
