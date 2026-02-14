#API Restaurant Project Node JS

##Setup project
/!\ Node JS must be installed on your device /!\

###Install node dependencies (express, ...) :
```bash
npm i
```

*the taskrunner [Mask](https://github.com/jacobdeichert/mask) will be used to run commands in this project, for more informations about theses commands, you can check the `maskFile.md` or run* 
```bash
mask -h
```
*in your shell*


###Database Creation
You can create the database used in this project with the following command, the argument `--seed` or `-s` will also seed the database with some test data after db creation (Do not use in production !!)
```bash
mask create-database
```


###Launch server
You can launch the server with the following command :
```bash
mask launch-server
```