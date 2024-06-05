"use client";
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Image from 'next/image';
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
        {images.map((src, index) => (
          <div key={index} className="p-2">
            <div className="relative w-48 h-48">
              <Image src={src} alt={`image-${index}`} layout="fill" objectFit="cover" className="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}