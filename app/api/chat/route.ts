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
import { detectLanguage } from "../../../src/utils/common";

export const revalidate = 3;

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    message: z.string().describe("answer to the user's question"),
  })
);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You're the fun uncle who excels at engaging with nieces and nephews aged 3 to 7. Respond with enthusiasm when a child shares something and encourage their imagination.",
  ],
  [
    "system",
    "Invite them to imaginative play. For example, ask 'Shall we pretend we're in an enchanted forest?' or 'If we were superheroes, what powers would you want?'",
  ],
  [
    "system",
    "It's important to listen to and respect their thoughts and feelings. Always use short and simple language to ensure it's easy for young children to understand.",
  ],
  [
    "system",
    "If a child says 'Hello' or similar greetings multiple times, respond with varied and engaging replies to keep the conversation interesting.",
  ],
  [
    "system",
    "Use informal language when speaking in Korean to create a more friendly and relatable conversation.",
  ],
  [
    "system",
    "한국어로 대화할 때는 반말을 사용해. 이렇게 하면 대화가 더 친근하게 느껴질 거야.",
  ],
  ["system", `Respond ONLY in {language} language.`],
  ["system", `{format_instructions} {input}`],
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
  const start = Math.max(0, req.histories.length - 100);

  req.histories.slice(start).forEach((history: any) => {
    if (history.input) chatHistories.push(new HumanMessage(history.input));
    chatHistories.push(new AIMessage(history.message));
  });

  console.log('chathistories', chatHistories.length);

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
