const express=require("express");
const auth=require("../middleware/authmiddleware");
const authorize=require("../middleware/role");
const{addSale,getsales,getbyid,updatebyid,delbyid,sales_date,summary,top_medicines,saleByMedicine,salesByUser}=require("../controllers/salesController");
const router=express.Router();
router.post("/sales",auth,authorize("pharmacist"),addSale);
router.get("/",auth,authorize("pharmacist"),getsales);
router.get("/date",auth,authorize("pharmacist"),sales_date);
router.get("/summary",auth,authorize("pharmacist"),summary);
router.get("/top",auth,authorize("pharmacist"),top_medicines);
router.get("/user",auth,authorize("pharmacist"),salesByUser);
router.get("/medicine/:medicineId",auth,authorize("pharmacist"),saleByMedicine);
router.get("/:id",auth,authorize("pharmacist"),getbyid);
router.put("/:id",auth,authorize("pharmacist"),updatebyid);
router.delete("/:id",auth,authorize("pharmacist"),delbyid);

module.exports=router;