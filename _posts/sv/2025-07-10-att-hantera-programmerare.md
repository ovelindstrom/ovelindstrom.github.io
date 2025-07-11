---
layout: post
title:  "En liten guide för hur man hanterar besvärliga programmerare"
date:   2025-07-10 10:00:00 +0200
categories: svenska 
---
Vi hamnade i en diskussion, ett gäng gamla uvar till programmerare som alla har det gemensamt att vi inte längre kan kalla oss programmerare egentligen. Några har lyckats få in ett C i sin titel, en del är Engineering Managers och de som har haft extra mycket otur, som jag, är systemarkitekter. Men vi har också det gemensamt att vi har varit (och kanske till viss del är) BesvärligaProgrammerare&trade;.

Det här är en liten sammanfattning av kvällens diskussioner. Specifika namn, platser och programmeringsspråk har ändrats för att skydda inblandade personer, som Trausti och Brander skulle säga.

## Besvärlig eller bara omogen?

Låt mig börja med att definiera vad vi kom fram till är en BesvärligProgrammerare&trade; och det är enklast med ett exempel. 

Alla programspråk har sina riktlinjer för hur man skriver. Java tycker att paketdeklarationer ska skrivas `com.acme.ecommerce.payment` med bara gemener rakt igenom och helst använda en ägd domän, men reversera ordningen. I C# är det `Acme.ECommerce.Payment` och PascalCase som gäller.

En besvärlig programmerare är den som skulle säga något sånt här när man ber denna att inte använda PascalCase i paketnamn i Java-klasser:

*"Det står faktiskt ingenstans i Javaspecificationen att paketnamn MÅSTE vara gemener, den säger bara att paketnamn ska följa samma regler som identifierare, och PascalCase är helt giltiga identifierare i Java. Javas community guidelines säger visserligen att man BORDE använda gemener, men det är bara en rekommendation, inte en del av språkspecifikationen. Och dessutom, om vi tittar på Sun's ursprungliga motivering så var det bara för att undvika konflikter med klassnamn - men med moderna IDE:er är det inte längre ett problem. Faktiskt så använder flera stora Java-bibliotek PascalCase i sina paketnamn, som Spring's `org.springframework.Boot` subpaket. Så egentligen är `Acme.ECommerce.Payment` helt enligt specifikationen och dessutom mer konsistent med resten av vår kodbas som följer Microsofts enterprise-standarder."*

Det här är typexemplet på en besvärlig programmerare och jag önskar att ovanstående vore AI-generarat, men det är i princip klippt från ett svar på en kommentar jag hade på en PR.

Tekniskt sett rätt - Java-kompilatorn kommer inte klaga. **Men man missar totalt poängen med kodkonventioner och teamarbete.**

Exemplet ovan innehåller det mesta som en BesvärligProgrammerare&trade; brukar använda sig av:

1. **Tekniskt korrekt** - det är inte explicit förbjudet att göra så, alltså är det tillåtet.
1. **Ställa specification mot konvention** - specificationer är alltid större än vad tolkningen, konventionerna och användningen av dem är.
1. **Historiska sammanhang** - använder gärna versioner av specificationer som har blivit ersatta av nyare.
1. **Falska prejudikat** - Hävda att "andra gör det", som med exemplet med Spring Boot. Ja, det finns väldigt tidiga Milestone-versioner där man kan hitta `org.springframework.Boot` (och det blir intressant nog mer och mer vanligt att AI skriver det så). Men det finns ingen aktuell och underhållen version av Spring Boot som innehåller det här paketnamnet.
1. **Självrättfärdigande** - hävda att det är mer konsekvent med andra, men i det här fallet helt irrelevanta, regelverk och standarder. Ofta använder BesvärligProgrammerare&trade; tyngden från de riktigt stora drakarna till att överskugga vad de anser vara mindre viktiga.

