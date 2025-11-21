import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 flex align-center justify-center justify-items-center p-20">
      <div className="flex flex-col gap-10 justify-start w-65">
        <h1 className="text-4xl text-center">
          Find your fellow Chingus around the world
        </h1>
        <Link href="/map" className="self-center">
          <Button className="rounded-full text-lg px-6 py-5 bg-gray-600 text-white">
            Explore Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
