'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CardIcon } from './CardIcons';

interface CardImageProps {
  imageUrl: string;
  type: string;
  alt: string;
  /** 이미지 있을 때 컨테이너에 추가할 클래스 */
  containerClassName?: string;
  /** SVG 폴백 컨테이너에 추가할 클래스 */
  iconClassName?: string;
}

export default function CardImage({
  imageUrl,
  type,
  alt,
  containerClassName = '',
  iconClassName = '',
}: CardImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center w-full h-full ${iconClassName}`}>
        <CardIcon type={type} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