Det som skiljer BesvärligProgrammerare&trade; från en omogen eller omedveten programmerare är att den omogna antingen trodde att det inte var så viktigt hur man skriver eller helt enkelt inte visste.

## Identifieringen av en BesvärligProgrammerare&trade;

Teori är enkelt, men hur vet man om man har en BesvärligProgrammerare&trade; framför sig? 

I en privat One-to-One kan man ställa öppna frågor för att förstå vad som ligger bakom beteendet och utforska vilka mål som den man har framför sig har.

För skillnaden mellan hur en omogen programmerare och en BesvärligProgrammerare&trade; blir tydlig i hur de svarar:

*"Vad skulle du säga är viktigast när ni i teamet jobbar på samma kodbas?"*

- **Omogen programmerare**: "Att koden fungerar... eh, kanske att den är läsbar också?"
- **BesvärligProgrammerare&trade;**: "Att följa specifikationer korrekt och inte låta *godtyckliga* konventioner diktera arkitekturella beslut."

*"Hur ser du på kodkonventioner generellt?"*

- **Omogen**: "Jag förstår inte riktigt varför de är så viktiga eller varför jag ska lära mig dem. Men IntelliJ är ganska bra på att rätta mig."
- **BesvärligProgrammerare&trade;**: "De flesta konventioner är historiska artefakter som hindrar innovation och teknisk excellens. Jag förstår verkligen inte varför vi tvingat in SonarQube. Nu måste jag göra SuppressWarning eller //NOSONAR hela tiden för att få igenom mina byggen."

*"Vad händer när ditt team har en annan åsikt om en teknisk lösning än du?"*

- **Omogen**: "Jag skulle vilja förstå varför de tycker annorlunda."
- **BesvärligProgrammerare&trade;**: "Jag kodar och gör en Pull Request innan någon annan hinner börja som visar varför min lösning är tekniskt överlägsen. Vi ska inte slänga bort fungerande kod."

Den omogne programmeraren visar ödmjukhet och vilja att lära. BesvärligProgrammerare&trade; visar att hen ser sig själv som den enda som förstår "riktig" programmering.

En bonus, där jag inte har något exempel på **Omogen** är följande:

*"Så, nu när jag har gått igenom varför jag vill att vi använder hexagonal arkitektur och Ports-and-Adapters i vår kod, kan du tänka dig att skriva om den här koden och göra en ny PR?"*

- **BesvärligProgrammerare&trade;**: "Du, jag har över 20 års erfarenhet av programmering. Du behöver inte kränka min intelligens med att förklara hur hexagonal arkitektur fungerar." (Och sedan gör hen Abandon på PR:en och gör något annat istället)

Om någon kommer på ett bra svar på det så vill jag gärna veta.

## Men hur hanterar jag dem då?

Nu har vi gett tillräckligt många bra exempel på BesvärligProgrammerare&trade; men det kommer att dyka upp en del andra i kåserier framöver. Vad är lösningen på BesvärligProgrammerare&trade;?

> Ta bort deras gömställen!

Så enkelt var det...

En BesvärligProgrammerare&trade; kommer att fortsätta vara besvärlig och motsträvig så länge som det **finns ställen att gömma sig på.** De fortsätter med sitt beteende för att de helt enkelt kan övertyga sig själva, och ibland även andra, att vad de gör **egentligen** inte är dåligt.

Och det värsta är att det är vi som är arkitekter, chefer och teamkamrater som tillhandahåller de här gömställena åt dem och oftast just för att vi inte riktigt orkar ta fighten med BesvärligProgrammerare&trade;.

Lyckligtvis finns det ett par enkla saker man kan ta till för att ta bort de här gömställena, eller i alla fall göra dem så småa att det är besvärligt att gömma sig bakom dem.

