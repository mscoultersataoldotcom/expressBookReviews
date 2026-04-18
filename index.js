const express = require('express');
const jwt = require('jsonwebtoken');
var session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
var cookieParser = require('cookie-parser');
const app = express();
let users = require('./router/auth_users.js').users;
let okUser = require('./router/auth_users.js').okUser;

app.use(express.json());
app.use(cookieParser());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true,  
}))

app.use("/customer/auth/*", async function auth(req,res, next){    
    let validUsers = users.length;
    if (validUsers > 0)  {
        if (okUser) {
            let validuser = users.filter((user) => {return user.username === okUser[validUsers-1];})
            if (validuser) {
                req.user = okUser[validUsers-1];
                next();            
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        } else {
            return res.status(403).json({ message: "User not logged in" });        }       
     }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

