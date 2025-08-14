---
layout: post
title:  "Om att räkna passagerare in en buss"
date:   2025-08-14 10:00:00 +0200
categories: svenska 
---

Observabilitet är inte lätt att förstå sig på. Ganska ofta när jag diskutterar med både produktledning och utvecklare så finns det ett motstånd till att göra observerbara strukturer till en första klassens objekt. Nästan alltid när frågan kommer upp om statistik eller metrik så handlar det om att på något sätt använda databaser och dess information till att derivera fram den information man frågar efter. Här kommer ett exempel från verkligheten. Jag har ändrat namnet på tabellerna och entiteterna samt ändrat namn på platser och liknande för att skydda eventuella inblandade utvecklare. ;)

## Problem 1: Ruttplanering

Vårt fiktiva system hanterar busstransporter mellan ett antal olika orter och tillåter att passagerare bokar in sig på en rutt, så länge som det finns tillräckligt med plats i bussarna som är tilldelade till just den rutten.

Datamodellen som används ser då ut såhär:

```sql
CREATE TABLE Busses (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    max_seats INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    from_destination VARCHAR(255) NOT NULL,
    to_destination VARCHAR(255) NOT NULL
);
```
Nu kan man alltså lagra vilka bussar man har och hur många man kan få in och vilka rutter som finns tillgängliga.

För att koppla samman dessa så används en klassisk kopplingstabell:

```sql
CREATE TABLE Route_Assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT,
    bus_id INT,
    FOREIGN KEY (route_id) REFERENCES Routes(route_id),
    FOREIGN KEY (bus_id) REFERENCES Busses(bus_id)
);
```

Hmm... här noterar den observanta att det varken i `Routes` eller `Routes_Assignment` finns direkt information om hur många passagerare som får plats totalt.

Det har man löst genom att använda följande fråga direkt i koden:

```sql
SELECT
    r.route_id,
    r.from_destination,
    r.to_destination,
    COALESCE(SUM(b.max_seats), 0) AS calculated_max_passengers
FROM
    Routes r
LEFT JOIN
    Route_Assignments ra ON r.route_id = ra.route_id
LEFT JOIN
    Busses b ON ra.bus_id = b.bus_id AND b.is_active = TRUE
GROUP BY
    r.route_id, r.from_destination, r.to_destination;
```

Varför har man valt att göra så här när servicen som faktiskt hanterar hur man räknar ut max antal passagerare eller lägger till, tar bort eller deaktiverar bussar, allt görs från samma tjänst? Huvudorsaken är att det är så man alltid har gjort och det här är ett traditionellt och mycket använt sätt att utveckla applikationer på.

Man skulle kunna lösa det med en VIEW, som hade varit det enklaste sättet att ge SQL server möjlighet att planera bättre men som fortfarande hade varit långsam för stora datamängder, eller använda store procedure, som hade gett servern ännu bättre optimeringsförutsättningar

Ett modent sätt att göra det på hade infört en hexagonal arkitektur och inte tillåtit att någon annan service än "Route Manager Service" manipulerar på Routes och att "Bus Instance Manager" på något sätt skickar ett event till de som behöver veta det om en buss blir aktiv eller faller bort.

Så bara genom att införa ytterligare en kolumn i `Routes` tabellen så har vi fått bort den komplexa storleksfrågan.

```sql
CREATE TABLE Routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    max_passengers INT NOT NULL,
    from_destination VARCHAR(255) NOT NULL,
    to_destination VARCHAR(255) NOT NULL
);
```

Givetvis går det att skapa SQL-triggers som uppdaterar den här kolumnen när man uppdaterar bussarna på en rutt eller om man uppdaterar `Busses.is_active` men det gömmer logiken i databasen istället för att hanteras i applikationen. Applikationen i det här fallet har all information den behöver i sin lista över Bussar så det skulle vara enkelt att göra något liknande det här för att tilldela en buss till en rutt:

```javascript
// NodeJS-style
async function assignBusToRoute(busId, routeId) {
  const bus = await db.getBus(busId);
  const transaction = await db.beginTransaction();
  try {
    await transaction.execute('INSERT INTO Route_Assignments (bus_id, route_id) VALUES (?, ?)', [busId, routeId]);
    await transaction.execute('UPDATE Routes SET max_passengers = max_passengers + ? WHERE route_id = ?', [bus.max_seats, routeId]);
    await transaction.commit();
    console.log("Success!");
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to assign bus:", error);
  }
}
```

och så inversen när man ska ta bort en buss från en rutt.

