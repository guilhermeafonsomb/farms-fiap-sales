# React + TypeScript + Vite + Microfront

This is a micro-frontend project for farm sales management. It includes unit tests with Vitest, React Testing Library, and MSW for API mocking.

## 🚀 Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

The `.env.example` file contains all necessary Appwrite configuration values for development and testing.

### 3. Run the project

```bash
pnpm dev
```

## 🧪 Testing

This project uses **Vitest** for unit testing with **React Testing Library** and **MSW** for API mocking.

### Run tests

```bash
pnpm test
```

### Run tests with UI

```bash
pnpm test:ui
```

### Run tests with coverage

```bash
pnpm test:coverage
```

## 📦 Build

Build the project for production:

```bash
pnpm build
```

Serve the production build locally:

```bash
npx serve dist -p 5003
```

## 🔧 Configuration

This project uses **Appwrite** as backend. The database and collection IDs are configured via environment variables in the `.env` file.

**Note:** For this portfolio/demo project, the `.env.example` contains real Appwrite credentials (free tier) to allow anyone to clone and run the project with tests working out-of-the-box.

## 🏗️ Architecture

This is a **micro-frontend** built with Module Federation. To see the full experience, you need to run all micro-frontends along with the host project.

### Host project

[farms-fiap-host](https://github.com/guilhermeafonsomb/farms-fiap-host)

## 📊 Test Coverage

The project includes comprehensive unit tests covering:

- ✅ Components (Button, Input, NewProduct, RegisterSale, UpdateStock)
- ✅ Services (Products CRUD operations)
- ✅ Error scenarios (HTTP errors, not found, validation)

Run `pnpm test:coverage` to see detailed coverage report.
