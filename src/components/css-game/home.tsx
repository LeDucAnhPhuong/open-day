"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/ui/code-editor";
import Preview from "@/components/ui/preview";
import AvariableColor from "./avariable-color";
import Result from "./result";
import React from "react";
import html2canvas from "html2canvas";
import Exam from "./exam";
import { checkPoint } from "@/services/check-point";
import { EXAMS } from "@/helper/data";
const initialValue = {
  html: `<div class="box"></div>
`,
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
export default function CSSBattlePage() {
  const [html, setHtml] = useState(initialValue.html);
  const [css, setCss] = useState(initialValue.css);
  const [imageDiffSrc, setImageDiff] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [bestPercent, setBestPercent] = React.useState(0);
  const [percentCompare, setPercentCompare] = useState(0);

  const previewRef = React.useRef<HTMLDivElement>(null);
  const examRef = React.useRef<HTMLImageElement>(null);

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
      // canvas.width = 400;
      // canvas.height = 300;

      console.log(
        "previewRef.current",
        previewRef.current.clientWidth,
        previewRef.current.clientHeight
      );
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
        ctx.drawImage(img, 0, 0); // Vẽ ảnh SVG lên canvas

        const { percent, diffImage } = await checkPoint(
          canvas as HTMLCanvasElement,
          canvasSvg as HTMLCanvasElement
        );
        setImageDiff(diffImage);
        setPercentCompare(percent);
      }
    }
  };

  React.useEffect(() => {
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
    if (percent > 80 && questionIndex < EXAMS.length - 1) {
      setQuestionIndex((prev) => Math.min(prev + 1, EXAMS?.length));
      handleReset();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex">
        <div className="w-2/5 bg-gray-900 p-4">
          <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html" className="text-white">
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="text-white">
                CSS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <CodeEditor
                language="html"
                value={html}
                onChange={(value) => setHtml(value || "")}
              />
            </TabsContent>
            <TabsContent value="css">
              <CodeEditor
                language="css"
                value={css}
                onChange={(value) => setCss(value || "")}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-3/5 bg-gray-800 px-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 items-start">
            <Preview
              ref={previewRef}
              imageTarget={EXAMS[questionIndex]?.image}
              imageDiffSrc={imageDiffSrc}
            />
            <Exam questionIndex={questionIndex} ref={examRef} />
            <Result
              percentCompare={percentCompare}
              handleSubmit={handleSubmit}
              setBestPercent={setBestPercent}
              bestPercent={bestPercent}
            />

            <AvariableColor colors={EXAMS[questionIndex]?.colors} />
          </div>
        </div>
      </div>
    </div>
  );
}
