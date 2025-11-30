#Mailing Microservice

#Neophodni u .env file-u
MAILJET_API_KEY
MAILJET_API_SECRET
MAILJET_SENDER_EMAIL
MAILJET_SENDER_NAME

NAPOMENA: MOGUĆE JE POSLATI SAMO 10 PORUKA NA SAT
NAPOMENA 2: 99% SLUČAJEVA ZAVRŠAVAJU U SPAM FOLDERU
NAPOMENA 3: PORUKA IMA IZGENERISAN TEMPLATE, U ZAHTEVU SE ŠALJE ISKLJUČIVO PORUKA!

Kako poslati mail?

POST http://localhost:5000/api/v1/MailService/SendMessage
body
{
    "user":"proba@proba.proba",
    "header":"Zahtev za prenos broja tu tu i tu",
    "message":"Poruka koja se prenosi"
}
ODGOVORI: 
    200 - sve ok
    40x - TODO za neispravan body poruke
    500 - greška do servera
    50x - TODO mikroservis nedostupan

#TODO
GET http://localhost:500/api/v1/MailService/MailAlive

Provera da li mail service dostupan

ODGOVORI:
    200 - sve ok
    500 - servis nedostupan 

