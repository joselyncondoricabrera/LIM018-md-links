const util = require('./index_utils.js');
const process = require('process');
//const fetch = require('node-fetch');

//console.log(process.argv);
//console.log(process.env);

//----------------------------------------route, options = {validate:false}

const mdLink = (route, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    const validPath = util.validatePath(route);
    if (validPath !== undefined) {
      const absolutePath = util.convertRouteAbsolute(validPath);
      if (util.isFolder(absolutePath) === 'archivo') {
        if (util.isFileMd(absolutePath) !== undefined) {
          if (util.existDatainFile(absolutePath) === undefined) { //archivo md no tiene data
            reject('Archivo .md vacío');
          }
          else {
            // archivo tiene data
            const data = util.readFile(absolutePath);
            //archivo no tiene links
            if (util.foundLinksText(data) === 0) {
              reject('No se encuentra links en este archivo')
            }
            else {//archivo tiene links
              if (options.validate === true)
                resolve(util.validateLink(absolutePath));
              else
                resolve(util.notValidateLink(absolutePath))
            }
          }
        }
        else {
          reject('No es archivo MD');
        }
      }
      else {// cuando es un directorio
        if (options.validate === true)
          resolve(util.validateArrayMd(absolutePath));
        else
          resolve(util.notValidateArrayMd(absolutePath));
      }
    }
    else {
      reject('la ruta no existe');
    }
  });
}



mdLink('carpeta', {validate:true})
.then(value => console.log(value))
.catch((error)=>{
  console.log(error);
});


  




 
