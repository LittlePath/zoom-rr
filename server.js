const fs = require('fs');
let lines = undefined;

try{
  const rawData = fs.readFileSync('./cc.txt');
  const fileContents = rawData.toString();
  lines = fileContents.split('\n');
  setInterval(post, 1000);
} catch(err){
  console.error(err);
}

function post(){
  const line = lines.shift();
  if(line){
    console.log(line);
  }
}
