import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean[]>(Array(images.length).fill(false));
  const [likeCounts, setLikeCounts] = useState<number[]>(Array(images.length).fill(0));
  const [likeIds, setLikeIds] = useState<(number | null)[]>(Array(images.length).fill(null));
  const [isOpen, setIsOpen] = useState<boolean>(false); // isOpenの状態を追加

  useEffect(() => {
    if (currentIndex !== null) {
      fetchLikeData(currentIndex);
      fetchLikeCount(currentIndex);
    }
  }, [currentIndex]);

  const fetchLikeData = async (index: number) => {
    try {
      const email = session?.user?.email;
      console.log("email", email);
      const userId = email ? await fetchUserId(email) : null;
      console.log("userId", userId);

      const response = await fetch(`http://localhost:8080/likes/${index+1}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if(data.islike){
        setLikeIds(prevCounts => {
          const newCounts = [...prevCounts];
          newCounts[index] = data.id;
          return newCounts;
        });
        setIsLiked((prevLikedImages) => {
          const newLikedImages = [...prevLikedImages];
          newLikedImages[index] = true;
          return newLikedImages;
        });

      }} else {
        console.error(`Failed to fetch like count for index ${index}`);
      }
    } catch (error) {
      console.error(`Error fetching like count for index ${index}:`, error);
    }
  }

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

  const fetchLikeCount = async (index: number) => {
    try {
      const response = await fetch(`http://localhost:8080/likes/${index + 1}/count`);
      if (response.ok) {
        const data = await response.json();
        setLikeCounts(prevCounts => {
          const newCounts = [...prevCounts];
          newCounts[index] = data.likes_count;
          return newCounts;
        });
      } else {
        console.error(`Failed to fetch like count for index ${index}`);
      }
    } catch (error) {
      console.error(`Error fetching like count for index ${index}:`, error);
    }
  };

  const toggleLikeImage = async (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const email = session?.user?.email;
    console.log("email", email);
    const userId = email ? await fetchUserId(email) : null;
    console.log("userId", userId);

    try {
      if (isLiked[index]) {
        // いいね解除
        const likeId = likeIds[index];
        if (likeId !== null) {
          const response = await fetch(`http://localhost:8080/likes/${likeId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setIsLiked((prevLikedImages) => {
              const newLikedImages = [...prevLikedImages];
              newLikedImages[index] = false;
              return newLikedImages;
            });

            setLikeIds((prevLikeIds) => {
              const newLikeIds = [...prevLikeIds];
              newLikeIds[index] = null;
              return newLikeIds;
            });

            fetchLikeCount(index);
          } else {
            console.error(`Failed to delete like for index ${index}`);
          }
        }
      } else {
        // いいねする
        const response = await fetch(`http://localhost:8080/likes?post_id=${index + 1}&user_id=${userId}`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();

          setIsLiked((prevLikedImages) => {
            const newLikedImages = [...prevLikedImages];
            newLikedImages[index] = true;
            return newLikedImages;
          });

          setLikeIds((prevLikeIds) => {
            const newLikeIds = [...prevLikeIds];
            newLikeIds[index] = data.id;
            return newLikeIds;
          });

          fetchLikeCount(index);
        } else {
          console.error(`Failed to like for index ${index}`);
        }
      }
    } catch (error) {
      console.error(`Error toggling like for index ${index}:`, error);
    }
  };

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
      <div
      className="flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-cover"
    >
      <div className="flex flex-wrap justify-start p-6 min-h-screen ml-64">
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
              className="relative flex items-center justify-center" // fullの指定削除
              onClick={(e) => e.stopPropagation()} // 追加
            >
              <Link href={`recipes/${currentIndex + 1}`}>
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
              <button
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-16 py-8 rounded text-white text-3xl ${isLiked[currentIndex] ? 'bg-red-500' : 'bg-gray-500'}`}
                onClick={(e) => toggleLikeImage(e, currentIndex)}
              >
                {likeCounts[currentIndex]} {isLiked[currentIndex] ? 'Liked!' : 'Liked'}
              </button>
            </div>

            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 transform -translate-y-1/2 text-white text-2xl"
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
    </div>
  );
}