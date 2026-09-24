const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.connectionString);
        console.log("mongodb connected successfully");
        
    }
    catch(error){
        console.log("mongodb connection failed");
        console.log(error.message);
        
        
    }
};

module.exports=connectDB;