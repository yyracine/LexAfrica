# CAHIER DES CHARGES : SaaS LegalTech OHADA (Nom de code : "LexAfrica")

## 1. Contexte et Objectifs
*   **Problème :** Les PME, startups et filiales de groupes en zone OHADA (17 pays) dépensent trop en frais d'avocats pour des documents standards ou, à l'inverse, utilisent des modèles gratuits inadaptés, créant des risques juridiques majeurs. Faire rédiger un simple contrat de travail ou un pacte d'associé par un cabinet local coûte souvent entre **50 000 et 150 000 FCFA**.
*   **Solution :** Une plateforme SaaS B2B permettant de générer automatiquement des documents juridiques 100% conformes au droit OHADA et aux codes nationaux, et de suivre les obligations légales.
*   **Objectif du MVP :** Lancer une version fonctionnelle en **4 mois**, ciblant en priorité **2 pays** (ex: Sénégal et Côte d'Ivoire) pour valider le produit avant d'étendre à toute la zone OHADA.

## 2. Cibles Utilisateurs (Personas)
1.  **Le Gérant de TPE/PME :** Veut embaucher rapidement, a besoin d'un contrat de travail simple, ne veut pas payer 75 000 FCFA l'heure un avocat.
2.  **Le Responsable RH d'une ETI :** Doit gérer 50+ contrats, a besoin d'archivage, de versions à jour et d'alertes sur les échéances (fin de période d'essai, renouvellement).
3.  **L'Investisseur / Filiale étrangère :** A besoin de comprendre les règles locales (Pacte d'associés, statuts SAS/SARL OHADA) sans maîtriser le jargon juridique local.

---

## 3. Périmètre Fonctionnel du MVP (V1)

