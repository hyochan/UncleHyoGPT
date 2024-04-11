"use client";

import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-end p-4 gap-2">
      <a
        href="https://github.com/hyochan/gpt.hyochan.dev"
        className="flex flex-row items-center gap-2"
      >
        <MarkGithubIcon />
        <LogoGithubIcon />
      </a>
    </header>
  );
}
