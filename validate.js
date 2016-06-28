var emails = require('./a.json');
var https = require('https');
var fs = require('fs');
var counter = 0

const options = {
    hostname: 'api.mailgun.net',
    port: '443',
    path: '/v3/address/validate?address=',
    method: 'GET',
    auth: 'api:pubkey-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-1'
};

var checkEmail = function (emailAddress, id, callback) {
    var emailOptions = options;
    var returnedObject = {};
    emailOptions.path = '/v3/address/validate?address=' + encodeURIComponent(emailAddress);
    https.request(emailOptions, function (res) {
        res.on('data', function (d) {
            resString = d.toString();
            returnedObject = JSON.parse(resString);
            console.log(returnedObject)
            callback(returnedObject.is_valid, id);
        })
    }).on('error', function (e) {
        console.log(e)
    }).end();

};

var emailObjectOfObjects = {};
emails.map(function (email) {
    emailObjectOfObjects[email[0]] = {
        email: email[1],
        memberId: email[2],
        isValid: undefined
    }
});
console.log(emailObjectOfObjects);
var writeFile = function() {
    fs.writeFile('d.json', JSON.stringify(emailObjectOfObjects), function (err) {
        if (err) {
            throw err
        }
        console.log('Wrote File')
    });
};
for (var key in emailObjectOfObjects) {
    counter++;
    if (counter === 10)

    checkEmail(emailObjectOfObjects[key].email, key, function (valid, id) {
        emailObjectOfObjects[id].isValid = valid;
        counter--;
        if (counter === 0) {
            writeFile()
        }
    });
}


