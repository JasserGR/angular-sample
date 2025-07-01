pipeline {
    agent any
    tools {
        nodejs 'Node22'
    }
    environment {
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
                        // Use Nexus registry here if your package.json dependencies are hosted there,
                        // otherwise set npm_config_registry to public registry if you want public packages
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
                        echo "Running lint using public npm registry..."

                        // Use public registry for ng add
                        withEnv(['npm_config_registry=https://registry.npmjs.org/']) {
                            sh 'ng add @angular-eslint/schematics --skip-confirmation || true'
                        }

                        // Use public registry to install ESLint dependencies manually
                        withEnv(['npm_config_registry=https://registry.npmjs.org/']) {
                            sh 'npm install --save-dev @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/template-parser'
                        }

                        // Run lint with default registry (can be Nexus if configured)
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
                        // Install test dependencies from public registry explicitly
                        withEnv(['npm_config_registry=https://registry.npmjs.org/']) {
                            sh 'npm install karma-junit-reporter --save-dev'
                        }

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
                    withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                        writeFile file: '.npmrc', text: """
registry=http://localhost:8081/repository/angular-artifacts/
//localhost:8081/repository/angular-artifacts/:username=${NEXUS_USERNAME}
//localhost:8081/repository/angular-artifacts/:_password=${NEXUS_PASSWORD.bytes.encodeBase64().toString()}
//localhost:8081/repository/angular-artifacts/:email=ci@example.com
always-auth=true
                        """
                        sh 'npm publish --access public'
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
