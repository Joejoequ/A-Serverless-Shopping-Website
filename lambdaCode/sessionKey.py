import json

def lambda_handler(event, context):
    # TODO implement
    session={'aws_access_key_id':'ASIARQEB74Z7AHWSJCEW',
        'aws_secret_access_key':'SehPuRKw8zA7K+bHVhHh5kwf/r/mSYaazAvO4mKL',
        'aws_session_token':'FwoGZXIvYXdzEO3//////////wEaDKHIsLVvtq5ledzbhyLAAScHpmA1i8yr1481XSiPX9ThDNNB0UnPNmq+bnRbmb5w42O+VR0XT2VAPggCZ3svGtp3p4OelN6UdqDuAkE+VxNXiU+ejYOio989y2SIipz3ckWvYx4EH/qa4d6y3GOeYEjV4mSUHQcPgXMSbqbJ0t2VubtDO/tF+I9I3ApAQdZUZsvIcZ51x9K9MJnE/l5AvB8wFBISAkqNvVrKYSxk93kc46vbsOYyBQr8ptu/VWlqGmjQ4mn06YlnPsEMVAxlYSji4rqRBjItGVBaHvqL64zomODfveZmngAcpkKjszBsU6sFuhnSj64bpMAd/cDXUNpH5Rxe',
        'region_name':'us-east-1'}


    return {
        'statusCode': 200,
        'body': json.dumps(session)
    }
