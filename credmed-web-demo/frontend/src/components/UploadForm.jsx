import React, { useState } from 'react';
import client from '../api/client';
import { Upload, FileText, Play } from 'lucide-react';

export default function UploadForm({ onJobCreated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSample = async () => {
      const res = await client.get('/sample');
      const blob = new Blob([res.data.csv_content], { type: 'text/csv' });
      setFile(new File([blob], "demo.csv", { type: "text/csv" }));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await client.post('/validate', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      onJobCreated(res.data.id);
    } catch (e) { alert("Error"); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">New Validation Job</h2>
          <p className="text-gray-600">Upload a CSV file with healthcare provider data to begin validation</p>
        </div>
        
        <div className="mb-8">
          <label className="block mb-4">
            <div className={`relative p-8 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${
              file 
                ? 'border-teal-500 bg-teal-50' 
                : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/50'
            }`}>
              <Upload className={`mx-auto h-16 w-16 mb-4 ${file ? 'text-teal-600' : 'text-gray-400'}`} />
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {file ? file.name : 'Click to upload or drag and drop'}
              </div>
              <div className="text-sm text-gray-500">CSV files only</div>
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={loadSample} 
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-gray-700"
          >
            <FileText size={20}/> 
            Load Demo Data
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!file || loading} 
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Play size={20}/> 
            {loading ? "Starting..." : "Start Validation"}
          </button>
        </div>
        
        {file && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <FileText className="text-green-600" size={20} />
            <span className="text-green-700 font-medium">File selected: {file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
