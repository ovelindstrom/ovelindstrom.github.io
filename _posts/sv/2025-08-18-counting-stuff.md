---
layout: post
title:  "Om att räkna passagerare in en buss"
date:   2025-08-18 10:00:00 +0200
categories: svenska 
---

Observabilitet är inte lätt att förstå sig på. Ganska ofta när jag diskuterar med både produktledning och utvecklare så finns det ett motstånd till att göra observerbara strukturer till en första klassens objekt. Nästan alltid när frågan kommer upp om statistik eller metrik så handlar det om att på något sätt använda databaser och dess information till att derivera fram den information man frågar efter. Det är speciellt vanligt inom brancher där lagkrav och regelverk hur och vilken information som ska lagras. Många har tyvärr föreställningen att man inte får utöka de definierade datamodellerna med vad man behöver i verksamheten. Baserat på ett par olika uppdrag över de senaste 10 åren har jag skapat ett lite exempel. Jag har ändrat namnen på tabellerna och entiteterna samt använd en helt annan domän för att skydda eventuella inblandade utvecklare men i stort sett är det taget från verkligheten.

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
Nu kan man alltså lagra vilka bussar man har och hur många sittplatser det finns i dem. Man kan även lagra vilka rutter som finns tillgängliga. Hur enkelt som helst.

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

Nu har vi en komplett datamodell som ser ut sårhär:

![Datamodell för bussbokning](/images/posts/datamodell-busses.svg)

Hmm... här noterar den observanta att det varken i `Routes` eller `Routes_Assignment` finns direkt information om hur många passagerare som får plats totalt men ruttadministratörerna ville ha den siffran i sin vy för att slippa sitta och summera varje buss själv.

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

Varför har man valt att göra så här när det bara är en tjänst som faktiskt hanterar hur man räknar ut max antal passagerare eller lägger till, tar bort och deaktiverar bussar?

Huvudorsakerna kan delas in i två olika delar. Det första är att kraven och regelverket för trafikplanering inte direkt säger att man behöver lagra maxantalet för en rutt. Fast det säger inte att man inte får, men varför chansa. Det andra är att det är så man alltid har gjort och det här är ett traditionellt och historiskt använt sätt att använda applikationen och därför också hur man utvecklat applikationen.

Man skulle kunna lösa det med en `VIEW`, som hade varit det enklaste sättet att ge SQL server möjlighet att planera bättre men som fortfarande hade varit långsam för stora datamängde.

Man kan använda sig av en `Stored Procedure`, som hade gett servern ännu bättre optimeringsförutsättningar. 

Ett ännu bättre sätt hade varit att använda sig av `Materialized View` för att få en snabbare läsning av data. Om man nu vill behålla den här typen av databaslogik som en del av hur man skriver applikationer.

Ett mer modernt sätt att göra det på är att införa en hexagonal arkitektur och inte tillåta att någon annan service än "Route Manager Service" manipulerar på Routes och att "Bus Instance Manager" på något sätt skickar ett event till de som behöver veta det om en buss blir aktiv eller faller bort.

Så bara genom att införa ytterligare en kolumn i `Routes` tabellen så har vi fått bort den komplexa storleksfrågan och kan uppdatera max antal passagerare när vi ändå ändrar i rutten.

```sql
CREATE TABLE Routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    max_passengers INT NOT NULL,
    from_destination VARCHAR(255) NOT NULL,
    to_destination VARCHAR(255) NOT NULL
);
```

Givetvis går det att skapa SQL-triggers som uppdaterar den här kolumnen när man uppdaterar bussarna på en rutt eller om man uppdaterar `Busses.is_active` men det gömmer logiken i databasen istället för att hanteras i applikationen. Det är i praktiken vad en Materialized View gör åt dig.

Applikationen i det här fallet har all information den behöver i sin lista över Bussar så det skulle vara enkelt att göra något liknande det här för att tilldela en buss till en rutt:

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

Eftersom webbappen som hanterar Rutterna också hanterar Bussarna så är det enkelt att iterera över rutterna när man deaktiverar en buss och ta bort den från en planerad rutt. Om det skapar underkapacietet kan man då stödja att administratören måste sätta in en ny buss innan man kan ta bort det inaktiverade. Jag kan säga att så var det inte löst i det här fallet utan det krävde en full körning av passagerarrapporten för att se om det fanns tillräckligt med kapacitet kvar i bussarna och man räknade om alla rutterna hela tiden även om den bussen inte var tilldelad till den rutten.

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

