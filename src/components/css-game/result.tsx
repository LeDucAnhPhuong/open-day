import { cn } from "@/utils/cn";
import React, { useEffect } from "react";
import { Button } from "../ui/button";

const Result = ({
  percentCompare,
  handleSubmit,
  setBestPercent,
  bestPercent,
}: {
  percentCompare: number;
  handleSubmit: (percent: number) => void;
  setBestPercent: (percent: number) => void;
  bestPercent: number;
}) => {
  const styleOfPercentCompare = (percent: number) => {
    if (percent > 80) return "text-green-700";
    if (percent > 60) return "text-yellow-700";
    return "text-red-700";
  };

  useEffect(() => {
    if (percentCompare > bestPercent) setBestPercent(percentCompare);
  }, [percentCompare]);

  return (
    <div className="p-4 w-[400px] border-2 border-gray-600 rounded-xl backdrop-blur-sm text-white flex flex-col space-y-2">
      <div className="flex gap-2">
        <p>Kết quả hiện tại: </p>
        <p className={cn(styleOfPercentCompare(percentCompare))}>
          {percentCompare.toFixed(2)}%
        </p>
      </div>
      <div className="flex gap-2">
        <p>Kết quả tốt nhất: </p>
        <p className={cn(styleOfPercentCompare(bestPercent))}>
          {bestPercent.toFixed(2)}%
        </p>
      </div>
      <div className="flex mt-4 justify-end items-center space-x-4">
        <Button
          onClick={() => handleSubmit(bestPercent)}
          className="text-black w-[100px]"
          variant="outline"
        >
          Nộp
        </Button>
      </div>
    </div>
  );
};

export default Result;
