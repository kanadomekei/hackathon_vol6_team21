"use client";
import React from "react";

function MainComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed" style={{backgroundImage:'url(/images/title.png)'}}>
      <div className="flex flex-col items-center mb-8">
        <img
          src="./images/logo.png"
          alt="Chef's hat and utensils icon"
          className="w-[400px] h-[400px] mb-4"
        />
      </div>
      <div className="text-center">
        <p className="text-4xl font-roboto text-[#000000] mb-4">
          写真からレシピが生まれる！
        </p>
        <p className="text-3xl font-roboto text-[#000000] mb-4">
          簡単クッキングで、毎日の食卓をもっと豊かに！
        </p>
      </div>
      <button className="mt-8 px-6 py-2 bg-[#FAF3E3] text-[#000000] rounded-full font-roboto">
        ログイン
      </button>
    </div>
  );
}

export default MainComponent;