const Medicine=require("../models/medicine");
const Sales=require("../models/sales");
const dashboardSummary=async(req,res)=>{
 try{
    const tot_medicines= await Medicine.countDocuments();
    const count_mediciines=await Medicine.aggregate([
        {$group:{
            _id:null,
            totalStock:{$sum:"$quantity"}

        }}
    ]);
    const low_stock=await Medicine.countDocuments({quantity:{$lt:20}});
 const expired_medicines=await Medicine.countDocuments({expiryDate:{$lt:new Date()}});
 const tot_sales=await Sales.countDocuments();
 const sold_med=await Sales.aggregate([
     {$group:{
        _id:null,
        totalQuantitySold:{$sum:"$quantity"}
     }}
 ]);
 const tot_revenue=await Sales.aggregate([
     {$group:{
        _id:null,
        total_rev:{$sum:"$totalamount"}
     }}
 ]);
 return res.status(200).json({
    totalMedicines:tot_medicines,
    totalStock:count_mediciines[0]?.totalStock||0,
    lowStock:low_stock,
    expiredMedicines:expired_medicines,
    totalSales:tot_sales,
    totalQuantitySold:sold_med[0]?.totalQuantitySold||0,
    totalRevenue:tot_revenue[0]?.tot_revenue||0
 })
 }catch(err){
    res.status(500).json({message:err.message});
 }
}
const salesInDay=async(req,res)=>{
    try{
const salesByDate=await Sales.aggregate([
    {$group:{
       _id:{
        $dateToString:{
            format:"%Y-%m-%d",
            date:"$saleDate"
        }
       },
       totalSales:{$sum:1},
       totalQuantitySold:{$sum:"$quantity"},
       totalRevenue:{$sum:"$totalamount"}
    }},
    {$sort:{
        _id:-1
    }}

]);
res.status(200).json(salesByDate);
}catch(err){
    res.status(500).json({message:err.message});
}
}
module.exports={dashboardSummary,salesInDay};