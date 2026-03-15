import Anthropic from "@anthropic-ai/sdk";

async function main() {
 const client = new Anthropic({
  apiKey: "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"
});

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content:
          "What should I search for to find the latest developments in renewable energy?"
      }
    ]
  });
  console.log(msg);
}

main().catch(console.error);