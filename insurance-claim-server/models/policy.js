const mongoose=require("mongoose");

const policySchema=new mongoose.Schema(
    {
        policyName:{
            type:String,
            required:true,
        },
        policyNumber:{
            type:String,
            required:true,
            unique:true,
        },
        policyType:{
            type:String,
            enum:["Health","Life","Vehicle","Home"],
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        coverageAmount:{
            type:Number,
            required:true,
        },
        premiumAmount:{
            type:Number,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
        },
        status:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active",
        },
    },
    {
        timestamps:true,
    }
);

const Policy =
  mongoose.models.Policy || mongoose.model("Policy", policySchema);

module.exports = Policy;