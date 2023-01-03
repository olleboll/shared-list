import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'shared-lists';

export const getItems = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const listId = event['queryStringParameters']!['list_id'];

        console.log(`Gettings list ${listId}`);
        const query = {
            TableName: tableName,
            IndexName: 'individual-lists',
            KeyConditionExpression: 'list_id = :partitionkeyval',
            ExpressionAttributeValues: {
                ':partitionkeyval': listId,
            },
        };
        console.log(query);

        const response = await dynamo.send(new QueryCommand(query));
        console.log(response);
        const items = response.Items;
        return {
            statusCode: 200,
            body: JSON.stringify(items),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

export const createItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = JSON.parse(event.body!);
        console.log('creating item');
        const item = {
            id: uuid(),
            value: requestBody.value,
            list_id: requestBody.listId,
            created_at: Date.now(),
        };
        console.log(item);

        await dynamo.send(
            new PutCommand({
                TableName: tableName,
                Item: item,
            }),
        );

        console.log('item created');

        return {
            statusCode: 201,
            body: JSON.stringify(item),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

export const deleteItem = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = JSON.parse(event.body!);
        console.log('Deleting item');
        await dynamo.send(
            new DeleteCommand({
                TableName: tableName,
                Key: { id: requestBody.id },
            }),
        );

        console.log('items deleted');

        return {
            statusCode: 204,
            body: JSON.stringify({
                message: 'deleted',
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
