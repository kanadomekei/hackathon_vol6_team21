"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Modal from '@/components/Modal';
import FloatingButton from '@/components/FloatingButton';
import Sidebar from '@/components/Sidebar';

interface Post {
  user_id: number;
  image_url: string;
  created_at: string;
  caption: string;
  id: number;
}

export default function Component() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:8080/posts');
        const data: Post[] = await response.json();
        setImages(data.map((item: Post) => item.image_url));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchImages();
  }, []);

  const handleUpload = () => {
    // 画像アップロードのロジックをここに追加
    console.log("画像アップロードボタンがクリックされました");
  };

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="ml-64"> {/* Sidebarの幅に合わせてマージンを追加 */}
       <div className="flex flex-wrap justify-start p-6 bg-white min-h-screen ml-64">
        <FloatingButton handleOpen={handleOpen} />
        <Modal isOpen={isOpen} handleClose={handleClose} />
        {/* {recipeData && (
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
              <p className="text-xl font-semibold text-gray-900">{recipeData.cooking_process.join(', ')}</p>
            </div>  
           </div>
          )} */}
          </div>
      </div>
    </div>
  );
}