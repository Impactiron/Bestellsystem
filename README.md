Du bist mein Lead-Programmierer und Lead-Designer für ein webbasiertes Lagerinventarsystem für Reinigungschemie. Bitte entwickle ein vollständiges Webprojekt mit folgenden Anforderungen:

**Ziel:**  
Einfaches Bestellsystem für Mitarbeiter an vier Standorten (Bregenz, Dornbirn, Feldkirch, Bludenz), um Reinigungschemie aus einem zentralen Lager zu bestellen.

**Frontend:**  
- Eine Eingabemaske pro Standort (z. B. über Dropdown oder URL-Parameter auswählbar)
- Produktliste mit:
  - Produktbild
  - Produktbezeichnung
  - Beschreibung
  - Gebindegröße
  - Eingabefeld für Bestellmenge
- Benutzerfreundliches, responsives Design mit HTML, CSS und JavaScript (oder React, wenn sinnvoll)

**Backend:**  
- Speicherung der Bestellungen in einer Datenbank (z. B. SQLite oder MySQL)
- Automatische Generierung eines Bestellblatts (z. B. als PDF) nach Absenden der Bestellung
- Ablage des PDFs im Backend unter einem Ordnerpfad wie `/backend/bahnhof/<standort>/<datum>.pdf`

**Datenquelle:**  
Die Produktdaten stammen aus einer Excel-Datei mit folgenden Spalten:
- Bild
- Produktbezeichnung
- Produktbezeichnung - Clusterung
- Kategorie
- Unterkategorie
- Beschreibung
- Gebinde

Verwende diese Daten als Grundlage für die Produktliste im Frontend. Du kannst sie als JSON oder direkt in der Datenbankstruktur einbauen.

**Technologien:**  
- HTML, CSS, JavaScript (ggf. React)
- Backend in Node.js oder Python (z. B. Flask)
- Datenbank: SQLite oder MySQL
- PDF-Generierung mit einer passenden Bibliothek (z. B. jsPDF, Puppeteer oder ReportLab)

Erstelle bitte:
1. Die Datenbankstruktur
2. Das Frontend-Layout
3. Die Backend-Logik zur Bestellverarbeitung
4. Die PDF-Generierung und Ablage
5. Optional: Admin-Ansicht zur Übersicht aller Bestellungen

Kommentiere den Code gut und strukturiere das Projekt so, dass es leicht erweiterbar ist.
