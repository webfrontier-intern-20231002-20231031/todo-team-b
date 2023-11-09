# 実施日時　2023/11/08-2023/11/09

## 実装範囲
Jenkinsの構築->pipelineの作成->手動でのテスト実施
## 検証環境
mac
- OS Sonoma 14.1
- M1チップ
- 16GBメモリ

## 作業内容
Jenkinsの構築
Jenkinsでのpipelineの作成

### 利用するもの
- git
- docker

### 環境周りの注意点
mac Sonomaの場合、port5000がair playが利用しているためair playを止めるなり、ポートを変更するなり作業を行う必要がある

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
ビルドの実行を行う

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