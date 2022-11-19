# medcord-backend
Repositorio con apis para el proyecto medcord

### Docker y Docker Compose
Para ejecutar el proyecto backend es necesario tener instalado docker.

#### Configurar variables de entorno
Copiar `.env.example` en `.env` y configurar las credenciales de la base de datos (postgres)

#### Build del contenedor backend
```
docker compose build medcord-backend
```

#### Levantar contenedores
```
docker compose up -d
```
