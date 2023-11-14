# 実施日時　2023/11/08-2023/11/13

## 作業実施者
mrAkito

## 概要
Jenkinsを利用して、pipelineを作成する際の作業ログであり、出来なかった部分や注意点についても記載する

## 実装範囲
Jenkinsの構築->pipelineの作成->手動でのテスト実施->github webhookでの自動化->リモートサーバへの環境移行->slackでの通知

## 検証環境
#### ローカル環境
mac
- OS Sonoma 14.1
- M1チップ
- 16GBメモリ

#### リモート環境
Linux x64


## 作業内容
- Jenkinsの構築
- pipelineでのテスト実施のためのdocker imageの作成とdocker hubへのpush
- Jenkinsファイルの作成
- Jenkinsでのpipelineの作成
- github webhookでの自動化
- リモートサーバへの環境移行
- slackでの通知

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

## リモートサーバでJenkinsを動かそうとした時の問題点と対応
### 問題点

リモートサーバでJenkinsを動かすときに、docker imageを作成するときにエラーが出て、pull後にcontainerが正常動作をしない

### 行ってみた対応
- docker imageを軽いサイズのものに変更する
- リバースプロキシの設定をしてもらう
両方ともうまくいかなかった

### 原因

ローカルとリモートでのOSのアーキテクチャの違い

ローカルはarmであり、リモートはx64であるため、docker imageの作成時にエラーが出ていた

### 解決方法

Jenkinsfileのagentでdockerfileを指定することで、そのアーキテクチャに合わせたdocker imageを作成することができるようにした

別の手段としてbuildx buildでマルチアーキテクチャに対応したdocker imageを作成することを試したが、うまくいかなかったため上記のものを採用した

また、Jenkinspfile内でDockerfileなどの別のファイルを参照する場合、Pathに注意する必要がある

改良後のディレクトリ構造
```bash
Jenkins % tree
.
├── Dockerfile
├── Jenkinsfile
└── requirements.txt
```

Dockerfileを変更
```Dockerfile
FROM python:3.12.0-alpine3.18
USER root

RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev sqlite-dev

COPY Jenkins/requirements.txt .
RUN pip install -r requirements.txt
```

