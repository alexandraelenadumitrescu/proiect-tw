# Sistem Management Conferinte - Proiect TW

## Echipa

- **Membru 1:** Baias Bianca
- **Membru 2:** Dumitrescu Alexandra
- **Membru 3:** Oniceanu Georgiana

## Descriere Proiect

Aplicatie web pentru gestionarea conferintelor, realizata cu React (Frontend) si Node.js (Backend).

## Cum pornim proiectul

### 1. Server (Backend)

- Mergi in folder: `cd server`
- Instaleaza: `npm install`
- Porneste: `npm run dev` (foloseste nodemon)

### 2. Client (Frontend)

- Mergi in folder: `cd client/my-app`
- Instaleaza: `npm install`
- Porneste: `npm start`

## Tehnologii folosite

- **Frontend:** React, Axios, React Router.
- **Backend:** Node.js, Express, Cors, Dotenv.
- **Stil si Calitate:** ESLint, Prettier.

## 🌳 Branch Strategy

### Workflow

1. **Development:** Lucrați pe `feature/*` branches
2. **Integration:** Merge în `develop` prin Pull Request
3. **Release:** Când `develop` e stabil → merge în `main`

## Documentatie API

Proiectul foloseste Swagger pentru documentarea si testarea endpoint-urilor.

- Dupa ce porniti serverul de backend (`npm run dev`), accesati:
- **URL:** `http://localhost:5000/api-docs`

## Cerinte

Aplicație web pentru organizarea de conferințe

Obiectiv
Realizarea unei aplicații web care să permită organizarea unor conferințe.
Descriere
Aplicația trebuie să permită înregistrarea organizarea unor conferințe
științifice, cu trimiterea și aprobarea unor articole.

Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive
mobile sau tablete (considerând preferințele utilizatorului).
Funcționalități (minime)

Aplicația are trei tipuri de utilizatori, organizatori, revieweri și autori.
Un organizator poate crea o conferință și aloca o serie de revieweri
Un autor se poate înregistra la o conferință și poate face o propunere de articol
La primirea articolului, se alocă automat 2 revieweri pentru articol
Reviewer-i pot aproba articolul sau pot da feed-back autorului pentru modificarea
Autorul poate încărca o nouă versiune a unui articol pe baza feed-back-ului primit
Organizatorul poate monitoriza starea articolelor trimise

Exemple
???

Conference management web application

Obiective
Implementing a web application for conference organization and management.
Description
The application must cover organizing scientific conferences, based on the uploading and approval of papers.

The application is built on a Single Page Application architecture and is accessible from the browser on the desktop, mobile devices or tablets (depending on user preference).
Functionality (minimal)

The application has three types of users:  organizers, reviewers and authors
An organizer can create a conference and allocate a series of reviewers
An author can register for a conference and make a paper proposal
On receiving an article, 2 reviewers are automatically allocated
Reviewers can accept the article or they can provide feedback to the author for an article update
The author can then upload a new version of the article based on the received feedback
The organizer can monitor the state of received articles

Examples
???
