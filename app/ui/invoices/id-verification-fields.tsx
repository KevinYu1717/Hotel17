import { IdentificationIcon, CalendarIcon, FlagIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { InvoiceForm } from '@/app/lib/definitions';

export default function IDVerificationFields({ invoice }: { invoice?: InvoiceForm }) {
  return (
    <div className="rounded-md bg-gray-50 p-4 space-y-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">ID/Passport Verification</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="id_document_type" className="mb-2 block text-sm font-medium">
            Document Type
          </label>
          <div className="relative">
            <select
              id="id_document_type"
              name="id_document_type"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice?.id_document_type}
            >
              <option value="" disabled>Select document type</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
              <option value="residence_permit">Residence Permit</option>
            </select>
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="id_number" className="mb-2 block text-sm font-medium">
            Document Number
          </label>
          <div className="relative">
            <input
              id="id_number"
              name="id_number"
              type="text"
              defaultValue={invoice?.id_number}
              placeholder="Enter document number"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="id_expiration_date" className="mb-2 block text-sm font-medium">
            Expiration Date
          </label>
          <div className="relative">
            <input
              id="id_expiration_date"
              name="id_expiration_date"
              type="date"
              defaultValue={invoice?.id_expiration_date}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="id_issuing_country" className="mb-2 block text-sm font-medium">
            Issuing Country
          </label>
          <div className="relative">
            <input
              id="id_issuing_country"
              name="id_issuing_country"
              type="text"
              defaultValue={invoice?.id_issuing_country}
              placeholder="e.g., USA, Canada, UK"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <FlagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="id_issuing_authority" className="mb-2 block text-sm font-medium">
          Issuing Authority
        </label>
        <div className="relative">
          <input
            id="id_issuing_authority"
            name="id_issuing_authority"
            type="text"
            defaultValue={invoice?.id_issuing_authority}
            placeholder="e.g., DMV, Passport Office, Government Agency"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center bg-green-50 p-3 rounded-md border border-green-200">
        <input
          id="id_verified"
          name="id_verified"
          type="checkbox"
          defaultChecked={invoice?.id_verified}
          className="h-4 w-4 cursor-pointer border-green-300 bg-green-100 text-green-600 focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="id_verified" className="ml-2 cursor-pointer text-sm font-medium text-green-800">
          ✅ ID/Passport verification completed - Document is valid and matches guest identity
        </label>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <p>⚠️ Important: Please verify that:</p>
        <ul className="list-disc ml-4 mt-1 space-y-1">
          <li>Document is not expired</li>
          <li>Photo matches the guest</li>
          <li>Document appears genuine (no signs of tampering)</li>
          <li>All required fields are filled</li>
        </ul>
      </div>
    </div>
  );
}