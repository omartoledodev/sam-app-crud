const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = process.env.TABLE_DYNAMODB

exports.saveItem = async (event) => {
    const task = event.queryStringParameters.task
    var date = new Date()
    const id = date.toLocaleDateString().replaceAll('/', '') + date.toLocaleTimeString().replaceAll(':', '')
    
    try {
        const item = {
            id: id,
            task: task,
            status: 'pending',
            created_at: new Date().toISOString()
        }
    
        const params = {
            TableName: TABLE_NAME,
            Item: item
        }
    
        const response = await dynamo.put(params).promise()
    
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: ' + error
        }
    }
    
}

exports.getItems = async (event) => {

    try {
        const params = {
            TableName : TABLE_NAME
        }
    
        const response = await dynamo.scan(params).promise()
    
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: ' + error
        }
    }
    
}

exports.updateItem = async (event) => {
    try {
        const task = event.queryStringParameters.task
        const status = event.queryStringParameters.status
        const id = event.queryStringParameters.id

        const params = {
            TableName: TABLE_NAME,
            Key: { 
                id : id
            },
            UpdateExpression: 'set #task = :task, #status = :status',
            ExpressionAttributeNames: { '#task' : 'task', '#status' : 'status'},
            ExpressionAttributeValues: {
                ':task': task,
                ':status': status
            }
        }

        const response = await dynamo.update(params).promise()

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        }  
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: ' + error
        }
    }
    
}

exports.deleteItem = async (event) => {
    try {
        const id = event.queryStringParameters.id

        const params = {
            TableName : TABLE_NAME,
            Key: {
                id: id
            }
        }

        const response = await dynamo.delete(params).promise()

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "OPTIONS,POST,GET, PUT, DELETE"
            },
            body: JSON.stringify(response)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: ' + error
        }
    }
    
}