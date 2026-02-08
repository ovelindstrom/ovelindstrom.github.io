---
layout: post
title: Data i rörelse
date: 2023-11-16
categories: callista
---
För en tid sedan höll Confluent en dag med temat "Data in Motion".  I denna utforskande text sammafattar jag mina intryck av dagen och ger min syn på den ständigt växande världen av datahantering inom IT-branschen. 

Från traditionella metoder för att samla och lagra data till moderna arkitekturmönster som Data Mesh och det dynamiska landskapet av dataströmmar. Jag utforskar konceptet av data som en produkt, hanteringen av komplexiteten i dagens system, och de utmaningar som uppstår när man hanterar data i rörelse. 

Och jag reflekterar över den övergripande frågan - är det värt att övergå till strömmad data? Det beror på...



> "Jaha, du jobbar med data!" - _Min mormor_

Och det stämmer mycket väl med verkligheten för oss som främst är mjukvarufokuserade inom IT-branschen. Det mesta av vår vardag handlar om att samla in, lagra, bearbeta och tillgängliggöra data.

Traditionellt samlade vi in data och lagrade i databaser som vi sedan ställde frågor till. Vi ägde vår egen silo, men ibland behövde ett annat system också veta vad vårt system visste. Då skapade vi ett API så de kunde fråga oss. Fast det andra systemet ville veta när vi ändrade på något i vår databas. Så vi skapade Change Data Capture-kopplingar så att vi kunde observera förändringar i databaserna.

Men om det är en sak som skapar allergiska reaktioner, speciellt hos systemarkitekter, så är det hårda beroenden.

Komplexiteten i de system som skapas idag blir större och större. Vi samlar in data från många olika källor och delar denna data med många delar av systemet. Eller till och med olika system av vilka vissa inte alltid är driftade tillsammans. Att hantera den här komplexiteten är idag en av våra största arkitektutmaningar. Hur gör man det?

> "Det beror på..." - _Anonym it-arkitekt_

## Data som produkt

Det är lätt att tänka på data endast i dess isolerade kontext. Idag är istället en datainstans, eller delar av den, en källa för att kunna producera metadata runt.

Ett analogi som gör det enklare att förstå är mjölk. Ur en slutkonsuments synvinkel är det en ganska enkel produkt. Vilken storlek på förpackningen, fetthalt, bäst-före-datum och pris.

Men om vi börjar från producenten, vet vi vilken ko mjölken kom ifrån? Och vilken bondgård? Och hur länge låg mjölken i gårdens mjölktank innan den hämtades av vilken tankbil?

Och när vi kom till mejeriet, vilka bakterietester togs på mjölken, hur hög fetthalt var det i den och vad användes mjölken till? Vilket näringsinnehåll var det i den mejeriprodukt som till slut skapades. Och så fortsätter det. Plötsligt har vi en massa metadata om mjölken och dess resa genom produktionen som också behöver hanteras. 

__Data är som mjölk.__

Hur hanterar vi all denna metadata?

> "Det beror på..." - _Anonym informationsarkitekt_


## Data mesh

För att kunna hantera den här komplexiteten är arkitekturmönstret _Data Mesh_ ett alternativ. Syftet är att varje dataproducent ansvarar för sin egen dataprodukt och hur den publiceras till de som behöver konsumera den som alternativ till att lagra all data centralt. Det möjliggör att datakonsumenter mer flexibelt kan tillgodose sig den data som finns i systemet och publicera sin vy eller metadata. Kopplingen mellan producent och konsument blir svagare. Sådant gör alltid en systemarkitekt glad.

Det finns utmaningar i att introducera en data mesh-arkitektur som vi känner igen från databaser. Att skapa konsistens i den data som flödar i systemet är det som är viktigast att nämna. En så "enkel" sak som att definiera hur ett datum och tid ska representeras i systemet. Är det ISO-8601 eller Epoch Timestamp? Ännu svårare kan det vara att definiera verksamhetsnära dataobjekt.

Det är också viktigt att man vet vem som är ägare av datadefinitionen (vilket inte alltid är den som producerar data) och vilken kontext som data befinner sig i för tillfället. Som i exemplet med mjölk så är bondens, mejeriets och näringslaboratoriets kontexter väldigt olika ur datasynvinkel även om alla handlar om samma mjölk.

Med de regulatoriska krav vi har idag, såsom GDPR och hänsyn till den personliga integriteten, är en annan utmaning att säkerställa att rätt delar av systemet får tillgång till känslig data. Här måste producenten av data ansvara för att bara rätt konsumenter kan tolka informationen.

