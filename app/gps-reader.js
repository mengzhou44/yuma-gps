const path = require("path");

const { spawn } = require('child_process');

const { isDev } =require('./environment');

const axios = require('axios');

const commandPath = isDev() ? 
                    __dirname + "\\yuma-lib" : 
                    path.join(process.resourcesPath, "yuma-lib");

  
const cmd = spawn('YumaServices.exe' , {cwd: commandPath});

function getGPSLocation(callback) {
  const url =  isDev() ?  
                 'http://localhost:3000/api/test/getLocation'  :
                 'http://localhost:3000/api/yuma/getLocation' 

  axios.get(url)
  .then(res=> {
                const  temp =  res.data.split(",");

                const latitude = parseFloat(temp[0].trim()); 
                const longitude = parseFloat(temp[1].trim()); 

                callback({
                      latitude,
                      longitude          
                });

   }).catch(err=> {
       console.log(err);
   });


  };

module.exports = { getGPSLocation, commandPath };
