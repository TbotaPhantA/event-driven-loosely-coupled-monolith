## Launch acceptance tests locally:
```bash
cd apps/backend
``` 
- 🧐make sure you have `.env.test.local` file in the `apps/backend` folder with proper environment variables
- 🚢make sure you have `docker` and `docker-compose`
- 🛫launch app infrastructure using the following command (it will use docker-compose to launch db, kafka, debezium, etc...):
```bash
npm run launch:test:infrastructure
``` 
- 😊run tests with 
```bash
npm run test:acceptance
``` 

## Run app locally:
- make sure you have `.env` file in the `apps/backend` folder with proper environment variables
- make sure you have `docker` and `docker-compose`
- TODO