En lösning på detta kan vara att så lång som möjligt pseudonymisera framför allt data som kan bindas till levande personer och begränsa vilka system som kan avkoda personlig data.

## Data i rörelse

![datainmotion1.png]({{site.baseurl}}/images/callista/datainmotion1.png)

Om vi kommer tillbaka till mjölken. Givetvis kan alla dessa dataproducenter skapa och spara sin data i sina egna databaser och sedan, vid ett givet tillfälle, göra stora och batchbaserade analyser och transformationer av dessa. Men vill vi som äter kanelbullar med mjölk att den mikrobiologiska analysens resultat kommer efter att vi har druckit upp mjölken?

Lösningen är att hantera data när den är i rörelse. 

Det finns få användningsfall där processning av data senare slår att processa data nu. Här kommer dataströmmar och ramverk som Apache Kafka, Flink, Druid och liknande in. Vi kallar det för realtidsströmmar, men i verkligheten handlar det om att definiera acceptabla fördröjningar. För det mesta är några sekunders fördröjning helt okej. Om 99% av alla händelser hanteras inom 100 ms är det fantastiskt. Om man har behov av fördröjningar under 10 ms så har man ändå ett nätverksproblem (och det är infrastrukturs problem).

Min personliga syn på realtidsdata är att det är viktigare att fokusera på konsistens och att förstå vilken kvalitet data har än att det har låg latens. Det senare är ett optimeringsproblem, och som känt är prematur optimiering roten till allt ont. Fokusera istället på att detektera när konsistensen är utanför acceptabla nivåer och vad som ska ske då.

Men ska man ha allt data i rörelse hela tiden?

> Det beror på... - _Anonym databasarkitekt_

Det är lätt att frestas att använda t.ex. Apache Kafka för att lagra all data i hela systemet. Problemet är att då att man bara skapat en annan typ av central databas. Lösningen på detta är att förstå att det är i de dataströmmande applikationerna som det verkliga värdet skapas och inte betrakta Kafka bara som en datapump mellan olika system. 

Det man vill ha i Kafka är de händelser och den information som man __verkligen behöver nu__. Allt annat kan sparas på ett mer ekonomiskt sätt så att systemet kan hämta det vid behov.

Ett väldigt bra exempel på en sådan värdeskapande produkt är Splunk. Det är inte i applikationernas loggar eller andra datakällor som värdet ligger. Det är istället att kunna överblicka helheten i Splunk. Det är där vi ges möjlighet att se både infrastrukturens och applikationernas metriker och snabbt kunna förstå vilken del som egentligen har problem. Där skapas det verkliga värdet. Splunk är dyrt. Att använda dataströmmar och produkter som Kafka och Flink för att transformera data och tidigt filtrera bort irrelevanta fält lönar sig i längden.

## Data Lakes

Men hur kommer då Data Lakes-konceptet in i den här bilden?

> Det beror på... _En anonym dataanalytiker_

Och det beror oftast på att vi inte vet från början om allt vi samlar in behövs och i vilken form. Och om vi behöver transformera det på ett annat sätt än vi trodde från början. Och att vi genom att skapa ett gemensamt dataformat ger möjlighet för dataanalytiker att se nya dataprodukter. Det är data i ett annat kontext ur vilket vi kan förfina och optimera de värdeskapande strömmarna. De kan också behövas för att producera om den data som behövs i nuet om denna har tappats bort.

Om vi går tillbaka till exemplet med Splunk kan det innebära att vi från vår Data Lake väljer att strömma in mer data till Splunk för att kunna göra bättre analyser.

## Sammanfattning

![dim_groundcontrol1.png]({{site.baseurl}}/images/callista/dim_groundcontrol1.png)

Dataströmmar är inte ett race, det är en resa. Det är inte alltid viktigast att komma fram fort, utan att komma fram säkert.

Dataströmmar är komplexa men hjälper till att bryta ut data ur sina silos.

Dataströmmande produkter som Apache Kafka och Flink är open source och gratis att starta med. Men en varning är på plats. De är inte gratis som en öl på krogen. De är gratis som i en "gratis valp". Den kommer att växa upp till en större hund och du kommer att behöva lägga tid och pengar på allt från matskålar till, om du har otur, veterinärer.

Dataströmmar kräver att du har en tydlig informationsägare och är överens om gemensamma dataformat.

Data i rörelse slår nästan alltid data i vila. Egentligen är en dataström bara en batchprocess utan start och slut.

Är det värt att gå över till strömmad data?

> Det beror på... _Ove Lindström, IT-arkitekt_

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2023/11/16/data-in-motion/)*