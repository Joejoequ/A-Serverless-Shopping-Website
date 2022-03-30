import json
import boto3
import urllib3
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

def getSession():
    
    http = urllib3.PoolManager()
    r = http.request('GET', "https://85grdydli0.execute-api.us-east-1.amazonaws.com/sessionKey")
    session=json.loads(r.data)
    session = boto3.Session(
        aws_access_key_id=session['aws_access_key_id'],
        aws_secret_access_key=session['aws_secret_access_key'],
        aws_session_token=session['aws_session_token'],
        region_name=session['region_name']
    )
    
    return session
    


def from_dynamodb_to_json(item):
    d = TypeDeserializer()
    return {k: d.deserialize(value=v) for k, v in item.items()}
    
def lambda_handler(event, context):
    client = getSession().client('dynamodb')
    data=json.loads(event['body'])
   
    item=client.get_item(
    TableName='DisplayItem',
    Key={
        'category': {'S': data['category']}

    })
    SKUs=item['Item']['DisplayItemSKU']['SS']
    
    x = client.batch_get_item(
    RequestItems={
        'Item': {
            'Keys': [{'SKU': {'S': sku}} for sku in SKUs]
        }
    }
)
    itemsList=x['Responses']['Item']
    result=[]
    for item in itemsList:
        result.append(from_dynamodb_to_json(item))
    

    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps(result),
        'headers':{
            "Access-Control-Allow-Origin": "*"
        }
    }