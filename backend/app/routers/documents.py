from typing import Any, Dict, Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.services.generator_service import generate_document
from app.services.document_service import save_document, list_user_documents, get_document

router = APIRouter()


class GeneratePreviewRequest(BaseModel):
    document_type: Literal["cdi", "cdd", "nda", "prestation", "pacte_associes"]
    country: Literal["CI", "SN"]
    form_data: Dict[str, Any]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "document_type": "cdi",
                    "country": "CI",
                    "form_data": {
                        "employer_name": "Société ABC SARL",
                        "employer_address": "123 Avenue du Commerce, Abidjan Plateau",
                        "employer_rccm": "CI-ABJ-2020-B-12345",
                        "employer_representative": "M. Kouassi Ange, Directeur Général",
                        "employee_name": "Traoré Marie",
                        "employee_address": "Résidence Les Lauriers, Cocody, Abidjan",
                        "employee_birth_date": "15 mai 1992",
                        "employee_birth_place": "Abidjan",
                        "employee_nationality": "Ivoirienne",
                        "job_title": "Responsable Comptabilité",
                        "job_category": "cadre",
                        "salary": 450000,
                        "work_location": "Abidjan, Plateau",
                        "start_date": "1er juillet 2026",
                        "trial_period_months": 6,
                        "signature_date": "12 juin 2026",
                        "signature_place": "Abidjan",
                    },
                }
            ]
        }
    }


@router.post(
    "/generate-preview",
    summary="Aperçu sans compte (avec filigrane)",
    description="Génère un .docx avec filigrane APERÇU. Pas d'authentification requise.",
)
async def generate_preview(request: GeneratePreviewRequest):
    try:
        buffer, filename = generate_document(
            document_type=request.document_type,
            country=request.country,
            form_data=request.form_data,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers,
    )


@router.post(
    "/generate",
    summary="Générer et sauvegarder (compte requis)",
    response_model=DocumentResponse,
    status_code=201,
)
async def generate_and_save(
    request: GeneratePreviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        generate_document(
            document_type=request.document_type,
            country=request.country,
            form_data=request.form_data,
        )
    except (FileNotFoundError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    doc = save_document(
        db=db,
        user=current_user,
        document_type=request.document_type,
        country=request.country,
        form_data=request.form_data,
    )
    return doc


@router.get(
    "/",
    summary="Lister mes documents",
    response_model=DocumentListResponse,
)
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    docs = list_user_documents(db, current_user)
    return DocumentListResponse(documents=docs, total=len(docs))


@router.get(
    "/{document_id}/download",
    summary="Télécharger un document sauvegardé",
)
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = get_document(db, document_id, current_user)
    if not doc:
        raise HTTPException(status_code=404, detail="Document introuvable")

    try:
        buffer, filename = generate_document(
            document_type=doc.document_type,
            country=doc.country,
            form_data=doc.form_data,
        )
    except (FileNotFoundError, ValueError) as e:
        raise HTTPException(status_code=500, detail=str(e))

    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers,
    )


@router.get("/types", summary="Lister les types de documents disponibles")
def list_document_types():
    return {
        "document_types": [
            {
                "id": "cdi",
                "label": "Contrat de Travail CDI",
                "countries": ["CI", "SN"],
                "description": "Contrat à Durée Indéterminée conforme au Code du Travail local",
            },
            {
                "id": "cdd",
                "label": "Contrat de Travail CDD",
                "countries": ["CI", "SN"],
                "description": "Contrat à Durée Déterminée avec date de fin obligatoire",
            },
            {
                "id": "nda",
                "label": "Accord de Confidentialité (NDA)",
                "countries": ["CI", "SN"],
                "description": "Non-Disclosure Agreement B2B conforme au droit OHADA",
            },
            {
                "id": "prestation",
                "label": "Contrat de Prestation de Services",
                "countries": ["CI", "SN"],
                "description": "Contrat Freelance / Consultant avec livrables et paiement",
            },
            {
                "id": "pacte_associes",
                "label": "Pacte d'Associés Simplifié",
                "countries": ["CI", "SN"],
                "description": "Pacte d'associés SARL/SAS conforme à l'AUSCGIE OHADA",
            },
        ]
    }
