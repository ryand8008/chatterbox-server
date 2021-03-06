// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// if (urlParams.has('username') && urlParams.has('text')) {
//   let message = {};

//   message.username = urlParams.get('username');
//   message.text = urlParams.get('text');

//   storage.push(message);

//   data.headers['Content-Type'] = 'application/json';
//   data.statusCode = 201;
//   data.end = JSON.stringify(message);
// } else {
//   data.statusCode = 400;
//   data.headers['Content-Type'] = 'text/plain';
//   data.end = 'Missing username or message';
// }

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

const storage = [];

var getOptions = function(data) {
  data.headers['Content-Type'] = 'text/plain';
  data.end = 'Allow: GET, POST, OPTIONS';
  data.statusCode = 200;
};

var postMessage = function(data, body) {
};

var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  const { url, headers } = request;
  let data = { headers: defaultCorsHeaders };

  var endResponse = () => {
    response.writeHead(data.statusCode, data.headers);
    response.end(data.end);
  };

  if (url === '/classes/messages') {
    if (request.method === 'GET') {
      data.headers['Content-Type'] = 'application/json';
      data.end = JSON.stringify(storage);
      data.statusCode = 200;
    } else if (request.method === 'POST') {

      data.statusCode = 201;
      data.headers['Content-Type'] = 'application/json';

      let bodyData = '';
      request.on('data', chunk => {
        bodyData += chunk;
      });
      request.on('end', () => {
        if (bodyData.length > 0) {
          bodyData = JSON.parse(bodyData);

          bodyData['message_id'] = storage.length + 1;
          storage.unshift(bodyData);

          data.end = JSON.stringify(storage);

          endResponse();
        }
      });
    } else if (request.method === 'OPTIONS') {
      getOptions(data);
    } else {
      // The outgoing status.
      data.statusCode = 405;

      data.headers['Content-Type'] = 'text/plain';
      data.end = 'Method not allowed';
    }
  } else {
    // The outgoing status.
    data.statusCode = 404;

    data.headers['Content-Type'] = 'text/plain';
    data.end = 'Hello, World!';
  }

  if (url !== '/classes/messages' || request.method !== 'POST') {
    endResponse();
  }
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

exports.requestHandler = requestHandler;
