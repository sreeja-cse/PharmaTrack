const mongoose=require("mongoose");
const salesSchema=new mongoose.Schema({
    medicine:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Medicine",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    totalamount:{
        type:Number,
        required:true,
        min:0
    },
    soldBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    saleDate:{
        type:Date,
        required:true
    }

});
const Sales=mongoose.model("Sales",salesSchema);
module.exports=Sales;