RULES
1. we are using postgresql locally for this project use suitable packages for this and create an .env file which will have the variabkes you will be needing for this connection and use  dummy value for now, I will be providing it afterwards, do it for every variable
2. for the authentication part, use jsonwebtoken for creating jwt token which will be having userID which will be a httpOnly cookie obnly and use a authmissleware which will intercept every request and check the DB for the user and if the user is there, then attach the user object to the request object if not then you know what to do lol
3. the project tsructure should be these should be server.js which will be for starting the app
    a src folder having app.js which will be importing all the routers and attaching it to the app 
    a middleware folder, routes folder, etc etc

create only the authentication flow for now nothing more 