### Module A : Le Générateur de Documents (Cœur du produit)
*   **Interface "Questionnaire Intelligent" :** L'utilisateur répond à des questions simples en langage courant.
*   **Moteur de règles juridiques :** Le système adapte les clauses automatiquement selon le pays choisi (ex: si Sénégal -> applique le Code du Travail sénégalais ; si Côte d'Ivoire -> code ivoirien).
*   **Bibliothèque de documents (V1) :**
    *   Contrats de travail (CDD, CDI, Stage, Consultance).
    *   Accords de confidentialité (NDA).
    *   Pacte d'associés simplifié (OHADA).
    *   Conditions Générales de Vente (CGV) et Mentions légales.
*   **Export :** Génération de fichiers PDF (avec filigrane de la plateforme) et Word (.docx) éditable.

### Module B : Coffre-fort Numérique et Gestion
*   **Tableau de bord :** Vue d'ensemble de tous les documents générés.
*   **Gestion des versions :** Historique des modifications d'un document.
*   **Dossiers par entité :** Possibilité de créer des espaces pour différentes filiales.

### Module C : Veille et Conformité (La fonction "Rétention")
*   **Calendrier juridique :** Alertes automatiques par email et SMS (ex: "La période d'essai de M. Diallo se termine dans 15 jours").
*   **Fil d'actualité OHADA :** Résumé des nouvelles réformes juridiques impactant les PME.

### Module D : Administration et Paiement
*   **Gestion des utilisateurs :** Rôles (Admin, Collaborateur, Lecteur seul).
*   **Intégration Paiement :** Indispensable. Intégration d'un agrégateur local (ex: **Paystack, Flutterwave, CinetPay ou Wave Business**) pour accepter les Cartes Bancaires locales/internationales et le **Mobile Money** (Orange Money, Wave, MTN MoMo, Moov Money).

---

## 4. Exigences Techniques

*   **Frontend :** React.js ou Vue.js.
*   **Backend :** Node.js (NestJS) ou Python (Django/FastAPI). Python est recommandé pour la manipulation de documents (`python-docx`).
*   **Base de données :** PostgreSQL.
*   **Hébergement & Souveraineté des données :** 
    *   Serveurs respectant les lois locales sur la protection des données personnelles (ex: loi sur les données personnelles au Sénégal, ARTCI en Côte d'Ivoire). Hébergement en Europe (OVH/AWS Paris) avec clauses contractuelles strictes, ou sur les data centers locaux émergents.
*   **Sécurité :** Chiffrement AES-256, TLS 1.3, sauvegardes quotidiennes.

---

## 5. Exigences Non-Fonctionnelles (UX/UI)

*   **Simplicité radicale :** Zéro jargon juridique dans l'interface.
*   **Responsive Design :** Parfaitement consultable sur mobile (pour les alertes et la validation rapide).
*   **Mode "Low-Bandwidth" :** L'interface doit rester légère et rapide même avec une connexion 3G/4G instable.

---

## 6. Modèle Économique (Pricing en FCFA)

*Le pricing doit refléter la valeur apportée (moins chère qu'un avocat, plus sûre qu'un modèle gratuit) tout en restant accessible. En Afrique de l'Ouest/Centrale, **la facturation annuelle** (payable par chèque ou virement) est souvent préférée par les PME pour éviter la lourdeur des paiements mensuels.*

*   **Offre "TPE / Solo" (15 000 FCFA / mois ou 150 000 FCFA / an)**
    *   1 à 2 utilisateurs.
    *   10 générations de documents par mois.
    *   Accès aux modèles de base (Contrats de travail, NDA, CGV).
    *   Export PDF uniquement.
    *   *Cible : Le petit commerçant structuré, le freelance, la micro-agence.*

*   **Offre "Business / PME" (45 000 FCFA / mois ou 450 000 FCFA / an)**
    *   Jusqu'à 5 utilisateurs.
    *   Générations **illimitées**.
    *   Accès à TOUS les modèles (Pactes d'associés, statuts, baux commerciaux, procédures de licenciement).
    *   Export Word + PDF.
    *   Module d'alertes de conformité RH et juridique complet.
    *   Support prioritaire par WhatsApp / Téléphone.
    *   *Cible : La PME de 10 à 50 employés, la startup en croissance.*

*   **Offre "Enterprise / ETI" (À partir de 150 000 FCFA / mois)**
    *   Utilisateurs illimités.
    *   Modèles personnalisés à la charte et aux spécificités de l'entreprise.
    *   Accès API pour intégration avec leur SIRH ou ERP.
    *   Formation en visio pour les équipes RH.
    *   *Cible : Les grandes entreprises, les cabinets RH, les groupes ayant plusieurs filiales en zone OHADA.*

---

## 7. Roadmap de Développement (4 Mois)

*   **Mois 1 : Cadrage & Juridique**
    *   Validation des modèles par un cabinet d'avocats OHADA partenaire.
    *   Maquettage UX/UI (Figma).
*   **Mois 2 : Développement du Core**
    *   Architecture, base de données, moteur de génération (moteur de règles conditionnelles).
    *   Intégration des modèles pour le Sénégal et la Côte d'Ivoire.
*   **Mois 3 : Fonctionnalités SaaS & Paiement**
    *   Tableau de bord, gestion des rôles.
    *   Intégration de la passerelle de paiement (CinetPay/Paystack) et système de facturation automatique (avec mention des taxes locales type TVA si applicable).
*   **Mois 4 : Tests & Lancement**
    *   Beta-test fermé avec 15 à 20 entreprises pilotes.
    *   Ajustements et lancement officiel (V1).

---

## ⚠️ Point de Vigilance Critique (Le "Game Changer")

**Ne développez pas ce SaaS sans un partenaire juridique senior.** 
Votre plus grand risque n'est pas technique, il est **juridique**. Si votre SaaS génère un contrat de travail illégal qui fait perdre un prud'homme à un client, votre réputation est détruite.

**La bonne approche :** Associez-vous dès le jour 1 avec un jeune cabinet d'avocats d'affaires ou un juriste d'entreprise reconnu en zone OHADA. 
*   *Leur rôle :* Valider chaque clause, chaque logique conditionnelle du générateur.
*   *Leur intérêt :* Ils peuvent toucher un petit pourcentage sur les revenus (revenus passifs pour eux) ou utiliser votre outil pour déléguer la "paperasse" de leurs propres clients. Cela vous donne aussi un argument marketing massif : *"Modèles validés et mis à jour par le Cabinet X"*.