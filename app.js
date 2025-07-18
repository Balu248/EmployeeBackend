
const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const employeeModel = require("./models/emp")
const leaveModel=require("./models/leave")
const sgMail = require("@sendgrid/mail");
require('dotenv').config();



const app=express()

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://baluanil:mongodbpassword@cluster0.j5gkd2w.mongodb.net/employeeDB?retryWrites=true&w=majority&appName=Cluster0")

app.post("/addemp",(req,res)=>{
    const empname=(req.body.empname)
    const empid=(req.body.empid)
    const email=(req.body.email)
    const mobile=(req.body.mobile)
    const age=(req.body.age)
    const role=(req.body.role)
    const salary=(req.body.salary)
    
    let dataStore=new employeeModel(
    {
        empname:empname,
        empid:empid,
        email:email,
        mobile:mobile,
        age:age,
        role:role,
        salary:salary
    }
)
dataStore.save()
res.json({
        "status":"success"
    })
})
app.get("/viewemployee",(req, res)=>{
    employeeModel.find().then(
        (items)=>{
            res.json(items)
        }
    ).catch()
})

app.post("/leaverequest", (req, res) => {
    console.log("Request Body:", req.body); 

    const empname = req.body.empname;
    const empid = req.body.empid;
    const email = req.body.email;
    const date = req.body.date;
    const days = req.body.days;

    const leaveData = new leaveModel({
        empname,
        empid,
        email,
        date,
        days
    });

    leaveData.save()
        .then(() => {
            res.json({ status: "success", message: "Leave request submitted" });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", message: error.message });
        });
});

app.get("/viewleave",(req, res) =>{
    leaveModel.find().then(
        (items)=>{
            res.json(items)
        }
    ).catch()
})

app.put("/leave/:id/status", async (req, res) => {
  const leaveId = req.params.id;
  const { status } = req.body; 

  if (!['approved', 'denied'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const leaveRequest = await leaveModel.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

   
    const msg = {
      to: leaveRequest.email,
      from: "balupc248@gmail.com",
      subject: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <h3>Hello ${leaveRequest.empname},</h3>
        <p>Your leave request starting on <b>${leaveRequest.date}</b> for <b>${leaveRequest.days}</b> day(s) has been <b>${status}</b>.</p>
        <p>Regards,<br/>Employee Management Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log("SendGrid Email sent successfully");

    res.json({ message: `Leave request ${status}`, leave: leaveRequest });
  } catch (error) {
    console.error("SendGrid error", error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ message: "Failed to update leave status or send email" });
  }
});


app.listen(4000,()=>{
    console.log("Server Running")
})

