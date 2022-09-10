const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// comprobar si ruta es correcta
const validatePath = (route) => {
  if (fs.existsSync(route)) {
    return route;
  }
  return undefined;
};
// console.log(validatePath('thumb.png'));

// convertir a ruta absoluta
const convertRouteAbsolute = (route) => {
  const valor = path.isAbsolute(route);
  if (valor === true) {
    return route;
  }
  return path.resolve(route);
};
// console.log(convertRouteAbsolute('prueba1.md'));

// verificar si es directorio
// const r = 'C:/Users/USER/LABORATORIA_LIM018/LIM018-md-links/carpeta';

const isFolder = (route) => {
  if (fs.existsSync(route)) {
    const res = fs.lstatSync(route).isDirectory();
    if (res) { return route; }
    return 'archivo';
  }
  return undefined;
};
// console.log(isFolder('index.js'));

// Determinar extensión del archivo
const extensionFile = (route) => path.extname(route);

// funcion para verificar si es archivo .md
const isFileMd = (route) => {
  const routeAbs = convertRouteAbsolute(route);
  if (extensionFile(routeAbs) === '.md') {
    return routeAbs;
  }

  return undefined;
};
// console.log(isFileMd('nuevoReadme.md'));

// leer archivo md
const readFile = (r) => fs.readFileSync(r, 'utf-8');

// verificar archivo md tiene data
const existDatainFile = (route) => {
  if (readFile(route) !== '') {
    return route;
  }
  return undefined;
};
// console.log( existDatainFile('./carpeta/prueba2.md'));

// Encontrar links con expresion regular de un archivo con data
const foundLinksText = (dataFile) => {
  // eslint-disable-next-line
  const regex = /\[(.*)\]\((ftp|http|https):\/\/(?:[\w\-]+(?::[\w\-]+)?@)?(?:[\w\-]+\.)+(?:[a-z]{2,4})(?::[0-9]+)?(?:\/[\w\-\.%]+)*(?:\?(?:[\w\-\.%]+=[\w\-\.%!]+&?)+)?(#\w+\-\.%!)?\/?/ig;
  const arrayLinks = dataFile.match(regex);
  // console.log(arrayLinks);
  const arrayUrl = [];
  if (arrayLinks === null) {
    return 0;
  }

  for (let i = 0; i < arrayLinks.length; i += 1) {
    // captura el text del enlace
    const text = arrayLinks[i].match(/\[(.*)\]/).pop();

    const reg = /\[(.*)\]/;
    const url = arrayLinks[i].replace(reg, '');
    const urlFinal = url.substring(1, url.length);
    arrayUrl.push({ href: urlFinal, text });
  }
  return arrayUrl;
};

// const d = readFile('nuevoReadme.md');
// console.log(foundLinksText(d));

// obtener info de los links sin validar de un archivo
const notValidateLink = (route) => {
  const file = isFileMd(route);
  const data = readFile(file);
  const arrayLink = foundLinksText(data);

  const arrayObjectLinks = arrayLink.map((e) => ({ ...e, path: file }));
  return arrayObjectLinks;
};

// console.log(notValidateLink('nuevoReadme.md'));

// validar links de un archivo
const validateLink = (route) => {
  const arrayObjectLink = notValidateLink(route);
  const newArrayLink = arrayObjectLink.map((e) => fetch(e.href)
    .then((res) => ({ ...e, status: res.status, ok: res.status >= 400 ? 'fail' : 'ok' })));
  return Promise.all(newArrayLink);
};

/* validateLink('nuevoReadme.md')
    .then((res) => (console.log(res))); */

// hacer recursividad-recorrer directorios
const arrayFile = [];
const getFileOfDirectory = (route) => {
  fs.readdirSync(route).map((file) => {
    const newPath = path.join(route, file);
    const directory = fs.lstatSync(newPath).isDirectory();
    return directory ? getFileOfDirectory(newPath) : arrayFile.push(newPath);
  });
  return arrayFile;
};

// obtener archivos md
const searchFileMd = (arrayFiles) => {
  const arrayMd = [];
  arrayFiles.forEach((element) => {
    if (isFileMd(element) !== undefined) {
      arrayMd.push(element);
    }
  });
  return arrayMd;
};

// console.log(searchFileMd(getFileOfDirectory('carpeta')));

// validar links de un array de archivos md
const validateArrayMd = (route) => {
  const arrayFiles = getFileOfDirectory(route);
  const arrayMd = searchFileMd(arrayFiles);

  const nuvArrayMd = arrayMd.map((e) => validateLink(e)
    .then((res) => res));
  return Promise.all(nuvArrayMd);
};

/* validateArrayMd('./carpeta')
  .then((res) => {
    console.log(res);
  }); */

// no validar links de un de array de archivos md
const notValidateArrayMd = (route) => {
  const arrayFiles = getFileOfDirectory(route);
  const arrayMd = searchFileMd(arrayFiles);

  const nuvArrayMd = arrayMd.map((e) => notValidateLink(e));
  return nuvArrayMd;
};
// console.log(notValidateArrayMd('carpeta'));

module.exports = {
  isFileMd,
  extensionFile,
  readFile,
  validateLink,
  notValidateLink,
  foundLinksText,
  validatePath,
  convertRouteAbsolute,
  existDatainFile,
  isFolder,
  getFileOfDirectory,
  searchFileMd,
  validateArrayMd,
  notValidateArrayMd,
};
