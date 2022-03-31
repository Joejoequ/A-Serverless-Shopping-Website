import json

def getSession():
    import boto3
    import urllib3
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
    displayItems=data['items_to_display']
    category=data['category']
    client.put_item(
    TableName='DisplayItem',
    
    Item={
        'category':{
            'S':category
            
        },
        
        'DisplayItemSKU': {
          'SS': displayItems
        }
        
    }
    )
    # TODO implement
    return {
        'statusCode': 200,
        'body': 'Display Items Saved in Dynamo Successfully!',
        'headers':{
            "Access-Control-Allow-Origin": "*"
        }
    }
