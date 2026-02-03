import "dotenv/config";
import https from "https";

const API_KEY = process.env.ARK_API_KEY;
if (!API_KEY) {
  console.error(
    "❌ Error: ARK_API_KEY is not set in environment or .env file.",
  );
  process.exit(1);
}

// Configuration to test
const MODEL_ID = "ark-code-latest";
// Test both URLs
const URLS_TO_TEST = [
  "https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions",
  "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
];

const PAYLOAD = {
  model: MODEL_ID,
  messages: [{ role: "user", content: "Hello, can you help me write code?" }],
  stream: false,
};

async function testUrl(url) {
  console.log(`\nTesting URL: ${url}`);
  try {
    const urlObj = new URL(url);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      timeout: 10000, // 10s timeout
    };

    return new Promise((resolve) => {
      const req = https.request(urlObj, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
          if (res.statusCode === 200) {
            console.log(
              "✅ Success! Response preview:",
              data.substring(0, 100) + "...",
            );
            const json = JSON.parse(data);
            if (json.choices && json.choices.length > 0) {
              console.log("Answer:", json.choices[0].message.content);
            }
            resolve(true);
          } else {
            console.log("❌ Failed. Response:", data);
            resolve(false);
          }
        });
      });

      req.on("error", (e) => {
        console.error(`❌ Request error: ${e.message}`);
        resolve(false);
      });

      req.write(JSON.stringify(PAYLOAD));
      req.end();
    });
  } catch (e) {
    console.error(`❌ Unexpected error: ${e.message}`);
    return false;
  }
}

async function run() {
  console.log(`Starting connection test for model: ${MODEL_ID}`);
  console.log(
    `Using API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`,
  );

  for (const url of URLS_TO_TEST) {
    const success = await testUrl(url);
    if (success) {
      console.log(`\n🎉 Found working configuration!`);
      console.log(`Base URL: ${url.replace("/chat/completions", "")}`);
      return;
    }
  }

  console.log(
    "\n❌ All tests failed. Please verify your Endpoint ID and API Key.",
  );
}

run();
