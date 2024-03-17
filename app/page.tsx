import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl">Langchain Sample</h1>
      <Button>Click me</Button>
    </main>
  );
}
