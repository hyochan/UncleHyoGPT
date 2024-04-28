import ChatForm from "../src/uis/ChatForm";
import Image from "next/image";
import Header from "../src/uis/Header";
import clsx from "clsx";

export default async function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main
        className={clsx(
          "py-12 px-4 gap-4 overflow-y-scroll",
          "flex flex-1 self-stretch flex-col",
          "md:px-24"
        )}
      >
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
