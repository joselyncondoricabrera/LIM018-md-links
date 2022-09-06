const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

//comprobar si ruta es correcta
const validatePath= (path)=>{
    if(fs.existsSync(path)){
        return path;
    }
    return undefined;
} 
//console.log(validatePath('thumb.png'));


//convertir a ruta absoluta
const convertRouteAbsolute = (r)=>{
    const valor =path.isAbsolute(r);
    if(valor === true){
        return r
    }
 return path.resolve(r);
}
//console.log(convertRouteAbsolute('prueba1.md'));

// verificar si es directorio 
let r ='C:/Users/USER/LABORATORIA_LIM018/LIM018-md-links/carpeta';
const isFolder = (path) => {
    if (fs.existsSync(path)) {
        const res = fs.lstatSync(path).isDirectory();
        if (res) { return path}
        return 'archivo'
    }
    return undefined;
}
//console.log(isFolder('index.js'));

//Determinar extensión del archivo
const extensionFile= (r)=>path.extname(r);

//funcion para verificar si es archivo .md
const isFileMd = (path)=>{
    const route = convertRouteAbsolute(path);
    if(extensionFile(route)=='.md'){
        return route;
    }
    else{
        return undefined;
    }
}
//console.log(isFileMd('nuevoReadme.md'));

 //leer archivo md
 const readFile = (r) => fs.readFileSync(r,'utf-8');

 //verificar archivo md tiene data
 const existDatainFile= (route)=>{
    if(readFile(route)!=''){
        return route;
    }
    return undefined;
 }
// console.log( existDatainFile('./carpeta/prueba2.md'));

//Encontrar links con expresion regular de un archivo con data
const foundLinksText = (dataFile) => {
    const regex = /\[(.*)\]\((ftp|http|https):\/\/(?:[\w\-]+(?::[\w\-]+)?@)?(?:[\w\-]+\.)+(?:[a-z]{2,4})(?::[0-9]+)?(?:\/[\w\-\.%]+)*(?:\?(?:[\w\-\.%]+=[\w\-\.%!]+&?)+)?(#\w+\-\.%!)?\/?/ig;
    const arrayLinks = dataFile.match(regex);
   // console.log(arrayLinks);
    let arrayUrl = [];
    if(arrayLinks===null){
        return 0;
    }
    else{
        for (let i = 0; i < arrayLinks.length; i++) {
            //captura el text del enlace
            let text = arrayLinks[i].match(/\[(.*)\]/).pop();

            const reg = /\[(.*)\]/;
            const url = arrayLinks[i].replace(reg, '');
            const urlFinal = url.substring(1, url.length);
            arrayUrl.push({ href: urlFinal, text: text });
        }
        return arrayUrl;
    }
}

//const d = readFile('nuevoReadme.md');
//console.log(foundLinksText(d));

//obtener info de los links sin validar de un archivo
const notValidateLink = (path) =>{

    const file = isFileMd(path);
    const data = readFile(file);
    const arrayLink = foundLinksText(data);
    
    const arrayObjectLinks = arrayLink.map((e) => {
        //console.log({...e});
       return {...e,path:file}
    });
    return arrayObjectLinks;
}

//console.log(notValidateLink('nuevoReadme.md'));

//validar links de un archivo
const validateLink= (path)=>{
    const arrayObjectLink = notValidateLink(path);
    const newArrayLink = arrayObjectLink.map((e)=>{
        return fetch(e.href)
        .then((res)=>{
          return {...e,status:res.status,ok: res.status>= 400 ? 'fail':'ok'};
        })
    });
    return Promise.all(newArrayLink);
   
}
//console.log(typeof validateLink);

//hacer recursividad-recorrer directorios
const arrayFile=[];
const getFileOfDirectory = (route) => {
    const recorrer = fs.readdirSync(route).map((file) => {
        const newPath = path.join(route, file);
        return fs.lstatSync(newPath).isDirectory() ? getFileOfDirectory(newPath) : arrayFile.push(newPath);
    });

    return arrayFile;
}
//obtener archivos md
const searchFileMd = (arrayFile) => {
    const arrayMd=[];
    arrayFile.forEach(element => {
        if(isFileMd(element)!== undefined){
            arrayMd.push(element);
        };
    });
    return arrayMd;
}

//console.log(searchFileMd(getFileOfDirectory('carpeta')));

//validar links de un array de archivos md
const validateArrayMd = (path) => {
    const arrayFile = getFileOfDirectory(path);
    const arrayMd = searchFileMd(arrayFile);

    const nuvArrayMd = arrayMd.map((e) => {
        return validateLink(e)
            .then((res) => {
                return res;
            });
    });
    return Promise.all(nuvArrayMd);
}


/*validateArrayMd('./carpeta')
.then((res)=>{
    console.log(res);
});*/

//no validar links de un de array de archivos md
const notValidateArrayMd = (path)=>{
    const arrayFile = getFileOfDirectory(path);
    const arrayMd = searchFileMd(arrayFile);

    const nuvArrayMd = arrayMd.map((e)=>{
        return notValidateLink(e);
    });
    return nuvArrayMd;
}
//console.log(notValidateArrayMd('carpeta'));


 module.exports = 
 {
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
    notValidateArrayMd
}