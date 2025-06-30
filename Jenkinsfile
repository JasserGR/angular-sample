pipeline {
    agent any
    tools {
        nodejs 'Node22'
    }
    environment  {
        SONAR_SCANNER_HOME = "/opt/sonar-scanner"
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
                        sh 'npm install'
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
                        echo "Trying to ensure @angular-eslint is set up..."
                        // Try to add ESLint (if already added, it will throw and be caught)
                        sh 'ng add @angular-eslint/schematics --skip-confirmation || true'

                        // Now run lint
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
                        // Install test dependencies
                        sh 'npm install karma-junit-reporter --save-dev'
                        // Set CHROME_BIN for ChromeHeadless
                        withEnv(['CHROME_BIN=/usr/bin/google-chrome']) {
                            sh 'ng test --no-watch --browsers=ChromeHeadless'
                        }
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
                                /opt/sonar-scanner/bin/sonar-scanner \
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
                }
            }
        }
       stage('Publish to Nexus') {
            steps {
            		script {
                		withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]){
                    		sh '''
                    			npm config set registry http://localhost:8081/repository/angular-artifacts/Add commentMore actions
                    			npm publish --access public
                    		'''
                    		}
                		}
                }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Placeholder for Docker image build'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying... (Placeholder for deployment logic)'
            }
        }
    }
    post {
        always {
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
