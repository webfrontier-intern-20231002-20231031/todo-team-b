# 実施日時　2023/11/08-2023/11/09

## 概要
Jenkinsを利用して、pipelineを作成する際の作業ログであり、出来なかった部分や注意点についても記載する

## 実装範囲
Jenkinsの構築->pipelineの作成->手動でのテスト実施

## 検証環境
mac
- OS Sonoma 14.1
- M1チップ
- 16GBメモリ

## 作業内容
Jenkinsの構築
pipelineでのテスト実施のためのdocker imageの作成とdocker hubへのpush
Jenkinsファイルの作成
Jenkinsでのpipelineの作成

### 利用するもの
- git
- docker

### Jenkinsの構築
pythonのテストを行うために、Jenkinsを構築する。

[公式チュートリアル](https://www.jenkins.io/doc/tutorials/build-a-python-app-with-pyinstaller/)を参考

ブリッジネットワークの作成
```Termainal
docker network create jenkins
```

Docker imageをダウンロードする
```Termainal
docker run --name jenkins-docker --rm --detach \
  --privileged --network jenkins --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 3000:3000 --publish 5000:5000 --publish 2376:2376 \
  docker:dind --storage-driver overlay2
```

公式のimageを元にdocker imageを作成するために、Dockerfileを作成する
```Dockerfile
FROM jenkins/jenkins:2.414.3-jdk17
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
RUN jenkins-plugin-cli --plugins "blueocean:1.27.9 docker-workflow:572.v950f58993843"
```

Dockerfileからdocker imageを作成する
```Termainal
docker build -t myjenkins-blueocean:2.414.3-1 .
```

imageを元にcontainerを作成する
```Termainal
docker run --name jenkins-blueocean --detach \
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  --volume "$HOME":/home \
  --restart=on-failure \
  --env JAVA_OPTS="-Dhudson.plugins.git.GitSCM.ALLOW_LOCAL_CHECKOUT=true" \
  myjenkins-blueocean:2.414.3-1
```

コンテナ作成後、Jenkinsの管理画面にアクセスする
`http://localhost:8080/`をブラウザで開く
管理者パスワードは、コンテナ作成時に表示されるログに記載されているためパスワードを取得する

```Terminal
docker logs jenkins-blueocean
```

パスワード認証後、Jenkinsの初期設定を行う
`Install suggested plugins`を選択する
インストール終了後、ユーザ作成などが求められるため、設定を行う

ユーザ作成終了後、dashboardに移動する
追加のプラグインをインストールする
- Docker Pipeline
- Blue Ocean

### pipelineでのテスト実施のためのdocker imageの作成とdocker hubへのpush
テスト実施のためのdocker imageを作成する
```dockerfile
FROM python:3
USER root

RUN apt-get update

COPY requirements.txt .

RUN apt-get install -y vim less
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt
```
ここの`RUN pip install -r requirements.txt`ではpractice-fastapiのrequirements.txtを導入したが別ディレクトリで作業を行ったため同じように作業する場合には、適宜変更が必要

docker imageを作成する
```Terminal
docker build -t tk210479/python-image:1.0 .
```
イメージ名はDockerHubのユーザ名/リポジトリ名:タグ名の形式で作成する
もし先にイメージをビルドしてある場合には`docker tag`を利用してタグをつける

DockrHubにログインする
```Terminal
docker login
```

docker imageをpushする
```Terminal
docker push tk210479/python-image:1.0
```


### Jenkinsfileの作成
```Jenkinsfile
pipeline {
    agent none
    environment {
        PROJECT_NAME="FastAPI+SQLArchemy Todo Sample"
        API_V1_STR="/v1"
        BACKEND_CORS_ORIGINS="localhost"
        DATABASE_URL="sqlite:///todo.db"
        LOGGING_CONF="./logging.json"
    }
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'python:3.12.0-alpine3.18'
                }
            }
            steps {
                sh 'echo "Building the project"'
                sh 'cd practical-fastapi/src/test; python -m py_compile conftest.py'
                // stash(name: 'compiled-results', includes: 'practical-fast-api/src/test/*.py*')
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'tk210479/python-image:1.0'
                }
            }
            steps {
                sh 'echo "Testing the project"'
                sh 'cd practical-fastapi; pytest'
            }
        }
    }
}
```


*stashを使ってビルドしたファイルをテストで利用したかったが上手くいかないためコメントアウト中*

### Jenkinsでのpipelineの作成

ダッシュボードから`新規ジョブ作成`を選択する
ジョブ名を決めて、パイプラインを選択する
`OK`を選択する

Configrationの設定を行う
`General`タブから、`パイプライン`の`定義`を`Pipeline script from SCM`に変更する
`SCM`の`Git`を選択する
`リポジトリURL`にブラウザからのアクセスを可能にするために、`/todo-team-b/`までのURLを入力する
`認証情報`に`追加`、`Jenkins`を選択する
-  `ドメイン`に`グローバルドメイン`を入力する
-  `種類`に`Username with password`を選択する
-  `ユーザ名`にGitHubのユーザ名を入力する
-  `パスワード`にGitHubのパスワードを入力する

他の部分は空欄でOK
2023/11/09現在、中止ボタンを押しても入力画面が閉じないため、リロードが必要（入力内容は保持されるはず）

`Script Path`に`Jenkins/Jenkinsfile`を入力する

`Save`を選択する

ダッシュボードのBlueOceanから作成したpipelineを選択する
初期だと`Run`ボタンが画面に出るため、`Run`を選択する

### 自動テストの実装
- ローカルホストを外部URLにする
- github webhookを作成する
- Jenkins側の設定を修正する

#### ローカルホストを外部URLにする
[ngrok設定の参考サイト](https://zenn.dev/tasada038/articles/fc7730f98d8f0a)に沿ってngrokを導入し、8080番ポートを外部に公開する

```Terminal
brew install ngrok/ngrok/ngrok
ngrok config add-authtoken *********************
ngrok http 8080
```
ngrok　httpを実行するとURLが払い出される

#### github webhookを作成する
git hubのリポジトリ->`Settings`->`Webhooks`->`Add webhook`を選択する
Payload：`払い出されたURL/github-webhook/`を入力する
Content type：`application/www-form-urlencoded`を選択する
Which events would you like to trigger this webhook?：`Just the push event.`を選択する
Active：チェックボタンを入れて、`Add webhook`を選択する

#### Jenkins側の設定を修正する
Jenkinsのダッシュボード画面から`General`->`GitHub hook trigger for GITScm polling`にチェックを入れる

ここまでで対象のブランチへのpushで自動テストができるようになった。

