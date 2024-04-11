"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Button, Chip, Input, Textarea } from "@nextui-org/react";
import { CommentIcon } from "@primer/octicons-react";
import useSWRMutation from "swr/mutation";
import { ChatHistory } from "../types";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";

const sendMessage = (
  url: string,
  { arg }: { arg: { message: string; histories: {}[]; sysMessage?: string } }
) =>
  fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());

export default function ChatForm() {
  const [message, setMessage] = useState("");
  const [sysMessage, setSysMessage] = useState("");

  const { trigger: triggerSendMessage, isMutating: isMutatingSendMessage } =
    useSWRMutation("/api/chat", sendMessage);

  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const result = await triggerSendMessage(
      {
        message,
        //? Sliding Window - Only keep the last 10 histories
        histories: histories.slice(0, 10),
        sysMessage,
      },
    );

    if (message) {
      result.input = message;
    }

    setHistories((prevResults) => [result, ...prevResults]);
    setMessage("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      className="self-stretch flex-1 flex flex-col items-center gap-8"
      onSubmit={onSendMessage}
    >
      {/* Body */}
      <div className="flex flex-1 flex-col w-full gap-4">
        {/* Input */}
        <div className="flex flex-row items-center gap-4">
          <Input
            ref={inputRef}
            label="Message"
            isClearable
            variant="bordered"
            radius="lg"
            onClear={() => setMessage("")}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Message GPT..."
            startContent={
              <CommentIcon className="text-black/50 mb-0.5 dark:text-white/90 pointer-events-none flex-shrink-0" />
            }
          />
          <Button
            color="primary"
            className="h-12"
            type="submit"
            isDisabled={!message}
            isLoading={isMutatingSendMessage}
          >
            Send
          </Button>
        </div>
        {/* Additional System Message */}
        <div className="flex flex-row items-center gap-4">
          <Textarea
            label="System Message"
            onClear={() => setSysMessage("")}
            radius="lg"
            type="text"
            value={sysMessage}
            onChange={(e) => setSysMessage(e.target.value)}
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Additional System Message..."
          />
        </div>
        {/* Results */}
        <div
          style={{ overflowY: "auto" }}
          className="flex flex-1 self-stretch flex-col p-2 gap-4"
        >
          {histories.map((result, i) => (
            <div
              key={`${result.message?.substring(0, 4)}-${i}`}
              className="flex flex-col gap-2"
            >
              <div className={clsx("p-2 py-1 text-white", "bg-zinc-800")}>
                Me: {result.input}
              </div>
              <div className="flex flex-row gap-2">
                <span className="text-white">{result.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </form>
  );
}
