import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    document_type: str
    country: str
    form_data: Dict[str, Any]


class DocumentResponse(BaseModel):
    id: uuid.UUID
    document_type: str
    country: str
    status: str
    is_paid: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    total: int
