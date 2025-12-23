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
    "type"": (number) tip poruke koji se salje -- OPCIONI PARAMETAR
}

Tip poruke samo menja izgled template-a za slanje poruke, moze i da se izostavi
    OTP - 0
    PasswordReset = 1,
    Info = 2,
    Promo = 3

ODGOVORI: 
    200 - sve ok
    40x - za neispravan body poruke
    500 -  mikroservis nedostupan

GET http://localhost:500/api/v1/MailService/MailAlive
#TDLR Provera da li mail service dostupan

Posto API nema klasican ping opciju, napravljeno je tako da zatrazimo statisticke podatke profila, na mikroservis to odbacije i vraca samo da li je dobio te podatke ili ne, u buducim verzijama ti podaci mogu biti implementirani za potrebe nekog admin panela.

ODGOVORI:
    200 - sve ok
    500 - servis nedostupan 

