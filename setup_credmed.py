import os
import sys

# Define the project structure and file contents
PROJECT_NAME = "credmed-web-demo"

file_contents = {
    # ---------------------------------------------------------
    # BACKEND FILES
    # ---------------------------------------------------------
    f"{PROJECT_NAME}/backend/requirements.txt": 
"""fastapi>=0.100.0
uvicorn>=0.22.0
sqlmodel>=0.0.8
pydantic>=2.0.0
python-multipart
pandas
httpx
pytest
""",

    f"{PROJECT_NAME}/backend/Dockerfile": 
"""FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",

    f"{PROJECT_NAME}/backend/app/__init__.py": "",
    f"{PROJECT_NAME}/backend/app/api/__init__.py": "",
    f"{PROJECT_NAME}/backend/app/models/__init__.py": "",
    f"{PROJECT_NAME}/backend/app/services/__init__.py": "",

    f"{PROJECT_NAME}/backend/app/models/schemas.py": 
"""from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class Job(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    status: str = Field(default="pending") 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_records: int = 0
    processed_records: int = 0
    log: str = ""

class ProviderInput(SQLModel):
    first_name: str
    last_name: str
    npi: str
    license_number: str
    address: str
    specialty: str

class FieldCheck(SQLModel):
    field: str
    status: str
    message: str
    source_stub: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ValidationReport(SQLModel):
    provider_input: ProviderInput
    confidence_score: float
    risk_level: str
    field_checks: List[FieldCheck]
    audit_trail: List[str]

class JobStatusResponse(SQLModel):
    job_id: str
    status: str
    progress: int
    logs: List[str]
""",

    f"{PROJECT_NAME}/backend/app/db.py": 
"""from sqlmodel import SQLModel, create_engine, Session

sqlite_file_name = "credmed.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
""",

    f"{PROJECT_NAME}/backend/app/external_stubs.py": 
"""import time

def stub_npi_registry(npi: str):
    time.sleep(0.3)
    if npi.startswith("99") or len(npi) != 10:
        return {"valid": False, "details": "NPI not found/invalid"}
    if npi == "1234567899":
        return {"valid": True, "active": False, "details": "Provider Suspended"}
    return {"valid": True, "active": True, "details": "Active NPI record found"}

def stub_state_license_board(license_num: str):
    time.sleep(0.4)
    if license_num.lower().startswith("exp"):
        return {"valid": True, "status": "EXPIRED"}
    if len(license_num) < 5:
        return {"valid": False, "status": "NOT_FOUND"}
    return {"valid": True, "status": "ACTIVE"}

def stub_google_maps_geocode(address: str):
    time.sleep(0.2)
    if not address or len(address) < 10:
        return {"valid": False, "match_type": "NONE"}
    if "PO BOX" in address.upper():
        return {"valid": True, "match_type": "PO_BOX_WARNING"}
    return {"valid": True, "match_type": "ROOFTOP"}

def stub_sanctions_check(npi: str):
    time.sleep(0.1)
    if npi == "1111111111":
        return {"sanctioned": True, "reason": "Fraud"}
    return {"sanctioned": False}
""",

    f"{PROJECT_NAME}/backend/app/services/validator.py": 
"""from app.models.schemas import ProviderInput, ValidationReport, FieldCheck
from app.external_stubs import *
from datetime import datetime

class ValidatorService:
    def validate_provider(self, provider: ProviderInput) -> ValidationReport:
        checks = []
        audit_log = [f"Started validation for {provider.npi} at {datetime.now()}"]
        score = 100

        # NPI
        npi_res = stub_npi_registry(provider.npi)
        if not npi_res["valid"]:
            score -= 40
            checks.append(FieldCheck(field="npi", status="FAIL", message=npi_res["details"], source_stub="NPPES"))
        elif not npi_res.get("active", True):
            score -= 40
            checks.append(FieldCheck(field="npi", status="FAIL", message="NPI Inactive", source_stub="NPPES"))
        else:
            checks.append(FieldCheck(field="npi", status="PASS", message="Active", source_stub="NPPES"))

        # Sanctions
        sanc_res = stub_sanctions_check(provider.npi)
        if sanc_res["sanctioned"]:
            score = 0
            checks.append(FieldCheck(field="sanctions", status="FAIL", message=f"Sanctioned: {sanc_res['reason']}", source_stub="OIG"))
        else:
            checks.append(FieldCheck(field="sanctions", status="PASS", message="Clean", source_stub="OIG"))

        # License
        lic_res = stub_state_license_board(provider.license_number)
        if not lic_res["valid"]:
            score -= 30
            checks.append(FieldCheck(field="license", status="FAIL", message="Not Found", source_stub="STATE"))
        elif lic_res["status"] != "ACTIVE":
            score -= 20
            checks.append(FieldCheck(field="license", status="WARN", message=lic_res["status"], source_stub="STATE"))
        else:
            checks.append(FieldCheck(field="license", status="PASS", message="Active", source_stub="STATE"))

        # Address
        addr_res = stub_google_maps_geocode(provider.address)
        if not addr_res["valid"]:
            score -= 10
            checks.append(FieldCheck(field="address", status="FAIL", message="Invalid", source_stub="MAPS"))
        elif addr_res["match_type"] == "PO_BOX_WARNING":
            score -= 5
            checks.append(FieldCheck(field="address", status="WARN", message="PO Box Detected", source_stub="MAPS"))
        else:
            checks.append(FieldCheck(field="address", status="PASS", message="Verified", source_stub="MAPS"))

        final_score = max(0, score)
        risk = "HIGH" if final_score < 60 else "MEDIUM" if final_score < 85 else "LOW"
        audit_log.append(f"Completed. Score: {final_score}")

        return ValidationReport(
            provider_input=provider,
            confidence_score=final_score,
            risk_level=risk,
            field_checks=checks,
            audit_trail=audit_log
        )
""",

    f"{PROJECT_NAME}/backend/app/background_worker.py": 
"""import pandas as pd
import io
import time
from sqlmodel import Session
from app.db import engine
from app.models.schemas import Job, ProviderInput
from app.services.validator import ValidatorService

job_results_store = {} 

def process_csv_upload(job_id: str, file_contents: bytes):
    with Session(engine) as session:
        job = session.get(Job, job_id)
        if not job: return
        
        try:
            job.status = "processing"
            job.log += "Reading CSV...\\n"
            session.add(job); session.commit()

            df = pd.read_csv(io.BytesIO(file_contents))
            job.total_records = len(df)
            job.log += f"Processing {len(df)} records...\\n"
            session.add(job); session.commit()

            validator = ValidatorService()
            results = []

            for i, row in df.iterrows():
                try:
                    p = ProviderInput(
                        first_name=str(row.get('first_name', '')),
                        last_name=str(row.get('last_name', '')),
                        npi=str(row.get('npi', '')),
                        license_number=str(row.get('license_number', '')),
                        address=str(row.get('address', '')),
                        specialty=str(row.get('specialty', ''))
                    )
                    results.append(validator.validate_provider(p))
                    job.processed_records = i + 1
                    session.add(job); session.commit()
                    time.sleep(0.5) 
                except Exception as e:
                    job.log += f"Row {i} error: {e}\\n"

            job_results_store[job_id] = results
            job.status = "completed"
            job.log += "Done.\\n"
            session.add(job); session.commit()
        except Exception as e:
            job.status = "failed"
            job.log += f"Critical Error: {e}"
            session.add(job); session.commit()
""",

    f"{PROJECT_NAME}/backend/app/api/routes.py": 
"""from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, HTTPException
from sqlmodel import Session
from typing import List
from app.db import get_session
from app.models.schemas import Job, JobStatusResponse, ValidationReport
from app.background_worker import process_csv_upload, job_results_store

router = APIRouter()

@router.post("/validate", response_model=Job)
async def validate_file(bg: BackgroundTasks, file: UploadFile = File(...), session: Session = Depends(get_session)):
    job = Job()
    session.add(job); session.commit(); session.refresh(job)
    content = await file.read()
    bg.add_task(process_csv_upload, job.id, content)
    return job

@router.get("/status/{job_id}", response_model=JobStatusResponse)
def get_status(job_id: str, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job: raise HTTPException(404)
    prog = int((job.processed_records / job.total_records) * 100) if job.total_records > 0 else 0
    return JobStatusResponse(job_id=job.id, status=job.status, progress=prog, logs=job.log.split('\\n'))

@router.get("/report/{job_id}", response_model=List[ValidationReport])
def get_report(job_id: str):
    return job_results_store.get(job_id, [])

@router.get("/sample")
def get_sample():
    return {"csv_content": "first_name,last_name,npi,license_number,address,specialty\\nJames,Smith,1234567890,A12345,123 Main St Los Angeles CA,Cardiology\\nMaria,Garcia,1111111111,B98765,456 Oak Ave New York NY,Dermatology\\nJohn,Doe,9999999999,EXP123,PO BOX 123 Phoenix AZ,General"}
""",

    f"{PROJECT_NAME}/backend/app/main.py": 
"""from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import create_db_and_tables
from app.api import routes
import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="CredMed", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(routes.router, prefix="/api")
""",

    # ---------------------------------------------------------
    # FRONTEND FILES
    # ---------------------------------------------------------
    f"{PROJECT_NAME}/frontend/package.json": 
"""{
  "name": "credmed-frontend",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}
""",

    f"{PROJECT_NAME}/frontend/vite.config.js": 
"""import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
})
""",

    f"{PROJECT_NAME}/frontend/tailwind.config.js": 
"""export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
""",

    f"{PROJECT_NAME}/frontend/postcss.config.js": 
"""export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""",

    f"{PROJECT_NAME}/frontend/index.html": 
"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CredMed AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""",

    f"{PROJECT_NAME}/frontend/src/index.css": 
"""@tailwind base;
@tailwind components;
@tailwind utilities;
""",

    f"{PROJECT_NAME}/frontend/src/main.jsx": 
"""import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
""",

    f"{PROJECT_NAME}/frontend/src/api/client.js": 
"""import axios from 'axios';
const client = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});
export default client;
""",

    f"{PROJECT_NAME}/frontend/src/components/UploadForm.jsx": 
"""import React, { useState } from 'react';
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
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6">New Validation Job</h2>
      <div className="mb-6 p-6 border-2 border-dashed rounded-lg text-center bg-gray-50">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-slate-500"/>
      </div>
      <div className="flex gap-4">
        <button onClick={loadSample} className="flex-1 flex items-center justify-center gap-2 py-2 border rounded hover:bg-gray-50"><FileText size={18}/> Load Demo Data</button>
        <button onClick={handleSubmit} disabled={!file || loading} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"><Play size={18}/> {loading?"Starting...":"Start"}</button>
      </div>
    </div>
  );
}
""",

    f"{PROJECT_NAME}/frontend/src/components/JobStatus.jsx": 
"""import React, { useEffect, useState, useRef } from 'react';
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

  if (!status) return <div>Initializing...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border">
      <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Processing...</h2><span>{status.status.toUpperCase()}</span></div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6"><div className="bg-blue-600 h-4 rounded-full transition-all" style={{width: `${status.progress}%`}}></div></div>
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto" ref={logRef}>
        {status.logs.map((l, i) => <div key={i}>{'>'} {l}</div>)}
      </div>
    </div>
  );
}
""",

    f"{PROJECT_NAME}/frontend/src/components/ReportView.jsx": 
"""import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ShieldCheck, AlertTriangle, XCircle, Download } from 'lucide-react';

export default function ReportView({ jobId, onReset }) {
  const [data, setData] = useState([]);
  useEffect(() => { client.get(`/report/${jobId}`).then(res => setData(res.data)); }, [jobId]);

  const download = () => {
    const link = document.createElement("a");
    link.href = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    link.download = "report.json";
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Report</h1>
        <div className="flex gap-3"><button onClick={onReset} className="px-4 py-2">New Scan</button><button onClick={download} className="flex gap-2 bg-slate-800 text-white px-4 py-2 rounded"><Download size={18}/> JSON</button></div>
      </div>
      <div className="grid gap-6">
        {data.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex justify-between">
              <div><h3 className="font-bold text-lg">{item.provider_input.first_name} {item.provider_input.last_name}</h3><p className="text-sm text-gray-500">{item.provider_input.npi}</p></div>
              <div className={`text-2xl font-bold ${item.confidence_score>80?'text-green-600':item.confidence_score>50?'text-yellow-600':'text-red-600'}`}>{item.confidence_score}/100</div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Checks</h4>
                {item.field_checks.map((c, j) => (
                  <div key={j} className="flex justify-between p-2 bg-gray-50 border mb-2 rounded">
                    <div className="flex gap-2 items-center">
                        {c.status==='PASS'?<ShieldCheck size={16} className="text-green-500"/>:c.status==='WARN'?<AlertTriangle size={16} className="text-yellow-500"/>:<XCircle size={16} className="text-red-500"/>}
                        <span className="text-sm font-medium">{c.field}</span>
                    </div>
                    <span className="text-xs text-gray-500">{c.message}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm font-mono bg-slate-50 p-3 h-40 overflow-y-auto text-slate-600">{item.audit_trail.map((l,k)=><div key={k}>{l}</div>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
""",

    f"{PROJECT_NAME}/frontend/src/App.jsx": 
"""import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import JobStatus from './components/JobStatus';
import ReportView from './components/ReportView';

function App() {
  const [view, setView] = useState('upload'); 
  const [jobId, setJobId] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-4"><span className="text-xl font-bold">CredMed AI</span></nav>
      <main className="container mx-auto px-4">
        {view === 'upload' && <UploadForm onJobCreated={(id) => { setJobId(id); setView('processing'); }} />}
        {view === 'processing' && <JobStatus jobId={jobId} onComplete={() => setView('report')} />}
        {view === 'report' && <ReportView jobId={jobId} onReset={() => setView('upload')} />}
      </main>
    </div>
  );
}
export default App;
""",

    f"{PROJECT_NAME}/frontend/Dockerfile": 
"""FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
""",

    f"{PROJECT_NAME}/docker-compose.yml": 
"""version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    volumes: ["./backend:/app"]
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    volumes: ["./frontend:/app"]
    environment:
      - CHOKIDAR_USEPOLLING=true
""",
    
    f"{PROJECT_NAME}/README.md":
"""# CredMed AI Demo
## Running Locally
1. **Backend**: `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
2. **Frontend**: `cd frontend && npm install && npm run dev`
3. **Open**: http://localhost:5173

## Docker
`docker-compose up --build`
""",
    
    f"{PROJECT_NAME}/sample_data/providers_demo.csv":
"""first_name,last_name,npi,license_number,address,specialty
James,Smith,1234567890,A12345,123 Main St Los Angeles CA,Cardiology
Maria,Garcia,1111111111,B98765,456 Oak Ave New York NY,Dermatology
John,Doe,9999999999,EXP123,PO BOX 123 Phoenix AZ,General
Suspicious,Actor,1234567899,C55555,789 Bad Way Chicago IL,Surgery
"""
}

def create_project():
    print(f"Creating project: {PROJECT_NAME}...")
    for path, content in file_contents.items():
        dir_name = os.path.dirname(path)
        if dir_name:
            os.makedirs(dir_name, exist_ok=True)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  + {path}")
    
    print("\nDone! To run the demo:")
    print(f"1. cd {PROJECT_NAME}")
    print("2. Run backend: (cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload)")
    print("3. Run frontend: (cd frontend && npm install && npm run dev)")

if __name__ == "__main__":
    create_project()