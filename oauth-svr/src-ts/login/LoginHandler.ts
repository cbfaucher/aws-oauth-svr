import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import {dynamoLoginDao} from "./DynamoLoginDao";
import {LoginDao} from "./LoginDao";

let response;

class LoginHandler {
    private dao:LoginDao;

    constructor(dao: LoginDao) {
        this.dao = dao;
    }

    execute(event: APIGatewayProxyEvent): APIGatewayProxyResult {
        const userId = event.queryStringParameters.userId;

        console.log("LOGIN '" + userId + '"... Calling DAO...')

        const token = this.dao.login(userId);

        response = {
            statusCode: 200,
            body: token.token
        }

        console.log()
        return response;
    }
}

export const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const handler = new LoginHandler(dynamoLoginDao);
    const result = await handler.execute(event)
    return result
}