
'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { KeyIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function KeycardGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, processing, done

  const startProcess = () => {
    setIsOpen(true);
    setStatus('processing');
    setProgress(0);
    
    // Simulate frequency/writing process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('done');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatus('idle');
    setProgress(0);
  };

  return (
    <>
      <Button type="button" onClick={startProcess} className="bg-teal-600 hover:bg-teal-500">
        Prepare Keycard <KeyIcon className="ml-2 h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Keycard Writer</h2>
            
            {status === 'processing' && (
              <div className="space-y-4">
                <p className="text-gray-600">Writing frequency to card...</p>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className="h-full bg-teal-600 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Encoding...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {status === 'done' && (
              <div className="text-center">
                <div className="mb-4 flex justify-center text-green-500">
                  <KeyIcon className="h-16 w-16" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-green-700">Keycard Ready!</h3>
                <p className="text-gray-600">The keycard has been successfully encoded.</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={closeModal} className={clsx(status === 'done' ? "bg-green-600 hover:bg-green-500" : "bg-gray-500 hover:bg-gray-400")}>
                {status === 'done' ? 'Close' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
