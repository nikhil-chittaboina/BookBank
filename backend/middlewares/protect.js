
// Middleware to protect routes and ensure user is authenticated
const jwt=require('jsonwebtoken');
const protect=(req,res,next)=>{
    const token=req.cookies.token||'';
    console.log(" 1.Protect middleware invoked. Token:", token);

    if(!token){
        return res.status(401).json({error:'Unauthorized'});
    }

   try {
       const decoded = jwt.verify(token, 'your_jwt_secret');
       req.user = decoded;
       console.log("2.User authenticated:", req.user);
       next();
   } catch (error) {  
       console.error('Error verifying token:', error);
       res.status(403).json({ error: 'Forbidden' });
   }
};
module.exports = protect;  