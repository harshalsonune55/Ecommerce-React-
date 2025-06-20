const express=require("express");
let app=express();
const port=8080;
const path=require("path");
var cors = require('cors');
const session=require("express-session");
// const {isloggedin}=require("./middlewere/login_auth.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const Userp=require("./database/users.js");


const sessionOption={
    secret:"My super Sceret code",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
  
    }
  
  }


app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Userp.authenticate()));
passport.serializeUser(Userp.serializeUser());
passport.deserializeUser(Userp.deserializeUser());

app.get("/",(req,res)=>{
    res.send("hello World!");
})


app.post("/signup",async(req,res)=>{
    let{username,Email,Password}=req.body;
    try{
        let newUser=new Userp({
            email:Email,
            username:username,});
      req.session.name=username;
      let regestiredUser= await Userp.register(newUser,Password);
      res.send("successfully login",regestiredUser);
    // req.login(regestiredUser, function(err) {
    //     if (err) { return next(err); }
    //     return res.send("success");
    //   });
      
    //   }else{
    //     return res.send("back");
    //   }
     }catch(e){
      console.log(e)
      return res.send("some error ")
    }
});



app.listen(port,()=>{
console.log(`listening on ${port} port successully`);
});