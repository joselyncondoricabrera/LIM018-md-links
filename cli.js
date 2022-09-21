#!/usr/bin/env node
/* eslint-disable no-console */

const [,, ...args] = process.argv;
const colors = require('colors');
const { mdLinks } = require('./api');

// valores de argumentos
const arrayArgs = args;

// eslint-disable-next-line default-case
switch (arrayArgs.length) {
  case 0:
    console.log(colors.blue('---●●●●------●●●●------●●●●-----●●●●------●●●●-----●●●●-----●●●●-----●●●●-----●●●●---------'));
    console.log('');
    console.log(colors.magenta('  Ingrese una ruta (obligatorio) o Ingrese --help -> información de los comandos a utilizar'));
    console.log('');
    console.log(colors.blue('---●●●●------●●●●------●●●●-----●●●●------●●●●-----●●●●-----●●●●-----●●●●-----●●●●---------'));
    break;
  case 1:
    if (arrayArgs[0] === '--help') {
      console.log('--------------------------------------------------------------------------'.magenta);
      console.log('***************** "MD-LINKS" - Joselyn Condori Cabrera ******************'.magenta);
      console.log('--------------------------------------------------------------------------'.magenta);
      console.log(colors.cyan(`
      Formato  para colocar en la terminal ---> md-links /Path/ /comando/

      Comandos válidos para esta libreria:
    1. Path -> Permite Obtener información del links encontrados, retorna:
        md-links ./some/example.md
        Href:Url del link
        Text:Texto que aparecía dentro del link (<a>)
        File:Ruta del archivo donde se encontró el link

    2. --validate -> Permite validar los links encontrados, retorna:
        md-links ./some/example.md --validate
        Href:Url del link
        Text:Texto que aparecía dentro del link (<a>)
        File:Ruta del archivo donde se encontró el link
        Status:Código de respuesta HTTP
        ok: mensaje de "fail" en caso de fallo u "ok" en caso de éxito

    3. --stats -> Determina cantidad de links únicos y total de links encontrados, retorna:
        md-links ./some/example.md --stats
        Total: 3
        Unique: 3

    4. --stats --validate -> Determina cantidad de links únicos, links rotos y el total, 
        retorna:
        md-links ./some/example.md --stats --validate
        Total: 3
        Unique: 3
        Broken: 1`));
    } else {
      mdLinks(arrayArgs[0])
        .then((res) => {
          console.log(`
            ┌───────────────────────************──────────────────────┐
              *******************LINKS ENCONTRADOS*******************
            └───────────────────────************──────────────────────┘`.magenta);
          res.forEach((md) => {
            if (md.length !== undefined) {
              md.forEach((link) => {
                console.log(` Href: ${link.href}\n Text: ${link.text}\n Path: ${link.path}`);
                console.log(colors.yellow('                  ────────────────────────────────────────'));
              });
            } else if (md.length === undefined) {
              console.log(` Href: ${md.href}\n Text: ${md.text}\n Path: ${md.path}`);
              console.log(colors.yellow('                  ────────────────────────────────────────'));
            }
          });
        })
        .catch((e) => {
          console.log(colors.red(e));
        });
    }
    break;
  case 2:
    if (args[1] === '--validate') {
      mdLinks(arrayArgs[0], { validate: true })
        .then((res) => {
          console.log(`
            ┌───────────────────────************──────────────────────┐
              *******************LINKS ENCONTRADOS*******************
            └───────────────────────************──────────────────────┘`.magenta);
          res.forEach((md) => {
            // para el directorio
            if (md.length !== undefined) {
              md.forEach((link) => {
                console.log(` Href: ${link.href}\n Text: ${link.text}\n Path: ${link.path}\n Status: ${link.status}\n Ok: ${link.ok}`);
                console.log(colors.yellow('                  ────────────────────────────────────────'));
              });
            } else if (md.length === undefined) {
              console.log(` Href: ${md.href}\n Text: ${md.text}\n Path: ${md.path}\n Status: ${md.status}\n Ok: ${md.ok}`);
              console.log(colors.yellow('                  ────────────────────────────────────────'));
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (args[1] === '--stats') {
      const arrayLinksOfFile = [];
      mdLinks(args[0], { validate: true })
        .then((res) => {
          console.log(`
            ┌───────────────────────************──────────────────────┐
              ************LINKS ÚNICOS POR CADA ARCHIVO MD***********
            └───────────────────────************──────────────────────┘\n`.magenta);
          let route = ' ';
          // probando para un archivo
          res.forEach((md) => {
            const arrayLinksOfDirectory = [];
            if (md.length !== undefined) {
              md.forEach((link) => {
                arrayLinksOfDirectory.push(link.href);
                route = link.path;
              });
              const linksUnique = new Set(arrayLinksOfDirectory);
              console.log(`\nPath: ${route.green}\n Total: ${arrayLinksOfDirectory.length}\n Unique: ${linksUnique.size}`);
              console.log('      ────────────────────────────────────────'.yellow);
            } else if (md.length === undefined) {
              arrayLinksOfFile.push(md.href);
              route = md.path;
            }
          });
          if (arrayLinksOfFile.length !== 0) {
            const arrayLinksUnique = new Set(arrayLinksOfFile);
            console.log(`Path: ${route.green}\n Total: ${arrayLinksOfFile.length}\n Unique: ${arrayLinksUnique.size}`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (args[1] !== '--validate' || args[1] !== '--stats') {
      console.log(`
    Comando inválido - Ingrese correctamente
    Consulte en md-link --help`.red);
    }
    break;
  case 3:
    if ((args[1] === '--stats' && args[2] === '--validate') || (args[1] === '--validate' && args[2] === '--stats')) {
      const arrayLinksOfFile = [];
      mdLinks(args[0], { validate: true })
        .then((res) => {
          console.log(`
            ┌───────────────────────************──────────────────────┐
              ********    LINKS ÚNICOS Y ROTOS ENCONTRADOS   *******
            └───────────────────────************──────────────────────┘\n`.magenta);
          let route = ' ';
          let acumLinkFail = 0;
          res.forEach((md) => {
            const arrayLinksOfDirectory = [];
            if (md.length !== undefined) {
              let acumLinkFailDirectory = 0;
              md.forEach((link) => {
                arrayLinksOfDirectory.push(link.href);
                route = link.path;
                // ACUMULAR ENALCES ROTOS DE UN DIRECTORIO
                if (link.ok === 'fail') {
                  acumLinkFailDirectory += 1;
                }
              });
              const linksUnique = new Set(arrayLinksOfDirectory);
              console.log(`\nPath: ${route.green}\n Total: ${arrayLinksOfDirectory.length}\n Unique: ${linksUnique.size}\n Broken: ${acumLinkFailDirectory}`);
              console.log('      ────────────────────────────────────────'.yellow);
            } else if (md.length === undefined) {
              arrayLinksOfFile.push(md.href);
              route = md.path;
              // ACUMULAR ENLACES ROTOS DE UN ARCHIVO
              if (md.ok === 'fail') {
                acumLinkFail += 1;
              }
            }
          });
          if (arrayLinksOfFile.length !== 0) {
            const arrayLinksUnique = new Set(arrayLinksOfFile);
            console.log(`Path: ${route.green}\n Total: ${arrayLinksOfFile.length}\n Unique: ${arrayLinksUnique.size}\n Broken: ${acumLinkFail}`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    break;
}
