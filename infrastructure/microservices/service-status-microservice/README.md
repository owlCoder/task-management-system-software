Service status microservice

Da bi microservice ispravno radio potrebno je da imate:
1. unutar tabele microservices servise koje zelite da merite
2. .env file adresu mikroservisa
3. Unutar Domain/constants definisanu rutu za health ili neki drugi mikroservis

Health service ->
Na odredjen vremenski interval checkInterval prolazi kroz sve mikroservise i skuplja njihovse statuse
#Prilikom testiranja smanjiti interval na 10-30 sekundi kako bi servis imao dovoljno podataka da pravilno rukuje s njima :)


postoje 3 opcije
    Operational = Sve je kako treba
    Partial_Outage = Odgovorio je ali mu je trebalo vise od 100 ms
    Down = Servis nije dostupan! --> ukoliko je sve ispravno ovo se nece desavati

GC service -->
Prolazi kroz bazu i brise stare zapise

gcIinterval -> koliko cesto prolazi
retenationOk -> koliko cesto brise sve statuse osim DOWN
retenationDown -> koliko cesto brise DOWN iliti ispade

Logger --> standardan

Kontroleri -->

Microservice 

Sustinski CRUD operacije sve vezano za mikroservise

Measurement

Standardne CRUD operacije +

getUptime() vraca prosecan upTime mikroservisa za taj mikroservis po formuli
(Operational_tog_dana/ukupno_tog_dana) * 100 -> zaokruzeno na dve decimale

getLatestStatuses() -> vraca triple 
Ime servisa | uptime(%)  | trenutni_status

averageResponseTime -> prima kao parametar broj dana za koliko treba unazad statistika
vraca u formatu:
datum+vreme | avgResponseTime
