"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { RecoilRoot, atom, useRecoilState, useSetRecoilState } from "recoil";

export const globalState = atom<any>({
  key: "globalState",
  default: null,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </NextUIProvider>
  );
}
