const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authmiddleware");
const authorize=require("../middleware/role");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", auth, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});
router.get("/admin",auth,authorize("admin"),(req,res)=>{
    res.json({
        message:"Welcome Admin"
    });
});

module.exports = router;