1. **Ha en entydig definition på vad bra och framgångsrik är.** - Ärligt, det är taskigt att säga att någon har brutit mot spelreglerna om man inte har varit tydlig med hur man spelar. Det är inte Formel 1, utan systemutveckling vi håller på med.
1. **Använd ett klart och tydligt språkbruk framför att låta rätt.** - Det finns en massa termer som man "bör" använda sig av för att "låta rätt" för sin position. Chefsord som "hävstångseffekt" och "strategi" och givetvis arkitektens pentagram "robust, skalbar, flexibel, effektiv och återanvändingsbar". Skrota ord som är abstrakta i sin natur eller mångfasetterade. Använd dig så långt du kan av absoluta sanningar. Ja, det kommer att hända att de absoluta sanningarna ibland blir motbevisade och visar sig vara fel, men då använder man sig av den nya sanningen. Och ser till att man för en liten beslutslogg över när och varför man byter sanning. Det kallas ADR.
1. **Mät enligt de sanningar och standarder som är fastställda och inte några andra.** - När BesvärligProgrammerare&trade; försöker sig på trick som "Spotify gör minsann såhär" så är det inte ett fastställt och giltigt mätvärde. Man kör på vänster sida i England också. 

Rent praktiskt finns det tekniker som är användbara för att slippa diskussioner med BesvärligProgrammerare&trade;.

1. **Automatisera bort diskussionerna** - Använd de utmärkta verktyg som finns för de språk som ni använder er av; linters, formatterare, .editorconfig, statisk kodanalys o.s.v. När dessa säger nej så är det nej men det är inte en person som säger nej. Jag har försökt argumentera med SonarQube men den svarar inte. Ja, man måste ta bort möjligheterna till att använda t.ex. //NOSONAR eller i alla fall skapa ett mätvärde för hur många de är och hur många man accepterar eller hur man bedömmer om det är rättfärdigat att använda det i det här fallet.
1. **Dokumentera allt** - Det räcker tyvärr inte med att du säger hur du vill ha det, **du måste skriva ner det.** När någon börjar argumentera, så kan du bara hänvisa till "som vi skrev i vår arkitekturdokumentation". När de börjar argumentera hur arkitekturdokumentationen skrevs och varför de inte fick vara med och bestämma, hänvisa till processen för att ändra i arkitekturdokumentationen. Eller hur man uppdaterar vilka regler som ska användas i SonarQube.
1. **Öga mot öga** - Jag älskar PRs och när jag behöver vara riktigt jobbig så plockar jag upp något av de open source-project som jag har Committer Status på och är besvärlig mot de som försöker få in något i kodbasen. Men då gäller andra och fastställda spelregler och alla är med på och förväntar sig asynkron kommunikation. Alla har klivit in i oktagonen och satt in tandskydden. Men i ett team som ska samarbeta behöver man inte tillåta asynkrona gömställen. Det är mycket svårare att vara besvärlig när man har en kollega bredvid sig. Det är därför BesvärligProgrammerare&trade; föredrar att jobba ensamma där de kan "optimera" utan insyn och de kan gå ganska långt i sitt personliga beteende för att göra det så jobbigt som möjligt för andra team-medlemmar att närma sig dem. Allt från att alltid jobba från annat ställe, till att ha fysiska "tics" som av de flesta andra uppfattas som hotfulla eller jobbiga.
1. **Klockan är din vän** - "Den här PR:en behöver vara klar till fredag, annars flyttar vi den till nästa sprint." <br>BesvärligProgrammerare&trade; kan inte argumentera i oändlighet när klockan tickar. Sätt deadlines med konsekvenser.
1. **Definition of Done** - Ha en konkret checklista för när något är klart. Inga undantag, inga "men i det här fallet...". Antingen uppfyller koden alla punkter eller så gör den inte det. Nej, man kan inte skriva en *Definition of Done-Done* som gäller för testarna och en *Definition of Done-Done-Done* som gäller när man ska releasa.

## Handgemäng?

Så, nu har vi teorierna klara. Hur gör man då rent praktiskt när man hamnar i handgemäng med BesvärligProgrammerare&trade;?

