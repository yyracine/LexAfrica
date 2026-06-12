from typing import Any, Dict, Literal

SUPPORTED_COUNTRIES = ("CI", "SN")
SUPPORTED_DOCUMENT_TYPES = ("cdi", "cdd", "nda", "prestation", "pacte_associes")


def apply_rules(
    document_type: str,
    country: str,
    form_data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Enrichit les données du formulaire avec les règles juridiques du pays.
    Retourne un dictionnaire prêt à être injecté dans le template Jinja2.
    """
    if country not in SUPPORTED_COUNTRIES:
        raise ValueError(
            f"Pays non supporté : '{country}'. Pays disponibles : {', '.join(SUPPORTED_COUNTRIES)}"
        )
    if document_type not in SUPPORTED_DOCUMENT_TYPES:
        raise ValueError(
            f"Type de document non supporté : '{document_type}'. "
            f"Types disponibles : {', '.join(SUPPORTED_DOCUMENT_TYPES)}"
        )

    if country == "CI":
        from app.engine.country_rules.ci_rules import apply_ci_rules
        return apply_ci_rules(document_type, form_data)

    from app.engine.country_rules.sn_rules import apply_sn_rules
    return apply_sn_rules(document_type, form_data)
