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

#### Ingresar al bash del contenedor backend
```
docker exec -it medcord-backend /bin/sh
```

#### Generar migración
```
npm run migrations:generate -- migration
```

#### Correr migración
```
npm run migrations:run
```
