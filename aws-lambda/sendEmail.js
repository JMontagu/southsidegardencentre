var config = {
    toEmail: 'jmontagu@gmail.com',
    toName: 'Southside Garden Centre'
};

exports.myHandler = function(event, context, callback) {
    var https = require('https');
    var querystring = require('querystring');
    
    var payLoad = {
        to: config.toEmail,
        toname: config.toName,
        subject: 'Website Enquiry from ' + event.name,
        html: 'Name: ' + event.name + '<br/>Email: ' + event.email + '<br/>Message: ' + event.message,
        from: 'no-reply@southsidegardencentre.co.nz',
        replyto: event.email
    };
    
    var dataString = querystring.stringify(payLoad);
    
    var options = {
        host: 'api.sendgrid.com',
        path: '/api/mail.send.json?' + dataString,
        port: 443,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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'
        }
    };
    
    var req = https.request(options, function(res) {
      console.log('Status: ' + res.statusCode);
      console.log('Headers: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (body) {
        console.log('Body: ' + body);
      });
    
    
    var responseString = '';

    res.on('data', function(data) {
        responseString += data;
    });

    res.on('end', function() {
      var responseObject = JSON.parse(responseString);
      callback(null, responseObject);
     });
    });
    
    req.on('error', function(e) {
        callback(null, 'problem with request: ' + e.message);
    });
    
    console.log(dataString);
    
    // write data to request body
    //req.write(dataString);
    req.end();
}