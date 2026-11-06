import * as path from 'path'
import { Construct } from 'constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'

// 英単語詳細ページのURLを共通のHTMLファイルへ読み替えるCloudFront Function
export const makeDetailWordRewriteAssociation = (
  scope: Construct,
  id: string
): cloudfront.FunctionAssociation => ({
  function: new cloudfront.Function(scope, id, {
    code: cloudfront.FunctionCode.fromFile({
      filePath: path.join(
        __dirname,
        'cloudfront-function/detail-word-rewrite.js'
      )
    })
  }),
  eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
})
