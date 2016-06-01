'use strict';

var bl = require('bl');
var https = require('https');

var parsing = require('./parsing');

var curPlace = 'http://www.reddit.com/';
// http.get(curPlace, (res) => {
//   res.pipe(bl((err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//
//     var links = parsing.findLinks(data.toString());
//     console.log(data);
//     console.log(links);
//   }));
// });

var options = {
  hostname: 'reddit.com',
  port: 443,
  path: '/',
  method: 'GET'
};

https.get(options, function (res) {
  console.log('STATUS: %d', res.statusCode);
  console.log('HEADERS: %s', JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: %s', chunck);
  });
  res.on('end', function () {
    console.log('No more data in response.');
  });
}).on('error', function (err) {
  console.log('error: %s', err);
});
