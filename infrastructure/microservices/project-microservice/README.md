# Project Microservice

## Opšti opis

Project Microservice je mikroservis zadužen za upravljanje projektima, sprintovima i povezivanjem korisnika sa projektima.

Pored osnovne poslovne logike, servis implementira centralizovano logovanje i SIEM integraciju, čime se omogućava auditovanje, bezbednosni nadzor i praćenje svih bitnih događaja u sistemu.

---

## Glavne odgovornosti servisa

Servis pokriva sledeće funkcionalnosti:

- Kreiranje, izmena, brisanje i dohvat projekata
- Upravljanje sprintovima u okviru projekta
- Dodela i uklanjanje korisnika sa projekata
- Provera postojanja projekta
- Upload i čuvanje slika projekata (R2 storage)
- Logovanje aplikacionih događaja
- Generisanje i slanje SIEM događaja

---

## Tehnologije

- Node.js
- TypeScript
- Express
- Multer
- Docker
- REST API
- SIEM integracija
- Custom Logger servis

---

## Struktura projekta

Projekat je organizovan po celinama:
src/
│
├── Database/
│   ├──                     # Pristup bazi podataka
│
├── Domain/
│   ├── DTOs/               # Data Transfer objekti
│   ├── enums/              # Enum tipovi
│   ├── models/             # Modeli podataka
│   ├── services/           # Interfejsi servisa
│   ├── types/              # Zajednički tipovi
│
├── Services/
│   ├── implementations/    # Poslovna logika
│
├── Siem/
│   ├── Domain              # Generisanje Event-ova za SIEM
│   ├── Services            # Slanje događaja ka SIEM sistemu
│
├── Storage/
│   └── R2StorageService    # Upload i čuvanje slika
│
├── Utils/
│   └── Maperi              # Maperi podataka
│   ├── WebAPI/             # Helperi za Kontrolere
│
├── WebAPI/
│   ├── controllers/        # REST kontroleri (Project, Sprint, ProjectUser)
│   ├── validators/         # Validacija zahteva
│
├── app.ts                  # Express konfiguracija
└── index.ts                # Entry point aplikacije

---

## Kontroleri

### ProjectController
Zadužen za:
- CRUD operacije nad projektima
- Proveru postojanja projekta
- Upload slike projekta
- Automatsku dodelu kreatora projektu

### SprintController
Zadužen za:
- Kreiranje sprintova
- Izmenu i brisanje sprintova
- Dohvat sprintova po projektu

### ProjectUserController
Zadužen za:
- Dodelu korisnika projektu
- Uklanjanje korisnika sa projekta
- Dohvat korisnika po projektu

---

## Logging

Logger servis (`ILogerService`) koristi se za aplikaciono logovanje i služi za:
- praćenje toka izvršavanja aplikacije
- beleženje grešaka
- informativne poruke tokom rada sistema

---

## SIEM integracija

Servis koristi SIEM integraciju za:
- audit logove
- bezbednosne događaje
- praćenje uspešnih i neuspešnih HTTP zahteva

Za svaki bitan zahtev u kontrolerima generiše se SIEM događaj