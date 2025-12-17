import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import JobStatus from '../components/JobStatus';
import ReportView from '../components/ReportView';

export default function ValidatePage() {
  const [view, setView] = useState('upload'); 
  const [jobId, setJobId] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 py-8">
      <div className="container mx-auto px-6">
        {view === 'upload' && (
          <UploadForm 
            onJobCreated={(id) => { 
              setJobId(id); 
              setView('processing'); 
            }} 
          />
        )}
        {view === 'processing' && (
          <JobStatus 
            jobId={jobId} 
            onComplete={() => setView('report')} 
          />
        )}
        {view === 'report' && (
          <ReportView 
            jobId={jobId} 
            onReset={() => {
              setView('upload');
              setJobId(null);
            }} 
          />
        )}
      </div>
    </div>
  );
}

