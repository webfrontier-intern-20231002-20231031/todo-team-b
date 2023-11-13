FROM python:3.12.0-alpine3.18
USER root

RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev sqlite-dev

COPY requirements.txt .
RUN pip install --no-cache python-dotenv requests fastapi fastapi-route-logger-middleware sqlalchemy sqlalchemy-seeder pytest httpx sqlalchemy_utils