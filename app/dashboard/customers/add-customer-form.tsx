'use client';

import { useState } from 'react';
import { createCustomer } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';

export default function AddCustomerForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<{
    errors?: {
      name?: string[];
      email?: string[];
      image_url?: string[];
    };
    message?: string | null;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createCustomer(undefined, formData);
    setFormState(result);
    if (result?.message && !result.errors) {
      // Reset form before closing
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(true)}>
        Add Guest
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg p-6 border border-gray-200 z-10">
          <h2 className="text-lg font-semibold mb-4">Add New Guest</h2>
          
          {formState.message && (
            <div className={`p-3 rounded-md ${formState.errors ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {formState.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="name" 
                name="name" 
                required 
                className={`w-full px-3 py-2 border rounded-md ${formState.errors?.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formState.errors?.name && (
                <p className="text-sm text-red-500">{formState.errors.name[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className={`w-full px-3 py-2 border rounded-md ${formState.errors?.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formState.errors?.email && (
                <p className="text-sm text-red-500">{formState.errors.email[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
              <input 
                id="image_url" 
                name="image_url" 
                className={`w-full px-3 py-2 border rounded-md ${formState.errors?.image_url ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formState.errors?.image_url && (
                <p className="text-sm text-red-500">{formState.errors.image_url[0]}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}