const { default: mongoose } = require("mongoose");
const Medicine=require("../models/medicine");
const addMedicine = async (req, res) => {
    try {
        let status="active";
        if(expiry<today){
            status="expired";
        }
        const {
            name,
            batchNumber,
            manufacturer,
            quantity,
            manufacturingDate,
            expiryDate
        } = req.body;
        const manufacturing=new Date(manufacturingDate);
        const expiry=new Date(expiryDate);
        const today=new Date();
        if(quantity<=0){
            return res.status(400).json({message:"Quantity cannot be negative"});
        }
        if(manufacturing>today){
            return res.status(400).json({message:"Manufacturing date cannot be in the future"});
        }
        if (expiry <= manufacturing) {
            return res.status(400).json({
                message: "Expiry date must be after manufacturing date"
            });
        }
        const medicine = await Medicine.create({
            name,
            batchNumber,
            manufacturer,
            quantity,
            manufacturingDate,
            expiryDate,
            createdBy: req.user.id
        });
        res.status(201).json({
            message: "Medicine added successfully",
            medicine
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const getmedicines = async (req, res) => {
    try {

        const data = await Medicine.find();

        for (let medicine of data) {

            if (
                medicine.expiryDate &&
                medicine.expiryDate < new Date() &&
                medicine.status === "active"
            ) {
                medicine.status = "expired";
                await medicine.save();
            }
        }

        res.status(200).json(data);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }
};
const getmedicinebyid=async(req,res)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid medicine ID"});
        }
        const data=await Medicine.findById(id);
        if(!data){
            return res.status(404).json({message:"Data not found"});
        }
        if(
            data.expiryDate &&
            data.expiryDate < new Date() &&
            data.status === "active"
        ){
            data.status="expired";
            await data.save();
        }

        res.status(200).json(data);
    }catch(err){
        res.status(400).json({message:err.message})
    }
}
const updatemedicine=async(req,res)=>{
    try{
        const{id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid medicine ID"});
        }
        const{quantity,manufacturer,expiryDate,status}=req.body;
        if(quantity<0){
            return res.status(400).json({message:"Quantity cannot be negative"});
        }
        const data=await Medicine.findByIdAndUpdate(id,
            {quantity,manufacturer,expiryDate,status},
            {new:true}
        )
        if(!data){
            return res.status(404).json({message:"Medicine not found"});
        }
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
const deletemedicine=async(req,res)=>{
    try{
      const{id}=req.params;
      const data=await Medicine.findByIdAndDelete(id);
      if(!data){
        return res.status(404).json({message:"Medicine not found"});
      }
      res.status(200).json(data);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
const expiredmedicine=async(req,res)=>{
    try{
       const data=await Medicine.find({expiryDate:{$lt:new Date()}});
       if(data.length===0){
         return res.status(404).json({message:"No expired medicines found"});
       }
       res.status(200).json(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}
const lowstock=async(req,res)=>{
    try{
        const data=await Medicine.find({quantity:{$lt:20}});
        if(data.length===0){
            return res.status(404).json({message:"No low-stock medicines found"});
        }
        res.status(200).json(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}
const searchbyname=async(req,res)=>{
    try{
        const {name}=req.params;
        if(name==""){
            return res.status(400).json({message:"Medicine name is required"});
        }
        const data=await Medicine.find({name:{$regex:name,$options:"i"}});
        if(data.length===0){
            return res.status(404).json({message:"Medicine not found"});
        }
        res.status(200).json(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}
const getstatus=async(req,res)=>{
    try{
        const{status}=req.params;
        if(status!="active"&&status!="expired"&&status!="returned"&&status!="destroyed"){
            return res.status(400).json({message:"Invald Status"});
        }
        const data=await Medicine.find({status:status});
        if(data.length===0){
            return res.status(404).json({message:"No medicine found with this status"});
        }
        res.status(200).json(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

module.exports={addMedicine,getmedicines,getmedicinebyid,updatemedicine,
deletemedicine,expiredmedicine,lowstock,searchbyname,getstatus};