
 
function isDev() {
   return process.mainModule.filename.indexOf('app.asar') === -1 
}

module.exports= { isDev }; 