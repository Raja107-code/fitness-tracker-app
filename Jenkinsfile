pipeline {
    agent any

    environment {
        // This is a simple environment variable, not a credential binding.
        DOCKER_IMAGE_NAME = "raja107/fitness-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Raja107-code/fitness-tracker-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building the Docker image...'
                bat "docker build -t ${DOCKER_IMAGE_NAME}:latest -f Dockerfile ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing the image ${DOCKER_IMAGE_NAME} to Docker Hub..."
                // The correct way to bind and use credentials for Docker login.
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
                    bat "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }
    }
}
