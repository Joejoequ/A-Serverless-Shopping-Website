// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

snsPublish('here is the message')

function snsPublish(message){
	// Set region
	AWS.config.update({
		region: 'us-east-1',
		accessKeyId: "AKIAURO45OBL6AV3X3LX",
		secretAccessKey: "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"});

// Create publish parameters
var params = {
	Message: message, /* required */
	TopicArn: 'arn:aws:sns:us-east-1:312385302615:4145'
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({
	apiVersion: '2010-03-31'
}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
	function(data) {
		console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
		console.log("MessageID is " + data.MessageId);
	}).catch(
	function(err) {
		console.error(err, err.stack);
	});
}
