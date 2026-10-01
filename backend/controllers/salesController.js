const mongoose=require("mongoose");
const Sales=require("../models/sales");
const Medicine=require("../models/medicine");

const addSale=async(req,res)=>{
    try{
        const{medicine,quantity,price}=req.body;

        if(!medicine){
            return res.status(400).json({message:"Medicine is required"});
        }

        if(quantity===undefined||quantity===null){
            return res.status(400).json({message:"Quantity is required"});
        }

        if(quantity<=0){
            return res.status(400).json({message:"Quantity must be greater than 0"});
        }

        if(price===undefined||price===null){
            return res.status(400).json({message:"Price is required"});
        }

        if(price<=0){
            return res.status(400).json({message:"Price must be greater than 0"});
        }

        if(!mongoose.Types.ObjectId.isValid(medicine)){
            return res.status(400).json({message:"Invalid medicine ID"});
        }

        const med=await Medicine.findById(medicine);

        if(!med){
            return res.status(404).json({message:"Medicine not found"});
        }

        if(quantity>med.quantity){
            return res.status(400).json({message:"Insufficient stock"});
        }

        const totalamount=quantity*price;

        med.quantity-=quantity;
        await med.save();

        const sale=await Sales.create({
            medicine,
            quantity,
            price,
            totalamount,
            soldBy:req.user.id,
            saleDate:new Date()
        });

        res.status(201).json({
            message:"Sale added successfully",
            sale
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const getsales=async(req,res)=>{
    try{
        const data=await Sales.find()
            .populate("medicine")
            .populate("soldBy");

        if(data.length===0){
            return res.status(404).json({message:"No sales found"});
        }

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const getbyid=async(req,res)=>{
    try{
        const{id}=req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid sale ID"});
        }

        const data=await Sales.findById(id)
            .populate("medicine")
            .populate("soldBy");

        if(!data){
            return res.status(404).json({message:"Sale not found"});
        }

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const updatebyid=async(req,res)=>{
    try{
        const{id}=req.params;
        const{quantity,price}=req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid sale ID"});
        }

        if(quantity===undefined||quantity===null){
            return res.status(400).json({message:"Quantity is required"});
        }

        if(quantity<=0){
            return res.status(400).json({message:"Quantity should be greater than 0"});
        }

        if(price===undefined||price===null){
            return res.status(400).json({message:"Price is required"});
        }

        if(price<=0){
            return res.status(400).json({message:"Price must be greater than 0"});
        }

        const sale=await Sales.findById(id);

        if(!sale){
            return res.status(404).json({message:"Sale not found"});
        }

        const oldQuantity=sale.quantity;
        const newQuantity=quantity;
        const difference=newQuantity-oldQuantity;

        const medicine=await Medicine.findById(sale.medicine);

        if(!medicine){
            return res.status(404).json({message:"Medicine not found"});
        }

        if(difference>0){

            if(medicine.quantity<difference){
                return res.status(400).json({message:"Not enough stock"});
            }

            medicine.quantity-=difference;

        }else if(difference<0){

            medicine.quantity+=Math.abs(difference);

        }

        const totalamount=newQuantity*price;

        await medicine.save();

        const data=await Sales.findByIdAndUpdate(
            id,
            {quantity:newQuantity,price,totalamount},
            {new:true}
        );

        res.status(200).json({
            message:"Sale updated successfully",
            sale:data
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const delbyid=async(req,res)=>{
    try{
        const{id}=req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid sale ID"});
        }

        const sale=await Sales.findById(id);

        if(!sale){
            return res.status(404).json({message:"Sale not found"});
        }

        const med=await Medicine.findById(sale.medicine);

        if(!med){
            return res.status(404).json({message:"Medicine not found"});
        }

        med.quantity+=sale.quantity;
        await med.save();

        await Sales.findByIdAndDelete(id);

        res.status(200).json({
            message:"Sale deleted successfully"
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const sales_date=async(req,res)=>{
    try{
        const{startdate,enddate}=req.body;

        if(!startdate||!enddate){
            return res.status(400).json({
                message:"Start date and end date are required"
            });
        }

        const start=new Date(startdate);
        const end=new Date(enddate);

        if(isNaN(start.getTime())||isNaN(end.getTime())){
            return res.status(400).json({
                message:"Invalid date format"
            });
        }

        if(start>end){
            return res.status(400).json({
                message:"Start date cannot be after end date"
            });
        }

        end.setHours(23,59,59,999);

        const data=await Sales.find({
            saleDate:{
                $gte:start,
                $lte:end
            }
        }).populate("medicine");

        
        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const summary=async(req,res)=>{
    try{
        const data=await Sales.aggregate([
            {
                $group:{
                    _id:null,
                    totalSales:{$sum:1},
                    totalQuantity:{$sum:"$quantity"},
                    totalRevenue:{$sum:"$totalamount"}
                }
            }
        ]);

        res.status(200).json({
            message:"Sales summary fetched successfully",
            summary:data[0]||{
                totalSales:0,
                totalQuantity:0,
                totalRevenue:0
            }
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const top_medicines=async(req,res)=>{
    try{
        const data=await Sales.aggregate([
            {
                $group:{
                    _id:"$medicine",
                    totalSold:{$sum:"$quantity"}
                }
            },
            {
                $sort:{
                    totalSold:-1
                }
            },
            {
                $lookup:{
                    from:"medicines",
                    localField:"_id",
                    foreignField:"_id",
                    as:"medicine"
                }
            },
            {
                $unwind:"$medicine"
            }
        ]);

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const saleByMedicine=async(req,res)=>{
    try{
        const{medicineId}=req.params;

        if(!mongoose.Types.ObjectId.isValid(medicineId)){
            return res.status(400).json({
                message:"Invalid medicine ID"
            });
        }

        const data=await Sales.aggregate([
            {
                $match:{
                    medicine:new mongoose.Types.ObjectId(medicineId)
                }
            },
            {
                $lookup:{
                    from:"medicines",
                    localField:"medicine",
                    foreignField:"_id",
                    as:"medicine"
                }
            },
            {
                $unwind:"$medicine"
            }
        ]);

        if(data.length===0){
            return res.status(404).json({
                message:"No sales found for this medicine"
            });
        }

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const salesByUser=async(req,res)=>{
    try{
        const data=await Sales.aggregate([
            {
                $group:{
                    _id:"$soldBy",
                    totalSales:{$sum:1},
                    totalQuantity:{$sum:"$quantity"},
                    totalRevenue:{$sum:"$totalamount"}
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $unwind:"$user"
            },
            {
                $project:{
                    _id:0,
                    user:{
                        name:"$user.name",
                        email:"$user.email"
                    },
                    totalSales:1,
                    totalQuantity:1,
                    totalRevenue:1
                }
            }
        ]);

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports={
    addSale,
    getsales,
    getbyid,
    updatebyid,
    delbyid,
    sales_date,
    summary,
    top_medicines,
    saleByMedicine,
    salesByUser
};

