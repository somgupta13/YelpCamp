var express=require("express");
var app=express();
var passport=require("passport");
var passportLocal=require("passport-local");
var User=require("./models/user.js");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var mongoose =require("mongoose");
var indexRoutes=require("./routes/index.js");
var campgroundRoutes=require("./routes/campground.js");
var commentRoutes=require("./routes/comment.js");
var flash=require("connect-flash");

mongoose.connect("mongodb://localhost/yelpcamp");
var campgrounds=require("./models/campgrounds.js");
var Comment = require("./models/comments.js");

//===========
//app config
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));


//========
//passport config
app.use(flash());
app.use(require("express-session")({
    secret: "this is secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========
app.use(function(req,res,next){
   res.locals.user=req.user;
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   next();
});

//routes
//campgrounds
app.use("/",indexRoutes);
app.use("/",campgroundRoutes);
app.use("/",commentRoutes);
//comments
//======
//Auth routes

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpCamp server has started");
});