pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials') 
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
                // The 'dir' command is removed. This command now runs from the root of the workspace.
                // The -f flag specifies the location of the Dockerfile.
                sh "docker build -t ${DOCKER_IMAGE_NAME}:latest -f Dockerfile ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing the image ${DOCKER_IMAGE_NAME} to Docker Hub..."
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS) {
                        docker.image(DOCKER_IMAGE_NAME).push("latest")
                    }
                }
            }
        }
    }
}