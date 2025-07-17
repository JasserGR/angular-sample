pipeline {
    agent any
    tools {
        nodejs 'Node22' // Make sure this is configured in Jenkins
    }
    environment {
        SONAR_SCANNER_HOME = "/opt/sonar-scanner"
        CHROME_BIN = "/usr/bin/google-chrome" // Adjust if needed, or install chrome/chromium on your agent
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
                        // eslint dependencies should be in package.json, no need to add/install here
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
                        // karma-junit-reporter should be in package.json devDependencies
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
		    timeout(time: 10, unit: 'MINUTES') {
		        def qg = waitForQualityGate()
		        if (qg.status != 'OK') {
		            error "Pipeline aborted due to Quality Gate failure: ${qg.status}"
		        }
		    }
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
            // Ensure Karma is configured to output JUnit XML to test-results/*.xml for this to work
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

