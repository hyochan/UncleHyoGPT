"use client";

import { Button } from "@nextui-org/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function BackButton({
  link,
  className,
}: {
  link?: string;
  className?: string;
}): JSX.Element {
  const router = useRouter();

  return (
    <Button
      onClick={link ? () => router.replace(link) : () => router.back()}
      className={clsx(className)}
      aria-label="Back"
    >
      <ArrowLeftIcon />
    </Button>
  );
}
