import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defaultRuntime } from "../dist/runtime.js";
import { agentCommand } from "../dist/commands/agent.js";
import { createDefaultDeps } from "../dist/cli/deps.js";

const apiKey = process.env.ARK_API_KEY;
if (!apiKey) {
  console.error("缺少 ARK_API_KEY 环境变量");
  process.exit(1);
}

const imageUrl =
  "https://ark-project.tos-cn-beijing.volces.com/doc_image/ark_demo_img_1.png";
const message = "你看见了什么？";

const deps = createDefaultDeps();
(async () => {
  try {
    const result = await agentCommand(
      {
        message,
        sessionId: "doubao-local-demo",
        messageChannel: "webchat",
      },
      defaultRuntime,
      deps,
    );
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(String(err));
    process.exit(1);
  }
})();
