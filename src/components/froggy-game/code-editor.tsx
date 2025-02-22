"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TypeData } from "@/helper/data";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";

interface Props {
  code: string;
  setCode: (code: string) => void;
  data: TypeData;
  handleSwitchQuestion: (status: "prev" | "next") => void;
}

export default function CodeEditor({
  code,
  setCode,
  data,
  handleSwitchQuestion,
}: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <Editor
        height="30vh"
        defaultLanguage={"css"}
        value={code}
        theme="vs"
        onChange={(value: string | undefined) => setCode(value ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
        }}
      />
      <Button
        className="mt-4 bg-[#0043D4]/80 hover:bg-[#0043D4] text-white"
        onClick={() => {
          const content = code.split("{")?.at(1);
          let codeLine = content?.split("}")?.at(0)?.trim()?.split("\n");
          console.log("code", codeLine);
          let { correctAnswer } = data;
          correctAnswer = correctAnswer?.filter(
            (answer) => !codeLine?.some((line) => line.trim() === answer)
          );
          codeLine = codeLine?.filter(
            (line) =>
              !data?.correctAnswer?.some((answer) => answer === line.trim())
          );
          if (correctAnswer?.length !== 0) {
            toast.info(
              <div>
                <h2>Có vẻ bạn đã thiếu gì đó</h2>
                <pre className="mt-2 rounded-md  p-2">
                  <code className="text-green-600">
                    {correctAnswer?.map((answer) => (
                      <p key={answer}>{answer}</p>
                    ))}
                  </code>
                </pre>
              </div>
            );
            return;
          }
          if (codeLine?.length !== 0) {
            toast.info(
              <div>
                <h2>Có vẻ bạn đã dư gì đó</h2>
                <pre className="mt-2 rounded-md  p-2">
                  <code className="text-red-600">
                    {codeLine?.map((answer) => (
                      <p key={answer}>{answer}</p>
                    ))}
                  </code>
                </pre>
              </div>
            );
            return;
          }
          handleSwitchQuestion("next");
        }}
      >
        Nộp
      </Button>
    </div>
  );
}
