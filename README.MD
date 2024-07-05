NodeJS debemos tener instalado cmd node -v
NPM debemos tener instalado este se instaal con paquete NODE
npm init || npm init --y
Nombre
Version
Descripcion:
Entry point: (index.js)
Test command:
git repository
keywords: node js
licencia: ISC
-> yes -> Con esto creamos package.json
---
npm i express -> framework de NodeJS para levantar servidores
---
npm i nodemon -D "se instalara unicamente dependencia de desarrollo"
"dev": "nodemon index.js",
-> npm run dev
---
creamos archivo
index.js -> codigo de servidor
---
Para utilizar los express como modulo "import" es necesario configurar linea 6 de package.json
insertaremos "type":"module"
---
Extension para manejar consultas en local
Rest client - Huachao Mao
En directorio raiz
crear request.http
GET http://localhost:3000/orders HTTP/1.1 -> end point para consultar