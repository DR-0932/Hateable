import { Router } from "express";
import { getAgentTaskStatus, submitAgentTask } from "../controllers/agent/agentController.js";

const agent_router:Router = Router();

agent_router.post('/agent/run',submitAgentTask);
agent_router.get('/agent/status/:jobId',getAgentTaskStatus)

export default agent_router