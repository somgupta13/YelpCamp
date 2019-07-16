var express= require("express");
var router=express.Router();
var campgrounds=require("../models/campgrounds.js");
var middleware=require("../middleware");
router.get("/",function(req,res){
    res.render("Landing");
});
router.get("/campgrounds",function(req,res){
    campgrounds.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds",{campgrounds:allcampgrounds,user:req.user});
        }
        
    });
});

router.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var img =req.body.img;
    var d1=req.body.d2;
    var data={
        name:name,
        img:img,
        desc:d1,
        author:{
       id:req.user._id,
       username:req.user.username
   }
        };
    campgrounds.create(data,function(err,addcampground){
         if(err){
            console.log(err);
        }
        else{
             res.redirect("/campgrounds");
        }
    });

    
});
router.get("/campgrounds/:id/edit",middleware.checkUserAuthentication,function(req,res){
    campgrounds.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{campgrounds:campgrounds});
        }
    });
    
});
router.post("/campgrounds/:id",middleware.checkUserAuthentication,function(req,res){
    campgrounds.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedcampground){
         if(err){
            console.log(err);
        }
        else{
             res.redirect("/campgrounds/"+req.params.id);
        }
    });

    
});
router.delete("/campgrounds/:id",middleware.checkUserAuthentication,function(req,res){
    campgrounds.findByIdAndDelete(req.params.id,function(err,deleteCamp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    
    res.render("addcampgrounds");
});
//middleware
function checkUserAuthentication(req,res,next){
    if(req.isAuthenticated()){
        campgrounds.findById(req.params.id,function(err,campgrounds){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                if(campgrounds.author.id.equals(req.user._id)){
            next();
            }else{
                res.redirect("/campgrounds");
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