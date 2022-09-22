/* eslint-disable max-len */
// const { mdLinks } = require('../api');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());
const {
  validatePath,
  convertRouteAbsolute,
  isFolder,
  extensionFile,
  isFileMd,
  readFile,
  existDatainFile,
  foundLinksText,
  notValidateLink,
  getFileOfDirectory,
  searchFileMd,
  notValidateArrayMd,
  validateLink,
// validateArrayMd,
} = require('../api_utils');

describe('validatePath', () => {
  it('Debería ser una función', () => {
    expect(typeof validatePath).toBe('function');
  });
  it('La ruta ./nuevos.md debería ser inválido', () => {
    expect(validatePath('./nuevos.md')).toEqual(undefined);
  });
  it('La ruta ./carpeta/carpeta3/prueba3.md debería ser válida', () => {
    expect(validatePath('./carpeta/carpeta3/prueba3.md')).toBe('./carpeta/carpeta3/prueba3.md');
  });
});

describe('convertRouteAbsolute', () => {
  it('Debería ser una función', () => {
    expect(typeof convertRouteAbsolute).toBe('function');
  });
  it('"./nuevoReadme.md", es ruta relativa y se convierte a ruta absoluta', () => {
    expect(convertRouteAbsolute('./nuevoReadme.md')).toEqual('C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\nuevoReadme.md');
  });
});

describe('isFolder', () => {
  it('Debería ser una función', () => {
    expect(typeof isFolder).toBe('function');
  });
  it('./nuevo.md, no debería ser un directorio', () => {
    expect(isFolder('./nuevo.md')).toBe('archivo');
  });
  it('./carpeta/carpeta2 debería ser un directorio', () => {
    expect(isFolder('./carpeta/carpeta2')).toEqual('./carpeta/carpeta2');
  });
});

describe('extensionFile', () => {
  it('Debería ser una función', () => {
    expect(typeof extensionFile).toBe('function');
  });
  it('"./api.js", debería ser .js', () => {
    expect(extensionFile('./api.js')).toEqual('.js');
  });
  it('"./archivo.md", debería ser .md', () => {
    expect(extensionFile('./archivo.md')).toEqual('.md');
  });
});

describe('isFileMd', () => {
  it('Debería ser una función', () => {
    expect(typeof isFileMd).toBe('function');
  });
  it('"./nuevo.md", debería ser un archivo .md', () => {
    expect(isFileMd('./nuevo.md')).toEqual('C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\nuevo.md');
  });
  it('"./cli.js", no debería ser un archivo .md', () => {
    expect(isFileMd('./cli.js')).toEqual(undefined);
  });
});

describe('readFile', () => {
  const data = ` nuevo readme - hola mundo

# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Objetivos de aprendizaje](#3-objetivos-de-aprendizaje)
* [4. Consideraciones generales](#4-consideraciones-generales)
* [5. Criterios de aceptación mínimos del proyecto](#5-criterios-de-aceptación-mínimos-del-proyecto)`;

  it('"./archivo.md", deberia ser archivo leído', () => {
    expect(readFile('./archivo.md')).toEqual(data);
  });
});

describe('existDatainFile', () => {
  it('Debería ser una función', () => {
    expect(typeof existDatainFile).toBe('function');
  });
  it('"./nuevoReadme.md", debería tener data', () => {
    expect(existDatainFile('./nuevoReadme.md')).toEqual('./nuevoReadme.md');
  });
});

describe('foundLinksText', () => {
  it('Debería ser una función', () => {
    expect(typeof foundLinksText).toBe('function');
  });
  it('"./carpeta/carpeta3/prueba3.md", debería retornar href y text de los links', () => {
    const data = '## 1. Preámbulo\n'
    + '[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado\n'
    + 'ligero muy popular entre developers. Es usado en muchísimas plataformas que\n'
    + 'manejan texto plano (GitHub, foros, blogs, ...) y es muy común\n'
    + 'encontrar varios archivos en ese formato en cualquier tipo de repositorio\n'
    + '(empezando por el tradicional `README.md`).';

    const link = [{
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
    }];
    expect(foundLinksText(data)).toStrictEqual(link);
  });
  it('"./archivo.md", no debería retornar ningún link', () => {
    const data = '## 2. Resumen del proyecto';
    expect(foundLinksText(data)).toEqual(0);
  });
});

describe('notValidateLink', () => {
  it('Debería ser una función', () => {
    expect(typeof notValidateLink).toBe('function');
  });
  it('"./carpeta/carpeta3/prueba3.md", debería retornar href, text y path (no validado)', () => {
    const arrayLinks = [{
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta3\\prueba3.md',
    }];
    expect(notValidateLink('./carpeta/carpeta3/prueba3.md')).toStrictEqual(arrayLinks);
  });
});