Eftersom webbappen som hanterar Rutterna också hanterar Bussarna så är det enkelt att när man deaktiverar en buss helt enkelt iterera över de rutter där bussen är planerad och se om det skapar underkapacietet eller inte. Jag kan säga att så var det inte löst...

## Problem 2: Passagerarbokningar

För att registrera en passagerare hittar vi följande tabell:

```sql
CREATE TABLE Booked_Passengers (
    passenger_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    route_id INT,
    checked_in_bus_id INT DEFAULT NULL,
    FOREIGN KEY (route_id) REFERENCES Routes(route_id),
    FOREIGN KEY (checked_in_bus_id) REFERENCES Busses(bus_id)
);
```

Så nu kan vi alltså ställa följande frågor:

```sql
SELECT GREATEST(COALESCE(SUM(b.max_seats), 0) - COUNT(bp.passenger_id), 0) as capacity_left
FROM Routes r
LEFT JOIN Route_Assignments ra ON r.route_id = ra.route_id
LEFT JOIN Busses b ON ra.bus_id = b.bus_id AND b.is_active = TRUE
LEFT JOIN Booked_Passengers bp ON r.route_id = bp.route_id
WHERE r.route_id = ?;
```

Hmm... den här typen av fråga känner jag igen. Den liknar ju den som vi hade ovan för att räkna ut max antal passagerare så vi skulle ju egentligen kunna göra såhär för att i en enda fråga få ut all information lite logiskt:

```sql
SELECT 
    r.route_id,
    r.from_destination,
    r.to_destination,
    COALESCE(SUM(b.max_seats), 0) as calculated_max_passengers,
    COUNT(bp.passenger_id) as booked_passengers,
    GREATEST(COALESCE(SUM(b.max_seats), 0) - COUNT(bp.passenger_id), 0) as capacity_left
FROM Routes r
LEFT JOIN Route_Assignments ra ON r.route_id = ra.route_id
LEFT JOIN Busses b ON ra.bus_id = b.bus_id AND b.is_active = TRUE
LEFT JOIN Booked_Passengers bp ON r.route_id = bp.route_id
WHERE r.route_id = ?
GROUP BY r.route_id, r.from_destination, r.to_destination;
```

Men så var inte fallet... Istället så itererar man över alla rutter som man ser i gränssnittet, gör SQL-frågan (två upp) och räknar sedan fram antal bokade passagerare som `calculated_max_passengers - capacity_left`.

## Problem 3: Incheckning

Nu kommer vi till det roligaste problemet, och det är när passagerarna faktiskt kommer till bussterminalen och ska kliva på bussarna. Eftersom passagerarna kan kliva på vilken av de planerade bussarna som helst, så registrerar systemet vilken buss som en viss passagerare har klivit ombord på. Det är helt korrekt förfarande. Men, applikationen som man registrerar in passagerare på bussarna visar också hur många som finns i varje buss, och hur många platser det finns kvar. Men det går oerhört långsamt när det är många passagerare och bussar och av någon anledning så går det långsamt att registrera in passagerare.

Vi kikar i koden:

```javascript
const mysql = require('mysql2/promise');

async function getCheckedInPassengerCounts(connection, busIds) {
    let results = {};
    
    try {
        // Lock the Booked_Passengers table for alterations
        await connection.execute('LOCK TABLES Booked_Passengers WRITE');
        
        // Iterate over each bus ID and get checked-in passenger count
        for (const busId of busIds) {
            const [rows] = await connection.execute(
                'SELECT COUNT(bp.passenger_id) as checked_in_passengers FROM Booked_Passengers bp WHERE bp.checked_in_bus_id = ?',
                [busId]
            );
            
            const checkedInPassengers = rows[0].checked_in_passengers;
            const maxPassengers = await getMaxPassengers(connection, busId);
            
            results[busId] = `${checkedInPassengers}:${maxPassengers}`;
        }
        
    } catch (error) {
        console.error('Error getting passenger counts:', error);
        throw error;
    } finally {
        // Always unlock tables
        await connection.execute('UNLOCK TABLES');
    }
    
    return results;
}
```

Hmm... vad gör `const maxPassengers = await getMaxPassengers(connection, busId);`? Vi kan ju hoppas att den  har en Map med busId:s och dess kapacitet, men så visade det sig inte vara utan man ställer den komplexa JOIN-frågan som plockar fram calculated_max_passengers för alla router till databasen vid VARJE fråga och så ittererar man över svaret tills man hittar rätt routeId...

## Counters

Egentligen är vi bara intresserade av räknarna medans vi håller på att lasta ombord passagerarna. Så genom att initerar en 