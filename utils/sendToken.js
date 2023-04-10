export const sendToken = (res,user,statusCode,message)=>{

    const token = user.getJWTToken()

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly : true
    }

    const userData = {
        _id : user._id,
        name : user.name,
        email : user.email, 
        avatar : user.avatar,
        tasks : user.tasks
    }

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message,
       user:userData
    })
}