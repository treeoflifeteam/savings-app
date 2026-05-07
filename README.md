# Savings App

[![CI](https://github.com/treeoflifeteam/savings-app/actions/workflows/nodejs.yml/badge.svg)](https://github.com/treeoflifeteam/savings-app/actions/workflows/nodejs.yml)

A cooperative savings application built with React, Vite, Express and MongoDB.

## Project setup

- Frontend: React + Vite
- Backend: Express + MongoDB
- Authentication: JWT
- Payments: Paystack

## Available scripts

- `npm run dev` — start the frontend dev server
- `npm run build` — build the frontend for production
- `npm run lint` — run ESLint
- `npm run start` — start the backend server

## CI Workflow

A GitHub Actions workflow is configured at `.github/workflows/nodejs.yml`.
It installs dependencies, runs lint, and builds the frontend on every push and pull request to `main`.

## Notes

- Make sure your repository is named `savings-app` on GitHub so the badge URL works.
- If you rename the repo or branch, update the badge link in `README.md`.
