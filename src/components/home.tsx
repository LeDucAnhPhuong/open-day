"use client";
import Image from "next/image";
import React from "react";
import thumnail from "@images/exams/thumnail.png";
import froggy from "@images/exams/froggy-flex.png";
import css_battle from "@images/exams/css-battle.png";
import Card from "./ui/card";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="absolute inset-0 z-[0]">
        <Image
          src={thumnail}
          alt="thumnail"
          width={1440}
          height={900}
          className="w-full h-full blur-[1px]"
        />
      </div>
      <div className="z-10 flex w-full h-full justify-center items-center gap-16">
        <div
          onClick={() => router.push("/froggy-game")}
          className="w-[350px] h-[350px] cursor-pointer"
        >
          <Card className="p-10">
            <div className="h-full flex flex-col justify-between">
              <h2 className="text-center uppercase font-semibold text-3xl text-white">
                FPT flex
              </h2>
              <div>
                <Image
                  src={froggy}
                  alt="froggy"
                  width={400}
                  height={300}
                  className="w-full "
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="w-[350px] h-[350px] cursor-pointer">
          <Card className="p-10" onClick={() => router.push("/css-game")}>
            <div className="flex flex-col justify-between h-full">
              <h2 className="text-center uppercase font-semibold text-3xl text-white">
                FPT css battle
              </h2>
              <div>
                <Image
                  src={css_battle}
                  alt="css_battle"
                  width={400}
                  height={300}
                  className="w-full "
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