Men så var inte fallet... Istället så itererar man över alla rutter som man ser i gränssnittet, gör SQL-frågan (två upp) och räknar sedan fram antal bokade passagerare som `calculated_max_passengers - capacity_left`. I gränssnittet.

## Problem 3: Incheckning

Nu kommer vi till det roligaste problemet, och det är när passagerarna faktiskt kommer till bussterminalen och ska kliva på bussarna. Eftersom passagerarna kan kliva på vilken av de planerade bussarna som helst, så registrerar systemet vilken buss som en viss passagerare har klivit ombord på. Det är helt korrekt förfarande enligt regelverken.

Applikationen som man registrerar in passagerare på bussarna med visar också hur många som finns i varje buss, och hur många platser det finns kvar. Men det går oerhört långsamt när det är många passagerare och bussar och av någon anledning så går det långsamare att registrera in passagerare när det är många bussar samtidigt.

Vi kikar i koden:

```javascript
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
Ja, ni ser rätt. Den här koden är inte effektiv. Den låser hela tabellen `Booked_Passengers` för skrivning, vilket gör att andra transaktioner som försöker läsa eller skriva till den tabellen måste vänta. Det är inte bra för prestandan, speciellt om det är många passagerare som ska checka in samtidigt.

Hmm... vad gör `const maxPassengers = await getMaxPassengers(connection, busId)`? 

Vi kan ju hoppas att den  har en Map med busId:s och dess kapacitet, men visade det sig inte vara så. Istället ställer den komplexa JOIN-frågan som plockar fram calculated_max_passengers för alla router till databasen vid **VARJE** fråga och så itererar man över svaret tills man hittar rätt routeId. Detta för att det finns en policy inom organisationen som säger att det BARA får göras beräkningar i en specifik komponent i systemet.

Här drabbas systemet av att man hela tiden behöver ha databasen konsistent och samma komponent i systemet har fått ansvar för att både registrera ny data och räkna på dessa.

## Räknare

Egentligen är vi bara intresserade av hur många som är i varje buss och olika totalsummor medan vi håller på att lasta ombord passagerarna. Så genom att initera ett antal räknare när vi startar lastningen av bussarna får vi det mycket enklare och mer effektivt.

De räknare vi behöver är:
- Totala antalet passagerare lastade - initieras till 0
- Total kapacitet kvar - initieras till summan av alla säten i bussarna och räknas ner.
- En uppsättning med ovanstående räknare, men baserat på bussId.

Jag skulle också, för enkelhetens skull, lägga till en konstant som håller Maximalt antal säten i bussarna och Maximalt antal passagerare så att det enkelt går att ta visa hur många säten det finns över i varje buss och hur många passagerare som ännu inte stigit på.

Min pseudokod blir något i den här stilen:

```javascript
class BusRouteCounters {
    constructor(connection, routeId) {
        this.connection = connection;
        this.routeId = routeId;
        
        // Bus counters: busId -> { passengerCount: number, capacityLeft: number, maxSeats: number }
        this.busCounters = new Map();
        
        // Route totals
        this.routeTotals = {
            totalPassengers: 0,
            totalCapacityLeft: 0,
            totalMaxSeats: 0
        };
        
        this.initialized = false;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        try {
            // Get all buses assigned to this route with their capacity
            const [buses] = await this.connection.execute(`
                SELECT DISTINCT b.bus_id, b.max_seats 
                FROM Busses b
                JOIN Route_Assignments ra ON b.bus_id = ra.bus_id
                WHERE ra.route_id = ? AND b.is_active = TRUE
            `, [this.routeId]);
            
            // Initialize bus counters
            for (const bus of buses) {
                // Get current passenger count for this bus
                const [passengerRows] = await this.connection.execute(`
                    SELECT COUNT(bp.passenger_id) as checked_in_passengers 
                    FROM Booked_Passengers bp 
                    WHERE bp.checked_in_bus_id = ?
                `, [bus.bus_id]);
                
                const currentPassengers = passengerRows[0].checked_in_passengers;
                const capacityLeft = Math.max(0, bus.max_seats - currentPassengers);
                
                this.busCounters.set(bus.bus_id, {
                    passengerCount: currentPassengers,
                    capacityLeft: capacityLeft,
                    maxSeats: bus.max_seats
                });
                
                // Update route totals
                this.routeTotals.totalPassengers += currentPassengers;
                this.routeTotals.totalCapacityLeft += capacityLeft;
                this.routeTotals.totalMaxSeats += bus.max_seats;
            }
            
            this.initialized = true;
            console.log(`Counters initialized for route ${this.routeId}`);
            this.printStatus();
            
        } catch (error) {
            console.error('Error initializing counters:', error);
        }
    }
    
