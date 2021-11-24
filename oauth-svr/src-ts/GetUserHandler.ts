// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import {AWSError} from "aws-sdk";
import {GetItemOutput} from "aws-sdk/clients/dynamodb";
//import {User} from "User";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
    TableName: 'OAuthSvrUsers',
    Key: {
        'UserId': {N: '001'}
    },
    ProjectionExpression: 'ATTRIBUTE_NAME'
}

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

    console.log("Entering: GET USER: " + userId)
    try {

        var user:User = null;
        ddb.getItem(params, function(err:AWSError, data:GetItemOutput) {
            if (err) {
                console.log("Error", err);
                user = null;
            } else {
                console.log("Success", data.Item);
                user = new User(data.Item.userId.N, data.Item.name.N, data.Item.password.N)
            }
        })

        console.log("USER Found: " + user)

        if (user == null) {
            response = {
                'statusCode': 404,
                'body': 'User not found'
            }
        } else {
            response = {
                'statusCode': 200,
                'body': JSON.stringify({
                    userId: userId,
                    user: user
                })
            }
        }

    } catch (error) {
        console.log(error);
        return error;
    }

    return response
};
