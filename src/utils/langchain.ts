import { ChatOpenAI } from "@langchain/openai";

export const chatOpenAI = new ChatOpenAI({
  temperature: 0.5,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  modelName: "gpt-3.5-turbo-0125",
  // modelName: 'gpt-4',
});

export function extractErrorMessageFromOutputParserException(message: string): string | undefined {
  const pattern = /Text: "(.*)". Error:/;
  const match = message.match(pattern);
  if (match && match[1]) {
    return match[1];
  }
}
