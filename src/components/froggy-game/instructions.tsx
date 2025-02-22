import { TypeData } from "@/helper/data";
import React from "react";

export default function Instructions({ data }: { data: TypeData }) {
  return (
    <div className="text-black mb-6">
      <h4 className="text-[#0043D4] text-xl">{data?.question}</h4>
      <div className="space-y-2">
        <p>Các thuộc tính Flexbox:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="bg-black/20 px-1 rounded">flex-start</code>: Các
            hàng mục sẽ được sắp xếp về phía bên trái của hộp chứa.
          </li>
          <li>
            <code className="bg-black/20 px-1 rounded">flex-end</code>: Các hàng
            mục sẽ được sắp xếp về phía bên phải của hộp chứa.
          </li>
          <li>
            <code className="bg-black/20 px-1 rounded">center</code>: Các hàng
            mục sẽ được sắp xếp ở giữa chính của hộp chứa.
          </li>
          <li>
            <code className="bg-black/20 px-1 rounded">space-between</code>: Các
            hàng mục sẽ được trình bày với khoảng cách bằng nhau giữa chúng.
          </li>
          <li>
            <code className="bg-black/20 px-1 rounded">space-around</code>: Các
            hàng mục sẽ được trình bày với khoảng cách bằng nhau xung quanh
            chúng.
          </li>
          <li className="flex gap-2">
            <span>hint*:</span>
            <p className="text-red-500">{data?.hint}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
