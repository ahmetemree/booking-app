import jwt from "jsonwebtoken"


export  const verifyToken =(req,res,next) => {
    const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ Message: "You are Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ Message: "Token is not valid!" });
    req.userId = payload.id;

    next();
  });

}