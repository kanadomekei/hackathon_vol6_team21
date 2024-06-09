"use client";
import React from "react";

function MainComponent() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(/images/about.png)` }}
    >
    <div className="flex flex-col items-center mb-8 bg-[#ffffff] bg-opacity-80 p-8 rounded-lg shadow-md">
      <div className="text-center mt-8"> 
            <title>About</title>
            <h2 className="text-6xl font-roboto text-[#000000] mb-4">
            Chef's AIの使用方法
            </h2>
            <section className="mb-8">
            <h3 className="text-4xl font-roboto text-[#000000] mb-2">・home</h3>
            <p className="text-lg font-roboto text-[#000000]">
                ここでは画像を投稿して料理をシェアできます！
            </p>
            <p className="text-lg font-roboto text-[#000000]">
                右下のプラスボタンを押して画像を投稿しよう！
            </p>
            <p className="text-lg font-roboto text-[#000000]">
                気になった料理は画像をクリックしてそのままレシピを参照することも可能！！
            </p>
            </section>

            <div className="flex flex-col items-center mb-8">
            <img
            src="./images/modal.png"
            alt="how to modal"
            className="w-[500px] h-[500px] mb-4"
            />
            </div>
        

            <section className="mb-8">
            <h3 className="text-4xl font-roboto text-[#000000] mb-2">・search</h3>
            <p className="text-lg font-roboto text-[#000000]">
                ここでは自分が持っている画像をアップロードすることでAIが自動的に料理を判断してレシピを提案してくれます!
            </p>
            <p className="text-lg font-roboto text-[#000000]">
                もし上手くできたら是非homeから投稿してみてね!
            </p>
            </section>
            <section>
            <h3 className="text-4xl font-roboto text-[#000000] mb-2">・about</h3>
            <p className="text-lg font-roboto text-[#000000]">
                このページだよ！このアプリの使い方を説明しています！
            </p>
            </section>
      </div>
    </div>
    </div>
  );
}

export default MainComponent;