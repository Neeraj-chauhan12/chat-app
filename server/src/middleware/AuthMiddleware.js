import jwt from 'jsonwebtoken';

export const authMiddleware=(req,res,next)=>{
   // const token=req.cookies.token;
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"Unauthorized, invalid token"});
        
        
        
    }
    const token=authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized, no token provided"});
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
        
    } catch (error) {
        return res.status(401).json({message:"Unauthorized, invalid token"});
        
    }

}