import { HubotIcon } from "@primer/octicons-react";
import ChatForm from "../src/uis/ChatForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24 gap-4">
      <div className="flex flex-row items-center gap-2 self-center">
        <HubotIcon className="text-black/50 dark:text-white/90 size-6" />
        <h1 className="text-3xl">Ask GPT</h1>
      </div>
      <ChatForm />
    </main>
  );
}
