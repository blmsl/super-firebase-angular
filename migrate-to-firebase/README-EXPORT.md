# super-firebase-angular / migrate-to-firebase
Export your data from MySQL.

## Install dependencies
```sh
npm run install
```

## Setup
### Edit MySQL Configuration file
Make a copy of "mysql-config-sample.json" file and 
rename it as "mysql-config.json"  
Edit "mysql-config.json" file and save  
Check out result in "data.json"  

### Edit export-from-mysql.js file 
Edit "export-from-mysql.js" file and save  
Check out "TODO:" items in the file  

## Run
**!!! "data.json" file will be OVERWRITTEN, 
you may want to make a copy of it !!!**
```sh
npm run export-from-mysql
```

### Edit export-from-drupal-7.js file 
Edit "export-from-drupal-7.js" file and save  
Check out "TODO:" items in the file  

## Run
**!!! "data.json" file will be OVERWRITTEN, 
you may want to make a copy of it !!!**
```sh
npm run export-from-drupal-7
```

## Import Data into Cloud Firestore
[`./README.md`](./README.md)