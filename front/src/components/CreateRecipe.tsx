import React, { FC, useState } from 'react';
import Image from 'next/image';
interface RecipeData {
  recipe_name: string;
  ingredients: Record<string, string>;
  cooking_process: string[];
}

const Upload: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const userId = 1; 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }
  
    const formData = new FormData();
    formData.append('img', file, file.name);
  
    setIsUploading(true);
  
    try {
      const response = await fetch('http://localhost:8080/ai/create_recipe', {
        method: 'POST',
        body: formData,
        headers: {
          'accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      setRecipeData(data);
    } catch (error) {
      console.error('Error:', error);
      setRecipeData(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-[500px] bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 font-roboto">
          料理の画像をアップロードして原材料と調理工程を知る
        </h1>
        <div className="flex flex-col items-center mb-4">
          <label className="flex flex-col items-center bg-[#f0f0f0] border border-gray-300 rounded-lg py-6 px-8 cursor-pointer w-full transition duration-200 ease-in-out hover:bg-[#e8e8e8]">
            <i className="fas fa-cloud-upload-alt text-6xl text-gray-600 mb-4"></i>
            <span className="font-semibold text-sm tracking-wide">
              クリックしてファイルを選択
            </span>
            <input
              type="file"
              className="hidden"
              name="imageUpload"
              onChange={handleFileChange}
            />
          </label>
        </div>
        {selectedImage && (
          <div className="flex justify-center mb-4">
            <Image
              src={selectedImage}
              alt="Selected preview"
              width={300}
              height={300}
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <button
          className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg font-roboto font-semibold transition duration-200 ease-in-out hover:bg-blue-400"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'アップロード中...' : 'アップロード'}
        </button>
        {recipeData && (
          <div className="mt-4 text-center text-lg text-gray-700">
            <h2 className="text-xl font-bold mb-2">{recipeData.recipe_name}</h2>
            <h3 className="text-lg font-semibold mb-2">材料</h3>
            <ul className="list-disc list-inside mb-4">
              {Object.entries(recipeData.ingredients).map(([ingredient, amount]) => (
                <li key={ingredient}>{ingredient}: {amount}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-2">調理工程</h3>
            <ol className="list-decimal list-inside">
              {recipeData.cooking_process.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
      `}</style>
    </div>
  );
};

export default Upload;