    // Register a passenger to a specific bus (up latch passenger count, down latch capacity)
    async registerPassengerToBus(passengerId, busId) {
        const busCounter = this.busCounters.get(busId);
        
        // Update database - set checked_in_bus_id for the passenger
        // This could be done as creating an event and send it to a worker thread.
        await this.connection.execute(`
            UPDATE Booked_Passengers 
            SET checked_in_bus_id = ? 
            WHERE passenger_id = ? AND route_id = ?
        `, [busId, passengerId, this.routeId]);
        
        // Up latch passenger count
        busCounter.passengerCount++;
        this.routeTotals.totalPassengers++;
        
        // Down latch capacity left
        busCounter.capacityLeft--;
        this.routeTotals.totalCapacityLeft--;
        
        console.log(`Passenger ${passengerId} registered to bus ${busId}. New counts: ${busCounter.passengerCount}/${busCounter.maxSeats}`);
    }
     
    // Get bus status
    getBusStatus(busId) {
        const busCounter = this.busCounters.get(busId);
        if (!busCounter) {
            throw new Error(`Bus ${busId} not found in route ${this.routeId}`);
        }
        
        return {
            busId: busId,
            passengerCount: busCounter.passengerCount,
            capacityLeft: busCounter.capacityLeft,
            maxSeats: busCounter.maxSeats,
            occupancyRate: ((busCounter.passengerCount / busCounter.maxSeats) * 100).toFixed(1) + '%'
        };
    }
    
    // Get route totals
    getRouteTotals() {
        return {
            routeId: this.routeId,
            totalPassengers: this.routeTotals.totalPassengers,
            totalCapacityLeft: this.routeTotals.totalCapacityLeft,
            totalMaxSeats: this.routeTotals.totalMaxSeats,
            totalOccupancyRate: ((this.routeTotals.totalPassengers / this.routeTotals.totalMaxSeats) * 100).toFixed(1) + '%'
        };
    }
    
