"""
Service de génération de documents juridiques.
Charge le template .docx Jinja2, applique les règles pays, rend le document.
"""
import os
from io import BytesIO
from typing import Any, Dict

from docxtpl import DocxTemplate

from app.config import settings
from app.engine.rules_engine import apply_rules

TEMPLATE_MAP = {
    ("cdi", "CI"): "cdi_ci.docx",
    ("cdi", "SN"): "cdi_sn.docx",
    ("cdd", "CI"): "cdd_ci.docx",
    ("cdd", "SN"): "cdd_sn.docx",
    ("nda", "CI"): "nda.docx",
    ("nda", "SN"): "nda.docx",
    ("prestation", "CI"): "prestation_services.docx",
    ("prestation", "SN"): "prestation_services.docx",
    ("pacte_associes", "CI"): "pacte_associes.docx",
    ("pacte_associes", "SN"): "pacte_associes.docx",
}

DOCUMENT_TITLES = {
    "cdi": "Contrat_CDI",
    "cdd": "Contrat_CDD",
    "nda": "Accord_Confidentialite_NDA",
    "prestation": "Contrat_Prestation_Services",
    "pacte_associes": "Pacte_Associes",
}


def generate_document(
    document_type: str,
    country: str,
    form_data: Dict[str, Any],
) -> tuple[BytesIO, str]:
    """
    Génère un document .docx à partir du type, du pays et des données du formulaire.

    Retourne (buffer BytesIO, nom_du_fichier).
    """
    template_file = TEMPLATE_MAP.get((document_type, country))
    if not template_file:
        raise ValueError(
            f"Pas de template pour le type '{document_type}' et le pays '{country}'"
        )

    template_path = os.path.join(settings.templates_dir, template_file)
    if not os.path.exists(template_path):
        raise FileNotFoundError(
            f"Template introuvable : {template_path}. "
            "Lancez 'python scripts/create_templates.py' pour générer les templates."
        )

    context = apply_rules(document_type, country, form_data)

    doc = DocxTemplate(template_path)
    doc.render(context)

    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    base_title = DOCUMENT_TITLES.get(document_type, document_type.upper())
    party = _extract_party_name(document_type, form_data)
    filename = f"LexAfrica_{base_title}_{country}_{party}.docx"

    return buffer, filename


def _extract_party_name(document_type: str, form_data: Dict[str, Any]) -> str:
    """Extrait un nom court pour nommer le fichier généré."""
    if document_type in ("cdi", "cdd"):
        name = form_data.get("employee_name", "")
    elif document_type in ("nda", "prestation"):
        name = form_data.get("party2_name", form_data.get("client_name", ""))
    else:
        name = form_data.get("company_name", "")

    clean = "".join(c if c.isalnum() or c in " -_" else "" for c in name)
    return clean.replace(" ", "_")[:30] or "Document"
