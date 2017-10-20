### Installation
* Create firebase app.
* Activate auth for Email and Google
* Data base rules as follows  
```{
  "rules": {  
    "posts": {  
    	".read": "true",  
    	".write": "auth != null",  
      ".indexOn": "score"  
    },  
    "comments": {  
      ".read": "true",  
      ".write": "auth != null",  
      ".indexOn": "post"  
    },  
    "users": {  
      "$uid": {  
      	".write": "true"  
    	},      
      ".read": "true"  
    }  
  }  
}
```
* put your config in config.js in the src folder. Example
```
export default {
    apiKey: "AAAAPPPPIIIIII_KKKKKKEEEEEYYYYYYY",
    authDomain: "appname.firebaseapp.com",
    databaseURL: "https://appname.firebaseio.com",
    projectId: "appname_0000",
    storageBucket: "appname-0000.appspot.com",
    messagingSenderId: "0000000000"
}
```
* npm install
* npm run start
