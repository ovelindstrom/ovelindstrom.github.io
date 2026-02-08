---
layout: post
title: Cloud Native & Container Day 2024
date: 2024-03-25
categories: callista
---

Jag har varit på Cloud Native & Container Day. Här kommer en kort reflektion och takeaways från årets evenemang och lite om vad som är hett och vad som kommer.



Den 6 mars, tillbringade jag en dag tillsammans med de ledande leverantörerna av kontainerteknik och teknik runt vårt favoritsätt att paketera applikationer och system numera.

Dagen arrangeras av Conoa, som även i år hade gjort ett väldigt bra arrangemang ute på Quality Hotel Friends.

Det första som slog mig är hur synkroniserade alla talare (och därmed närvarande leverantörer) är när det gäller ett par saker:
- [Cloud Native Computing Foundation](https://www.cncf.io/) är centralt för att hålla överflödet av varianter kompatibla med varandra.
- Ingenting har egentligen ändrat sig. Ingenting körs egentligen på Kubernetes; det behövs fortfarande OS, hårdvara och nätverk. Det är bara lite enklare att hantera och dela dessa resurser.
- Cloud Native är inte synonymt med publika moln.
- Säkerhet är den centrala utmaningen.
- Öppna API:er är framtiden. Undvik att låsa in dig i låsta produkter.

## Det handlar om personer

Att gå över till kontainerteknik, i praktiken någon paketering av Kubernetes, handlar nästan uteslutande om personer och mindre om teknik. Det behövs en strategi för vad man vill göra med sin förflyttning till Cloud Native och se till att ledningens förväntningar stämmer överens med vad som är möjligt.

Ett exempel är att infrastrukturkunskap fortfarande kommer att behövas. Det som är nödvändigt är att det görs tillgängligt för utvecklarna tidigare i utvecklingsprocessen, det som brukar kallas för Shift Left. Idag kan så lite som 15-20% av en utvecklares tid vara programmering och 50-60% läggs på att bråka med infrastrukturen. Det finns undersökningar som visar att 36% av utvecklarna lämnar för ett nytt jobb på grund av dåliga utvecklarmiljöer och en infrastruktur som är en silo.

Det vanligaste är att man då skapar ett projekt för att skapa en utvecklarplattform på Kubernetes för att skapa en bättre och effektivare utvecklingsorganisation. Det jobbet ges nästan alltid till infrastrukturoganisationen. Som då löser sina problem. Man tror att om man bygger det som så kommer utvecklarna att komma och använda det. Tyvärr är det inte alltid fallet. Tänk om Kevin Costner hade byggt en basketplan i "Field of Dreams"...

[![Field of Dreams](https://img.youtube.com/vi/o3c_pJ_CLJQ/default.jpg)](https://www.youtube.com/watch?v=o3c_pJ_CLJQ)

- Förstå vad som är den största smärtpunkten och lös det behovet för dina användare/utvecklare.
- Ha ett tydligt mål och se till att du mäter rätt KPI:er för plattformen.
- Designa för en bra användarupplevelse. Om dina utvecklare gillar YAML, ge dem YAML. Om de vill ha en stor röd knapp, ge dem en stor röd knapp.
- Starta med en TVP! (Thinnest Viable Platform)
- Uppfinn inte hjulet. Det finns en poäng med att följa de standarder som CNCF har tagit fram, som t.ex [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).


## If you don't snooze, you lose

Vad och när används dina kontainrar egentligen? Behöver de köras 24/7? Genom att använda sig av telemetri och skaffa sig insikt i vad som händer i systemet kan man konfigurera det så att systemet bara använder så mycket resurser som är nödvändigt. Stäng ner utvecklingsmiljöer nattetid, använd triggers för att starta administrativa system som bara används nu och då. Det sparar el och el är koldioxid och vi ska vara rädda om miljön.

![cncd-climat.jpg]({{site.baseurl}}/images/callista/cncd-climat.jpg)

## Säkerhet

Här är egentligen pudelns kärna och det som var det viktigaste jag tar med mig från den här dagen. Det handlar, inte helt oväntat, mest om säkerhet.

Första området där det finns bra systemstöd idag är att hålla koll på vad som finns i systemet och framför allt vad som förväntas finnas där.

Vi förväntar oss att kontainrar ska vara oförändringsbara och det är relativt enkelt att få till det i ett kontainerbaserat system. Men det är som alltid svårt att skydda sig mot mänskliga fel och mer eller mindre avsiktligt illvilliga aktiviteter.

Lösningen är att hålla reda på att systemet är inom givna ramar och inte driver iväg.

![tpms.jpg]({{site.baseurl}}/images/callista/tpms.jpg)

Och så behöver man sätta säkerhet tidigt i utvecklingsprocessen, alltså Shift Left.

## Sammanfattning

På det hela taget var presentationerna förvånansvärt befriade från aktivt sälj. Ja, man presenterar ett problem och hur presenterande leverantörens produkt kan lösa problemet. Men det är CNCF först. "Vi är en av produkterna som är CNCF-kompatibla" var något som återkom i princip i alla presentationer.

På det hela taget var presentationerna förvånansvärt befriade från aktivt sälj. Ja, man presenterar ett problem och hur presenterande leverantörens produkt kan lösa problemet. Men det är CNCF först. "Vi är en av produkterna som är CNCF-kompatibla" var något som återkom i princip i alla presentationer.

Conoa har samlat de om är branchledande inom respektive område och utställarområdet representerade en komplett bild över modern kontainerisering och kringliggande produkter.


Det som skaver lite är att alla pratar om att just deras problemområde behöver komma tidigt i utvecklingsprocessen, Shift Left. "If everything is Shift left, what is then left to do right?"

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2024/03/25/cloud-native-container-day/)*