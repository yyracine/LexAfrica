Voici la définition précise et opérationnelle du **MVP (Minimum Viable Product)** pour votre SaaS LegalTech OHADA. 

L'objectif d'un MVP n'est pas de construire un produit parfait, mais de **valider une hypothèse centrale avec le minimum d'effort et de budget** : *"Des PME en Afrique de l'Ouest sont-elles prêtes à payer pour générer des contrats juridiques conformes via Mobile Money, plutôt que de payer un avocat ou d'utiliser des modèles Word gratuits et risqués ?"*

---

### 🎯 1. Objectif Unique du MVP
Valider la **volonté de payer** et l'**utilité réelle** du générateur de documents sur un marché restreint (Sénégal et Côte d'Ivoire uniquement) avant d'investir dans des fonctionnalités complexes.

---

### ✅ 2. Périmètre Strict du MVP (Ce qu'on FAIT)

Pour tenir un délai de 2 à 3 mois et un budget maîtrisé, on se concentre uniquement sur l'essentiel :

*   **Zone géographique :** Sénégal et Côte d'Ivoire uniquement (le moteur de règles ne gère que ces 2 codes nationaux + le droit OHADA de base).
*   **Bibliothèque de documents (Limitée à 4 modèles "Pain Killers") :**
    1. Contrat de travail (CDI et CDD avec variables de pays).
    2. Accord de confidentialité (NDA) B2B.
    3. Contrat de prestation de services (Freelance / Consultant).
    4. Pacte d'associés simplifié (SARL/SAS OHADA).
*   **Formulaire intelligent (Wizard) :** Un questionnaire en 5 à 10 étapes maximum, en langage clair (ex: "Nom de l'entreprise", "Salaire mensuel", "Durée du contrat").
*   **Génération et Export :** Génération instantanée d'un fichier **PDF** (avec un filigrane "LexAfrica - Version d'essai" si non payé) et **Word (.docx)**.
*   **Paiement :** Intégration d'un seul agrégateur (ex: **CinetPay** ou **Paystack**) pour accepter : Carte Bancaire, Wave, Orange Money, MTN MoMo.
*   **Tableau de bord minimaliste :** Liste des documents générés, date de création, et une simple alerte visuelle si une date d'échéance (ex: fin de CDD) est proche.
*   **Comptes utilisateurs :** Inscription par Email + Mot de passe (ou lien magique).

---

### ❌ 3. Hors Périmètre (Ce qu'on NE FAIT PAS encore)
*C'est la partie la plus importante pour éviter de dépenser de l'argent inutilement.*

*   ❌ Pas d'application mobile native (le site web responsive mobile suffit).
*   ❌ Pas de signature électronique avancée (type Docusign avec valeur légale certifiée). On se contente de l'export PDF/Word que l'utilisateur signera et scannera lui-même pour le MVP.
*   ❌ Pas de gestion multi-entreprises complexe (un compte = une entreprise pour l'instant).
*   ❌ Pas d'API pour les développeurs.
*   ❌ Pas de module de veille juridique automatisée (un simple blog ou fil d'actu statique suffit).
*   ❌ Pas de 17 pays OHADA (on commence par 2).

---

### 🔄 4. Parcours Utilisateur Type (User Flow)

1. **Arrivée :** Le gérant de TPE arrive sur la page d'accueil. Il voit : *"Générez votre contrat de travail conforme au droit ivoirien en 3 minutes, à partir de 5 000 FCFA"*.
2. **Inscription :** Il crée un compte (Email + Mot de passe).
3. **Choix :** Il sélectionne "Côte d'Ivoire" puis "Contrat de Travail CDI".
4. **Remplissage :** Il répond au questionnaire (Nom de l'employé, salaire, poste, lieu de travail...).
5. **Prévisualisation :** Il voit un aperçu du document avec des zones de texte remplacées par ses réponses.
6. **Paiement (Le moment de vérité) :** Pour télécharger le fichier propre (sans filigrane et en .docx), une pop-up demande le paiement de 5 000 FCFA (paiement à l'acte pour le MVP) OU l'activation de l'abonnement à 15 000 FCFA/mois.
7. **Téléchargement :** Paiement validé via Wave/Orange Money → Téléchargement immédiat du fichier.
8. **Post-action :** Il reçoit un email de confirmation et une alerte est créée dans son tableau de bord pour la fin de la période d'essai.

---

### 🛠️ 5. Stack Technique Recommandée pour le MVP
*L'objectif est la vitesse de développement et la facilité de maintenance.*

*   **Frontend :** Next.js (React) + Tailwind CSS (pour une interface propre, rapide et responsive).
*   **Backend :** Node.js (avec Express ou NestJS) OU Python (FastAPI). *Python est légèrement avantagé ici grâce à des librairies comme `python-docx` ou `DocxTemplate` qui sont excellentes pour manipuler des modèles Word.*
*   **Base de données :** PostgreSQL (hébergé sur Supabase ou Render pour aller vite).
*   **Paiement :** CinetPay ou Paystack (les mieux documentés pour l'Afrique de l'Ouest).
*   **Hébergement :** Vercel (Frontend) + Render/Railway (Backend/DB).

*(Note : Si vous n'avez pas de développeur, ce MVP peut être prototypé en No-Code avec **Bubble.io** couplé à une API de génération de document comme **Documint** ou **PDFMonkey**, pour un coût et un délai encore plus réduits).*

---

### 📊 6. Indicateurs de Succès (KPIs) du MVP
Pour savoir si le MVP est une réussite après 2 mois de lancement, surveillez ces chiffres :

1. **Taux de conversion :** Pourcentage d'utilisateurs qui arrivent au bout du questionnaire et paient réellement (Objectif MVP : > 5%).
2. **Coût d'acquisition client (CAC) :** Combien vous dépensez en publicité/réseautage pour obtenir un client payant.
3. **Méthode de paiement utilisée :** Est-ce que les gens paient vraiment par Mobile Money ? (Cela validera l'intégration).
4. **Taux de réclamation :** Nombre de clients qui contactent le support car le document généré contient une erreur (Doit être proche de 0% si le partenaire avocat a bien fait son travail).

---

### 💡 Conseil Stratégique pour le Lancement du MVP
Ne lancez pas de grandes campagnes publicitaires. Faites du **"Concierge MVP"** :
Contactez manuellement 20 à 30 PME, startups ou cabinets de recrutement à Abidjan et Dakar. Offrez-leur l'outil gratuitement en échange d'un appel de 15 minutes pour observer comment ils l'utilisent. C'est lors de ces appels que vous découvrirez les vrais problèmes (ex: "Le champ 'numéro de registre de commerce' est obligatoire au Sénégal mais pas en CI, il faut que tu changes ça"). 

Une fois ces 20 retours intégrés, vous ouvrez les vannes et activez le système de paiement.