import React, { FC, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface RecipeData {
  recipe_name: string;
  ingredients: Record<string, string>;
  cooking_process: string[];
}

const CombinedUpload: FC = () => {
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const uploadData = async (url: string, formData: FormData, errorMessage: string) => {
    setIsUploading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUserId = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8080/users/by-email/${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('ユーザーIDの取得に失敗しました');
      }
      const data = await response.json();
      return data.user_id;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleUploadRecipe = async () => {
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    const formData = new FormData();
    formData.append('img', file, file.name);

    const data = await uploadData('http://localhost:8080/ai/create_recipe', formData, 'レシピ生成に失敗しました');
    setRecipeData(data);
  };

  const handleFinalUpload = async () => {
    if (!file || !recipeData) {
      alert('ファイルまたはレシピデータがありません');
      return;
    }

    const email = session?.user?.email;
    const userId = email ? await fetchUserId(email) : null;
    console.log(userId);
    if (!userId) {
      alert('ユーザーIDの取得に失敗しました');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', recipeData.recipe_name);

    const responseData = await uploadData(`http://localhost:8080/posts?user_id=${userId}&caption=%E6%96%99%E7%90%86%E3%81%AE%E8%AA%AC%E6%98%8E`, formData, '最終アップロードに失敗しました');
    if (responseData) {

      console.log(recipeData);
      console.log(JSON.stringify(recipeData, null, 2));

      // recipeデータをjson形式に変換した後、APIに送信
      const jsonResponse = await fetch('http://localhost:8080/recipes?post_id=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!jsonResponse.ok) {
        throw new Error('レシピデータの送信に失敗しました');
      }
      alert('アップロード成功！');
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
          onClick={handleUploadRecipe}
          disabled={isUploading}
        >
          {isUploading ? 'レシピ生成中...' : 'レシピ生成'}
        </button>
        {recipeData && (
          <div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mt-4">レシピ名</h2>
              <p className="text-xl font-semibold text-gray-900">{recipeData.recipe_name}</p>
              <h2 className="text-lg font-semibold text-gray-700 mt-4">原材料</h2>
              <ul className="list-disc pl-5">
                {Object.entries(recipeData.ingredients).map(([ingredient, quantity]) => (
                  <li key={ingredient} className="text-lg text-gray-900">{`${ingredient}: ${quantity}`}</li>
                ))}
              </ul>
              <h2 className="text-lg font-semibold text-gray-700 mt-4">調理工程</h2>
              <p className="text-xl font-semibold text-gray-900">{recipeData.cooking_process}</p>
            </div>  
            <button
              className="w-full py-3 mt-4 bg-green-500 text-white rounded-lg font-roboto font-semibold transition duration-200 ease-in-out hover:bg-green-400"
              onClick={handleFinalUpload}
              disabled={isUploading}
            >
              {isUploading ? 'アップロード中...' : 'アップロード'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CombinedUpload;