    // Get all bus statuses
    getAllBusStatuses() {
        const statuses = [];
        for (const busId of this.busCounters.keys()) {
            statuses.push(this.getBusStatus(busId));
        }
        return statuses;
    }
}
```

## Summering

Det finns ett antal olika sätt att göra det här och jag är egentligen inte emot att använda SQL om det handlar om normaliserad data. En lite guide för när man ska använda vilken metod i SQL.

| Metod                      | Läshastighet | Datauppdatering       | Bäst för...                                                        |
|:---------------------------|:-------------|:----------------------|:-------------------------------------------------------------------|
| View                       | Långsam         | 100% Realtid        | Förenkling och för att gömma komplexa joins.                       |
| Stored Procedure           | Långsam         | 100% Realtid       | Bäst för återanvändning och för att kapsla in databaslogik.        |
| Trigger med Stored Column | Snabbast      | 100% Realtid        | Maximal läshastighet och garanterad data-integritet.               |
| Materialized View          | Snabb         | Inaktuell tills den är uppdaterad | Högprestandarapportering  av data som inte ändrar på sig så ofta.  |

Med räknare så har vi alltid en konstant läshastighet på O(1) och om vi vill så skulle vi kunna göra det event-drivet och lägga uppdateringarna av databasen i en egen worker. Om vi kikar på vad SQL frågorna kostar så blir det lite mer komplext. För beräkningen av totalkapaciteten så får vi $$O(N_{routes} + N_{assignments} + N_{busses})$$

Nerbrutet så får vi följande effekt:
- Databasen måste komma åt alla rader i `Routes` eftersom den är bas-tabellen.
- När vi gör en `JOIN` på `Route_Assignments` måste vi lägga på ytterligare ett N. I värsta fall måste vi även här göra en full scan av tabellen.
- Och så gör vi ytterligare en `JOIN` på `Busses` vilket kan göra att vi får en full scan.
- Och om vi gör en `GROUP BY` så kommer vi, i värsta fall, att behöva göra en full scan på det dataset som vi skapat med våra joins.

Det här är helt okej så länge som alla tabeller är små. Men när datamängderna växer, med många bussar, många passagerare och många rutter, så blir det snabbt långsamt (pun intended). Speciellt om man inte har en bra indexering på sina tabeller. I en simulering jag gjorde där jag stängde av indexeringen så närmade sig komplexiteten $O(N*M)$ för varje `JOIN`.

Moderna SQL-motorer som Postgres och SQL Server är väldigt bra på att optimera det här för att få hög prestanda men med mycket uppdateringar får man ojämn prestanda då den databasmotorn ibland får för sig att indexera om helt och hållet. Det blir även viktigare med att ställa in hur många och hur länge man behåller en planerad fråga i minntet.

**Det finns ingenting som slår direkt minnesåtkomst.**

Om vi gör ett antagande att vi har en rutt med 4 bussar, 100 passagerare så är det inte mer än drygt 100 Java-object att skapa som i minnet skulle ta ca 10 kilobytes. Så även om vi skulle ha 240 rutter med 3 bussar och säg 70% fullt så är det fortfarande bara runt 2 MB i minnet för att hantera en hel dag. Och det finns många bra ramverk, som Spring Data JPA, för att förenkla den här typen av hantering.

Det är också värt att notera att det här exemplet är ganska enkelt och inte tar hänsyn till alla de komplexiteter som kan uppstå i verkliga system, som samtidiga uppdateringar, felhantering och transaktionshantering. I verkligheten var systemet mycket mer komplext och det som mördade prestandan var just den här typen av JOINs som gjordes i realtid för att räkna ut saker i ett mycket större antal dimensioner.

En fälla som man också gått i är att dynamiskt skapa SQL-frågor i applikationen istället för att använda sig av en databasmodell och olika vyer och procedures som är anpassade för att hantera den här typen av frågor. Det är inte "fel" att göra det men det är inte optimalt. Att konkatenera fram en SQL fråga baserat på vilken fråga som ställs från klienten och sedan exekvera den gör att databasmotorn inte kan optimera frågan på samma sätt som om den hade fått en statisk fråga att jobba med. Det är också mycket svårare att felsöka och underhålla.

Vid en analys av vilka frågor som ställdes mot databasen så var det också tydligt att det var samma frågor som ställdes om och om igen, trots att det underliggande datat inte hade ändrats. Genom att använda räknare och cachning av resultatet så kunde vi minska antalet frågor mot databasen och istället bara uppdatera räknarna när det var nödvändigt. Vi sparade också mycket tid genom att skapa en grundfråga som hämtade all information (i storleksordningen 100 MB i minnet) och sedan använda sig av strömmar för att filtrera och bearbeta datat i minnet istället för att göra stora och komplexa frågor mot databasen. Intressant nog så sjönk också minnesanvändningen i applikationen eftersom vi inte behövde hålla alla rader i minnet utan bara de som var relevanta för den aktuella operationen.

Vad som till slut gjorde att vi kunde optimera frågorna var införandet av statistik och loggning av vilka ingående frågor som faktiskt ställs från kunderna. Genom att kunna analysera hur kunderna faktiskt ställde frågor kom vi fram till att en lösning där vi håll det mesta av informationen in minnet och filtrerade baserat på query-parametrar gjorde systemet mycket snabbare.

Ett exempel, om vi använder buss-systemet, är att när mobilklienterna frågar efter hur många som är i deras buss så är det samma cachade svar som när trafikledningen ville se statusen för varje buss i sin stora skärm för att kunna skicka fram nästa. Systemet blockerade alla mobilklienter för läsning och skrivning varje gång som trafikledningen uppdaterade sina skärmar. I det nya systemet strömmas räknarna ut till klienterna vid uppdatering.

Så databaser är bra. Jag gillar databaser. Men allt ska inte göras i en databas. Och när det sedan kommer till sådant som användarbeteende så tycker jag faktisk att metrik-ramverk, som t.ex Micrometer, ett mycket bättre sätt att hantera det på. Men det är en helt annan diskussion.

