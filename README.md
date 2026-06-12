# LexAfrica

Plateforme SaaS LegalTech B2B qui permet aux PME en **Côte d'Ivoire** et au **Sénégal** de générer des documents juridiques conformes au droit **OHADA**, sans passer par un avocat pour les actes standards.

---

## Fonctionnalités

- Génération de documents juridiques en quelques minutes via un formulaire guidé
- 5 types de documents : CDI, CDD, NDA, Contrat de prestation, Pacte d'associés
- Règles OHADA adaptées par pays (Côte d'Ivoire et Sénégal)
- Aperçu gratuit avec filigrane — version finale débloquée après paiement
- Paiement Mobile Money via CinetPay (Orange Money, Wave, MTN MoMo)
- Espace personnel pour retrouver et télécharger ses documents

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Python FastAPI |
| Base de données | PostgreSQL (Supabase) |
| Templates | docxtpl (Jinja2 dans .docx) |
| Auth | JWT (python-jose) |
| Paiement | CinetPay |
| Déploiement cible | Vercel (frontend) + Render (backend) |

---

## Structure du projet

```
LexAfrica/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── engine/       # Moteur de règles OHADA par pays
│   │   ├── models/       # Modèles SQLAlchemy (users, documents)
│   │   ├── routers/      # Endpoints API (auth, documents, payments)
│   │   ├── schemas/      # Schémas Pydantic
│   │   └── services/     # Logique métier
│   ├── templates/        # Fichiers .docx Jinja2 (modèles juridiques)
│   └── alembic/          # Migrations base de données
├── frontend/             # Application Next.js
│   └── src/
│       ├── app/          # Pages (App Router)
│       ├── components/   # Wizard, Dashboard, UI
│       ├── lib/          # API client, types, utilitaires
│       └── store/        # État global (Zustand)
└── docs/
    └── wizard_schemas.json   # Définition des formulaires par type de document
```

---

## Installation en local

### Prérequis

- Python 3.11+
- Node.js 18+
- Un projet Supabase (PostgreSQL)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials Supabase et votre clé JWT

# Appliquer les migrations
alembic upgrade head

# Lancer le serveur
python -m uvicorn main:app --reload --port 8000
```

Documentation API disponible sur : `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install

# Configurer les variables d'environnement
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Lancer le serveur
npm run dev
```

Application disponible sur : `http://localhost:3000`

---

## Variables d'environnement

### `backend/.env`

```env
DATABASE_URL=postgresql://...         # URL Session Pooler Supabase
JWT_SECRET_KEY=votre-cle-secrete
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=votre-service-key
TEMPLATES_DIR=templates
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## API — Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion, retourne un JWT |
| GET | `/api/v1/auth/me` | Profil utilisateur connecté |
| POST | `/api/v1/documents/generate-preview` | Génère un .docx avec filigrane (sans auth) |
| POST | `/api/v1/documents/generate` | Génère et sauvegarde en BDD (auth requis) |
| GET | `/api/v1/documents/` | Liste les documents de l'utilisateur |
| GET | `/api/v1/documents/{id}/download` | Télécharge un document |

---

## Documents disponibles

| Type | Nom complet | CI | SN |
|------|-------------|----|----|
| `cdi` | Contrat à Durée Indéterminée | ✅ | ✅ |
| `cdd` | Contrat à Durée Déterminée | ✅ | ✅ |
| `nda` | Accord de Confidentialité | ✅ | ✅ |
| `prestation` | Contrat de Prestation de Services | ✅ | ✅ |
| `pacte_associes` | Pacte d'Associés | ✅ | ✅ |

---

## État d'avancement

- [x] Phase 1 — Moteur de génération de documents
- [x] Phase 2 — Authentification et base de données
- [x] Phase 3 — Interface utilisateur (wizard + dashboard)
- [ ] Phase 4 — Paiement CinetPay + déblocage document final
- [ ] Phase 5 — Alertes échéances (CDD)
- [ ] Phase 6 — Déploiement production

---

## Licence

Projet propriétaire. Tous droits réservés.
