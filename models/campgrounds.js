var mongoose = require("mongoose");


var campgroundSchema=mongoose.Schema({
    name:String,
    img:String,
    desc:String,
    author:{
       id:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
           
       },
       username:String
   },
    comments:[
        {
            type:   mongoose.Schema.Types.ObjectId,
            ref:    "Comment" 
        }
        ]
});

 
 module.exports=mongoose.model("campground",campgroundSchema);
 