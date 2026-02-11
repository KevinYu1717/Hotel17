import Image from 'next/image';
import CardWrapper from '@/app/ui/dashboard/cards';
export default function Page() {
    return(
   <div>
 <p>About</p>
  
<div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
       <Image
  src="/hotel17.png"
  width={0}
  height={0}
  style={{ width: '100%', height: 'auto' }}
  sizes="100vw"
  className="hidden md:block"
  alt="Screenshots of the dashboard project showing desktop version"
/>
      </p>
    </div>
</div>
);
}