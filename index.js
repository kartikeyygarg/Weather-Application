const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8"); //bufferencoding

const replaceVal = (tempVal, orgVal) =>{
        let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273.16).toFixed(2));
        temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min-276).toFixed(2));
        temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-268).toFixed(2));
        temperature = temperature.replace("{%location%}", orgVal.name);
        temperature = temperature.replace("{%country%}", orgVal.sys.country);
        temperature = temperature.replace("{%tempStatus%}", orgVal.clouds);
        return temperature;
};

const server = http.createServer((req, res)=>{
        if(req.url== "/"){
                requests("https://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&appid=00c4d0e128f1b775c84f79108422e024")
.on('data', (chunk) =>{
  const objdata=JSON.parse(chunk);   
  const arrData = [objdata];   
//   console.log(arrData[0].main.temp);
  const realTimeData = arrData.map((val) =>replaceVal(homeFile, val)).join("");
  res.write(realTimeData);
// console.log(realTimeData);
})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
}); 
} else{
        res.end("File not found");
        }
});

server.listen(3000,"127.0.0.1");