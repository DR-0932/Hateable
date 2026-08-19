import { Router } from "express";
import { authMiddleware } from "../controllers/auth/authMiddleware.js";
import { getAgentTaskStatus, submitAgentTask } from "../controllers/agent/agentController.js";

const agent_router = Router();

agent_router.post('/agent/run',authMiddleware,submitAgentTask);
agent_router.get('/agent/status/:jobId',authMiddleware,getAgentTaskStatus)