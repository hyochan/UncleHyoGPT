import {
  chatOpenAI,
  extractErrorMessageFromOutputParserException,
} from "@/src/utils/langchain";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { isSessionCallLimited } from "../../../src/utils/session";
import { franc } from 'franc';

function detectLanguage(text: string): string {
    return franc(text, {minLength: 1}); // ISO639-3 언어 코드 반환
}



export const revalidate = 3; // 3sec

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    message: z.string().describe("answer to the user's question"),
  })
);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You're the fun uncle who plays well with nieces and nephews aged 4 to 12, guiding conversations to ensure they flow smoothly. When your niece or nephew shares something, respond with enthusiasm like, "Wow, that's amazing!" or "Really? What happened next?" to show your interest.
    Moreover, ask simple questions based on what they've said to spark their imagination. For instance, "What's your favorite dinosaur?" or "Is there a planet you'd like to visit in a spaceship?" These questions encourage them to think creatively.
    You can also invite them to imagine together, saying, "Shall we pretend we're in an enchanted forest?" or "If we were superheroes, what powers would you want?" Such prompts help deepen the conversation.
    Creating simple stories together is another way to engage. Start with, "Once, a little puppy went on an adventure. What do you think it discovered?" to gather their opinions and ideas.
    Importantly, listen to and respect their thoughts and feelings, encouraging them to express themselves freely. By responding positively, asking follow-up questions, imagining together, crafting stories, and valuing their opinions, your communication with your nieces and nephews will be more enjoyable and meaningful.
    Try to answer shortly instead of a long response.
    Lastly, ensure you respond in the same language as the user's question. Detect the language of the user's question and use it for your response. If the user's language cannot be determined, ask for clarification.
    {format_instructions}
    {input}`,
  ],
  [
    "system",
    `Respond ONLY in {language} language.`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

export async function POST(request: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const req = await request.json();

  if (isProduction && isSessionCallLimited(request)) {
    return Response.json({
      message: "Rate limit exceeded. Please try again in 4 hours.",
      status: 429,
    });
  }

  const chatHistories = [
    new AIMessage(`Hello, sweeties! How have you been?`),
    new HumanMessage("Uncle~~~ Play with me!"),
  ];

  // Sliding Window - Only keep the last 100 histories
const start = Math.max(0, req.histories.length - 100); // 올바른 시작 인덱스 계산
req.histories.slice(start).forEach((history: any) => {
  if (history.input) chatHistories.push(new HumanMessage(history.input));
  chatHistories.push(new AIMessage(history.message));
});


  try {
    const message = req.message;
    const sysMessage = req.sysMessage || "";

    const memory = new BufferMemory({
      returnMessages: false,
      memoryKey: "chat_history",
      chatHistory: new ChatMessageHistory([
        ...chatHistories,
        //? Add the current message to the history or it will give bad responses.
        new SystemMessage(sysMessage),
        new HumanMessage(message),
      ]),
    });

    console.log("memory:", memory);    
    
    const chain = RunnableSequence.from([prompt, chatOpenAI, parser]);

    const response = await chain.invoke(
      {
        chat_history: chatHistories,
        input: message,
        language: detectLanguage(message),
        format_instructions: parser.getFormatInstructions(),
        memory,
      },
      { configurable: { sessionId: "unused" } }
    );

    return Response.json(response);
  } catch (err: any) {
    const message = extractErrorMessageFromOutputParserException(err?.message);

    if (message) {
      return Response.json({ message });
    }

    return Response.json({
      status: 500,
      message: err?.message || "Internal Server Error",
    });
  }
}
