pipeline {
    agent any

    environment {
        // The ID of the Docker Hub credentials you stored in Jenkins
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials') 
        // TODO: Replace with your Docker Hub username
        DOCKER_IMAGE_NAME = "2300039107@kluniversity.in/fitness-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                // TODO: Replace with your frontend repository's URL
                git branch: 'main', url: 'https://github.com/Raja107-code/fitness-tracker-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building the Docker image...'
                script {
                    // This command builds the image using the Dockerfile in your repo
                    docker.build(DOCKER_IMAGE_NAME, ".")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing the image to Docker Hub...'
                script {
                    // This logs into Docker Hub and pushes the image
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS) {
                        docker.image(DOCKER_IMAGE_NAME).push("latest")
                    }
                }
            }
        }
    }
}