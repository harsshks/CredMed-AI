from typing import Optional, List
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
