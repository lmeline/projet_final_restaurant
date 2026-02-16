# API Restaurant Project Node JS
  

## Setup project
  

### Prerequisites 
- Node js
- XAMPP or anything else that can launch a MySQL server
  

### Install node dependencies (express, mysql2...) :
```bash
npm i
```
  

#### *Mask*
*You can use the taskrunner [Mask](https://github.com/jacobdeichert/mask) to run commands in this project, for more informations about the mask commands, you can check the `maskFile.md` or run the following command in your shell :* 
```bash
mask -h
```
  

### Database Creation
You can create the database used in this project with the following command:
```bash
mask create-database
```

#### Without mask:
```bash
node database/database_creator.js
```

  

### Launch server
You can launch the server with the following command :
```bash
mask launch-server
```
#### without mask :
```bash
npm start
```