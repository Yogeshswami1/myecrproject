pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID = "654654592668"
    AWS_REGION = "ap-south-1"

    ECR_FRONTEND = "expenses-frontend"
    ECR_BACKEND  = "expenses-backend"

    EC2_HOST = "3.110.193.50"
  }

  stages {

    stage('Build Docker Images') {
      steps {
        sh '''
          docker build -t ecr-frontend ./frontend
          docker build -t ecr-backend ./backend
        '''
      }
    }

    stage('Login to AWS ECR') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          sh '''
            aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
            aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
            aws configure set region $AWS_REGION

            aws ecr get-login-password --region $AWS_REGION |
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
          '''
        }
      }
    }

    stage('Push Images to ECR') {
      steps {
        sh '''
          docker tag ecr-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND:latest
          docker tag ecr-backend:latest  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND:latest

          docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND:latest
          docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND:latest
        '''
      }
    }

    stage('Deploy on EC2') {
  steps {
    sshagent(['ec2-ssh']) {
      withCredentials([
        string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
        string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
      ]) {
        sh '''
          ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "
            aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID &&
            aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY &&
            aws configure set region $AWS_REGION &&

            aws ecr get-login-password --region $AWS_REGION |
            docker login --username AWS --password-stdin \
            $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com &&

            docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND:latest &&
            docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND:latest &&

            docker stop frontend backend || true &&
            docker rm -f frontend backend || true &&

            docker run -d --name backend -p 7000:7000 \
              $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND:latest &&

            docker run -d --name frontend -p 3000:4173 \
              $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND:latest
          "
        '''
      }
    }
  }
}

  }
}
