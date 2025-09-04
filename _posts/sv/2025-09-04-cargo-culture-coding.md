---
layout: post
title:  "Cargo Cult Coding"
date:   2025-09-04 10:00:00 +0200
categories: svenska 
---


**Cargo Cult Coding: När vi kopierar ritualer istället för att förstå värde**

Den här bloggen baserar sig på en presentation jag gjorde på en internkonferens idag, fast ingen bett mig om det. ;)

Den ör en liten betraktelse över hur vi gör en del dumma saker inom systemutvecklingen. Presentationen hittar ni som [PDF här]({{ "/images/posts/Cargo_Cult_Coding.pdf" | relative_url }}). Det är en hel del polimik i det hela och det ska läsas med en stor glimt i ögat.

Har du någonsin undrat varför vissa metoder och verktyg inom mjukvaruutveckling, trots att de lovar guld och gröna skogar, sällan lever upp till förväntningarna i praktiken? 

Kanske beror det på "Cargo Cult Coding" – ett fenomen där vi kopierar de ytliga ritualerna utan att förstå det underliggande "varför".

Det hela börjar i Stillahavsöarna Melanesien under Andra Världskriget. Öborna observerade hur amerikanska soldater byggde landningsbanor satte på sig hörlurar och uttalade ord och fraser och tryckte på knappar. Efter det kom flygplan och släppte värdefulla "lådor" med godsaker. Efter kriget, i hopp om att godsakerna skulle återvända, byggde öborna egna landningsbanor och flygledartorn av bambu, komplett med kokosnöts-hörlurar. De imiterade soldaternas rörelser och fraser, men flygplanen kom aldrig tillbaka. De kopierade formen, men missade funktionen.

Den berömde fysikern Richard Feynman myntade begreppet "Cargo Cult Science" för att beskriva liknande beteenden inom vetenskapen, där man följer metoder utan verklig förståelse. Inom mjukvaruutveckling ser vi samma mönster av Se, Kopiera, Förvänta sig effekt, Misslyckas.

  * **Agil Utveckling:** I lådan finns kundnöjdhet, hastighet och autonoma team. Landningsbanorna är dagliga stand-ups, Jira-tavlor och sprint-backlogs. Men istället får vi stand-ups som statusrapporter, ingen ständig förbättring och retrospektiv med samma gamla punkter som aldrig åtgärdas. Fokus flyttas från värdeskapande till att rapportera aktiviteter. **Quick-fix:** Fokusera på vilket värde som skapas, inte bara "vad gjorde du igår".

  * **Code Reviews:** Löftet är snabbare time to market, bättre säkerhet och delad kunskap. Landningsbanorna är obligatoriska Pull Requests och verktyg som SAST, DAST och Linters. Resultatet blir ofta oändliga reviews som godkänns utan djupare granskning, säkerhet som en bockruta (94% känner sig säkra efter ISO27001/SOC2-audit, men 62% av hackade företag är certifierade\!), och kodstilsdiskussioner istället för fokus på logik och säkerhet. **Quick-fix:** Automatisera styling vid push och fokusera kodgranskningen på logik och säkerhet.

  * **Microservices:** Lockelsen är skalbarhet, felisolering och snabbare driftsättning. Vi bygger API Gateways och använder orkestreringsramverk. Men vi slutar ofta med "distribuerade monoliter", pladdriga tjänster som äter bandbredd, och operationell överhettning. Komplexiteten underskattas enormt. **Quick-fix:** Förstå verkligen gränserna mellan dina tjänster. Om du inte kan rita det på en whiteboard är det förmodligen för komplext.

  * **Containerisering och Orkestrering:** Standardiserade miljöer, snabb utveckling och skalbarhet utlovas med Docker och Kubernetes. Men vi får containeriserade monoliter, bristande hälsokontroller och en naiv användning av taggar som `:latest`. Utvecklare tvingas hantera nätverksstrukturer och resursgränser de inte förstår. **Quick-fix:** Börja enklare med Docker Compose eller "serverless" innan du hoppar på Kubernetes. Förstå behoven före implementering.

  * **DevSecOps:** Lådan innehåller snabbare time to market, kunskapsdelning och reducerad risk. Vi automatiserar byggen, använder scannrar och "shift-left" QA. Men vi automatiserar ofta trasiga processer, prioriterar verktyg över kultur, och säkerhet blir en automatisk kryssruta. Vi riskerar att göra fel saker snabbare och oftare. Vi vill fortfarande ha utveckling först, så vi gör "shift-leftier". **Quick-fix:** Ha en topp-3-lista över verkliga hot i ditt system och fokusera på dem. Uppdatera listan om systemets gränser ändras.

**Att bryta mönstret: Sluta apa efter, börja förstå**

För att undvika Cargo Cult Coding behöver vi en grundläggande förändring:

  * **Börja med "Varför?"** Definiera problemet du försöker lösa innan du väljer en lösning.
  * **Investera i Kulturen:** Verktyg löser inte mänskliga problem. Främja samarbete och psykologisk säkerhet.
  * **Omfamna Lärande:** Anamma ett "Shu Ha Ri"-tänk: lär dig reglerna, ifrågasätt dem, och innovera sedan.
  * **Fokusera på Människor:** Ge teamen möjlighet att äga sina processer, reflektera och anpassa sig.

I slutändan handlar det inte om att kopiera de senaste trenderna, utan om att förstå de underliggande principerna och anpassa dem till vår unika kontext. Annars riskerar vi att, likt öborna, vänta på lådor som aldrig kommer.
