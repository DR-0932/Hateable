import { Sandbox } from '@e2b/code-interpreter';
import { runAgent } from './agent.js';

async function main() {
  const sandbox = await Sandbox.create();

  try {
    await sandbox.commands.run('mkdir -p /home/user/project');

    const result = await runAgent(
      sandbox,
      'Create a file called hello.txt in the project root containing "Hello from the agent". Then run `cat hello.txt` to confirm it worked.'
    );

    console.log('=== done:', result.done);
    console.log('=== final text:', result.text);
    console.log(
      '=== turns taken:',
      result.history.filter((h) => h.role === 'model').length
    );

    // Print every tool call + result so you can see what the model actually did.
    for (const turn of result.history) {
      for (const part of turn.parts ?? []) {
        if (part.functionCall) {
          console.log(`[call] ${part.functionCall.name}`, part.functionCall.args);
        }
        if (part.functionResponse) {
          console.log(`[result] ${part.functionResponse.name}`, part.functionResponse.response);
        }
      }
    }
  } finally {
    await sandbox.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});