import json
import boto3
import urllib3


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
    imageurl=data['image_url']
    desc=data['description']
    sku=data['SKU']
    name=data['product_name']
    detail=data['product_detail']
    price=data['price']
    # TODO implement
    
    data = client.put_item(
    TableName='Item',
    
    Item={
        'SKU': {
          'S': sku
        },
        'price': {
          'S': price
        },
        'product_name':{
          'S': name
        },
        
        'description':{
          'S': desc
        },
        
        'product_detail':{
          'S': detail
        },
        
        'image_url':{
          'S': imageurl
        }
        
        
        
    }
    )
    
  
    
    return {
        'statusCode': 200,
        'body': 'Item Added Successfully'
    }
    

