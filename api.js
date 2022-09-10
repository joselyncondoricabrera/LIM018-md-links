const util = require('./api_utils');

const mdLinks = (route, options = { validate: false }) => new Promise((resolve, reject) => {
  const validPath = util.validatePath(route);
  if (validPath !== undefined) {
    const absolutePath = util.convertRouteAbsolute(validPath);
    if (util.isFolder(absolutePath) === 'archivo') {
      if (util.isFileMd(absolutePath) !== undefined) {
        if (util.existDatainFile(absolutePath) === undefined) { // archivo md no tiene data
          reject(new Error('Archivo .md vacío').message);
        } else {
          // archivo tiene data
          const data = util.readFile(absolutePath);
          // archivo no tiene links
          if (util.foundLinksText(data) === 0) {
            reject(new Error('No se encuentra links en este archivo').message);
          } else if (options.validate === true) {
            resolve(util.validateLink(absolutePath));
          } else { resolve(util.notValidateLink(absolutePath)); }
        }
      } else {
        reject(new Error('No es archivo MD').message);
      }
    } else if (options.validate === true) {
      resolve(util.validateArrayMd(absolutePath));
    } else { resolve(util.notValidateArrayMd(absolutePath)); }
  } else {
    reject(new Error('la ruta no existe').message);
  }
});

/* mdLinks('carpeta', { validate: true })
  .then((value) => console.log(value))
  .catch((error) => {
    console.log(error);
  }); */

module.exports = { mdLinks };
