"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CodeEditor from "@/components/ui/code-editor";
import Preview from "@/components/ui/preview";
import AvariableColor from "@/components/css-game/avariable-color";
import Result from "@/components/css-game/result";
import Exam from "@/components/css-game/exam";
import { Challenge } from "@/types/api";
import { checkPoint } from "@/services/check-point";
import html2canvas from "html2canvas";
import React from "react";

interface CSSBattleGameProps {
  challenge: Challenge;
  onSubmit: (points: number) => void;
  timeRemaining: number;
  isSubmitTime: boolean;
}

const initialValue = {
  html: `<div class="box"></div>`,
  css: `body{
}
.box {
  position: absolute; 
  top:0; 
  left:0; 
  width: 100px; 
  height: 100px; 
  background: #dd6b4d; 
}`,
};

export function CSSBattleGame({
  challenge,
  onSubmit,
  timeRemaining,
  isSubmitTime,
}: CSSBattleGameProps) {
  const [html, setHtml] = useState(initialValue.html);
  const [css, setCss] = useState(initialValue.css);
  const [imageDiffSrc, setImageDiff] = useState("");
  const [bestPercent, setBestPercent] = useState(0);
  const [percentCompare, setPercentCompare] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const examRef = useRef<HTMLImageElement>(null);

  console.log("challenge", challenge);

  const captureToImage = async () => {
    if (previewRef?.current) {
      const newHtml = document.createElement("html");
      newHtml.style.width = "400px";
      newHtml.style.height = "300px";
      newHtml.style.overflow = "hidden";
      newHtml.innerHTML = `
          <style>
          body{
            width: 100%;
            height: 100%;
            position: relative;
          }
          ${css}</style>
          <body>
           ${html}
          </body>
        `;

      previewRef.current.appendChild(newHtml);

      let canvas = document.createElement("canvas");

      canvas = await html2canvas(previewRef.current, {
        width: 400,
        height: 300,
        scale: 1,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgElement = document.createElement("img");
      imgElement.src = imgData;

      const canvasSvg = document.createElement("canvas");
      canvasSvg.width = 400;
      canvasSvg.height = 300;
      const img = examRef.current;

      if (img) {
        const ctx = canvasSvg.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const { percent, diffImage } = await checkPoint(
          canvas as HTMLCanvasElement,
          canvasSvg as HTMLCanvasElement
        );
        setImageDiff(diffImage);
        setPercentCompare(percent);
      }
    }
  };

  useEffect(() => {
    captureToImage();
    return () => {
      if (previewRef.current) previewRef.current.innerHTML = "";
    };
  }, [html, css]);

  const handleReset = () => {
    setHtml(initialValue.html);
    setCss(initialValue.css);
    setPercentCompare(0);
    setBestPercent(0);
  };

  const handleSubmit = (percent: number) => {
    if (!hasSubmitted && percent > 0) {
      onSubmit(percent);
      setHasSubmitted(true);
      setBestPercent(Math.max(bestPercent, percent));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Auto-submit when time is up
  useEffect(() => {
    if (isSubmitTime && !hasSubmitted && percentCompare > 0) {
      handleSubmit(percentCompare);
    }
  }, [isSubmitTime, hasSubmitted, percentCompare]);

  return (
    <div className="space-y-4">
      {/* Timer and Challenge Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>CSS Battle Challenge</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining > 60 ? "default" : "destructive"}>
                Time: {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline">Best: {bestPercent}%</Badge>
              <Badge variant="secondary">Current: {percentCompare}%</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Submit Time Alert */}
      {isSubmitTime && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription className="text-center font-bold">
            ⏰ Time&apos;s up!{" "}
            {hasSubmitted ? "Solution submitted!" : "Auto-submitting..."}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Game Interface */}
      <div className="flex h-[600px]">
        {/* Code Editor Section */}
        <div className="w-2/5 bg-gray-900 p-4">
          <Tabs defaultValue="html" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html" className="text-white">
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="text-white">
                CSS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="html" className="h-full">
              <CodeEditor
                language="html"
                value={html}
                onChange={(value) => setHtml(value || "")}
                disabled={hasSubmitted}
              />
            </TabsContent>
            <TabsContent value="css" className="h-full">
              <CodeEditor
                language="css"
                value={css}
                onChange={(value) => setCss(value || "")}
                disabled={hasSubmitted}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview and Controls Section */}
        <div className="w-3/5 bg-gray-800 px-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 items-start">
            {/* Preview */}
            <Preview
              ref={previewRef}
              imageTarget={challenge?.image}
              imageDiffSrc={imageDiffSrc}
            />

            {/* Target Image */}
            <Exam questionIndex={0} ref={examRef} challenge={challenge} />

            {/* Result Component */}
            <Result
              percentCompare={percentCompare}
              handleSubmit={handleSubmit}
              setBestPercent={setBestPercent}
              bestPercent={bestPercent}
              disabled={hasSubmitted}
            />

            {/* Available Colors */}
            <AvariableColor colors={challenge?.materials || []} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={handleReset} variant="outline" disabled={hasSubmitted}>
          Reset Code
        </Button>
        <Button
          onClick={() => handleSubmit(percentCompare)}
          disabled={hasSubmitted || percentCompare === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {hasSubmitted ? "Submitted!" : `Submit Solution (${percentCompare}%)`}
        </Button>
      </div>
    </div>
  );
}
