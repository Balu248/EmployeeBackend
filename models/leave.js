const mongoose=require("mongoose")
const leaveSchema=mongoose.Schema(
    {
        "empname":String,
        "empid":String,
        "email":String,
        "date":String,
        "days":String,
        "status": { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' }
    }
)
const leaveModel=mongoose.model("leaves",leaveSchema)
module.exports=leaveModel