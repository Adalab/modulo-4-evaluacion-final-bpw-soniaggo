 API de Frases de Los Simpson
¡Bienvenido a la API de Frases de Los Simpson! Este es un proyecto sencillo para gestionar frases icónicas de la serie, conectándolas con los personajes que las dijeron y los capítulos donde aparecieron.

Este proyecto te ayudará a entender cómo funciona una API RESTful con Node.js y MySQL.

🚀 ¿Qué puedes hacer con esta API?
Actualmente, esta API te permite hacer las siguientes cosas con las frases:

Ver todas las frases: Obtener una lista de todas las frases guardadas.

Ver una frase específica: Buscar una frase por su número de identificación (ID).

Añadir una nueva frase: Guardar una frase nueva en la base de datos.

Actualizar una frase: Cambiar la información de una frase que ya existe.

Eliminar una frase: Borrar una frase de la base de datos.

🛠️ ¿Qué necesitas para que funcione?
Para que esta API funcione en tu ordenador, necesitas tener instaladas algunas cosas:

Node.js: Es el entorno donde corre tu código JavaScript.

Puedes descargarlo de aquí: Node.js oficial

MySQL Server: Es la base de datos donde se guardará toda la información.

Puedes descargarlo de aquí: [enlace sospechoso eliminado]

MySQL Workbench: Es una herramienta visual muy útil para manejar tu base de datos MySQL (crear tablas, ver datos, etc.).

Puedes descargarlo de aquí: MySQL Workbench

Un editor de código: Como Visual Studio Code (VS Code), que es el que hemos usado.

Descarga VS Code: Visual Studio Code

Una extensión para probar APIs: En VS Code, puedes usar Thunder Client (es la que hemos usado).

Instala Thunder Client desde la tienda de extensiones de VS Code.

📦 Pasos para Poner en Marcha el Proyecto
Sigue estos pasos para que tu API funcione en tu ordenador:

1. Descargar el Código
Primero, descarga o clona este proyecto en tu ordenador. Si usas Git:

git clone <URL_DE_TU_REPOSITORIO>
cd modulo-4-evaluacion-final-bpw-soniaggo

2. Instalar las Dependencias
Una vez dentro de la carpeta del proyecto (modulo-4-evaluacion-final-bpw-soniaggo), abre tu terminal (o la terminal integrada de VS Code) y escribe:

npm install

Esto instalará todas las librerías que tu proyecto necesita (como Express y MySQL2).

3. Configurar la Base de Datos MySQL
Tu API necesita una base de datos para guardar la información.

Abre MySQL Workbench.

Conéctate a tu servidor MySQL local.

Abre el archivo database.sql que está en la carpeta src/ de tu proyecto (src/database.sql).

Ejecuta todo el script. Haz clic en el botón del "rayo" en MySQL Workbench.

¡Importante! Este script creará la base de datos simpsons_api, las tablas (personajes, capitulos, frases, etc.) y llenará algunas con datos de ejemplo. Si ya existe, la borrará y la creará de nuevo para asegurar que esté limpia.

Asegúrate de que no aparezcan errores en el panel "Output" de MySQL Workbench.

4. Crear el archivo de configuración .env
Tu API necesita saber cómo conectarse a tu base de datos. Para ello, crea un archivo llamado .env en la raíz de tu proyecto (al mismo nivel que package.json).

Dentro de .env, pega estas líneas y ajusta los valores según tu configuración de MySQL:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_DATABASE=simpsons_api
DB_PORT=3306

Cambia tu_contraseña_de_mysql por la contraseña que usas para acceder a MySQL con el usuario root.

5. Iniciar la API
Ahora que todo está configurado, puedes iniciar tu API. En tu terminal, dentro de la carpeta del proyecto:

node src/app.js

Deberías ver un mensaje como:

Conexión a la base de datos MySQL establecida correctamente.
Servidor Express escuchando en http://localhost:3000

¡Esto significa que tu API está funcionando!

🧪 Cómo Probar la API (Endpoints)
Una vez que tu API esté corriendo, puedes usar Thunder Client (o Postman, Insomnia) para enviar peticiones y ver cómo funciona.

La URL base para todas tus peticiones será: http://localhost:3000

Endpoints para frases
1. Ver todas las frases
Método: GET

URL: http://localhost:3000/frases

¿Qué hace? Te devuelve una lista de todas las frases guardadas en la base de datos, con información de su personaje y capítulo.

2. Ver una frase específica por ID
Método: GET

URL: http://localhost:3000/frases/ID_DE_LA_FRASE

Importante: Reemplaza ID_DE_LA_FRASE por un número real de una frase que exista (ej. 1, 2, 3). Para saber qué IDs existen, primero haz un GET /frases.

¿Qué hace? Te devuelve los detalles de una única frase.

3. Añadir una nueva frase
Método: POST

URL: http://localhost:3000/frases

Headers:

Content-Type: application/json

Body (JSON):

{
    "texto": "¡Ay, caramba! (Nueva frase)",
    "marca_tiempo": "00:20",
    "descripcion": "Una frase de Bart insertada desde la API.",
    "personaje_id": 3,
    "capitulo_id": 1
}

Importante: No incluyas el id de la frase; la base de datos lo genera automáticamente. Asegúrate de que personaje_id y capitulo_id (si lo incluyes) existan en tus tablas de personajes y capitulos.

¿Qué hace? Crea una nueva frase en la base de datos. Si todo va bien, te responderá con un 201 Created y el ID de la nueva frase.

4. Actualizar una frase existente
Método: PUT

URL: http://localhost:3000/frases/ID_DE_LA_FRASE_A_ACTUALIZAR

Importante: Reemplaza ID_DE_LA_FRASE_A_ACTUALIZAR por el número de ID real de la frase que quieres modificar.

Headers:

Content-Type: application/json

Body (JSON):

{
    "texto": "¡D'oh! (Frase de Homer actualizada)",
    "marca_tiempo": "00:35",
    "descripcion": "La exclamación clásica de Homer, ahora modificada.",
    "personaje_id": 1,
    "capitulo_id": 2
}

Importante: Debes enviar al menos texto y personaje_id en el JSON.

¿Qué hace? Modifica la información de una frase existente. Si todo va bien, te responderá con un 200 OK.

5. Eliminar una frase
Método: DELETE

URL: http://localhost:3000/frases/ID_DE_LA_FRASE_A_ELIMINAR

Importante: Reemplaza ID_DE_LA_FRASE_A_ELIMINAR por el número de ID real de la frase que quieres borrar.

¿Qué hace? Borra una frase de la base de datos. Si todo va bien, te responderá con un 200 OK.

🚀 Próximos Pasos (Opcional)
Si quieres seguir mejorando tu API, podrías:

Implementar los mismos endpoints (GET, POST, PUT, DELETE) para las tablas personajes y capitulos.

Añadir funciones de búsqueda más avanzadas (ej. buscar frases por texto, buscar personajes por nombre).

Crear endpoints para mostrar las frases de un personaje específico (/personajes/:id/frases).
