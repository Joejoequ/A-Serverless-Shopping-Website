# Critical Analysis & Response Tasks Document
## 1) Project Proposal, Deployment & Delivery Model
We intend to develop a online shopping website with the suppport of AWS service. The website provide customer with basic function for shopping and receiving orders function for seller.

### Potential User Story/Task
User Story 1:

User could create an account with sufficient personal information.

User Story 2:

User could login using an existing account

User Story 3:

User add items to shopping cart (saved in account)

User Story 4:

User could checkout the cart, pay for order.

User Story 5:

Items could be posted on the website

User Story 6:

Orders could be saved in a database, with transaction details

User Story 7:

User could review history order.

### AWS Service 
#### AWS SNS
We could use this service to push notification for order confirmation to customer/seller email address.
#### AWS Secrets Manager
We could use this service to save api keys, and important user information (username/password)
#### AWS API Gateway
We could use this service to secure networks requests.
#### AWS S3
We could use this service to store image of items, static resource
#### (AWS DynamoDB)
We could use this as our online database, for order information storage
#### AWS Elastic Beanstalk
Use this for back-end code.
#### AWS Lambda
Use this for some service to build a serverless back-end
