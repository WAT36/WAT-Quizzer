import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

export const makeReadbleQuizzerBucketIamRole = (
  scope: Construct,
  env: string,
  bucketName: string
) => {
  const iamPolicy = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket'],
        resources: [`arn:aws:s3:::${bucketName}`]
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        resources: [`arn:aws:s3:::${bucketName}/*`]
      })
    ]
  })

  const iamRole = new iam.Role(scope, 'authenticatedQuizzerRole', {
    assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com'),
    inlinePolicies: {
      [`authenticated${env}QuizzerS3`]: iamPolicy
    },
    roleName: `Authenticated${env}QuizzerRoleForAuthedUser`
  })

  return {
    iamRole
  }
}

export const makeUnauthenticatedQuizzerBucketIamRole = (
  scope: Construct,
  env: string,
  bucketName: string
) => {
  const iamPolicy = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['s3:ListBucket'],
        resources: [`arn:aws:s3:::${bucketName}`]
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['s3:GetObject'],
        resources: [`arn:aws:s3:::${bucketName}/*`]
      })
    ]
  })

  const iamRole = new iam.Role(scope, 'unauthenticatedQuizzerRole', {
    assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com'),
    inlinePolicies: {
      [`unauthenticated${env}QuizzerS3`]: iamPolicy
    },
    roleName: `Unauthenticated${env}QuizzerRoleForAuthedUser`
  })

  return {
    iamRole
  }
}
