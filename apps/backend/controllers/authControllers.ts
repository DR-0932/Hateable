import type { Request,Response } from "express";
import { login_schema, signup_schema } from "../../zod_schema";
import { prisma } from "../../db/lib/prisma";

import jwt from "jsonwebtoken";
import "dotenv/config"


const JWT_SECRET = "aaj_mera-mon_hai"


export async function signup(req:Request,res:Response):Promise<void>{
    const data = signup_schema.safeParse(req.body);
    if(!data.success){
        res.status(401).json({error:"invalid data"})
        return
    }
    const {username,name,password,email} = data

    try{
        const hash_password = await Bun.password.hash(password,{
            algorithm:"bcrypt",
        })

        const user = await prisma.user.create({
            data:{
                username,
                password:hash_password,
                name,
                email
            }
        })
        res.json(200).json({userdata:user})

    }catch(err){
        res.status(500).json({error:"internal server error",err})
    }

}


export async function login(req:Request,res:Response):Promise<void>{
    const data = login_schema.safeParse(req.body);
        if(!data.success){
        res.status(401).json({error:"invalid data"})
        return
    }

    const {username,password,email} = data;

    try{
        const user = await prisma.user.findFirst({
            where:{
                username,
                email
            }
        })
        if(!user){
            res.status(404).json({error:"user not found"})
            return
        }

        const isMatch =  await Bun.password.verify(password,user?.password)
        if(!isMatch){
            res.status(401).json({error:"Invalid username or password"})
            return
        }

        const token = jwt.sign(user,JWT_SECRET,{expiresIn:'1d'})
        res.status(200).json(token)

    }catch(err){
        res.status(500).json({error:"internal server error",err})
    }
}