# Pokedex-Server

The backend to this [Pokédex frontend](https://github.com/Haltarys/Pokedex-Client) built with NestJS. Currently a mirror from a Gitlab repository.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository and install the dependencies.

```bash
git clone git@github.com:Haltarys/Pokedex-Server.git
cd Pokedex-Server
yarn install
```

2. Create a `.env` file in the root directory following this model.

```env
# MongoDB configuration
DATABASE_URL=mongodb://mongo:27017
DATABASE_USER=root
DATABASE_PASSWORD=password

# Jwt configuration
JWT_SECRET=some_very_long_secret
JWT_EXPIRATION_TIME=15m

# Launch configuration
# Change port if need be
# PORT=3002
# Comma-separated list of origins, '*' if omitted
CORS_ORIGIN=*
```

3. Start the server.

```bash
docker compose up -d --build
```

4. First time only, create an admin user.

```bash
./setup-db.sh
```

5. Production

**On the production server only**
Create a `ssl` directory with a `cert.pem` and `key.pem` file for the SSL keys.
Run `deploy.sh` to build the project and start the server in production mode.
