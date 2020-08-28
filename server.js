const http = require('http');
const https = require('https');
const fs = require('fs');
const { parse } = require('querystring');
const url = require('url');

const port = 3000;
const host = '127.0.0.1';
const server = http.createServer( (request, response) => {

  if(request.method === 'POST') {
    let data = [];

    request.on('data', (chunk) => {
      data.push(chunk); 
    });
    
    request.on('end', () => {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end('Closed captioning enabled.');
      dataJson = parse( Buffer.concat(data).toString() );
      zoomMeetingUrl = dataJson.meetingUrl;
      setupCC();
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

server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);

//////////////////////////////////

let zoomMeetingUrl = undefined;
let lines = undefined;
let sequence = 1;
function setupCC(){
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
  const data = lines.shift();
  if(data){
    const urlParts = new URL(zoomMeetingUrl);
    const options = {
      hostname: urlParts.hostname,
      port: 443,
      path: urlParts.pathname + urlParts.search + '&lang=en-US' + `&seq=${sequence++}`,
      method: 'POST',
      headers: {
        'Content-Type': 'plain/text',
        'Content-Length': data.length
      }
    }

    const postToZoom = https.request(options, res => {
      res.on('data', d => {
        console.log(d.toString());
      });
    });

    postToZoom.on('error', err => {
      console.error(err);
    });

    postToZoom.write(data);
    postToZoom.end();
  }
}
