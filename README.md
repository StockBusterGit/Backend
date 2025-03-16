# StockBuster - Gestion des stocks pour les entreprises

StockBuster est une application web conçue pour aider les entreprises à gérer leur inventaire de manière efficace. Elle permet aux utilisateurs de suivre les niveaux de stock, les produits, les employés et diverses configurations de l'entreprise via une interface intuitive et puissante.

## Architecture du projet

StockBuster est construit avec **Next.js** pour le frontend et utilise **NestJS** pour gérer le backend et l'API. L'application est conçue pour être modulaire et scalable, garantissant une gestion efficace des différentes entités de l'entreprise.

## Structure du projet

Le projet est organisé en plusieurs répertoires principaux :

```plaintext
📦 stockbuster
├── 📂 src
│   ├── 📄 main.ts                # Point d'entrée principal de l'application
│   ├── 📄 app.module.ts          # Module racine de l'application
│   ├── 📄 app.controller.ts      # Contrôleur principal
│   ├── 📄 app.service.ts         # Service principal
│   ├── 📄 health.controller.ts   # Contrôleur pour vérifier l'état de santé de l'API
│   │
│   ├── 📂 auth                    # Gestion de l'authentification
│   │   ├── 📄 auth.module.ts      # Module d'authentification
│   │   ├── 📄 auth.controller.ts  # Contrôleur d'authentification
│   │   ├── 📄 auth.service.ts     # Service d'authentification
│   │   ├── 📄 jwt.strategy.ts     # Stratégie JWT
│   │   └── 📄 jwt-auth.guard.ts   # Garde d'authentification JWT
│   │
│   ├── 📂 users                  # Gestion des utilisateurs
│   │   ├── 📂 dto                 # Objets de transfert de données
│   │   │   └── 📄 create-user.dto.ts  # DTO pour la création d'un utilisateur
│   │   ├── 📂 entities            # Définition des entités
│   │   │   └── 📄 users.entity.ts # Entité utilisateur
│   │   ├── 📄 users.module.ts      # Module utilisateur
│   │   ├── 📄 users.controller.ts  # Contrôleur des utilisateurs
│   │   └── 📄 users.service.ts     # Service des utilisateurs
│   │
│   ├── 📂 roles                  # Gestion des rôles utilisateurs
│   │   ├── 📂 entities
│   │   │   └── 📄 role.entity.ts  # Entité rôle
│   │   ├── 📄 roles.module.ts      # Module des rôles
│   │   ├── 📄 roles.controller.ts  # Contrôleur des rôles
│   │   └── 📄 roles.service.ts     # Service des rôles
│   │
│   ├── 📂 companies              # Gestion des entreprises
│   │   ├── 📂 dto
│   │   │   └── 📄 create-company.dto.ts  # DTO pour la création d'une entreprise
│   │   ├── 📂 entities
│   │   │   └── 📄 company.entity.ts  # Entité entreprise
│   │   ├── 📄 companies.module.ts      # Module des entreprises
│   │   ├── 📄 companies.controller.ts  # Contrôleur des entreprises
│   │   └── 📄 companies.service.ts     # Service des entreprises
│   │
│   ├── 📂 products               # Gestion des produits
│   │   ├── 📂 dto
│   │   │   └── 📄 create-product.dto.ts  # DTO pour la création d'un produit
│   │   ├── 📂 entities
│   │   │   └── 📄 product.entity.ts  # Entité produit
│   │   ├── 📄 products.module.ts      # Module des produits
│   │   ├── 📄 products.controller.ts  # Contrôleur des produits
│   │   └── 📄 products.service.ts     # Service des produits
├── 📂 test                      # Fichiers de tests unitaires et e2e
│   ├── 📄 app.e2e-spec.ts         # Tests end-to-end
│   ├── 📄 jest.config.ts          # Configuration Jest
│   ├── 📂 mocks                   # Mocks pour les tests
│   └── 📂 fixtures                # Données de test
│
├── 📄 package.json               # Dépendances et scripts du projet
├── 📄 tsconfig.json               # Configuration TypeScript
├── 📄 .eslintrc.js                # Configuration ESLint
├── 📄 .prettierrc                 # Configuration Prettier
└── 📄 README.md                   # Documentation du projet

```

## 🛠 Technologies utilisées

- **Frontend** : Next.js
- **Backend** : NestJS (API et logique métier)
- **Base de données** : MySQL
- **Containerisation** : Docker & Docker compose
- **CI/CD** : GitHub Actions

## ⚙️ Installation et configuration

### 📌 Prérequis

Avant de commencer, assurez-vous que vous avez les outils suivants installés :

- **Node.js** 20.18.0
- **Docker**
- **Docker compose**
- **Make**

### 🚀 Étapes d'installation
Pour lancer le projet ça se passe sur le projet devtools
#### 1️⃣ Cloner le projet DevTools et initialiser l'environnement

Clonez le dépôt DevTools et passez dans le répertoire du projet :

```bash
git clone https://github.com/your-repo/devtools.git
cd devtools
make init
```
Cette commande installe automatiquement le frontend et le backend.

#### 2️⃣ Mettre à jour le projet
Mettez à jour le projet en vous assurant que vous êtes sur la branche develop et en installant les dépendances :
```bash
make update
```
### 3️⃣ Lancer le projet
Lancez l'application avec Docker Compose :
```bash
make start
```
Cette commande démarre l'ensemble de l'application.
### 4️⃣ Arrêter le projet
Pour arrêter les services Docker associés à l'application :
```bash
make stop
```
### 5️⃣ Exporter la base de données
Si vous souhaitez exporter la base de données MySQL :
```bash
make export-db
```
### 6️⃣ Importer une base de données
Pour importer une base de données MySQL :
```bash
make import-db
```
## 🚢 Déploiement

Le projet est configuré pour être déployé via Docker et GitHub Actions.
À chaque fois qu'un tag versionné (vX.X.X) est poussé, une image Docker est construite, envoyée sur Docker Hub, et le déploiement est lancé sur Coolify.