Jenkinsfileでdockerfileを使えるようにしたもの
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
                dockerfile {
                    filename 'Jenkins/Dockerfile'
                    args '--network=default'
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

requirement.txtの内容をテスト環境に必要なものだけにする
```requierment.txt
python-dotenv
requests
fastapi
fastapi-route-logger-middleware
sqlalchemy
sqlalchemy-seeder
pytest
httpx
sqlalchemy_utils
```

### 新たな問題点

テストに対して時間がかかるようになってしまった。


## Slackに通知を送る設定を行う


### Slack側の設定
[CloudBeesのサイト](https://cloudbees.techmatrix.jp/blog/struggle-story-about-ci-12/)を参考に作業を進める

[slack api](https://api.slack.com/)->`Your App`->`create app`->`From Scratch`->AppName`hogehoge`,Workspace`fugafufa`でAppを作成
権限は、`chat:write`のみを付与する

`Install your app`でワークスペースに連れてくる

ここで表示されるトークンをJenkinsと結びつける

導入したいチャンネルのテキストメッセージ欄で`/invite ~~~`でappをチャンネルに参加させる

(`/i`で「このチャンネルにアプリを参加させる」の予測変換が出てきたのでそれでもできた)


### Jenkins側の設定
ダッシュボード->`Jenkinsの管理`->`Plugins`->`slacknotification`のインストール

ダッシュボード->`Jenkinsの管理`->`System`->`slack`で下記のように設定する

- Workspace
    - 自分がslack側の設定でappを連れてきたワークスペースの名前
- credential
    - `追加`->`jenkins`->`種類`->`secret text`から`secret`の部分にslackで表示されたトークンを入れる->`追加`押下
    - 生成した`secret text`を選択する
- Default channel
    - appを参加させたチャンネルを入力する

右下の`Test Connection`を押下し、`success`が出れば準備完了


### Jenkinsfileを変更する
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
            post {
                success {
                    slackSend (color: '#00FF00', message: "Build Stage Succeeded")
                }
                unstable {
                    slackSend (color: '#FFFF00', message: "Build Stage is Unstable: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                failure {
                    slackSend (color: '#FF0000', message: "Build Stage Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
            }
        }
        stage('Test') {
            agent {
                dockerfile {
                    filename 'Jenkins/Dockerfile'
                    args '--network=default'
                }
            }
            steps {
                sh 'echo "Testing the project"'
                sh 'cd practical-fastapi; pytest'
            }
            post {
                success {
                    slackSend (color: '#00FF00', message: "Test Stage Succeeded: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                unstable {
                    slackSend (color: '#FFFF00', message: "Test Stage is Unstable: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                failure {
                    slackSend (color: '#FF0000', message: "Test Stage Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
            }
        }
    }
}
```

## テスト時間の短縮を図る

### 概要
「Jenkinsfileのagentでdockerfileを指定することで、そのアーキテクチャに合わせたdocker imageを作成することができるようにした」ことによって「テストの処理時間が伸びる」という問題点が発生したためその対応を行う

### 対応方法
1. stash関数を利用し、buildステージで生成したcacheを元にtestステージでテストを行う
2. Jenkinsの並列実行を行うことで、テスト時間の短縮を図る
3. pytestのオプションを利用して、テストを分割する



1〜3を踏まえて、Jenkinsfileを変更する
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
                //stash name: 'PythonTest'
                stash includes: 'practical-fastapi/src/test/__pycache__/*', name: 'PythonTest'
            }
            post {
                success {
                    slackSend (color: '#00FF00', message: "Build Stage Succeeded")
                }
                unstable {
                    slackSend (color: '#FFFF00', message: "Build Stage is Unstable: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                failure {
                    slackSend (color: '#FF0000', message: "Build Stage Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
            }
        }
        stage('Test') {
            parallel{
                stage("TagsAllTest") {
                    agent {
                        dockerfile {
                            filename 'Jenkins/Dockerfile'
                            args '--network=default'
                        }
                    }
                    steps {
                        sh 'echo "Testing the project"'
                        unstash 'PythonTest'
                        //sh 'cd practical-fastapi; pytest'
                        sh 'cd practical-fastapi; pytest -v -m run_these_tag'
                    }
                }
                stage("TodoNormalTest") {
                    agent {
                        dockerfile {
                            filename 'Jenkins/Dockerfile'
                            args '--network=default'
                        }
                    }
                    steps {
                        sh 'echo "Testing the project"'
                        unstash 'PythonTest'
                        //sh 'cd practical-fastapi; pytest'
                        sh 'cd practical-fastapi; pytest -v -m run_these_todo'
                    }
                }
                stage("TodoErrorAndUserAllTest") {
                    agent {
                        dockerfile {
                            filename 'Jenkins/Dockerfile'
                            args '--network=default'
                        }
                    }
                    steps {
                        sh 'echo "Testing the project"'
                        unstash 'PythonTest'
                        //sh 'cd practical-fastapi; pytest'
                        sh 'cd practical-fastapi; pytest -v -m run_these_todoError_and_user'
                    }
                }
            }
            post {
                success {
                    slackSend (color: '#00FF00', message: "Test Stage Succeeded: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                unstable {
                    slackSend (color: '#FFFF00', message: "Test Stage is Unstable: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
                failure {
                    slackSend (color: '#FF0000', message: "Test Stage Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                }
            }
        }
    }
}
```

3を踏まえて、pytest.iniを作成する

pytestのオプションでデコレータで分割したテストを実行するために作成

ディレクトリ構造（markdownなどは省いている）

基本的にはpytestを実行するディレクトリにpytest.iniを配置する
```bash
practical-fastapi % tree -L 1
.
├── logging.json
├── pytest.ini
├── src
└── tool
```

```pythhon:pytest.ini
[pytest]
markers =
    run_these_tag: Mark a test to run with the 'run_these_tag' marker
    run_these_todo: Mark a test to run with the 'run_these_todo' marker
    run_these_todoError_and_user: Mark a test to run with the 'run_these_todoError_and_user' marker
```

上記のpytest.iniを作成することで、pytestのオプションを利用してテストを分割する

テスト分割は/practical-fastapi/src/testを参照