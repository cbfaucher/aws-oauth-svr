
import {AWSError} from "aws-sdk";
import {DeleteItemOutput, PutItemInput, PutItemOutput} from "aws-sdk/clients/dynamodb";
import {GetItemInput} from "aws-sdk/clients/dynamodb";
import {GetItemOutput} from "aws-sdk/clients/dynamodb";
import {DeleteItemInput} from "aws-sdk/clients/dynamodb";
import {makeid, LoginDao} from "./LoginDao";
import {Login} from "./Login";

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const tableName = 'OAuthSvrLogins';

export const dynamoLoginDao: LoginDao = {

    exists(token: string): boolean {
        const params: GetItemInput = {
            TableName: tableName,
            Key: {
                "Token": {S: token}
            }
        };

        const existing = ddb.getItem(params, function (err:AWSError, data:GetItemOutput) {
            if (err) {
                console.error("Failure getting token: " + token + " - ERROR: " + err);
                throw new Error("Failure getting token: " + err);
            } else {
                console.info("Token '" + token + "' found successfully");
                return data.Item;
            }
        });

        console.log("Token details: " + JSON.stringify(existing));
        return existing != null;
    },

    login(userId: string): Login {

        const token = userId + " " + makeid(20);

        const params: PutItemInput = {
            TableName: tableName,
            Item: {
                'Token': {S: token},
                'UserId': {S: userId}
            }
        };
        ddb.putItem(params, function(err:AWSError, data:PutItemOutput) {
            if (err) {
                console.error("Failure saving token: " + token + " - ERROR: " + err);
                throw new Error("Failure saving token: " + err);
            } else {
                console.info("Token '" + token + "' saved successfully");
                return data;
            }
        });

        return new Login(userId, token);
    },

    logout(token: string): void {

        const params: DeleteItemInput = {
            TableName: tableName,
            Key: {
                'Token': {S: token}
            }
        }

        ddb.deleteItem(params, function(err:AWSError, data:DeleteItemOutput) {
            if (err) {
                console.error("Failure deleting token: " + token + " - ERROR: " + err);
                throw new Error("Failure deleting token: " + err);
            } else {
                console.info("Token '" + token + "' deleted successfully");
            }
        })
    }
}