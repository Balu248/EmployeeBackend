const mongoose=require("mongoose")
const empSchema=mongoose.Schema(
    {
        "empname":String,
        "empid":String,
        "email":String,
        "mobile":String,
        "age":String,
        "role":String,
        "salary":String,

        
    }
)

const employeeModel=mongoose.model("emploi",empSchema)
module.exports=employeeModel