describe('getFileOfDirectory', () => {
  it('Debería ser una función', () => {
    expect(typeof getFileOfDirectory).toBe('function');
  });
  it('Debería retornar array de archivos que contenga el directorio', () => {
    const arrayFiles = [
      'carpeta\\carpeta2\\hola.txt',
      'carpeta\\carpeta2\\prueba21.md',
      'carpeta\\carpeta3\\probando.js',
      'carpeta\\carpeta3\\prueba3.md',
      'carpeta\\prueba1.md',
      'carpeta\\prueba2.md',
    ];
    expect(getFileOfDirectory('./carpeta')).toEqual(arrayFiles);
  });
});
describe('searchFileMd', () => {
  it('Debería ser una función', () => {
    expect(typeof searchFileMd).toBe('function');
  });
  it('Debería retornar array de archivos .md', () => {
    const arrayFile = ['carpeta\\carpeta2\\hola.txt', 'carpeta\\carpeta2\\prueba21.md', 'carpeta\\carpeta3\\probando.js', 'carpeta\\carpeta3\\prueba3.md', 'carpeta\\prueba1.md', 'carpeta\\prueba2.md'];
    const arrayMd = ['carpeta\\carpeta2\\prueba21.md', 'carpeta\\carpeta3\\prueba3.md', 'carpeta\\prueba1.md', 'carpeta\\prueba2.md'];
    expect(searchFileMd(arrayFile)).toStrictEqual(arrayMd);
  });
});

describe('notValidateArrayMd', () => {
  it('Debería ser una función', () => {
    expect(typeof notValidateArrayMd).toBe('function');
  });
  it('Debería capturar links de un directorio sin validar', () => {
    const arrayMdFolder = [
      [
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://nodejs.org/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
          text: 'md-links',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://nodejs.org/es/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
      ],
      [
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta3\\prueba3.md',
        },
      ],
      [
        {
          href: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
          text: 'Arreglos',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/',
          text: 'Array - MDN',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
          text: 'Array.prototype.sort() - MDN',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://neoattack.com/proyectos/',
          text: 'neoattack',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://www.pixar.com/error404',
          text: 'nuevo link',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
      ],
      [
        {
          href: 'https://nodejs.org/es/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://neoattack.com/proyectos/',
          text: 'neoattack',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
      ],
      [
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://nodejs.org/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
          text: 'md-links',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://nodejs.org/es/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta2\\prueba21.md',
        },
      ],
      [
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\carpeta3\\prueba3.md',
        },
      ],
      [
        {
          href: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
          text: 'Arreglos',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/',
          text: 'Array - MDN',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
          text: 'Array.prototype.sort() - MDN',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://neoattack.com/proyectos/',
          text: 'neoattack',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
        {
          href: 'https://www.pixar.com/error404',
          text: 'nuevo link',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba1.md',
        },
      ],
      [
        {
          href: 'https://nodejs.org/es/',
          text: 'Node.js',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://developers.google.com/v8/',
          text: 'motor de JavaScript V8 de Chrome',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
        {
          href: 'https://neoattack.com/proyectos/',
          text: 'neoattack',
          path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpeta\\prueba2.md',
        },
      ],
    ];
    // console.log(notValidateArrayMd('./carpeta'));

    expect(notValidateArrayMd('./carpeta')).toEqual(arrayMdFolder);
  });
});

describe('funcion validar link fetch', () => {
  it('Debería retornar links validados con status', (done) => {
    fetch.mockResolvedValueOnce({ status: 200 });
    fetch.mockResolvedValueOnce({ status: 200 });
    const result = [
      {
        href: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
        text: 'Arreglos',
        path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\nuevo.md',
        status: 200,
        ok: 'ok',
      },
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/',
        text: 'Array - MDN',
        path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\nuevo.md',
        status: 200,
        ok: 'ok',
      },
    ];

    validateLink('nuevo.md')
      .then((res) => {
      // console.log(res);
        expect(res).toEqual(result);
        done();
      });
  });
});

/* describe('validateArrayMd', () => {
  /* const array = [
    [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce',
        text: 'Array.prototype.reduce() - MDN',
        path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpetaprueba\\carpeta1\\prueba1.md',
        status: 200,
        ok: 'ok',
      },
    ],
    [
      {
        href: 'https://nodejs.org/',
        text: 'Node.js',
        path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpetaprueba\\carpeta2\\prueba2.md',
        status: 200,
        ok: 'ok',
      },
    ],
    [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/',
        text: 'Array - MDN',
        path: 'C:\\Users\\USER\\LABORATORIA_LIM018\\LIM018-md-links\\carpetaprueba\\prueba.md',
        status: 200,
        ok: 'ok',
      },
    ],
  ];
  it('directorio validado', () => {
    fetch.mockResolvedValueOnce({ status: 200 });
    fetch.mockResolvedValueOnce({ status: 200 });
    fetch.mockResolvedValueOnce({ status: 200 });

     validateArrayMd('./carpetaprueba')
      .then((res) => {
        expect(res).toEqual(array);
        done();
      });
    validateArrayMd('./carpetaprueba')
      .then((res) => {
        console.log(res);
      });
  });
}); */
