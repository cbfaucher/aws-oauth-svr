// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import {AWSError} from "aws-sdk";
import {GetItemInput, GetItemOutput} from "aws-sdk/clients/dynamodb";
//import {User} from "User";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
export const getUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const { userId } = event.pathParameters;

    try {

        var params: GetItemInput = {
            TableName: 'OAuthSvrUsers',
            Key: {
                'UserId': {S: userId}
            },
            ProjectionExpression: 'UserId,FullName,Password'
        }
        console.log("Entering: GET USER: " + userId + " / Params=" + JSON.stringify(params));

        var user:User = null;
        const dbResult = await ddb.getItem(params).promise();
        if (dbResult.$response.error) {
            console.error("Failure fetching Object: " + dbResult.$response.error);
        } else {
            console.log("DB Result is " + JSON.stringify(dbResult));
            user = dbResult.Item;
            console.log("Object found: " + JSON.stringify(user));
        }

        if (user == null) {
            response = {
                'statusCode': 404,
                'body': 'User not found'
            }
        } else {
            response = {
                'statusCode': 200,
                'body': JSON.stringify(user)
            }
        }

    } catch (error) {
        console.log(error);
        return error;
    }

    return response
};
