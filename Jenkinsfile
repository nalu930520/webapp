pipeline {
  agent {
    docker {
      image 'node:9.11-alpine'
      args '-v /var/lib/jenkins:/opt/awsconfig'
    }
  }

  stages {

    stage('Checkout') {
        steps {
          checkout([$class: 'GitSCM',
                    branches: [[name: '*/develop']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[$class: 'SubmoduleOption',
                                  disableSubmodules: false,
                                  parentCredentials: false,
                                  recursiveSubmodules: true,
                                  reference: '',
                                  trackingSubmodules: false]],
                    submoduleCfg: [],
                    userRemoteConfigs: [[credentialsId: 'd0f6a358-6f2e-4f11-823b-b0c31838f942',
                                         url: 'https://github.com/mobiwallet/mobi-webapp.git']]])
        }
      }

    stage('Install Dependencies') {
      steps {
                nodejs(nodeJSInstallationName: 'node10.1.0') {
                sh 'npm --version'
                sh 'node --version'
                sh 'npm install'
           }
      }
    }

    stage('Build According Bracnch') {
      steps {
                sh  """
                      if [ ${BRANCH_NAME} = 'develop' ];then
                          npm run build:staging
                      fi
                      if [ ${BRANCH_NAME} = 'master' ];then
                          npm run build:preProduction
                      fi
                      if [ ${BRANCH_NAME} = 'release' ];then
                          npm run build:production
                      fi
                    """
      }
    }

    stage('create staging deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'develop' }
            }
      steps {
        input 'Are you sure to deploy staging?'
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-Staging',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Staging',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'mobi-webapp',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'cn-north-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/mobi-webapp',    //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }

    stage('create preProduction deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'master-pause' }
            }
      steps {
        input 'Are you sure to deploy preProduction?'
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-PRE',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Production',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'mobi-webapp',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'ap-northeast-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/mobi-webapp', //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }

    stage('create production deployment') {
      when {
              // case insensitive regular expression for truthy values
              expression { env.BRANCH_NAME == 'release-pause' }
            }
      steps {
        input 'Are you sure to deploy prodution?'
        step([$class: 'AWSCodeDeployPublisher',
              applicationName: 'MOBI-PRO',
              awsAccessKey: '',
              awsSecretKey: '',
              credentials: 'Production',
              deploymentGroupAppspec: true,
              deploymentGroupName: 'mobi-webapp',    //PROJECT_NAME
              deploymentMethod: 'deploy',
              excludes: 'node_modules/',
              iamRoleArn: '',
              includes: '**',
              proxyHost: '',
              proxyPort: 0,
              region: 'ap-northeast-1',
              s3bucket: 'jenkinscicode',
              s3prefix: 'CodeDeploy/mobi-webapp',    //PROJECT_NAME
              subdirectory: '',
              versionFileName: '',
              waitForCompletion: false])
      }
    }
  }
  environment {
    Author = 'Vance Li'
  }
}
