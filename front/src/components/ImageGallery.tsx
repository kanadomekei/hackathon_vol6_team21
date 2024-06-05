import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
      {images.map((src, index) => (
        <div key={index} className="p-2">
          <div className="relative w-48 h-48">
            <Image src={src} alt={`image-${index}`} layout="fill" objectFit="cover" className="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}