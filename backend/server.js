const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/connect");
const authroute = require("./routes/authroute");
const medicineroute=require("./routes/medicineroute");
const salesroute=require("./routes/salesroute");
const dashboardroute=require("./routes/dashboardroute");
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/sales",salesroute);
app.use("/api/auth", authroute);
app.use("/api/medicine",medicineroute);
app.use("/api/dashboard",dashboardroute);
app.get("/", (req, res) => {
    res.json({
        message: "PharmaTrack API is running"
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});