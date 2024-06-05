"use client";
import ImageGallery from "@/components/ImageGallery"
import { useEffect, useState } from 'react';

interface Post {
  user_id: number;
  image_url: string;
  created_at: string;
  caption: string;
  id: number;
}

export default function Component() {

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/posts')
      .then(response => response.json())
      .then(data => setImages(data.map((item: Post) => item.image_url)))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleUpload = () => {
    // 画像アップロードのロジックをここに追加
    console.log("画像アップロードボタンがクリックされました");
  };

  return (
    <div className="flex relative">
      <ImageGallery images={images} />
    </div>
  )
}