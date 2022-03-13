// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

snsSubscribe('848080960@qq.com')

function snsSubscribe(emailAddress){
  // Set region
  AWS.config.update({region: 'us-east-1',
    accessKeyId: "AKIAURO45OBL6AV3X3LX",
    secretAccessKey: "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"});

// Create subscribe/email parameters
var params = {
  Protocol: 'EMAIL', /* required */
  TopicArn: 'arn:aws:sns:us-east-1:312385302615:4145', /* required */
  Endpoint: 'emailAddress'
};

// Create promise and SNS service object
var subscribePromise = new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();

// Handle promise's fulfilled/rejected states
subscribePromise.then(
  function(data) {
    console.log("Subscription ARN is " + data.SubscriptionArn);
  }).catch(
  function(err) {
    console.error(err, err.stack);
  });
}
