export interface TypeData {
  level: number;
  question: string;
  targetPosition: string;
  initialPosition: string;
  correctAnswer: string[];
  hint: string;
}

export const DATA: TypeData[] = [
  {
    level: 1,
    question: "Làm thế nào để căn phần tử vào góc dưới bên phải?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-end;",
      "align-items: flex-end;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
`,
    targetPosition: `
#target {
  position: absolute;
  bottom: 0;
  right: 0;
}
`,
    hint: "Dùng 'justify-content' và 'align-items' để căn phần tử vào góc dưới bên phải.",
  },
  {
    level: 1,
    question: "Làm thế nào để căn giữa phần tử theo chiều ngang?",
    correctAnswer: ["display: flex;", "justify-content: center;"],
    initialPosition: `
#child {
  display: flex;
  justify-content: flex-start;
}
`,
    targetPosition: `
#target {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
`,
    hint: "Dùng 'justify-content: center' để căn giữa theo chiều ngang.",
  },
  {
    level: 2,
    question: "Làm thế nào để căn phần tử vào góc trên bên trái?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-start;",
      "align-items: flex-start;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  top: 0;
  left: 0;
}
`,
    hint: "Dùng 'justify-content' và 'align-items' để căn phần tử vào góc trên bên trái.",
  },
  {
    level: 2,
    question:
      "Làm thế nào để đặt phần tử cách mép trái 50px và căn giữa theo chiều dọc?",
    correctAnswer: [
      "display: flex;",
      "align-items: center;",
      "margin-left: 50px;",
    ],
    initialPosition: `
#child {
  display: flex;
  align-items: flex-start;
  margin-left: 0;
}
`,
    targetPosition: `
#target {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
`,
    hint: "Dùng 'align-items' và 'margin-left' để đạt kết quả.",
  },
  {
    level: 3,
    question: "Làm thế nào để đặt phần tử vào trung tâm theo cả hai trục?",
    correctAnswer: [
      "display: flex;",
      "justify-content: center;",
      "align-items: center;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
`,
    targetPosition: `
#target {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
`,
    hint: "Dùng 'justify-content: center' và 'align-items: center' để căn giữa phần tử theo cả hai chiều.",
  },
  {
    level: 3,
    question: "Làm thế nào để căn phần tử vào góc dưới bên trái?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-start;",
      "align-items: flex-end;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  bottom: 0;
  left: 0;
}
`,
    hint: "Dùng 'justify-content: flex-start' và 'align-items: flex-end' để căn phần tử vào góc dưới bên trái.",
  },
  {
    level: 3,
    question: "Làm thế nào để căn giữa phần tử theo chiều dọc?",
    correctAnswer: ["display: flex;", "align-items: center;"],
    initialPosition: `
#child {
  display: flex;
  align-items: flex-start;
}
`,
    targetPosition: `
#target {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
`,
    hint: "Dùng 'align-items: center' để căn giữa phần tử theo chiều dọc.",
  },
  {
    level: 3,
    question: "Làm thế nào để căn phần tử vào giữa mép phải?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-end;",
      "align-items: center;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
`,
    hint: "Dùng 'justify-content: flex-end' và 'align-items: center' để căn phần tử vào giữa mép phải.",
  },
  {
    level: 3,
    question: "Làm thế nào để đặt phần tử ở góc dưới bên phải với margin?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-end;",
      "align-items: flex-end;",
      "margin: 20px;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
`,
    hint: "Dùng 'justify-content: flex-end', 'align-items: flex-end' và margin để căn phần tử vào góc dưới bên phải.",
  },
  {
    level: 4,
    question: "Làm thế nào để căn đều ba phần tử theo chiều ngang?",
    correctAnswer: [
      "display: flex;",
      "justify-content: space-between;",
      "align-items: center;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
`,
    targetPosition: `
#target {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`,
    hint: "Dùng 'justify-content: space-between' để căn đều ba phần tử.",
  },
  {
    level: 4,
    question: "Làm thế nào để căn đều bốn phần tử theo cả hai chiều?",
    correctAnswer: [
      "display: flex;",
      "flex-wrap: wrap;",
      "justify-content: space-around;",
      "align-items: center;",
    ],
    initialPosition: `
#child {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
`,
    targetPosition: `
#target {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
`,
    hint: "Dùng 'justify-content: space-around' và 'align-items: center' để căn đều bốn phần tử.",
  },
  {
    level: 4,
    question:
      "Làm thế nào để căn phần tử vào góc trên bên phải với khoảng cách cố định?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-end;",
      "align-items: flex-start;",
      "margin: 30px;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  top: 30px;
  right: 30px;
}
`,
    hint: "Dùng 'justify-content: flex-end', 'align-items: flex-start' và margin để căn phần tử vào góc trên bên phải.",
  },
  {
    level: 5,
    question:
      "Làm thế nào để sắp xếp phần tử theo trục dọc với khoảng cách bằng nhau?",
    correctAnswer: [
      "display: flex;",
      "flex-direction: column;",
      "justify-content: space-evenly;",
    ],
    initialPosition: `
#child {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
`,
    targetPosition: `
#target {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
`,
    hint: "Dùng 'justify-content: space-evenly' để căn đều phần tử theo trục dọc.",
  },
  {
    level: 5,
    question:
      "Làm thế nào để căn phần tử vào góc dưới bên phải và cách mép 50px?",
    correctAnswer: [
      "display: flex;",
      "justify-content: flex-end;",
      "align-items: flex-end;",
      "margin: 50px;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: center;
  align-items: center;
}
`,
    targetPosition: `
#target {
  position: absolute;
  bottom: 50px;
  right: 50px;
}
`,
    hint: "Dùng 'justify-content: flex-end', 'align-items: flex-end' và margin để đặt phần tử đúng vị trí.",
  },
  {
    level: 5,
    question:
      "Làm thế nào để căn giữa phần tử theo cả hai trục mà vẫn có khoảng cách đều nhau giữa chúng?",
    correctAnswer: [
      "display: flex;",
      "justify-content: center;",
      "align-items: center;",
      "gap: 20px;",
    ],
    initialPosition: `
#child {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
`,
    targetPosition: `
#target {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
`,
    hint: "Dùng 'justify-content: center', 'align-items: center' và 'gap' để tạo khoảng cách giữa các phần tử.",
  },
];

export const EXAMS = [
  { image: "/images/exams/exam_1.svg", colors: ["#000000", "#FFFFFF"] },
  { image: "/images/exams/exam_2.svg", colors: ["#000000", "#FFFFFF"] },
  { image: "/images/exams/exam_3.svg", colors: ["#FF0000", "#FFFFFF"] },
  { image: "/images/exams/exam_4.svg", colors: ["#4285EB", "#2EC7FF"] },
  { image: "/images/exams/exam_5.svg", colors: ["#FA8E7D", "#000000"] },
  { image: "/images/exams/exam_6.svg", colors: ["#764ABC", "#D9D9D9"] },
  { image: "/images/exams/exam_7.svg", colors: ["#4ABC85", "#D9D9D9"] },
  { image: "/images/exams/exam_8.svg", colors: ["#A9BC4A", "#000000"] },
  { image: "/images/exams/exam_9.svg", colors: ["#654ABC", "#D9D9D9"] },
  { image: "/images/exams/exam_10.svg", colors: ["#FFB914", "#D9D9D9"] },
];
