---
layout: post
title: Arkitekturella behovsdomäner
date: 2023-12-12
categories: callista
---
Hösten 2003 kom Eric Evans bok om Domain-Driven Design ut för första gången. Den ansågs som banbrytande och var en ögonöppnare för många inom mjukvaruutveckling. Den jämfördes med Martin Fowlers böcker om designmönster men det fanns en avgörande skillnad. 

Evans införde konceptet "domändriven utveckling", där huvudsyftet var att skapa lösningar nära kopplade till den verksamhetsdomän som systemet skulle betjäna och samtidigt bryta ner dess komplexitet.

I denna text utforskar jag behovsdomäner och hur de kan adresseras genom tre olika aspekter: operativ, taktisk och strategisk. Jag presenterar lite erfarenheter jag samlat på mig genom åren och som jag önskade att någon erfaren arkitekt hade förklarat för mig tidigare.




## Introduktion till domändriven arkitektur

På hösten 2003 publicerades Eric Evans bok _Domain-Driven Design: Tackling Complexity in the Heart of Software_. Jag hade just läst Martin Fowlers bok _Patterns of Enterprise Application Architecture_, och även om det är en mycket bra bok och mönstrena som beskrevs i boken fortfarande är relevanta idag, så var det något som skavde lite.

Det jag inte fick ihop var att mönstren alla beskrev hur och vad, men varför saknades.

Eric Evans bok lade till en aspekt där huvudsyftet med domändriven utveckling är att bygga lösningar som är tätt kopplade till den verksamhetsdomän som ska använda systemet och bryta ner dess komplexitet.

För att göra det behöver arkitekter, tekniska experter och domänexperter från verksamheten samarbeta och skapa en gemensam modell för den aktuella domänen. Det finns massor med bra material idag om man vill fördjupa sig i DDD. Ett exempel är den Cadec-presentation som @andreastell höll [2017 om DDD och mikroservices](/blogg/presentationer/2017/01/25/ddd/).

## Problemet

