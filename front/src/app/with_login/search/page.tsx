"use client";
import React from "react";
import { useEffect, useState } from 'react';

function MainComponent() {

        const [file, setFile] = useState(null);
        const [response, setResponse] = useState(null);
          
        const handleFileChange = (event) => {
              setFile(event.target.files[0]);
            };
          
        const handleSubmit = async (event) => {
              event.preventDefault();
              if (!file) return;
          
              const formData = new FormData();
              formData.append('img', file);

    try {
      const res = await fetch('http://localhost:8080/ai/create_recipe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log(data)
      setResponse(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
   }
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <title>Search</title>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          アップロード
        </button>
      </form>
      {response && (
        <div className="mt-4">
          <p>{response.recipe_name}</p>
        </div>
      )}
    </div>
  );
  };
  export default MainComponent;

//   return (
//     <div className="flex flex-col items-center p-4">
//       <img
//         src="./images/saba.png"
//         alt="Grilled mackerel dish"
//         className="w-[300px] h-[200px] mb-4"
//       />

//       <div className="w-full max-w-[600px]">
//         <h2 className="font-bold text-lg mb-2">材料 (1人前)</h2>
//         <div className="border rounded p-2 mb-4">
//           <div className="flex justify-between mb-2">
//             <span className="font-medium">サバ (200g)</span>
//             <span className="font-medium">1切れ</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="font-medium">料理酒</span>
//             <span className="font-medium">大さじ2</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="font-medium">塩</span>
//             <span className="font-medium">少々</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="font-medium">大葉</span>
//             <span className="font-medium">1枚</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="font-medium">大根おろし</span>
//             <span className="font-medium">適量</span>
//           </div>
//         </div>

//         <h2 className="font-bold text-lg mb-2">作り方</h2>
//         <ol className="list-decimal pl-6">
//           <li className="mb-2">
//             サバは半分に切ります。1切れは十字に切り込みを入れ、残りは約3cmに2本の切り込みを入れます。
//           </li>
//           <li className="mb-2">
//             料理酒をかけて5分ほど置き、キッチンペーパーで水気を拭き取ります。
//           </li>
//           <li className="mb-2">
//             アルミホイルを敷いた天板に皮目を上にしてのせ、塩をふり、オーブントースターで10分ほど焼きます。
//           </li>
//           <li className="mb-2">
//             焼き目が付いたら、中央まで火が通ったら、大葉を敷いたお皿に盛り付け、大根おろしを添えて完成です。
//           </li>
//         </ol>
//       </div>
//     </div>
//   );


