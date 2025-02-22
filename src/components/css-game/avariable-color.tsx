import React from "react";
import { toast } from "sonner";

const AvariableColor = ({ colors }: { colors: string[] }) => {
  const handleCopy = (color: string) => {
    navigator.clipboard
      .writeText(color)
      .then(() => {
        toast.success("Copy thành công");
      })
      .catch(() => {
        toast.error("Copy thất bại");
      });
  };
  return (
    <div className="p-4 w-[400px] space-y-2 border-2 border-gray-600 rounded-xl">
      <h2 className="text-white text-xl font-semibold">Màu có sẵn:</h2>
      <div className="flex gap-4 ">
        {colors?.map((color: string) => (
          <div
            key={color}
            onClick={() => handleCopy(color)}
            className="rounded-full group relative hover:scale-110 transition-transform duration-300 ease-in-out bg-gray-700 py-1 px-2 pr-3 items-center gap-2 cursor-pointer justify-between flex"
          >
            <span
              className="rounded-full group-hover:scale-125 transition-transform duration-150 ease-in-out border-spacing-1 size-4 aspect-square"
              style={{ backgroundColor: color }}
            />
            <p className="text-white">{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvariableColor;
