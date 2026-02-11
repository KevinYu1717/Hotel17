import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

export default function Page() {
    return(
   <div>
    <form action="">
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <PlusIcon className="w-5" />
      </button>
      
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="hidden md:block">Create</span>{' '}
        <PlusIcon className="w-5" />
      </button>
    </form>
 <p>Room</p>
 
 <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
 <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
      />

    <div
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Room</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <Search placeholder="Search rooms..." />
        </Suspense>
        <CreateInvoice />
      </div>


<div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
       
      </p>
    </div>
    <div className="quote">
        <span className="text" >“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.”</span>
        <span>by <small className="author" >Albert Einstein</small>
        <a href="/author/Albert-Einstein">(about)</a>
        </span>
        
    </div>
</div>
);
}