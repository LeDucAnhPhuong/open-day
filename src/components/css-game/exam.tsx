import React, { forwardRef } from "react";
import Image from "next/image";
import { EXAMS } from "@/helper/data";
const Exam = forwardRef<HTMLImageElement, { questionIndex: number }>(
  ({ questionIndex }: { questionIndex: number }, ref) => {
    return (
      <div>
        <div className="h-full flex flex-col justify-cente">
          <div className="flex justify-end h-8 mb-4" />
          <div className="w-[400px] h-[300px] bg-white overflow-hidden">
            <Image
              width={400}
              height={300}
              ref={ref}
              src={EXAMS[questionIndex]?.image}
              alt="exam"
            ></Image>
          </div>
        </div>
      </div>
    );
  }
);

Exam.displayName = "Exam";

export default Exam;
