import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ShieldCheck, AlertTriangle, XCircle, Download, FileText } from 'lucide-react';

export default function ReportView({ jobId, onReset }) {
  const [data, setData] = useState([]);
  useEffect(() => { client.get(`/report/${jobId}`).then(res => setData(res.data)); }, [jobId]);

  const download = () => {
    const link = document.createElement("a");
    link.href = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    link.download = "report.json";
    link.click();
  };

  const exportPdf = () => {
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }

    const rowsHtml = data.map((item, index) => {
      const passCount = item.field_checks.filter((c) => c.status === 'PASS').length;
      const warnCount = item.field_checks.filter((c) => c.status === 'WARN').length;
      const failCount = item.field_checks.filter((c) => c.status === 'FAIL').length;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.provider_input.first_name} ${item.provider_input.last_name}</td>
          <td>${item.provider_input.npi}</td>
          <td>${item.confidence_score}</td>
          <td>${passCount}</td>
          <td>${warnCount}</td>
          <td>${failCount}</td>
        </tr>
      `;
    }).join('');

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>CredMed AI - Validation Report</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 24px;
              color: #0f172a;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 4px;
            }
            p {
              margin-top: 0;
              margin-bottom: 16px;
              color: #64748b;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 8px 10px;
              font-size: 12px;
              text-align: left;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .summary {
              display: flex;
              gap: 16px;
              margin-top: 12px;
              font-size: 13px;
            }
            .badge {
              padding: 4px 10px;
              border-radius: 999px;
              background-color: #e0f2f1;
              color: #0f766e;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <h1>CredMed AI - Validation Report</h1>
          <p>Export of validation results for job <strong>${jobId}</strong>.</p>
          <div class="summary">
            <span class="badge">Total records: ${data.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Provider Name</th>
                <th>NPI</th>
                <th>Confidence</th>
                <th>Pass</th>
                <th>Warn</th>
                <th>Fail</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  const totalRecords = data.length;
  const highConfidence = data.filter(item => item.confidence_score > 80).length;
  const mediumConfidence = data.filter(item => item.confidence_score > 50 && item.confidence_score <= 80).length;
  const lowConfidence = data.filter(item => item.confidence_score <= 50).length;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Validation Report</h1>
            <p className="text-gray-600">Comprehensive analysis of your healthcare provider data</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onReset} 
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-gray-700"
            >
              New Validation
            </button>
            <button 
              onClick={download} 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Download size={18}/> 
              Download JSON
            </button>
            <button 
              onClick={exportPdf} 
              className="flex items-center gap-2 px-6 py-3 bg-white text-teal-700 border-2 border-teal-500 rounded-lg hover:bg-teal-50 transition-all shadow-sm hover:shadow-md font-semibold"
            >
              <FileText size={18}/> 
              Export PDF
            </button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <div className="text-2xl font-bold text-teal-600">{totalRecords}</div>
            <div className="text-sm text-gray-600 font-medium">Total Records</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{highConfidence}</div>
            <div className="text-sm text-gray-600 font-medium">High Confidence</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{mediumConfidence}</div>
            <div className="text-sm text-gray-600 font-medium">Medium Confidence</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{lowConfidence}</div>
            <div className="text-sm text-gray-600 font-medium">Low Confidence</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {data.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className={`p-6 border-b flex justify-between items-start ${
              item.confidence_score > 80 ? 'bg-green-50 border-green-200' :
              item.confidence_score > 50 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-1">
                  {item.provider_input.first_name} {item.provider_input.last_name}
                </h3>
                <p className="text-sm text-gray-600">NPI: {item.provider_input.npi}</p>
              </div>
              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${
                item.confidence_score > 80 ? 'text-green-700 bg-green-100' :
                item.confidence_score > 50 ? 'text-yellow-700 bg-yellow-100' :
                'text-red-700 bg-red-100'
              }`}>
                {item.confidence_score}/100
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-900">Field Validation Checks</h4>
                <div className="space-y-2">
                  {item.field_checks.map((c, j) => (
                    <div key={j} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex gap-3 items-center">
                        {c.status === 'PASS' ? (
                          <ShieldCheck size={20} className="text-green-500 flex-shrink-0"/>
                        ) : c.status === 'WARN' ? (
                          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0"/>
                        ) : (
                          <XCircle size={20} className="text-red-500 flex-shrink-0"/>
                        )}
                        <span className="text-sm font-semibold text-gray-900">{c.field}</span>
                      </div>
                      <span className="text-xs text-gray-600 text-right max-w-[200px]">{c.message}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-900">Audit Trail</h4>
                <div className="text-sm font-mono bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-4 rounded-lg h-64 overflow-y-auto shadow-inner">
                  <div className="space-y-1">
                    {item.audit_trail.map((l, k) => (
                      <div key={k} className="flex items-start gap-2">
                        <span className="text-green-500">›</span>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
