import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes";


const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("GrowEasy Backend is Running 🚀");
});


app.use("/api", uploadRoutes);


export default app;