"use client";

import { useState, FormEvent, useRef } from "react";
import { Button, Input } from "@nextui-org/react";
import { CommentIcon, HubotIcon } from "@primer/octicons-react";

export default function ChatForm() {
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    console.log("Send", message);
    setMessage("");
    setResults((prev) => [message, ...prev]);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      className="self-stretch flex-1 flex flex-col items-center gap-8"
      onSubmit={onSubmit} // 폼 제출 이벤트에 핸들러 연결
    >
      {/* Body */}
      <div className="flex flex-1 flex-col w-full gap-4">
        {/* Input */}
        <div className="flex flex-row items-center gap-4">
          <Input
            ref={inputRef}
            label="Message"
            isClearable
            radius="lg"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // 입력값 변경 핸들러
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
              <CommentIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
          <Button color="primary" className="h-12" type="submit">
            Send
          </Button>
        </div>
        {/* Results */}
        <div
          style={{ maxHeight: "600px", overflowY: "auto" }}
          className="flex flex-1 self-stretch flex-col p-2 gap-2"
        >
          {results.map((result, i) => (
            <div
              key={`${result.substring(0, 4)}-${i}`}
              className="flex flex-row items-center"
            >
              <p className="text-right text-black/90 dark:text-white/90">
                {result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
