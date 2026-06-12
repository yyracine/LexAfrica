"""
Règles juridiques applicables en Côte d'Ivoire.
Sources : Code du Travail ivoirien (Loi n°2015-532 du 20 juillet 2015)
          Actes Uniformes OHADA
"""
from typing import Any, Dict


def apply_ci_rules(document_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    enhanced = data.copy()
    enhanced["country_full_name"] = "Côte d'Ivoire"
    enhanced["country_code"] = "CI"
    enhanced["currency"] = "FCFA"
    enhanced["country_code_travail"] = (
        "Code du Travail de Côte d'Ivoire (Loi n°2015-532 du 20 juillet 2015)"
    )

    if document_type in ("cdi", "cdd"):
        _apply_ci_labor_rules(enhanced)
    elif document_type == "nda":
        _apply_ci_nda_rules(enhanced)
    elif document_type == "prestation":
        _apply_ci_prestation_rules(enhanced)
    elif document_type == "pacte_associes":
        _apply_ci_pacte_rules(enhanced)

    return enhanced


def _apply_ci_labor_rules(data: Dict[str, Any]) -> None:
    job_category = data.get("job_category", "non_cadre")

    if job_category == "cadre":
        data.setdefault("trial_period_months", 6)
        data["trial_period_legal_max"] = 6
        data["notice_period_months"] = 3
    else:
        data.setdefault("trial_period_months", 3)
        data["trial_period_legal_max"] = 3
        data["notice_period_months"] = 1

    # SMIG ivoirien 2024 : 75 000 FCFA/mois
    data["smig"] = 75_000
    data["smig_label"] = "75 000 FCFA"

    # Heures supplémentaires (Code du Travail CI, art. 21.7)
    data["overtime_rate_1"] = "15%"   # 41-48h/semaine
    data["overtime_rate_2"] = "50%"   # Au-delà de 48h
    data["weekly_hours"] = 40

    # Congés payés : 2,2 jours ouvrables par mois travaillé (art. 25.1)
    data["paid_leave_days_per_month"] = "2,2"
    data["paid_leave_days_per_year"] = 26

    # Protection sociale
    data["social_protection_body"] = "CNPS (Caisse Nationale de Prévoyance Sociale)"
    data["social_protection_law"] = "Loi n°99-476 du 2 août 1999 portant Code de Prévoyance Sociale"

    # Juridiction compétente
    data.setdefault("jurisdiction", "Tribunal du Travail d'Abidjan")


def _apply_ci_nda_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit ivoirien")
    data.setdefault("jurisdiction", "Tribunal de Commerce d'Abidjan")
    data.setdefault("duration_years", 2)


def _apply_ci_prestation_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit ivoirien")
    data.setdefault("jurisdiction", "Tribunal de Commerce d'Abidjan")
    # TVA en Côte d'Ivoire : 18%
    data["tva_rate"] = "18%"
    data["tva_note"] = (
        "Les honoraires sont indiqués hors taxes. "
        "La TVA au taux de 18% sera ajoutée si applicable."
    )


def _apply_ci_pacte_rules(data: Dict[str, Any]) -> None:
    data.setdefault("governing_law_label", "droit OHADA et ivoirien")
    data.setdefault("jurisdiction", "Tribunal de Commerce d'Abidjan")
    data["ohada_reference"] = (
        "Acte Uniforme relatif au droit des Sociétés Commerciales "
        "et du Groupement d'Intérêt Économique (AUSCGIE), révisé le 30 janvier 2014"
    )
    data["company_registry"] = "RCCM Côte d'Ivoire"
