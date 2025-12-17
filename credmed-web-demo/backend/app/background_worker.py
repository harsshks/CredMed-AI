import pandas as pd
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
            job.log += "Reading CSV...\n"
            session.add(job); session.commit()

            df = pd.read_csv(io.BytesIO(file_contents))
            job.total_records = len(df)
            job.log += f"Processing {len(df)} records...\n"
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
                    job.log += f"Row {i} error: {e}\n"

            job_results_store[job_id] = results
            job.status = "completed"
            job.log += "Done.\n"
            session.add(job); session.commit()
        except Exception as e:
            job.status = "failed"
            job.log += f"Critical Error: {e}"
            session.add(job); session.commit()
