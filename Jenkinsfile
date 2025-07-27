pipeline {
    agent any
    tools {
        nodejs 'Node22' 
    }
    environment {
        SONAR_SCANNER_HOME = "/opt/sonar-scanner"
        CHROME_BIN = "/usr/bin/google-chrome" 
        NEXUS_URL = "http://localhost:8081" 
        NEXUS_CREDENTIALS = credentials('nexus-credentials') 
        DOCKER_IMAGE = "localhost:8082/${NEXUS_CREDENTIALS_USR.toLowerCase()}/angular-sample" 
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    try {
                        withEnv(['npm_config_registry=https://registry.npmjs.org/']) {
                            sh 'npm ci'
                        }
                    } catch (Exception e) {
                        error "Failed to install dependencies: ${e.message}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    try {
                        sh 'ng build --configuration production'
                    } catch (Exception e) {
                        error "Build failed: ${e.message}"
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    try {
                        sh 'ng lint angular-sample'
                    } catch (Exception e) {
                        error "Linting failed: ${e.message}"
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        sh 'ng test --watch=false --browsers=ChromeHeadless --code-coverage'
                    } catch (Exception e) {
                        error "Tests failed: ${e.message}"
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                                ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=angular-sample \
                                -Dsonar.projectName="Angular Sample" \
                                -Dsonar.sources=src \
                                -Dsonar.tests=src \
                                -Dsonar.test.inclusions="**/*.spec.ts" \
                                -Dsonar.typescript.lcov.reportPaths=coverage/angular-sample/lcov.info
                            '''
                        }
                    } catch (Exception e) {
                        error "SonarQube analysis failed: ${e.message}"
                    }
                    /* Quality Gate check temporarily commented out due to timeout issues
                    timeout(time: 10, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to Quality Gate failure: ${qg.status}"
                        }
                    }
                    */
                }
            }
        }

        stage('Publish to Nexus') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                        def version = "1.0.${env.BUILD_NUMBER}-${new Date().format('yyyyMMddHHmmss')}"
                        sh "npm version ${version} --no-git-tag-version"
                        writeFile file: '.npmrc', text: """
                        registry=http://localhost:8081/repository/angular-artifacts/
                        //localhost:8081/repository/angular-artifacts/:username=${NEXUS_USERNAME}
                        //localhost:8081/repository/angular-artifacts/:_password=${NEXUS_PASSWORD.bytes.encodeBase64().toString()}
                        //localhost:8081/repository/angular-artifacts/:email=ci@example.com
                        always-auth=true
                        """
                        sh 'npm publish --access public'
                        sh 'rm -f .npmrc'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                        withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                            sh 'echo $NEXUS_PASSWORD | docker login http://localhost:8082 -u $NEXUS_USERNAME --password-stdin'
                        }
                        sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                    } catch (Exception e) {
                        error "Docker image build or push failed: ${e.message}"
                    }
                }
            }
        }
        stage('Verify Docker Image') {
            steps {
                script {
                    try {
                        sh "docker pull ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker inspect ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        echo "Docker image ${DOCKER_IMAGE}:${env.BUILD_NUMBER} verified successfully."
                    } catch (Exception e) {
                        error "Docker image verification failed: ${e.message}"
                    }
                }
            }
        }
      stage('Generate Build Metadata') {
          steps {
              script {
                  try {
                      def metadata = """
                      Build Number: ${env.BUILD_NUMBER}
                      Timestamp: ${new Date().format('yyyy-MM-dd HH:mm:ss z')}
                      Docker Image: ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                      """
                      writeFile file: 'build-metadata.txt', text: metadata
                      archiveArtifacts artifacts: 'build-metadata.txt', allowEmptyArchive: false
                      echo "Build metadata generated and archived."
                  } catch (Exception e) {
                      error "Build metadata generation failed: ${e.message}"
                  }
              }
          }
      }
        stage('Deploy to Kubernetes') {
	    steps {
		script {
		    try {
		        sh """
		        kubectl apply -f k8s/deployment.yaml
		        kubectl set image deployment/angular-sample angular-sample=${DOCKER_IMAGE}:${env.BUILD_NUMBER} --record
		        kubectl rollout status deployment/angular-sample --timeout=2m
		        """
		        echo "Deployment to Kubernetes completed successfully."
		    } catch (Exception e) {
		        error "Kubernetes deployment failed: ${e.message}"
		    }
		}
	    }
	}
}
    post {
        always {
            // Ensure Karma is configured to output JUnit XML to test-results/*.xml
            junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
            archiveArtifacts artifacts: 'dist/angular-sample/**', allowEmptyArchive: true
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}

