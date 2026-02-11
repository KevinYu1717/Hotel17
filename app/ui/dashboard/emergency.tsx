
import { PhoneIcon, FireIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function EmergencyContacts() {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl text-red-600`}>
        Emergency & Contact
      </h2>
      <div className="rounded-xl bg-red-50 p-4 border border-red-100">
        <div className="space-y-4">
          
          <div className="flex items-center justify-between border-b border-red-200 pb-2">
            <div className="flex items-center text-red-700">
              <FireIcon className="mr-2 h-6 w-6" />
              <span className="font-bold">Emergency (Police/Fire/Medical)</span>
            </div>
            <a href="tel:911" className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">
              911
            </a>
          </div>

          <div className="flex items-center justify-between border-b border-red-200 pb-2">
            <div className="flex items-center text-gray-700">
              <PhoneIcon className="mr-2 h-5 w-5" />
              <span className="font-medium">Front Desk</span>
            </div>
            <a href="tel:100" className="text-blue-600 hover:underline">
              Ext. 100
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <PhoneIcon className="mr-2 h-5 w-5" />
              <span className="font-medium">Manager on Duty</span>
            </div>
             <a href="tel:101" className="text-blue-600 hover:underline">
              Ext. 101
            </a>
          </div>

        </div>
        <div className="mt-4 text-xs text-gray-500">
            * In case of emergency, please evacuate using the nearest stairs. Do not use elevators.
        </div>
      </div>
    </div>
  );
}
