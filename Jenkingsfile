pipeline {
    agent none

    environment {
        PROJECT_NAME = 'VindThing'
        MAJOR_VERSION = 0
        MINOR_VERSION = 9
        VERSION_NUMBER = "ui-dev-${MAJOR_VERSION}.${MINOR_VERSION}.${BUILD_NUMBER}"
        CONTAINER_NAME = "vt-ui"
        CONTAINER_HUB_NAME = "bsteffen/vt-ui"
    }

    stages {
        stage('Get Source') {
            agent any
            steps {
                script {
                    currentBuild.displayName = "${VERSION_NUMBER}"
                }

                // Get code from the GitHub repository
                //// git branch: 'main', credentialsId: 'github-benjamin', url: 'https://github.com/stefannyffenegger/vindthing-ui.git'

            }
        }

        stage('Build Docker Container') {
            agent any
            steps {
                script {

                    // Docker Container stoppen und löschen falls dieser läuft
                    def command = $/if [ "$( docker container inspect -f '{{.State.Status}}' ${CONTAINER_NAME} )" = 'running' ]; then docker container stop ${CONTAINER_NAME} && docker container rm ${CONTAINER_NAME}; fi/$
                    sh("${command}")

                    def commandStopped = $/if [ "$( docker container inspect -f '{{.State.Status}}' ${CONTAINER_NAME} )" = 'exited' ]; then docker container stop ${CONTAINER_NAME} && docker container rm ${CONTAINER_NAME}; fi/$
                    sh("${commandStopped}")

                    // Docker Container aufbauen
                    def vtui = docker.build("${CONTAINER_HUB_NAME}:${VERSION_NUMBER}", '.')

                    // Docker Container auf Docker Hub pushen
                    // docker.withRegistry( '', 'docker-hub-credentials' ) { vtui.push('latest') }

                    // Docker Container auf lokalem Docker Host starten
                    vtui.run('--name "${CONTAINER_NAME}" -p 6000:6000')
                    sh 'docker tag "${CONTAINER_HUB_NAME}:${VERSION_NUMBER}" "${CONTAINER_HUB_NAME}:latest"'

                }
            }
        }
    }
    post {
        always {
            emailext subject: "${JOB_NAME} - Build # ${VERSION_NUMBER} - ${currentBuild.result}!",
            body: """${JOB_NAME} - Build # ${VERSION_NUMBER} - ${currentBuild.result}: Check console output in the attachement or at ${BUILD_URL} to view the results.""",
            from: 'benjamin.steffen@students.ffhs.ch',
            to: 'benjamin.steffen@students.ffhs.ch',
            attachLog: true
        }

        cleanup {
            node('master') {
                // Alte Docker Images löschen
                sh 'docker rmi $(docker images --filter=reference="${CONTAINER_HUB_NAME}:*" --filter "before=${CONTAINER_HUB_NAME}:latest" -q)'
            }
        }
    }
}
