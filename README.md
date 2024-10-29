# TeilnahmePlaner

## Übersicht

Dieses Projekt ist ein Event RSVP-Tool, das es Benutzern ermöglicht, an Auftritte teilzunehmen und ihre Instrumente auszuwählen. Die Anwendung verwendet React für das Frontend, Redux Toolkit für das State-Management und Axios für die API-Kommunikation. Admins können Veranstaltungen verwalten.

## Architektur

-   **Frontend**:

    -   Das Frontend ist mit React erstellt und verwendet React Router für die Navigation zwischen den verschiedenen Seiten.
    -   Redux Toolkit wird zur Verwaltung des globalen Zustands verwendet, einschließlich der Veranstaltungen und der Benutzeranmeldedaten.

-   **Backend**:

    -   Eine RESTful API (angenommen, dass sie bereits existiert) wird verwendet, um Daten über Veranstaltungen, Teilnehmer und Benutzer zu speichern und abzurufen.
    -   Axios wird für die HTTP-Anfragen an die API verwendet.

-   **Datenbank**:
    -   Die Anwendung verwendet MongoDB als Datenbank, um alle Veranstaltungs- und Teilnehmerdaten zu speichern.
    -   Die Verbindung zur MongoDB-Datenbank erfolgt in der Backend-Anwendung über Mongoose, ein ODM (Object Data Modeling) für MongoDB.

## Installation und Nutzung

### Abhängigkeiten installieren

```bash
npm install

```

### In das Frontend Verzeichnis wechseln und Abhängigkeiten installieren

Navigieren Sie in das Projektverzeichnis:

```bash
cd frontend
npm install

```

### Umgebungsvariablen einrichten

Erstellen Sie eine .env-Datei im Hauptverzeichnis des Projekts und fügen Sie die folgenden Umgebungsvariablen hinzu:

```
NODE_ENV=development
ADMIN_PASSWORD=<admin>
JWT_SECRET=<your_jwt_secret>
PORT=5000
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<database>

```

### DEV Umgebung starten

Server starten:

```bash
npm start

```

Frontend DEV starten:

```bash
cd frontend
npm run dev

```

## Ordnerstruktur

```plaintext

├── frontend
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   └── favicon.ico
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Participants.jsx
│   │   │   └── RSVPForm.jsx
│   │   ├── index.css
│   │   ├── layout
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── NavigationBar.jsx
│   │   │   └── RootLayout.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── AddEvent.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventRSVP.jsx
│   │   │   └── Login.jsx
│   │   ├── redux
│   │   │   ├── eventSlice.js
│   │   │   └── store.js
│   │   └── utils
│   │       └── api.js
│   └── vite.config.js
├── package.json
└── server.js


```
