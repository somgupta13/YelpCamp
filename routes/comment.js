var express=require("express");
var router=express.Router({mergeParams:true});
var campgrounds=require("../models/campgrounds.js");
var Comment=require("../models/comments.js");
var middleware=require("../middleware");
router.get("/campgrounds/:id",function(req,res){
    campgrounds.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
            console.log("foundCampground"+foundCampground);
        }else{
         res.render("show",{campgrounds:foundCampground});
        }
    });
});
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    campgrounds.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("addcomments",{campgrounds:campgrounds});
        }
    });
    
});
router.post("/campgrounds/:id/comments",function(req,res){
    campgrounds.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err);
        }
        else{
            var commentsadd={
                author:{
                    id:req.user._id,
                    username:req.user.username
                },
                text:req.body.commenttext
            };
            Comment.create(commentsadd,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                     campgrounds.comments.push(comment);
                     campgrounds.save();
                     comment.save();
            res.redirect("/campgrounds/"+campgrounds._id);
                }
 
            });
           
        }
    });
});
router.get("/campgrounds/:id/comments/:commentid/edit",middleware.checkUserAuthentication1,function(req,res){
    Comment.findById(req.params.commentid,function(err, comment) {
        if(err){
            console.log(err);
        }
        else{
            res.render("editcomment",{campgrounds_id:req.params.id,comments:comment});
        }
    });
            
});
router.put("/campgrounds/:id/comments/:commentid/edit",middleware.checkUserAuthentication1,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentid,req.body.comments,function(err,updatedcampground){
         if(err){
            console.log(err);
        }
        else{
             res.redirect("/campgrounds");
        }
    });
});
router.delete("/campgrounds/:id/comments/:commentid",middleware.checkUserAuthentication1,function(req,res){
    Comment.findByIdAndDelete(req.params.commentid,function(err,deleteCamp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//middleware
function checkUserAuthentication(req,res,next){
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
                res.redirect("back");
            }
            }
            
        });
        
    }else{
        res.redirect("/login");
    }
    

}
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;