// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import {AWSError} from "aws-sdk";
import {PutItemInput} from "aws-sdk/clients/dynamodb";
import {PutItemOutput} from "aws-sdk/clients/dynamodb";
//import {User} from "User";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let response;
let newuser:User;

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
export const storeUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    //const { userId } = event.pathParameters;
    try {
        console.log("BODY is " + event.body);
        newuser = JSON.parse(event.body);

        console.log("Entering: SAVE USER: UserId=" + newuser.userId + " / Name=" + newuser.fullName + " / Password=" + newuser.password);

        var params: PutItemInput = {
            TableName: 'OAuthSvrUsers',
            Item: {
                'UserId': {S: newuser.userId},
                'Name': {S: newuser.fullName},
                'Password': {S: newuser.password}
            }
        };
        console.log("PutItem Params: " + JSON.stringify(params));

        //var result:Boolean = false
        var rc = 0;
        var result = await ddb.putItem(params).promise();
        console.log("Saving Result: " + JSON.stringify(result));

        if (result.$response.error) {
            console.error("Error saving object: " + result.$response.error);
            rc = 500;
        } else {
            console.info("Saving object apparently succeeded?!")
            rc = 200;
        }

        response = {
            statusCode: rc,
            body: ''
        }

        return response

    } catch (error) {
        console.log(error);
        return error;
    }
};
