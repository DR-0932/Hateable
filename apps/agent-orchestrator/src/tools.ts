import type { Sandbox } from "@e2b/code-interpreter";

export const PROJECT_ROOT = "/home/user/project";

const DEFAULT_COMMAND_TIMEOUT = 60_000;

export interface ToolResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface WriteFileResult {
  path: string;
  bytesWritten: number;
}

export interface ReadFileResult {
  path: string;
  content: string;
}

export interface RunCommandResult {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Resolves a relative path against PROJECT_ROOT, collapsing "." and ".."
 * segments, and throws if the result escapes PROJECT_ROOT.
 */
function resolveProjectPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "");
  const rootParts = PROJECT_ROOT.split("/").filter(Boolean);

  const parts = normalized.split("/").reduce<string[]>((acc, segment) => {
    if (segment === "" || segment === ".") return acc;

    if (segment === "..") {
      // Refuse to pop past the project root itself.
      if (acc.length <= rootParts.length) {
        throw new Error(`Path "${relativePath}" resolves outside the project directory`);
      }
      acc.pop();
      return acc;
    }

    acc.push(segment);
    return acc;
  }, [...rootParts]);

  return "/" + parts.join("/");
}

export async function writeFileTool(
  sandbox: Sandbox,
  filePath: string,
  content: string
): Promise<ToolResult<WriteFileResult>> {
  try {
    const fullPath = resolveProjectPath(filePath);
    await sandbox.files.write(fullPath, content);

    return {
      success: true,
      data: { path: filePath, bytesWritten: Buffer.byteLength(content, "utf-8") },
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to write file: ${filePath}`,
    };
  }
}

export async function readFileTool(
  sandbox: Sandbox,
  filePath: string
): Promise<ToolResult<ReadFileResult>> {
  try {
    const fullPath = resolveProjectPath(filePath);
    const content = await sandbox.files.read(fullPath);

    return { success: true, data: { path: filePath, content } };
  } catch (error) {
    return {
      success: false,
      error: `File not found or unreadable: ${filePath}`,
    };
  }
}

export async function runCommandTool(
  sandbox: Sandbox,
  command: string,
  options?: { timeoutMs?: number; background?: boolean }
): Promise<ToolResult<RunCommandResult>> {
  try {
    const result = await sandbox.commands.run(command, {
      cwd: PROJECT_ROOT,
      timeoutMs: options?.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT,
      background: options?.background ?? false,
    });

    const exitCode = result.exitCode ?? 1;

    return {
      success: exitCode === 0,
      data: {
        command,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to run command: ${command}`,
    };
  }
}