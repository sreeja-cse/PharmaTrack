const express=require("express");
const router=express.Router();
const auth=require("../middleware/authmiddleware");
const authorize=require("../middleware/role");
const{dashboardSummary,salesInDay}=require("../controllers/dashboardSummary");
router.get("/summary",auth,authorize("pharmacist"),dashboardSummary);
router.get("/sale_per_day",auth,authorize("pharmacist"),salesInDay);
module.exports=router;
