# 実施日時　2023/10/24

## 動作環境
- python 3.11.5
- psycopg2==2.9.9
- alembic==1.12.0
- SQLAlchemy==2.0.22
- sqlalchemy-seeder==0.3.0

## 概要
Seederを通してデータベースにデータ挿入

## 変更点
ターミナルで流れてしまったので変更後のみ記載

### 原因
app.database.pyとseed.seeder.pyの`engine=create_engine()`にSQLiteのオプションが入っていたため、できなかった。

app.database.py
```python
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.settings import DATABASE_URL

engine = create_engine(DATABASE_URL)
```


seed.seeder.py
```python
rom app.settings import DATABASE_URL

parser = argparse.ArgumentParser()

parser.add_argument("revision")
args = parser.parse_args()

engine = create_engine(DATABASE_URL)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

```


### データベースとの接続に対して
seeder実行時にmodels.todo.pyとmodels.tag.pyのupdate_atにdefaultを設定していなかったためにエラーが出た。
両ファイルにてdefault値を設定することで解決した
```
    updated_at: Mapped[datetime] = mapped_column(
        postgresql.TIMESTAMP(timezone=True),
        default=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
        onupdate=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
    )
```