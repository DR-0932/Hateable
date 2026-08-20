import { Sandbox } from "@e2b/code-interpreter";
import "dotenv/config";

export async function createSandboxSession(): Promise<Sandbox> {
  const apiKey = process.env.E2B_API_KEY;

  if (!apiKey) {
    throw new Error("E2B_API_KEY is not defined");
  }

  const sandbox = await Sandbox.create({
    apiKey: apiKey,
    timeoutMs: 60_000,
  });

  return sandbox;
}

export async function closeSandboxSession(sandbox: Sandbox): Promise<void> {
  await sandbox.kill();
}