const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    batchNumber: {
        type: String,
        required: true,
        unique: true
    },

    manufacturer: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min:0
    },

    manufacturingDate: {
        type: Date,
        required: true
    },

    expiryDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["active", "expired", "returned", "destroyed"],
        default: "active"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const Medicine = mongoose.model("Medicine", MedicineSchema);

module.exports = Medicine;