Om du har en tydlig och entydig definition på framgång och har varit explicit med dina förväntningar så måste du kliva in och coacha och ge råd till de som du har ansvar för. **Men inte till någon annan.** Om det inte är ditt problem, se till att prata ihop dig med den som faktiskt har ansvaret för personen.

Det finns två nivåer i hur man gör det här. Den första är att använda sig av enskilda samtal, det som brukar kallas One-to-ones i modernt företagsspråk. Hur man gör det på bästa sätt kan ni Googla er fram till, men se till att hur man gör det och vad som förväntas är dokumenterat. Det här är ett kritiskt och väldigt jobbigt steg, för det händer ganska ofta att ni kommer fram till att det är du som är det egentliga problemet och borde skärpa dig. Om det är så, gör något åt det först.

Om ni däremot har alla saker som jag beskriver satta och det finns dokumentation på det så borde det vara ganska solklart för er båda vem det är som kommer till korta. Vad du ska leta efter är om de primärt har förstått vad som förväntas av dem och helt enkelt inte har haft förmågan att leverera. Det är i de här mötena, speciellt med juniora och omogna utvecklare, som man snabbt hittar möjligheter till att coacha och göra dem bättre. Oftast handlar det om att de är omedvetet inkompetenta. Att då spendera extra tid med dem betalar sig i längden. Det är därför som lärlingsprogram funkar så bra om de görs rätt. 

Och här är den distinkta skillnaden. Den omogna utvecklaren trodde inte att det var så viktigt. En BesvärligProgrammerare&trade; kommer att aktivt inte bry sig. En omogen utvecklare kommer med lite hjälp att bli bättre och bättre och vara den som försvarar era uppsatta regler bäst. Om de inte gör det så är de redan BesvärligProgrammerare&trade; eller i värsta fall inkompetenta på riktigt. (Och hur man fångar blåa elefanter, det vet alla)

Men ibland hjälper det inte med att ha samtal öga mot öga, privat, på ett kontrollerat sätt. Då är det dags att ta det publikt och använda tyngden hos mångfalden och hastigheten i diskussionen för att skapa en massa som inte går att argumentera emot.

> När man använder sig av t.ex. kod som inte följer de uppgjorda kodstandarderna som exempel är det oerhört viktigt att man skapar en miljö där det är tydligt att det är koden och inte kodaren som är det som är oacceptabel.

Mitt favorit-trick här är att använda mig av den fastställda processen för att ändra på kodstandarder. Om man har sagt att SQL-frågor ska skrivas så att nyckelorden är i versaler och en utvecklare envist fortsätter att skriva `select * from MyTable` så kallar jag till ett möte med ämnet "Förändringar i hur vi skriver SQL i vår kod" och ställer de olika typerna av statements mot varandra.

Det här fungerar nästan alltid just för att det för den stora massan i rummet är helt solklart att det ska göras på det sätt som vi har kommit överrens om. Ibland gör det inte det, och då ändras kodstandarden. Svårare än så är det inte.

Det här är inte bekvämt och det är att "söka en konflikt" som HR skulle säga. Men det är viktigt av ett par olika anledningar:

1. **Det skapar en möjlighet för grupptryck/gruppstöd att fungera.** - Om hela teamet samlas runt BesvärligProgrammerare&trade; och har en gemensam åsikt så kommer BesvärligProgrammerare&trade; att utgöra den svagaste länken. En normal person ger sig då och tar tillfället i akt att be om hjälp att bättra sig och skapar på så sätt ett mer sammanhållet team. Tyvärr så händer det att BesvärligProgrammerare&trade; istället hävdar sin rätt, ofta med senioritet i företaget som förevänding, för att få sin vilja igenom. Då måste man ge resten av gruppen stöd i att skapa en situation som gör det besvärligt och inte så kul för BesvärligProgrammerare&trade; att vara kvar.
1. **Det skickar en signal att du menar allvar i det du säger** - Jag föredrar att coacha så länge jag bara kan och orkar. Men det kommer alltid till en punkt där man måste sätta ner foten och säga "ledsen, men nu accepterar jag inte det här längre".
1. **Det ger möjlighet till självreflektion** - Ibland är BesvärligProgrammerare&trade; bara på fel ställe och borde vara någon annanstans. Att ge dem möjlighet att själv inse att de har en annan syn på hur man ska agera som inte passar med den som de är i och frivilligt hitta ett nytt ställe som kan härbärgera deras sätt att vara är alltid bättre för alla än att behöva avsluta, stänga av eller säga upp dem.


