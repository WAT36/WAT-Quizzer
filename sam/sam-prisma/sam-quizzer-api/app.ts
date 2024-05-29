import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import prisma from './prismaClient';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const pathParam = event.path.split('/');
        if (pathParam.length < 1 || pathParam[1] === 'hello') {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'hello world',
                }),
            };
        } else if (pathParam[1] === 'quiz') {
            return {
                statusCode: 200,
                body: JSON.stringify(
                    await prisma.quiz_file.findMany({
                        select: {
                            file_num: true,
                            file_name: true,
                            file_nickname: true,
                        },
                        where: {
                            deleted_at: null,
                        },
                        orderBy: {
                            file_num: 'asc',
                        },
                    }),
                ),
            };
        } else {
            throw new Error(`Error: illegal path.:${event.path}`);
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
};
