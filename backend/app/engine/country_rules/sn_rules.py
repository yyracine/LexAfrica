"""
Règles juridiques applicables au Sénégal.
Sources : Code du Travail sénégalais (Loi n°97-17 du 1er décembre 1997)
          Actes Uniformes OHADA
"""
from typing import Any, Dict


def apply_sn_rules(document_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    enhanced = data.copy()
    enhanced["country_full_name"] = "Sénégal"
    enhanced["country_code"] = "SN"
    enhanced["currency"] = "FCFA"
    enhanced["country_code_travail"] = (
        "Code du Travail du Sénégal (Loi n°97-17 du 1er décembre 1997)"
    )

    if document_type in ("cdi", "cdd"):
        _apply_sn_labor_rules(enhanced)
    elif document_type == "nda":
        _apply_sn_nda_rules(enhanced)
    elif document_type == "prestation":
        _apply_sn_prestation_rules(enhanced)
    elif document_type == "pacte_associes":
        _apply_sn_pacte_rules(enhanced)

    return enhanced


def _apply_sn_labor_rules(data: Dict[str, Any]) -> None:
    job_category = data.get("job_category", "non_cadre")

    if job_category == "cadre":
        data.setdefault("trial_period_months", 6)
        data["trial_period_legal_max"] = 6
        data["notice_period_months"] = 3
    else:
        data.setdefault("trial_period_months", 3)
        data["trial_period_legal_max"] = 3
        data["notice_period_months"] = 1

    # SMIG sénégalais 2024 : 63 125 FCFA/mois (décret n°2021-571)
    data["smig"] = 63_125
    data["smig_label"] = "63 125 FCFA"

    # Heures supplémentaires (Code du Travail SN, art. L.143)
    data["overtime_rate_1"] = "15%"   # 41-48h/semaine
    data["overtime_rate_2"] = "40%"   # Au-delà de 48h (différence CI/SN)
    data["weekly_hours"] = 40

    # Congés payés : 1 jour ouvrable par mois + 2 jours supplémentaires après 5 ans
    data["paid_leave_days_per_month"] = "1,67"
    data["paid_leave_days_per_year"] = 24

    # Protection sociale
    data["social_protection_body"] = "IPRES (Institution de Prévoyance Retraite du Sénégal) et CSS"
    data["social_protection_law"] = "Loi n°75-50 du 3 avril 1975 relative aux institutions de prévoyance sociale"

    # Juridiction compétente
    data.setdefault("jurisdiction", "Tribunal du Travail de Dakar")


def _apply_sn_nda_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit sénégalais")
    data.setdefault("jurisdiction", "Tribunal de Commerce de Dakar")
    data.setdefault("duration_years", 2)


def _apply_sn_prestation_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit sénégalais")
    data.setdefault("jurisdiction", "Tribunal de Commerce de Dakar")
    # TVA au Sénégal : 18%
    data["tva_rate"] = "18%"
    data["tva_note"] = (
        "Les honoraires sont indiqués hors taxes. "
        "La TVA au taux de 18% sera ajoutée si applicable."
    )


def _apply_sn_pacte_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit OHADA et sénégalais")
    data.setdefault("jurisdiction", "Tribunal de Commerce de Dakar")
    data["ohada_reference"] = (
        "Acte Uniforme relatif au droit des Sociétés Commerciales "
        "et du Groupement d'Intérêt Économique (AUSCGIE), révisé le 30 janvier 2014"
    )
    data["company_registry"] = "RCCM Sénégal"
