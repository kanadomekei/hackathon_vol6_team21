"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ImageGallery from "@/components/ImageGallery";
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
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(/images/orangeback.jpg)` }}
    >
    <div className="flex relative">
      <title>images</title>
      <Sidebar />
      <div className="ml-64"> {/* Sidebarの幅に合わせてマージンを追加 */}
        <ImageGallery images={images} />
        <FloatingButton handleOpen={handleOpen} />
        <Modal isOpen={isOpen} handleClose={handleClose} />
      </div>
    </div>
    </div>
  );
}