"use client";

import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const message = searchParams.get("message");

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-center">
        {title ? title : "Oops!"}
      </h1>
      <p className="text-lg text-center">
        {message ? message : "Something went wrong. Please try again."}
      </p>
      <Button color="danger" onClick={() => router.back()}>
        Go Back
      </Button>
    </main>
  );
}

export default function ErrorPageContainer() {
  return (
    <Suspense>
      <ErrorPage />
    </Suspense>
  );
}
