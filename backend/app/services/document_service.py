from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.user import User


def save_document(
    db: Session,
    user: User,
    document_type: str,
    country: str,
    form_data: Dict[str, Any],
) -> Document:
    doc = Document(
        user_id=user.id,
        document_type=document_type,
        country=country,
        form_data=form_data,
        status="generated",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def list_user_documents(db: Session, user: User) -> List[Document]:
    return (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
        .all()
    )


def get_document(db: Session, document_id: str, user: User) -> Document | None:
    return (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == user.id)
        .first()
    )
