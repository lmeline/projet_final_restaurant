# API Restaurant Project Node JS
  

## Setup project
  

### Prerequisites 
- Node js
- XAMPP or anything else that can launch a MySQL server
- Postman or some equivalent
  

### Install node dependencies (express, mysql2...) :
```bash
npm i
```

### Setup the .env file
1. Copy the content of the `.env.example` file into a new `.env` file at the root of the project.
2. Fill the `.env` file with your environment informations, admins credentials can be filled here (might be for dev purpose only) to quickly have a admin account ready to be used at the end of the setup. The `JWT-SECRET-KEY` must be generated for a key generator (for example : [https://jwtsecretkeygenerator.com](https://jwtsecretkeygenerator.com))

### Database Creation
You can create the database used in this project with the following command:

```bash
node database/database_creator.js
```

the database will be created and seeded from the sql scripts placed in the `/database/source` folder.

### Launch server
You can launch the server with the following command :

```bash
npm start
```

## API Documentation

The API documentation can be found on the `/api-docs` URL once the server launched.