import express from 'express';
import cors from 'cors';
import agent_router from './routes/agentRoutes.js'

const app =express();



app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));


app.use(express.json());

app.use("/",agent_router)

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})