import { OpenAI, ChatOpenAI } from "@langchain/openai";

export const openAI = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  configuration: {
    organization: 'dooboolab'
  },
  temperature: 0.9,
});

export const chatAI = new ChatOpenAI({
  temperature: 0.9,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  modelName: "gpt-3.5-turbo",
  // modelName: 'gpt-4',
});
