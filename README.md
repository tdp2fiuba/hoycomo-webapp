# HoyComo: Backend Comercios

## Instalación

### Herramientas 

Para instalar el ambiente, es necesario contar con los siguientes programas:

* **Node.js** ([instalación](https://nodejs.org/en/download/current/))
* **Bower** ([instalación](https://bower.io/#install-bower))
* **MongoDB** ([instalación](https://www.mongodb.com/download-center#community))

### Pasos para correr el programa

Para correr el programa, desde una terminal ejecutar los siguientes comandos

````
npm install
bower install
gulp serve
````
* `npm install` instalará las dependencias de `npm`, que se descargarán en la carpeta `node_modules`.
* `bower install` instalará las dependencias de `bower`, que se descargarán en la carpeta `bower_compenents`
* `gulp serve` creará y correrá el web-server, inyectando también las dependencias indicadas en cada página.

## Documentación

### Web server

* El web server es creado y ejecutado por Gulp con BrowserSync. El proceso puede encontrarse en `gulp/server.js`.
* En la instancia de BrowserSync se determina cuál es la página de inicio:

````
  browserSync.instance = browserSync.init({
    startPath: '/auth.html',
    server: server,
    browser: browser,
    ghostMode: false
  });
````

### Inyección de archivos estáticos

* Las librerías utilizadas en la aplicación son descargadas a través de Bower
* Esas librerías y todos los otros archivos estáticos (archivos CSS, HTML y JavaScript propios) son inyectados en cada página que sirve el servidor utilizando `gulp inject`. Este proceso se encuentra en el archivo `gulp/inject.js`, que se ejecuta dentro de `gulp serve`.
* Puede declararse un conjunto de dependencias a inyectar dentro de un `gulp.task()`. Ejemplo:

````
gulp.task('injectAuth', ['scripts', 'stylesAuth'], function () {
  var injectStyles = gulp.src([
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css'), 
    path.join(conf.paths.tmp, '/serve/app/auth.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/assets/js/**/*.js'),
    path.join(conf.paths.src, '/shared/**/*.js'),
    path.join(conf.paths.src, '/login/**/*.js'),
  ])

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/auth.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
````
* Este comando indica que para el archivo `/auth.html`, se deben inyectar los siguientes archivos:
  * Del tipo CSS, `vendor.css` y `auth.css`
  * Del tipo JS: los cuales tengan una ruta del estilo `/assets/js/**/*.js`, `/shared/**/*.js` y `/login/**/*.js'`
* Para incluir cada grupo de archivos, en el archivo HTML se incluye, por ejemplo:

````
 <!-- build:css({.tmp/serve,src}) styles/vendor.css -->
 <!-- bower:css -->
 <!-- endbower -->
 <!-- endbuild -->
````
* Esto incluye el archivo `vendor.css` en el lugar donde se incluya este script.
* Para más información, puede consultarse la [documentación](https://www.npmjs.com/package/gulp-inject) o [este artículo](https://stormpath.com/blog/angularjs-with-gulp-inject), entre otros.
* *Inicialmente, a menos que se trabaje sobre una vista que no vaya a inyectarse en index.html, no es necesario especificar ningún comando de inyección nuevo, ya que el que existe para index.html automáticamente incluirá cualquier nuevo archivo HTML o JS dentro de /pages o /theme.*

### Arquitectura

TBD

## Documentación BlurAdmin

Algunos datos e información sobre BlurAdmin pueden encontrarse en: https://akveo.github.io/blur-admin/

