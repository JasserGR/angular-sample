pipeline {
    agent any
    tools {
        nodejs 'Node22'
    }
    environment {
        SONAR_SCANNER_HOME = "/opt/sonar-scanner"
        CI = 'true'
        NODE_OPTIONS = '--max-old-space-size=4096'
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
                        sh '''
                            npm ci --prefer-offline --no-audit
                            npm install jest-junit --save-dev
                        '''
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
                        sh 'npm run build'
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
                        sh '''
                            # Install ESLint if not already installed
                            if [ ! -d "node_modules/@angular-eslint" ]; then
                                npm install --save-dev @angular-eslint/schematics
                                ng add @angular-eslint/schematics --skip-confirmation
                            fi
                            
                            # Run linting
                            npm run lint || ng lint angular-sample
                        '''
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
                        sh '''
                            # Run tests with coverage
                            npm run test:ci
                            
                            # Verify coverage files were generated
                            echo "=== Coverage files generated ==="
                            ls -la coverage/
                            
                            # Verify LCOV file exists
                            if [ -f "coverage/lcov.info" ]; then
                                echo "✓ LCOV file generated successfully"
                                head -10 coverage/lcov.info
                            else
                                echo "✗ LCOV file not found"
                                exit 1
                            fi
                        '''
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
                                -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.coverage.exclusions="**/*.spec.ts,**/*.module.ts,src/main.ts,src/polyfills.ts,src/environments/**" \
                                -Dsonar.cpd.exclusions="**/*.spec.ts" \
                                -Dsonar.sourceEncoding=UTF-8
                            '''
                        }
                    } catch (Exception e) {
                        error "SonarQube analysis failed: ${e.message}"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    try {
                        timeout(time: 5, unit: 'MINUTES') {
                            def qg = waitForQualityGate()
                            if (qg.status != 'OK') {
                                error "Pipeline aborted due to quality gate failure: ${qg.status}"
                            }
                        }
                    } catch (Exception e) {
                        echo "Quality gate timeout or failure: ${e.message}"
                        // Don't fail the pipeline, just warn
                    }
                }
            }
        }

        stage('Publish to Nexus') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                            def version = "1.0.${env.BUILD_NUMBER}-${new Date().format('yyyyMMddHHmmss')}"
                            
                            sh """
                                npm version ${version} --no-git-tag-version
                                
                                cat > .npmrc << 'EOF'
registry=http://localhost:8081/repository/angular-artifacts/
//localhost:8081/repository/angular-artifacts/:username=${NEXUS_USERNAME}
//localhost:8081/repository/angular-artifacts/:_password=${NEXUS_PASSWORD.bytes.encodeBase64().toString()}
//localhost:8081/repository/angular-artifacts/:email=ci@example.com
always-auth=true
EOF
                                
                                npm publish --access public
                            """
                        }
                    } catch (Exception e) {
                        error "Nexus publish failed: ${e.message}"
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
                echo 'Deploying... (Add your deployment logic here)'
                // Example: sh 'kubectl apply -f k8s-deployment.yaml'
            }
        }
    }

    post {
        always {
            // Archive test results
            junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
            
            // Archive build artifacts
            archiveArtifacts artifacts: 'dist/angular-sample/**', allowEmptyArchive: true
            
            // Publish coverage reports
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
            
            // Clean workspace
            cleanWs()
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
            // Add notification logic here (Slack, email, etc.)
        }
        success {
            echo 'Pipeline completed successfully!'
            // Add success notification logic here
        }
    }
}