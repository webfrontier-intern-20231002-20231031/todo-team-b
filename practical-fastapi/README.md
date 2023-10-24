## install dependencies

#### 10/24 SQLiteからpostgresへのマイグレーションを行ったことによる追記
requirements.txtに`psycopg2`を追記

pip install -r requirements.txt

## edit enviroment variables

mv .env.sample .env
edit .env 

## migration

alembic upgrade head

## data seed

export PYTHONPATH=./src:$PYTHONPATH && python -m seed.seeder <revision>