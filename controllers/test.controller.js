import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);

  res.status(200).json({ Message: "You are authenticated" });
};
export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ Message: "You are Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ Message: "Token is not valid!" });
    if(!payload.isAdmin){
        return res.status(403).json({ Message: "Not authorized!" });
    }
  });
  
  res.status(200).json({ Message: "You are authenticated" });
};
