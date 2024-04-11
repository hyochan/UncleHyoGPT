import ChatForm from "../src/uis/ChatForm";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-1 self-stretch flex-col py-12 px-24 gap-4">
        <div className="flex flex-row items-center gap-4 self-center mb-4">
          <Image src="/icon.png" alt="App Icon" width={36} height={36} />
          <h1 className="text-3xl text-white">Hyo GPT</h1>
          <span className="text-gray-500">v0.1</span>
        </div>
        <ChatForm />
      </main>
    </div>
  );
}
