# Markdown Links - Joselyn Danitza

## Índice

* [1. Descripción de la librería](#1-Descripción-de-la-librería)
* [2. Diagrama de flujo](#2-Diagrama-de-flujo)
* [3. Instalar librería](#3-Instalar-librería)
* [4. Ejemplos de aplicación](#4-Ejemplos-de-aplicación)
* [5. Detalle de las propiedades](#5-Detalle-de-las-propiedades)
* [6. Developer](#6-Developer)

***

## 1. Descripción de la librería
`md-links-joselyn-danitza` es una librería desarrollada en Javascript y Node.js, permite realizar lecturas de archivos Marckdown para detectar la cantidad de links  y detalle de algunas estadísticas básicas de lo hallado en cada archivo. Detecta a tiempo los enlaces rotos dentro de tu archivo para que puedas eliminarlos, instala está librería y descubre!!

![marckdown](./image/marckdown.jpg)

## 2. Diagrama de flujo
El desarrollo de la librería se trabajó de la siguiente manera:

![flujograma](./image/md-links-diagrama.png)

## 3. Instalar librería
Instala la librería colocando el siguiente comando en tu terminal:

![comando](./image/install-mdlinks.png)

## 4. Ejemplos de aplicación
### Caso 1: solo coloca una ruta
`md-links <path-to-file/directory>`

![caso1](./image/caso1.png)

### Caso 2: Coloca ruta y validate
`md-links <path-to-file/directory> --validate`

![caso2](./image/caso2.png)

### Caso 3: Coloca ruta, validate y stats
`md-links <path-to-file/directory> --validate --stats`

![caso3](./image/caso3.png)

### Caso 4: No coloque ningún argumento
`md-links`

![caso4](./image/caso4.png)

## 5. Detalle de las propiedades
* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.
* `status`: Código de respuesta HTTP.
* `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

## 6. Developer
### Joselyn Danitza Condori Cabrera