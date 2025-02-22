"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { TypeData } from "@/helper/data";
import froggy from "@images/exams/froggy-flex.png";
import target from "@images/exams/target.png";

export default function GameBoard({
  code,
  data,
}: {
  code: string;
  data: TypeData;
}) {
  const childRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const childStyleElement = document.createElement("style");
    childStyleElement.textContent = code;
    childRef?.current?.appendChild(childStyleElement);

    const targetStyleElement = document.createElement("style");
    targetStyleElement.textContent = data?.targetPosition;
    targetRef?.current?.appendChild(targetStyleElement);

    return () => {
      childRef?.current?.removeChild(childStyleElement);
      targetRef?.current?.removeChild(targetStyleElement);
    };
  }, [code]);

  return (
    <div className=" h-[calc(100%-64px)] p-4 ">
      <div className=" relative  bg-teal-700 h-full rounded-lg">
        <div className="absolute inset-4  ">
          <div id="target" ref={targetRef} className=" w-24 h-24  rounded-full">
            <Image
              src={target}
              alt="target"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>

          <div id="child" ref={childRef} className="absolute inset-0">
            <Image
              src={froggy}
              alt="Frog"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
