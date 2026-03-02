import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import AddCustomerForm from './add-customer-form';

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || '';
  const initialCustomers = await fetchFilteredCustomers(query);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Guests</h1>
        <AddCustomerForm />
      </div>
      <CustomersTable customers={initialCustomers} />
    </div>
  );
}