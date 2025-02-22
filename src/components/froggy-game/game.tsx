"use client";
import React, { useEffect, useState } from "react";
import CodeEditor from "@/components/froggy-game/code-editor";
import GameBoard from "@/components/froggy-game/game-board";
import Instructions from "@/components/froggy-game/instructions";
import { DATA, TypeData } from "@/helper/data";
import { Button } from "../ui/button";
const Game = () => {
  const [questionIndex, setQuestion] = useState<number>(0);
  const [currenMaxQuestionIndex, setMaxQuestion] = useState<number>(0);

  const [code, setCode] = useState(`#child {
        display: flex;
      }`);

  const data = DATA.at(questionIndex) as TypeData;
  useEffect(() => {
    setCode(data?.initialPosition);
  }, [data]);

  const handleSwitchQuestion = (action: string) => {
    switch (action) {
      case "prev":
        setQuestion((prev) => Math.max(prev - 1, 0));
        break;
      case "next":
        const nextQuestion = Math.min(questionIndex + 1, DATA?.length - 1);
        setQuestion(nextQuestion);
        setMaxQuestion((prev) => (nextQuestion > prev ? nextQuestion : prev));
        break;
    }
  };
  return (
    <div className="flex w-full h-full justify-between">
      <div className="w-1/2 bg-white p-6 flex flex-col">
        <h1 className="text-4xl font-bold text-black mb-6">FPT Flexbox</h1>
        <Instructions data={data} />
        <CodeEditor
          handleSwitchQuestion={handleSwitchQuestion}
          code={code}
          setCode={setCode}
          data={data}
        />
      </div>

      <div className="w-1/2 bg-teal-400">
        <div className="p-4 flex justify-between items-center text-white">
          <Button
            onClick={() => handleSwitchQuestion("prev")}
            className="p-2  bg-[#0043D4]/80 hover:bg-[#0043D4] text-white rounded"
            disabled={questionIndex === 0}
          >
            Trở về
          </Button>
          <span>
            Cấp {questionIndex + 1} của {DATA.length}
          </span>
          <Button
            onClick={() => handleSwitchQuestion("next")}
            className="p-2  bg-[#0043D4]/80 hover:bg-[#0043D4] text-white rounded"
            disabled={
              questionIndex === DATA?.length - 1 ||
              questionIndex >= currenMaxQuestionIndex
            }
          >
            Tiếp theo
          </Button>
        </div>
        <GameBoard code={code} data={data} />
      </div>
    </div>
  );
};

export default Game;
