
import express from "express";
import dotenv from "dotenv";
import { zpl203 } from "./zpl.js";
dotenv.config();
const app = express();
app.use(express.json());
app.post("/print",(req,res)=>{
 const {trackId,hotel}=req.body;
 res.json({zpl:zpl203(trackId,hotel)});
});
app.listen(process.env.PORT,()=>console.log("Server running"));
