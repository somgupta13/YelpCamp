var middlewareObj={};
var campgrounds=require("../models/campgrounds.js");
var Comment=require("../models/comments.js");
middlewareObj.checkUserAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        campgrounds.findById(req.params.id,function(err,campgrounds){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                if(campgrounds.author.id.equals(req.user._id)){
            next();
            }else{
                req.flash("error","You need to Login first");
                res.redirect("/campgrounds");
            }
            }
            
        });
        
    }else{
        res.redirect("/login");
    }
    

};
middlewareObj.checkUserAuthentication1 = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid,function(err,comment){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                if(comment.author.id.equals(req.user._id)){
                //console.log(comment);
                //if((true)){
            next();
            }else{
                req.flash("error","Invalid request");
                res.redirect("back");
            }
            }
            
        });
        
    }else{
        req.flash("error","You need to Login first");
        res.redirect("/login");
    }
    

};
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to Login first");
    res.redirect("/login");
};
module.exports=middlewareObj;