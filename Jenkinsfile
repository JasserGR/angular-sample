pipeline {
    agent any
    tools {
        nodejs 'Node22' // Matches Node.js version in Jenkins
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
        /* stage('Lint') {
            steps {
                script {
                    try {
                        def eslintInstalled = sh(script: "npm list @angular-eslint/schematics --depth=0", returnStatus: true) == 0
                        def configExists = fileExists('eslint.config.js') || fileExists('.eslintrc.json')
                        if (!eslintInstalled && !configExists) {
                            echo "ESLint not installed and config missing — installing now..."
                            sh 'ng add @angular-eslint/schematics --skip-confirmation'
                        } else {
                            echo "ESLint already installed or config files exist."
                        }
                        sh 'ng lint angular-sample'
                    } catch (Exception e) {
                        error "Linting failed: ${e.message}"
                    }
                }
            }
        } */
        stage('Test') {
            steps {
                script {
                    try {
                        // Ensure test dependencies are installed
                        sh 'npm install karma-junit-reporter --save-dev'
                        // Run tests with Angular CLI
                        sh 'ng test --no-watch --browsers=ChromeHeadless'
                    } catch (Exception e) {
                        error "Tests failed: ${e.message}"
                    }
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo 'Placeholder for SonarQube analysis'
            }
        }
        stage('Publish to Nexus') {
            steps {
                echo 'Placeholder for Nexus artifact upload'
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