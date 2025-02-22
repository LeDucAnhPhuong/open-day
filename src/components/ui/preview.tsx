"use client";
import type React from "react";
import { useState, useMemo, useRef, forwardRef } from "react";
import Image from "next/image";
import { useDrag } from "react-use-gesture";
import { Button } from "./button";
import { cn } from "@/utils/cn";

export const Preview = forwardRef<
  HTMLDivElement,
  { imageDiffSrc: string; imageTarget: string }
>(({ imageDiffSrc, imageTarget }, ref) => {
  const [sliderPosition, setSliderPosition] = useState(100);
  const [isCompare, setCompare] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef(0);

  const bind = useDrag(({ down, movement: [mx], first, last, event }) => {
    if (first) {
      setIsDragging(true);
      const rect = sliderRef.current?.getBoundingClientRect();
      const mouseX = (event as MouseEvent).clientX;
      initialPositionRef.current =
        ((mouseX - (rect?.left || 0)) / (rect?.width || 1)) * 100;
    }
    if (last) {
      setIsDragging(false);
    }

    if (down) {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (rect) {
        const newPos = initialPositionRef.current + (mx / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(newPos, 0), 100));
      }
    }
  });

  const sliderStyle = useMemo(
    () => ({
      left: `${sliderPosition}%`,
      transition: isDragging ? "none" : "left 0.1s ease-out",
    }),
    [sliderPosition, isDragging]
  );

  const rightImageStyle = useMemo(
    () => ({
      transform: `translate(${sliderPosition}%)`,
      transition: isDragging ? "none" : "width 0.1s ease-out",
    }),
    [sliderPosition, isDragging]
  );
  const reverseRightImageStyle = useMemo(
    () => ({
      transform: `translate(${-sliderPosition}%)`,
      transition: isDragging ? "none" : "width 0.1s ease-out",
    }),
    [sliderPosition, isDragging]
  );

  const handleComparing = () => {
    setCompare((prev) => !prev);
  };
  return (
    <div className="w-[400px]">
      <div className="flex justify-end h-8 mb-4">
        <Button
          onClick={handleComparing}
          className={cn(
            "border-0",
            isCompare ? "bg-[#0040CC]/50 text-white" : "bg-white"
          )}
          variant="outline"
        >
          So Sánh
        </Button>
      </div>
      <div className="w-[400px] h-[300px] flex flex-col justify-center">
        <div
          className={cn(
            "relative",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          {...bind()}
        >
          <div
            ref={sliderRef}
            className={`w-[400px] h-[300px] overflow-hidden`}
          >
            {isCompare && (
              <div className="absolute inset-0 z-10">
                <Image src={imageDiffSrc} alt="image diff" fill />
              </div>
            )}
            <div ref={ref} className="w-[400px] h-[300px]" />
            <div
              className="w-[400px] h-[300px] top-0 left-0 z-30 absolute overflow-hidden"
              style={rightImageStyle}
            >
              <div
                className="w-[400px] h-[300px] absolute top-0 left-0 z-30"
                style={reverseRightImageStyle}
              >
                <Image src={imageTarget} alt="image target" fill />
              </div>
            </div>
          </div>
          <div
            className={`absolute top-0 z-30 bottom-0 w-px bg-black/30 ${
              isDragging ? "scale-y-110" : ""
            }`}
            style={sliderStyle}
          >
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-150 ${
                isDragging ? "scale-110" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Preview.displayName = "Preview";
export default Preview;
