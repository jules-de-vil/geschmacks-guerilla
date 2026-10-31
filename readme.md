# 🍜 Geschmacks Guerilla

A self-hosted, lightning-fast, and minimalist recipe management application built for food lovers who want absolute control over their culinary collection. Say goodbye to bloated recipe blogs and endless scrolling—just pure recipes, categories, search, and local-first control powered by a robust backend.

---

## 🛠️ Tech Stack

* **Front-end:** Standalone HTML5, modern JavaScript (`fetch` API), Tailwind CSS (via CDN)
* **Back-end:** Node.js with [Fastify](https://www.fastify.io/) (High-performance API)
* **Database & ORM:** PostgreSQL (running via Docker), [Prisma ORM](https://www.prisma.io/)
* **Development:** Nodemon (for hot-reloading)

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites

Make sure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **Docker & Docker Compose** (for running the PostgreSQL container)

---

### 1. Clone the Repository

```bash
git clone https://github.com/jules-de-vil/geschmacks-guerilla.git
cd geschmacks-guerilla
```

### 2. Start the Database (Docker)

Spin up your local PostgreSQL instance via Docker:

```bash
docker-compose up -d
```
*(Make sure your `.env` file points to this database instance, e.g., `DATABASE_URL="postgresql://user:password@localhost:5432/guerilladb?schema=public"`)*

### 3. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 4. Run Database Migrations

Initialize your database schema using Prisma:

```bash
npx prisma migrate dev --name init
```

### 5. Start the Backend Server

Start the development server with live-reloading:

```bash
npm run dev
```

The Fastify API will now be running at **`http://localhost:4000`**.

---

## 📂 Frontend Usage

1. Open the `index.html` file directly in your favorite web browser (or serve it via a live server extension like VS Code Live Server).
2. The front-end automatically communicates with your local Fastify backend on port `4000` to fetch, create, and delete recipes.

---

## 📜 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recipes` | Fetch all recipes (including ingredients & steps) |
| `POST` | `/api/recipes` | Create a new recipe |
| `PUT` | `/api/recipes/:id` | Updates an existing recipe |
| `DELETE` | `/api/recipes/:id` | Delete a recipe and its related relations |

---

## 💡 License

Distributed under the **MIT License**. See `LICENSE` for more information.