## Ibland går det inte

När du är framme vid "sista chansen" för BesvärligProgrammerare&trade; att ändra på sig är det ännu viktigare att du är tydlig. Dokumentera att ni har nått till den punkten nu och när du vill se en förbättring. Om den inte kommer så har ni för olika sätt att se på hur saker ska göras och som ansvarig chef/arkitekt har du tolkningsföreträdet. 

Om du har personalansvaret för BesvärligProgrammerare&trade; så måste du dra av plåstret och faktiskt säga upp personen. Det kommer egentligen inte att komma som en överraskning för BesvärligProgrammerare&trade; men hen kommer att spela chockad. Mest för att hen inte tror att du skulle våga göra det som alla har sett komma.

En intressant reflektion jag gjorde när jag var den som var BesvärligProgrammerare&trade; och blev uppsagd var hur lättat jag blev över att slippa ta beslutet själv. 

För de flesta som blivit BesvärligProgrammerare&trade; är det för att de fastnat i ett fack och aldrig fått hjälp att ta sig ut. Då är ett avslut ett sätt att komma bort från gropen. 

I princip alla som var med och diskuterade den här kvällen hade varit BesvärligProgrammerare&trade; vid något tillfälle. En av dem insåg att han var det just nu.

## Slutreflektion

Det ironiska med den här diskussionen är att vi alla satt där - f.d. (och pågående som sagt) BesvärligaProgrammerare&trade; - och gav råd om hur man hanterar BesvärligaProgrammerare&trade;. Vi hade alla varit "den där personen" som argumenterade för teknisk korrekthet framför teamarbete, som tyckte att vi visste bättre än konventioner, som såg oss själva som de enda som förstod "riktig" programmering.

Skillnaden var att vi växte ur det. Eller tvingades växa ur det.

Kanske är det viktigaste insikten från kvällen inte hur man hanterar BesvärligaProgrammerare&trade;, utan hur man hjälper dem att bli bättre versioner av sig själva. För under all den tekniska envishet och alla de falska prejudikaten finns oftast någon som bara vill skriva bra kod och göra rätt för sig.

Problemet är att de har fastnat i tron att "tekniskt rätt" är samma sak som "rätt", och att de kan argumentera sig till framgång.

Men programmering är inte ett soloäventyr. Det är lagarbete. Och i lagarbete gäller andra regler än i tekniska specifikationer.

## TL;DR

**BesvärligProgrammerare&trade;** = tekniskt korrekt men missar poängen med teamarbete helt.

**Identifiera skillnaden:**
- **Omogen**: "Jag förstår inte varför, men jag kan lära mig"
- **Besvärlig**: "Specifikationen säger inte att jag MÅSTE..."

**Ta bort gömställena:**
1. Tydliga definitioner och dokumentation
2. Automatisera med linters/verktyg
3. Pair programming och deadlines
4. Definition of Done utan undantag

**När det inte hjälper:**
- Öppna diskussioner i grupp
- Sätt ultimatum med konsekvenser
- Säg upp dem (de blir ofta lättade)

**Slutsats:** De flesta av oss har varit besvärliga programmerare någon gång. Skillnaden är om man växer ur det eller fastnar i det.



















