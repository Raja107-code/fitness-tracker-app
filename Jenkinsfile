pipeline {
    agent any

    environment {
        // The ID of the Docker Hub credentials you stored in Jenkins
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials') 
        // Your Docker Hub username and the desired image name
        DOCKER_IMAGE_NAME = "raja107/fitness-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // This step checks out your code from GitHub
                git branch: 'main', url: 'https://github.com/Raja107-code/fitness-tracker-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building the Docker image...'
                
                // *** THIS IS THE MAIN CHANGE ***
                // We must first change into the 'frontend' directory where the Dockerfile is located.
                dir('frontend') { 
                    bat 'docker build -t "${DOCKER_IMAGE_NAME}:latest" .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing the image ${DOCKER_IMAGE_NAME} to Docker Hub..."
                script {
                    // This block logs into Docker Hub and pushes the image
                    // It requires the "Docker Pipeline" plugin to be installed in Jenkins.
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS) {
                        docker.image(DOCKER_IMAGE_NAME).push("latest")
                    }
                }
            }
        }
    }
}