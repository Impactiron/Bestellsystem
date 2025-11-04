# Bestellsystem Backend für Reinigungschemie

## Setup

1. **Zeige die `.env.example` und trage Daten in `.env` ein**
2. **Starte Datenbank und importiere `database_schema.sql`**
3. **Installiere Abhängigkeiten**  
   ```
   cd backend
   npm install
   ```
4. **Starte Backend**
   ```
   npm start
   ```

## Features

- Bestellung für 4 Standorte (Bregenz, Dornbirn, Feldkirch, Bludenz)
- Speicherung in MySQL/SQLite
- Automatische PDF-Erstellung nach Bestellung
- Strukturierte Ablage der PDFs

## API

- **POST /api/orders** – Neue Bestellung aufgeben
- **GET /api/orders** – Alle Bestellungen anzeigen

## Frontend

Frontend im `/frontend`-Ordner. Die Produktdaten werden aus `products.json` geladen.
