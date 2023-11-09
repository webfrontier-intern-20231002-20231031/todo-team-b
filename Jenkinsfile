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
                sh 'cd practical-fastapi/src/test; python -m py_compile conftest.py test_tags.py test_todos.py'
                stash(name: 'compiled-results', includes: 'test/*.py*')
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'tk210479/python-image:1.0'
                }
            }
            steps {
                sh 'cd practical-fastapi; pytest'
            }
            // post {
            //     always {
            //         junit 'test-reports/results.xml'
            //     }
            // }
        }
    }
}