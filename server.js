const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const server = http.createServer( (request, response) => {

  if(request.method === 'POST') {
    let data = [];

    request.on('data', (chunk) => {
      data.push(chunk); 
    });
    
    request.on('end', () => {
      console.dir(data);
      response.writeHead(200, {'Content-Type': 'text/html'});
      // response.end('Closed captioning enabled.');
      let output = '';
      output += '<pre><code>Zoom meeting url:[';
      requestBody = Buffer.concat(data).toString();
      output += requestBody;
      output += ']</code></pre>';
      console.log(output);
      response.end(output);
      rr();
    });

    request.on('error', (err) => {
      console.error(`ERROR: ${err.stack}`);
    });

  } else if(request.method === 'GET'){
    const index = fs.readFileSync('./index.html');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(index.toString());
  }
});

const port = 3000;
const host = '127.0.0.1';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);

let lines = undefined;
function rr(){
  try{
    const rawData = fs.readFileSync('./cc.txt');
    const fileContents = rawData.toString();
    lines = fileContents.split('\n');
    setInterval(post, 1000);
  } catch(err){
    console.error(err);
  }
}

function post(){
  const line = lines.shift();
  if(line){
    console.log(line);
  }
}
