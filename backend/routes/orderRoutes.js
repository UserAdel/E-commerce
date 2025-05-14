const express = require("express");
const order = require("../models/Order");
const {protect} = require("../middleware/Authmiddleware.js");

const router=express.Router();



router.get("/:id", protect, async(req, res) => {
    
    try {
        const order = await order.findById(req.params.id).populate("user", "name email");

        if(!order){
            return res.status(404).json({message: "Order not found"});
        }else{
            res.status(200).json(order);
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});   

    }


});




module.exports = router;

