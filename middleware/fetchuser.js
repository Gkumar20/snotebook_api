var jwt = require('jsonwebtoken');
const jwtSecret = "Secret$Client&Server"

const fetchuser=(req,res,next)=>{
    // get user from the jwt token and add id to req object
    const token = req.header("auth-token")
    if(!token){
        res.status(401).send({error:"please authenticate using valid token"})
        return
    }
    try {
        const data = jwt.verify(token,jwtSecret)
        
        req.user=data.user
    } catch (error) {
        // console.log(error)
        res.status(401).send({error:"please  authenticate using valid token"})
        return
    }
    next()
}

module.exports= fetchuser;