Att använda en domändriven ansats, speciellt om man även blandar in lite [beteendedriven utveckling](https://en.wikipedia.org/wiki/Behavior-driven_development) samtidigt, har genom åren visat sig vara en utmärkt strategi som hjälper mig analysera och förstå system.

Men tyvärr händer det ganska ofta att verksamhetsexperterna inom samma domän blir oense om vad domänen egentligen gör och vilka funktionella krav som är viktiga.

Ett sätt att lösa de knutarna och komma framåt snabbare är att introducera aspekter på kravdomänerna. Följande tre aspekter är bra att använda sig av.

## Operativ

![Operativ domän med ikoner som visar olika delar av en verksamhet.]({{site.baseurl}}/images/callista/domain-needs/behovsdomain-operativ.png "Operativ domän")

Den första, och den som de flesta är mest bekväma med att hantera, är den __Operativa__ behovsaspekten. I domänen ingår de delar av systemet som används dagligen. Här hittar man funktioner som har de högsta kraven på tillgänglighet och åtkomst. Nästan alltid handlar det idag om att ha en 24/7-tillgänglighet. Ofta uppstår störningar i verksamheten redan efter en kort tidsrymd om något system inte fungerar som det ska.

I ett exempel med en online-handel förväntar sig kunden att kunna gå in på siten och när som helst kunna se lagerstatus, beställa, betala, se status på sina ordrar och var transporten är. Även de som jobbar inom de olika verksamhetsdelarna förväntar sig att systemet fungerar som det är tänkt när de jobbar. Det är här man lägger ner mest tid i utvecklingen. Med rätta, eftersom det är här det mesta av värdet skapas.

## Taktiskt

![Taktisk domän med ikoner som visar taktiska aspekter.](/images/callista/domain-needs/behovsdomain-taktisk.png "Taktisk domän")

För att de operativa funktionerna ska fungera optimalt krävs att man även tittar på de __Taktiska__ aspekterna i domänmodellen. De här systemdelarna har oftast inte ett 24/7-behov utan är mer fokuserade på funktioner som behöver vara tillgängliga under kontorstid. Det kan finnas undantag, som t.ex. bedrägeridetektion.

De är viktiga för att täcka upp behoven av daglig planering och möjliggöra styrning av det dagliga operativa arbetet. En onlineshop behöver veta hur många produkter som sålts, vilka förpackningsmaterial som behövs, hur mycket personal som förväntas behövas och vad som finns i lager.

Om man har fysiska butiker behövs taktiska analyser av vad som säljer var för att planera transporter.

Och givetvis hittar vi hela planeringen av reklam på internet i den här aspekten.

I den taktiska aspekten ska mycket tid läggas på att analysera fram vilka händelser och metadata som behöver monitoreras och sparas för framtida analys. Många verksamheter agerar idag på intuition eller på schabloner. Om man istället kan agera datadrivet får de taktiska analyserna mycket större träffsäkerhet.

## Strategisk

![Strategisk domän med ikoner som visar strategiska aspekter.](/images/callista/domain-needs/behovsdomain-strategisk.png "Strategisk domän")

I den __Strategiska__ domänen hittar vi funktioner och systemstöd som är av långsiktig natur. Hur utvecklas vår verksamhet ekonomiskt? Hur ser de olika säsongerna ut? Hur kan vi jämföra oss med våra konkurrenter både nationellt och internationellt?

Jag har noterat att i den här domänen finns den största viljan att skapa smala och specialiserade, och tyvärr väldigt dyra, system för ett fåtal personer. Det är naturligt, eftersom det är här som de som kontrollerar ekonomin oftast arbetar. Det är också de som oftast klarar sig med COTS-produkter i botten och enklare modifieringar/specialiseringar av dessa.

Den strategiska domänaspekten är också där vi hittar de funktioner som handlar om beredskap. Vilka system och processer behöver vi för att klara en kris eller att vår datorhall slutar att fungera? Hur hanterar vi nya regler och regulativa krav som t.ex. GDPR eller hur man får och inte får använda AI?

## Livscykeln

![Visar hur de olika domänerna hänger ihop med varandra](/images/callista/domain-needs/behovsdomain-lifecycle.png "Livscykeln")

De olika aspekterna hänger ihop genom sina respektive verksamhetskontexter. Ur den Strategiska domänen kan man skapa modeller för att med insamlad data ge bättre beslut till både de Taktiska och de Operativa delarna. Idag finns det AI och ML-modeller att använda sig av för att förenkla analyserna, men den Strategiska domänen behöver driva vilka parametrar och vilken grunddata som ska användas i dessa modeller. Det är viktigt att ge experter inom respektive område, som t.ex. marknadsföring och logistik, möjlighet att skapa och använda expertmodeller. Speciellt viktiga är dessa som indata till taktiska analyserna.

Säkerhet är en stark drivkraft från den Strategiska domänen gentemot den Taktiska. Typiskt är det här hur man hanterar accessrättigheter till data och system och vilka regler som gäller för vilken information. Om grunden för hantering av identiteter, accessrättigheter och policies för hantering av data inte finns och stöttar övrig verksamhet ökar riskerna för dataläckage eller intrång.

Andra aspekter kan t.ex. vara hur mycket pengar man vill lägga ner på bedrägerianalys i en online-handel. Det går aldrig riktigt helt att förhindra bedrägerier eller försök, men det finns en brytpunkt när det kostar mer än det smakar.

Den Taktiska domänen driver de dagliga besluten. Det viktigaste att fokusera på här är hur man detekterar anomaliteter i den Operativa sidan och hur man från den Taktiska domänen kan styra detta på enklast sätt. Ofta handlar det om att tillgängliggöra de viktiga mätpunkterna till den operativa sidan och göra dem ansvariga för sin egen styrning. I slutänden är de ändå de som förstår sin verksamhet bäst.

## Sammanfattning

Genom att använda sig av dessa domän-aspekter i sin analys har jag som systemarkitekt haft det enklare att förklara varför olika funktioner som till synes tillhör samma domän egentligen är flera olika. Den Operativa driver genom sin genererade data funktioner i de Taktiska och Strategiska domänerna. Det betyder inte att man vill implementera bedrägeridetektion i logistik eller betalningssystemen (och jag har varit med om båda förslagen). Det är ett helt eget litet komplext system och en bra kandidat till att köpa in som tjänst istället.

Åt andra hållet driver behovet av data i de Taktiska och Strategiska aspekterna på framför allt icke-funktionella krav på datainsamling och mätpunkter som inte alltid är helt uppenbara ur en Operationell synvinkel. Vad behöver man för meta-data om det som produceras? 

När man väl lyckats bryta ner sin arkitektur i rätt kontexter, skapat sitt gemensamma verksamhetsspråk, vet vilka domänhändelser och värdeobjekt som flödar i systemet och lyckats sätta begränsningar på rätt sammanhang har man bara en utmaning kvar. Att övertyga domänägarna att ge tillräckligt mycket tid (läs pengar) att genomföra det på ett bra sätt. Hur man gör det?

> Det beror på...

Åt andra hållet driver behovet av data i de Taktiska och Strategiska aspekterna på framför allt icke-funktionella krav på datainsamling och mätpunkter som inte alltid är helt uppenbara ur en Operationell synvinkel. Vad behöver man för meta-data om det som produceras? 

När man väl lyckats bryta ner sin arkitektur i rätt kontexter, skapat sitt gemensamma verksamhetsspråk, vet vilka domänhändelser och värdeobjekt som flödar i systemet och lyckats sätta begränsningar på rätt sammanhang har man bara en utmaning kvar. Att övertyga domänägarna att ge tillräckligt mycket tid (läs pengar) att genomföra det på ett bra sätt. Hur man gör det?

> Det beror på...

[De flesta ikonerna i bilderna kommer från Freepik - Flaticon](https://www.flaticon.com/free-icons/togheter)

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2023/12/12/architecturedomains/)*
