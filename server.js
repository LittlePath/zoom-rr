const http = require('http');
const fs = require('fs');

const server = http.createServer(function(request, response) {

  if(request.method === 'POST') {
    let body = '';
    request.on('data', function(data) {
      body += data;
    })
    request.on('end', function() {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end('Closed captioning enabled.');
    })
  } else if(request.method === 'GET'){
    const index = fs.readFileSync('./index.html');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(index.toString());
  }
})

const port = 3000;
const host = '127.0.0.1';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
