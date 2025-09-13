import React, { forwardRef } from "react";
import Image from "next/image";
import { EXAMS } from "@/helper/data";
import { Challenge } from "@/types/api";

interface ExamProps {
  questionIndex: number;
  challenge?: Challenge;
}

const Exam = forwardRef<HTMLImageElement, ExamProps>(
  ({ questionIndex, challenge }: ExamProps, ref) => {
    const imageSource = challenge?.image || EXAMS[questionIndex]?.image;

    return (
      <div>
        <div className="h-full flex flex-col justify-cente">
          <div className="flex justify-end h-8 mb-4" />
          <div className="w-[400px] h-[300px] bg-white overflow-hidden">
            <Image
              width={400}
              height={300}
              ref={ref}
              src={imageSource}
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
