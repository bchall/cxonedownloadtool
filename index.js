const request = require('request');
const fs = require('fs');
const Readable = require('stream').Readable;
const args = process.argv.slice(2);

var options = {
    'method': 'POST',
    'url': 'https://na1.nice-incontact.com/authentication/v1/token/access-key',
    'headers': {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "accessKeyId": "",
        "accessKeySecret": ""
    })

};
request(options, function (error, response) {
    if (error) throw new Error(error);
    obj = JSON.parse(response.body);

    var token = obj.access_token;

    var options = {
        'method': 'GET',
        'url': 'https://api-na1.niceincontact/incontactapi/services/v23.0/scripts/search?scriptName=' + args[0],
        'headers': {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        obj = JSON.parse(response.body);
        masterID = obj.scriptSearchDetails[0].masterID;


        var options = {
            'method': 'GET',
            'url': 'https://api-na1.niceincontact/incontactapi/services/v23.0/scripts/' + masterID,
            'headers': {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            obj = JSON.parse(response.body);

            const imgBuffer = Buffer.from(obj.body, 'base64')

            var s = new Readable()

            s.push(imgBuffer)
            s.push(null)

            s.pipe(fs.createWriteStream(obj.name + '.xml'));

        });
    });
});
