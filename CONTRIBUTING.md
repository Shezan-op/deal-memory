# Contributing to DealMemory

Thank you for your interest in contributing to DealMemory!

## 1. Development Principles
- **Hindsight-Centric**: Hindsight is the primary memory engine. Do not replace it with decorative vector databases or client-side storage.
- **Evidence-First**: Recommendations must always link to historical document IDs. Never introduce unsupported claims.
- **Minimalist Aesthetic**: Maintain the clean, editorial design language (no gratuitous purple gradients or floating AI orbs).
- **Human Voice**: Write documentation and content following direct, authentic engineering standards.

## 2. Setting Up Your Environment
```bash
git clone https://github.com/Shezan-op/deal-memory.git
cd deal-memory
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

## 3. Pull Request Guidelines
1. Ensure all Vitest tests pass: `npm run test`.
2. Ensure TypeScript compilation passes: `npm run typecheck`.
3. If modifying content deliverables, run `npm run content:check`.
4. Run the end-to-end repository audit: `npm run audit`.
5. Write clear, conventional commit messages.
