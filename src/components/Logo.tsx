'use client';
import Image from 'next/image';
import { useUIView } from '@/stores/useUIViewStore';

function Logo() {
  const { showHomeView } = useUIView();

  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={100}
      height={100}
      loading="eager"
      onClick={showHomeView}
    />
  );
}

export default Logo;
