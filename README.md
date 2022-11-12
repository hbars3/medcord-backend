# Ensolvers Challenge

## Backend
### Tecnologias
 - Node (16.14.2)
 - Nest (8.2.5)
 - Docker

## Frontend
### Tecnologias
 - Node (16.15)
 - Angular (14)
 - Docker


## Correr con scripts
 - Arrancar Docker
 - Correr el script `run-backend.sh`
 - Correr el script `run-frontend.sh`

Si los scripts no funcionan debido a alguna incompatibilidad por Docker, correr manualmente (Sin Docker)

## Correr Manualmente (Sin Docker)
### Backend

- Establecer la terminal en la ruta del proyecto backend
- Ejecutar el comando `docker-compose up database -d` para instanciar la base de datos Postgres
- Ejecutar el comando `npm install` para instalar las dependencias
- Ejecutar el comando `npm run start:dev` para correr la aplicación Nest
- Ejecutar el comando `npm run migrations:generate -- migration` para generar la migración que creará las tablas necesarias en la base de datos
- Ejecutar el comando `npm run migrations:run` para correr la migración

Listo, el backend estará expuesto en el puerto 5000 de localhost y listo para ser usado.

### Frontend

- Establecer la terminal en la ruta del proyecto frontend
- Ejecutar el comando `npm install` para instalar las dependencias
- Ejecutar el comando `ng serve` para arrancar el proyecto angular

Listo, el frontend estará expuesto en el puerto 4200 de localhost y listo para ser usado.
