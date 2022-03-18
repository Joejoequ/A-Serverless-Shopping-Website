
    
import uuid
import json
import boto3
import urllib3
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer

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
    
    
    client = getSession().client('dynamodb')
    
    data=json.loads(event['body'])
    orderID=str(uuid.uuid4())
    userID=data['user_id']
    status=data['status']
    amount=data['amount']
    checkout_list=data['checkout_list']
    
    
    ts= TypeSerializer()
    
    
    #example_checkout_list=[{"SKU":"1M7","Quantity":"2"},{"SKU":"1M7","Quantity":"2"},{"SKU":"1M7","Quantity":"2"}]
    
    
    formated_checkout_list=[]
    for item in checkout_list:
      formated_checkout_list.append(ts.serialize(item))
    
    
    
    data = client.put_item(
    TableName='Order',
    
    Item={
        'order_id': {
          'S': orderID
        },
        'user_id': {
          'S': userID
        },
        'status':{
          'S': status
        },
        
        'amount':{
          'S': amount
        },
        
        'checkout_list':{
          'L': formated_checkout_list
        }
        
        
    }
    )
    
  
    
    return {
        'statusCode': 200,
        'body': 'Order Created Successfully'
    }