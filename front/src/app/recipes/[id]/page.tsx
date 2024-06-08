"use client";
import { useEffect, useState, FC} from 'react';

interface Recipe {

}

export default async function Page({
  params,
}: {
  params: { id : number };
}) {
  
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/posts/`)
      .then(response => response.json())
      .then(data => setImages(data.map((item: Post) => item.image_url)))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
        this is {params.id}th receptだよ～
      </div>
    </>
  )
}
