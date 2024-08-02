import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


export const register = async (req, res) => {
  try{
    
    const { username, email, password } = req.body;
  //hash password
  console.log(req.body);
  const hashedpassword = await bcrypt.hash(password, 7);
  console.log(hashedpassword);
  //create new user and save it to db
  //    console.log("message is " + req.body)

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password:hashedpassword,
    },
  });
  console.log(newUser)

  res.status(201).json({Message: "User Created!"})
  }

  catch(error){
    console.log(error);
    res.status(500).json({Message: "Failed to create user!"})
  }
  
};

export const login = async (req, res) => {
  
  const {username,password} =req.body;

  try{
    //check user exist or not

    const user = await prisma.user.findUnique({
      where:{username:username}
    })

    if(!user) return res.status(401).json({Message:"Invalid credentials"})
    //check user password
    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid) return res.status(401).json({Message:"Invalid credentials"})
    //generate cookie token and send to the user
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")

    const age=1000*60*60*24*7
    const token =jwt.sign({
      id:user.id,
      isAdmin:true,
    }, process.env.JWT_SECRET_KEY,{
      expiresIn:age
    })

    const{password:userPassword, ...userInfo} =user
    res.cookie("token",token ,{
      httpOnly:true,
      // secure:true
      maxAge:age,
    }).status(200).json(userInfo)

  }
  catch(error){
  console.log(error);
  res.status(500).json({Message:"Failed to login"});
  }  
};


export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({Message:"Logout Successful"})
};
