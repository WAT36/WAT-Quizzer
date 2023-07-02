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

  const iamRole = new iam.Role(scope, 'Role', {
    assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com'),
    inlinePolicies: {
      [`read${env}QuizzerS3`]: iamPolicy
    },
    roleName: `Read${env}QuizzerRoleForAuthedUser`
  })

  return {
    iamRole
  }
}
