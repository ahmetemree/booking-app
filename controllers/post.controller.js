import { Property } from "@prisma/client";
import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  const query=req.query
  // console.log(query);
  try {
    const post = await prisma.post.findMany({
      where:{
        type:query.type || undefined,
        city:query.city || undefined,
        bedroom:parseInt(query.bedroom) || undefined,
        property:query.property || undefined,
        price: {
          gte:parseInt(query.minPrice) || 0,
          lte:parseInt(query.maxPrice) || 10000000
        }
      }
    });
    setTimeout(()=>{

      res.status(200).json(post);
    },500)
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include:{
        postDetail:true,
        user:{
          select:{
            username:true,
            avatar:true,
          }
        },
      }
    });
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  console.log(req.body);
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
        data:{
            ...body.postData,
            userId:tokenUserId,
            postDetail:{
              create:body.postDetail,
            },
            
        },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
    const id = req.params.id
    console.log(id);
    const tokenUserId =req.userId
    console.log(tokenUserId);
  try {
    const post = await prisma.post.findUnique({
        where:{id},
    })
    console.log(post);
    if(post.userId!==tokenUserId){
        return res.status(403).json({Message:"not authorized!"})
    }
    await prisma.post.delete({
      where:{id}
    })
    res.status(200).json({Message: "post deleted!"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Failed to delete post" });
  }
};
