var express=require("express");
var passport=require("passport");
var User=require("../models/user.js");
var router=express.Router();
router.get("/register",function(req,res){
   res.render("register"); 
});
router.post("/register",function(req,res){
    var newuser=new User({username:req.body.username});
    User.register(newuser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp "+req.user);
            res.redirect("/");
            });
        }
    });
});
router.get("/login",function(req,res){
   res.render("login"); 
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
    });
    
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;