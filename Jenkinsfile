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
                dir('frontend') { 
                    // *** THIS IS THE CORRECTED LINE ***
                    // Changed single quotes to double quotes to allow variable substitution
                    bat "docker build -t ${DOCKER_IMAGE_NAME}:latest ."
                }
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