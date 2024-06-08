import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentIndex(null);
  };

  const showNextImage = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex + 1) % images.length);
    }
  };

  const showPrevImage = () => {
    if (currentIndex !== null) {
      setCurrentIndex((currentIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
        {images.map((src, index) => (
          <div key={index} className="p-2">
            <div className="relative w-48 h-48">
              <Image
                src={src}
                alt={`image-${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => openModal(index)}
              />
            </div>
          </div>
        ))}
      </div>

      {isOpen && currentIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="relative w-3/4 h-3/4 flex items-center justify-center" // 親要素を中央に配置するためのスタイリングを追加
          >
            <div
              className="flex items-center justify-center" // fullの指定削除
              onClick={(e) => e.stopPropagation()} // 追加
            >
              <Link href={`/recipes/${currentIndex}`}>
                <Image
                  src={images[currentIndex]}
                  alt={`Selected image ${currentIndex}`}
                  layout="instrinsic"
                  width={500}
                  height={500}
                  objectFit="contain"
                  className="cursor-pointer"
                />
              </Link>
            </div>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={(e) => {
                    e.stopPropagation(); // 追加
                    showPrevImage();
                  }}
              >
              &lt;
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={(e) => {
                    e.stopPropagation(); // 追加
                    showNextImage();
                  }}
              >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}