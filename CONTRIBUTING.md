# Contributing to MedNexa

Thank you for contributing to the MedNexa healthcare access platform. This document outlines our code standards, git workflow, and review process.

---

## Code of Conduct

All contributors are expected to uphold a professional, inclusive, and collaborative environment. Patient confidentiality, clinical safety considerations, and deterministic error handling are central to all contributions.

---

## Git Workflow and Commit Conventions

This project strictly follows the **Conventional Commits** specification. Commit messages must be structured as follows:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

- `feat`: A new feature or user-facing functionality
- `fix`: A bug fix or regression repair
- `docs`: Documentation changes, inline comments, or markdown files
- `style`: Formatting, missing semicolons, or whitespace adjustments (no code change)
- `refactor`: Code refactoring that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing unit or integration tests
- `chore`: Build tasks, package upgrades, or tool configurations

### Examples of Conventional Commits

- `feat(consultation): add live audio and video calling controls`
- `fix(payments): handle timeout response on bank transfer confirmation`
- `docs(api): document geolocation endpoints and payload structure`
- `refactor(voice): extract speech recognition handler to custom hook`
- `perf(facilities): memoize Haversine distance calculations`

---

## Development Environment Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended; v20+ supported)
- npm (v9 or higher)
- Git (v2.30 or higher)

### 2. Clone the Repository
```bash
git clone https://github.com/bethwel3001/mednexa.git
cd mednexa
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev # or node server.js
```
The backend starts on `http://127.0.0.1:5000`.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

---

## Coding Standards

### TypeScript
- All frontend source files must use TypeScript (`.ts` or `.tsx`).
- Do not suppress type errors with `any` unless integrating untyped browser experimental APIs.
- Ensure all component props and API response interfaces are typed in `src/types/index.ts`.
- Run type checks prior to pushing:
  ```bash
  npm run build
  ```

### Architecture and State Management
- Keep UI components presentational where possible; encapsulate network logic in `src/services/api.ts`.
- Share cross-cutting state (Authentication, Notifications, Live Geolocation) via React Context providers in `src/context/`.
- Clean up side effects and event listeners (e.g., media streams, intervals, speech synthesis) in `useEffect` return functions.

### Styling
- Use Tailwind CSS utility classes.
- Maintain consistent spacing, typography scale, and hairline border styling (`border-[#E8E6DD]`, `bg-[#FBFAF7]`, `text-[#161613]`).
- Do not introduce arbitrary CSS files or conflicting utility frameworks.

---

## Pull Request Guidelines

1. **Branch Naming**:
   - `feat/feature-name`
   - `fix/bug-description`
   - `docs/topic-name`
2. **Pre-Submission Checklist**:
   - Run `npm run build` in the `frontend` directory and ensure zero compilation errors.
   - Test endpoints against the local backend server.
   - Verify that no secrets, `.env` files, or private keys are committed.
3. **PR Description**:
   - Clearly state the problem being solved.
   - Summarize the specific technical changes made.
   - Provide manual test steps or verification screenshots where applicable.
