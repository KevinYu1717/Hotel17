
import { UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function Facilities() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Hotel Facilities
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Breakfast Hall */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center pb-2">
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <h3 className="ml-2 text-sm font-medium text-gray-500">Breakfast Hall</h3>
            </div>
            <div className="h-32 w-full rounded-md bg-orange-100 flex items-center justify-center text-orange-500">
                [Breakfast Hall View]
            </div>
            <p className="mt-2 text-xs text-gray-500">Open: 6:00 AM - 10:00 AM</p>
          </div>

          {/* Gym */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center pb-2">
              <TrophyIcon className="h-5 w-5 text-gray-500" />
              <h3 className="ml-2 text-sm font-medium text-gray-500">Gym & Fitness</h3>
            </div>
             <div className="h-32 w-full rounded-md bg-blue-100 flex items-center justify-center text-blue-500">
                [Gym View]
            </div>
            <p className="mt-2 text-xs text-gray-500">Open: 24/7</p>
          </div>

        </div>
      </div>
    </div>
  );
}
