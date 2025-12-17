from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, HTTPException
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
    return JobStatusResponse(job_id=job.id, status=job.status, progress=prog, logs=job.log.split('\n'))

@router.get("/report/{job_id}", response_model=List[ValidationReport])
def get_report(job_id: str):
    return job_results_store.get(job_id, [])

@router.get("/sample")
def get_sample():
    return {"csv_content": "first_name,last_name,npi,license_number,address,specialty\nJames,Smith,1234567890,A12345,123 Main St Los Angeles CA,Cardiology\nMaria,Garcia,1111111111,B98765,456 Oak Ave New York NY,Dermatology\nJohn,Doe,9999999999,EXP123,PO BOX 123 Phoenix AZ,General"}
