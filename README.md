# GIS Request Form Automation

This repository contains a full-stack application to submit GIS requests via a web form and automatically add them to a Smartsheet sheet.

## Overview

- **Frontend:** React-based form to collect GIS requests.
- **Backend:** Node/Express server that submits requests to Smartsheet via API.
- **Automation:** Ensures that requests are validated and logged automatically.

## Features

- Form validation on required fields.
- Backend handles API submission to Smartsheet securely.
- Environment variables used for sensitive credentials (API tokens, sheet IDs, URLs).
- Supports multiple environments (local development, production).

## Setup

### Backend

1. Navigate to `backend/`

```bash
cd backend
npm install
```
