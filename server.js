require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const session =require('express-session');
const port=process.env.PORT;
const path=require('path');
const flash=require('connect-flash');
const connectDB=require('./config/db');
const engine = require("ejs-mate");
const MongoStore = require("connect-mongo");

//connect to database
connectDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        crypto: {
            secret: process.env.SESSION_SECRET
        }
    }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
// falsh
app.use(flash());

//global flash messages
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

//routes

app.use('/',require('./routes/pageRoutes'));
app.use('/auth',require('./routes/authRoutes'));
app.use('/music',require('./routes/musicRoutes'));
app.use("/playlist", require("./routes/playlistRoutes"));



//start server
app.listen(port,()=>{
    console.log('server is running on port 5000');
});

