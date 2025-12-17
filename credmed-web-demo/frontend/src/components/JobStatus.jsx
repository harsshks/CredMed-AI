import React, { useEffect, useState, useRef } from 'react';
import client from '../api/client';
import { Loader2 } from 'lucide-react';

export default function JobStatus({ jobId, onComplete }) {
  const [status, setStatus] = useState(null);
  const logRef = useRef(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await client.get(`/status/${jobId}`);
      setStatus(res.data);
      if (res.data.status === 'completed' || res.data.status === 'failed') {
        clearInterval(poll);
        setTimeout(() => onComplete(), 1000);
      }
    }, 1000);
    return () => clearInterval(poll);
  }, [jobId]);

  useEffect(() => { if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [status?.logs]);

  if (!status) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Initializing validation job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Processing Validation</h2>
            <p className="text-gray-600">Your healthcare provider data is being validated by our AI agents</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            status.status === 'completed' ? 'bg-green-100 text-green-700' :
            status.status === 'failed' ? 'bg-red-100 text-red-700' :
            'bg-teal-100 text-teal-700'
          }`}>
            {status.status.toUpperCase()}
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{status.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                status.status === 'completed' ? 'bg-green-500' :
                status.status === 'failed' ? 'bg-red-500' :
                'bg-gradient-to-r from-teal-500 to-teal-600'
              }`}
              style={{width: `${status.progress}%`}}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-6 rounded-xl font-mono text-sm h-80 overflow-y-auto shadow-inner" ref={logRef}>
          <div className="space-y-1">
            {status.logs.length > 0 ? (
              status.logs.map((l, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500">›</span>
                  <span>{l}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Waiting for logs...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
