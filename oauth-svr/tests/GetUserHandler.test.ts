'use strict';

import { suite, test } from '@testdeck/mocha';
//import * as _chai from 'chai';
import { mock, instance } from 'ts-mockito';
import { getUserHandler } from '../src-ts/GetUserHandler';
import {APIGatewayProxyEvent} from "aws-lambda";

const app = require('../src-ts/GetUserHandler.ts');
const chai = require('chai');
const expect = chai.expect;
var event:APIGatewayProxyEvent

describe ('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await app.getUserHandler(event)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("hello world");
        // expect(response.location).to.be.an("string");
    });
});
