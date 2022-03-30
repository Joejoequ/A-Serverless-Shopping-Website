
    
import uuid
import json
import boto3
import urllib3

from boto3.dynamodb.conditions import Key

def input_check(data,imageurl,desc,sku,name,detail):
    return
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
    
    
def lambda_handler(event, context):
    
    
    dynamodb = getSession().resource('dynamodb', region_name='us-east-1')
    
    data=json.loads(event['body'])
    
    userID=data['user_id']
    
    table = dynamodb.Table('Order')
    
    response=table.query(
    IndexName='user_id-index', 
    KeyConditionExpression=Key('user_id').eq(userID)
)

  
    
    return {
        'statusCode': 200,
        'body': str(response['Items'])
    }
