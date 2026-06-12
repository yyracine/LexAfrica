# RESUME.md — LexAfrica

> Fichier de référence technique à lire au début de chaque session.
> Mis à jour manuellement après chaque phase complétée.

---

## Qu'est-ce que LexAfrica

Plateforme SaaS LegalTech B2B permettant aux PME en **Côte d'Ivoire** et au **Sénégal** de générer des documents juridiques conformes au droit **OHADA**, sans passer par un avocat pour les actes standards.

**Modèle économique :** freemium. L'aperçu (avec filigrane APERÇU) est gratuit. Le document final propre est payant via CinetPay (Mobile Money : Orange Money, Wave, MTN MoMo).

**Documents couverts (5 types) :**

| Clé | Nom |
|-----|-----|
| `cdi` | Contrat à Durée Indéterminée |
| `cdd` | Contrat à Durée Déterminée |
| `nda` | Accord de Confidentialité |
| `prestation` | Contrat de Prestation de Services |
| `pacte_associes` | Pacte d'Associés |

Chaque type est disponible pour `CI` (Côte d'Ivoire) et `SN` (Sénégal), avec règles OHADA adaptées par pays.

---

## Architecture technique

```
LexAfrica/
├── backend/          # FastAPI Python, port 8000
│   ├── app/          # Code applicatif
│   ├── templates/    # 7 fichiers .docx Jinja2 (modèles juridiques)
│   └── alembic/      # Migrations PostgreSQL
├── frontend/         # Next.js 16 App Router, port 3000
│   └── src/
├── docs/
│   └── wizard_schemas.json   # Définition des étapes de formulaire
└── context/          # Fichiers de contexte Jarvis
```

### Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16.2.9, TypeScript, Tailwind CSS v4, App Router |
| State | Zustand + persist (localStorage `lexafrica-auth`) |
| Backend | FastAPI Python, SQLAlchemy sync, Alembic |
| Base de données | PostgreSQL via Supabase (Session Pooler) |
| Templates | `docxtpl` (Jinja2 dans .docx Word) |
| Auth | JWT maison (python-jose + passlib[bcrypt]) |
| Paiement | CinetPay (à implémenter, Phase 4) |
| Hébergement cible | Vercel (frontend) + Render (backend) |

---

## Connexion Supabase

**Important :** la connexion directe Supabase ne fonctionne pas depuis le réseau local (IPv6 requis). Utiliser uniquement le **Session Pooler**.

```
DATABASE_URL=postgresql://postgres.izbvkaojukqhbuplhaay:54LIyZmXZBX50JkB@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
```

Les tables `users` et `documents` sont créées (migration Alembic `d3740e791b43_initial` déjà appliquée).

---

## État du développement

### Phase 1 — Moteur de génération ✅ TERMINÉE

- Backend FastAPI opérationnel
- Moteur de règles pays (`engine/rules_engine.py`, `ci_rules.py`, `sn_rules.py`)
- 7 templates `.docx` Jinja2 dans `backend/templates/`
- Endpoint `POST /api/v1/documents/generate-preview` : génère un `.docx` avec filigrane APERÇU
- `wizard_schemas.json` définit les champs de chaque formulaire (5 types, 3 à 5 étapes chacun)

### Phase 2 — Auth + BDD ✅ TERMINÉE

- Tables PostgreSQL : `users` (UUID, email, password_hash, plan, company_name, country) et `documents` (UUID, user_id FK, document_type, country, form_data JSONB, status, is_paid)
- Endpoints auth : `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- Endpoints documents : `POST /generate-preview` (sans auth), `POST /generate` (auth requis + save BDD), `GET /` (liste), `GET /{id}/download`
- JWT Bearer token, expire 24h

### Phase 3 — Frontend Next.js ✅ TERMINÉE

- 5 pages fonctionnelles (HTTP 200 confirmé)
- Wizard multi-étapes : `ProgressBar`, `WizardField` (text, number, select, textarea, boolean, associates_list), `WizardContainer`
- Dashboard avec liste des documents générés
- Pages auth (login, inscription)
- Comportement : aperçu `.docx` avec filigrane téléchargé en cliquant "Générer et télécharger". Si connecté, document sauvegardé en BDD aussi.

### Phase 4 — Paiement CinetPay 🔲 À FAIRE

Logique prévue :
1. Utilisateur clique "Obtenir la version finale" sur son document
2. `PaymentModal.tsx` s'ouvre avec les options Mobile Money
3. Appel `POST /api/v1/payments/initiate` → CinetPay sandbox retourne une URL de paiement
4. Après paiement, CinetPay envoie `POST /api/v1/payments/webhook` → backend vérifie signature → `document.is_paid = True` → génère .docx sans filigrane → stocke dans Supabase Storage
5. Bouton "Télécharger la version finale" s'active dans le dashboard

Fichiers à créer : `backend/app/services/payment_service.py`, `backend/app/routers/payments.py`, `frontend/src/components/PaymentModal.tsx`

Clés CinetPay sandbox nécessaires (à obtenir sur sandbox.cinetpay.com).

### Phase 5 — Alertes échéances 🔲 À FAIRE

Pour les CDD : alerte dans le dashboard quand l'échéance approche (15 jours).
Fichiers : `alert_service.py`, `AlertBadge.tsx`.

### Phase 6 — Déploiement 🔲 À FAIRE

Vercel (frontend) + Render (backend). CORS production, compression Gzip, test mobile 3G.

---

## Lancer le projet en local

```bash
# Terminal 1 — Backend
cd backend
python -m uvicorn main:app --reload --port 8000
# Swagger UI : http://localhost:8000/docs

# Terminal 2 — Frontend
cd frontend
npm run dev
# App : http://localhost:3000
```

---

## Points d'attention techniques

- **Tailwind CSS v4** : syntaxe `@import "tailwindcss"` dans `globals.css` (pas `@tailwind base/components/utilities`)
- **Next.js 16** : `params` et `searchParams` sont des `Promise<...>` dans les page components, il faut les `await`
- **Mode sombre supprimé** : le `@media (prefers-color-scheme: dark)` a été retiré de `globals.css` pour éviter le texte blanc sur fond blanc des inputs
- **spellCheck désactivé** : tous les inputs ont `spellCheck={false} lang="fr"` pour éviter le soulignement rouge sur les termes français/juridiques
- **wizard_schemas.json** : présent à deux endroits — `docs/wizard_schemas.json` (source) et `frontend/src/lib/wizard_schemas.json` (copie pour import Next.js). Si on modifie les schémas, mettre à jour les deux.
- **SQLAlchemy sync** avec `psycopg2-binary`, pas async. Ne pas passer à asyncpg sans refactoring complet.
- **Utilisateur de test** : `racine.yao@gmail.com` existe déjà en BDD Supabase.

---

## Variables d'environnement

### backend/.env
```
DATABASE_URL=postgresql://postgres.izbvkaojukqhbuplhaay:54LIyZmXZBX50JkB@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
JWT_SECRET_KEY=lexafrica-jwt-2026-xK9mP3qR7vL2nW8jF4cB6sDhYpQeAtMz
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
SUPABASE_URL=https://izbvkaojukqhbuplhaay.supabase.co
SUPABASE_SERVICE_KEY=
TEMPLATES_DIR=templates
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

*Dernière mise à jour : Phase 3 terminée — juin 2026*
