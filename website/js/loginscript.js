const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');


signUpButton.addEventListener('click', () => {

    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});


var username;
var password;
var email;
var poolData;

//intercept submit process, use AWS Cognito Script to control
function processLogin(e) {
    if (e.preventDefault) e.preventDefault();

    login();
    return false;
}

function processRegister(e) {
    if (e.preventDefault) e.preventDefault();

    register();
    return false;
}


var loginform = document.getElementById('loginform');
if (loginform.attachEvent) {
    loginform.attachEvent("submit", processLogin);
} else {
    loginform.addEventListener("submit", processLogin);
}

var registerform = document.getElementById('registerform');
if (registerform.attachEvent) {
    registerform.attachEvent("submit", processRegister);
} else {
    registerform.addEventListener("submit", processRegister);
}


function cleanPage() {
    document.getElementById("loginform").reset();
    document.getElementById("response").innerText = "";
}


function register() {


    username = document.getElementById("regUserName").value;
    password = document.getElementById("regPassword").value;
    email = document.getElementById("regEmail").value;

    var pattern = /[\da-zA-Z]+/;
    var digit = /[\d]+/;
    var letter = /[a-zA-Z]+/;
    var emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (pattern.test(username) && pattern.test(password) && password.length >= 8 && digit.test(password) && letter.test(password) && emailRegex.test(email)) {

        poolData = {
            UserPoolId: _config.cognito.userPoolId,//AWS Cognito Userpool ID
            ClientId: _config.cognito.clientId,
        };
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var attributeList = [];
        var dataEmail = {
            Name: 'email',
            Value: email,
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail)
        userPool.signUp(username, password, attributeList, null, function (err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            var cognitoUser = result.user;
            console.log('Register Successful. User name is :' + cognitoUser.getUsername());
            //change response
            document.getElementById("registerform").reset();

            document.getElementById("signIn").click()
            document.getElementById("response").style.visibility = "visible"
            document.getElementById("response").innerText = "Sign Up Successfully. Please Verify Account in Email"
        });
    } else {
        alert("Invalid Format of User Input")
    }

}

function login() {


    var authenticationData = {
        Username: document.getElementById("loginUsername").value,
        Password: document.getElementById("loginPassword").value,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId: _config.cognito.userPoolId, // Your user pool id here
        ClientId: _config.cognito.clientId, // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var userData = {
        Username: document.getElementById("loginUsername").value,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            
            var accessToken = result.getAccessToken().getJwtToken();
            console.log(accessToken);

            window.location.replace("index.html");

        },

        onFailure: function (err) {
            document.getElementById("response").style.visibility = "visible";
            document.getElementById("response").innerText = "Error: " + err.message || JSON.stringify(err);

        },
    });
}


