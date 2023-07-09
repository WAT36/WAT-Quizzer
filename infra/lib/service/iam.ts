import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

export const makeReadbleQuizzerBucketIamRole = (
  scope: Construct,
  env: string,
  bucketName: string,
  idPoolId: string
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
    assumedBy: new iam.FederatedPrincipal(
      'cognito-identity.amazonaws.com',
      {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': idPoolId
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        }
      },
      'sts:AssumeRoleWithWebIdentity'
    ),
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
  bucketName: string,
  idPoolId: string
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
    assumedBy: new iam.FederatedPrincipal(
      'cognito-identity.amazonaws.com',
      {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': idPoolId
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated'
        }
      },
      'sts:AssumeRoleWithWebIdentity'
    ),
    inlinePolicies: {
      [`unauthenticated${env}QuizzerS3`]: iamPolicy
    },
    roleName: `Unauthenticated${env}QuizzerRoleForAuthedUser`
  })

  return {
    iamRole
  }
}

export const makeQuizzerLambdaEdgeIamRole = (scope: Construct, env: string) => {
  const iamPolicy = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ],
        resources: ['arn:aws:logs:*:*:*']
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'lambda:GetFunction',
          'lambda:EnableReplication*',
          'iam:CreateServiceLinkedRole',
          'cloudfront:CreateDistribution',
          'cloudfront:UpdateDistribution'
        ],
        resources: [`*`]
      })
    ]
  })

  const iamRole = new iam.Role(scope, `${env}QuizzerLambdaEdgeRole`, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    inlinePolicies: {
      [`${env}QuizzerLambdaEdgePolicy`]: iamPolicy
    },
    roleName: `${env}QuizzerLambdaEdgeRole`
  })

  return {
    iamRole
  }
}
