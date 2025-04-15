
// USER AUTHENTICATION SYSTEM
const express = require("express")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
require("./config")
const userModel = require("./userModel")
const app = express()
const secretKey = "secretKey"

app.use(express.json())

//register API
app.post("/register", async (req, resp) => {
    const user = req.body
    if (!user.name || !user.password) {
        resp.json(
            {
                message: "All fileds are required.."
            }
        )
    }
    else {

        //convert  password into hash
        const hashPass = await bcryptjs.hash(user.password, 10)


        //save in DB
        const data = new userModel({
            name: user.name,
            password: hashPass
        })
        const result = await data.save()
        console.log("save in db successfully");



        jwt.sign({ user }, secretKey, { expiresIn: "500s" }, (err, token) => {
            if (err) {
                resp.json({
                    message: "some error occurred..."
                })
            }
            else {
                resp.json(
                    {
                        message: `${user.name} register successfully`,
                        token: token
                    }
                )
            }
        })
    } // else block end


})

//login api 
app.post("/login", async (req, resp) => {
    const user = req.body
    if (!user.name || !user.password) {
        resp.json({
            message: "all fields are required"
        })
    }
    else {
        //check name exist and password match
        const data = await userModel.findOne({ name: user.name })
        console.log("data pass", data);
        if (data) {
            console.log("data exist");
            //check password
            const isPassword = await bcryptjs.compare(user.password, data.password)
            if (isPassword) {

                //generate token
                jwt.sign(user, secretKey, { expiresIn: "500s" }, (err, token) => {
                    if (err) {
                        resp.json({
                            message: "invalid token"
                        })
                    }
                    else {
                        resp.json({
                            message: "Login successfully",
                            token: token
                        })


                    }
                })


            }
            else {
                resp.json(
                    {
                        message: "username or password incorrect"
                    }
                )
            }

        }
        else {
            console.log("name does not match");
            resp.json({
                message: "name does not match"
            })

        }
    } //else block end



})

app.get("/profile",verifyToken,(req,resp)=>{ //middleware
    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err){
            resp.json({
                message:"Invalid token"
            })
        }
       else{
        resp.json({
            message:"profile page access",
            user:req.user
            
        })
       }
    })
 
})

function verifyToken(req,resp,next){
const bearerHeader=req.headers["authorization"]
if(typeof bearerHeader=="undefined"){
    resp.json({
        message:"Invalid token"
    })
}
else{
    const bearer=bearerHeader.split(" ")
    const token=bearer[1]
    const authData = jwt.verify(token, secretKey)
    req.token=token  //Stores token so next route can use it
    req.user=authData
    next()

}


}
const port = 5000
app.listen(port, () => {
    console.log(`your code is runnung on ${port} port`);

})
