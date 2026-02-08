---
layout: post
title: Sagan om två datum
date: 2024-02-29
categories: callista
---
> It was the best of `java.time.Date`, it was the worst of `java.utl.Date`.  
> - not Charles Dickens

Använder du forfarande `java.util.Date`? 

Gör inte det. 

Varför? Det finns bättre sätt att hantera både kalenderdatum och tid i `java.time` paketet. Ta 10 minuter för att förstå vad klasserna i `java.time` kan göra för dig.



Idag är det skottdagen 2024 så vad är lämpligare än att prata lite om datum och tid i vårt favoritspråk Java.

Vi firar snart 10-årsjubileum av att Java 8 släpptes och i den releasen hittar vi [JSR-310](https://jcp.org/en/jsr/detail?id=310). Den gav oss ett väldigt brett API för att arbeta med datum och tid.

Ändå ser vi än idag exempel som använder `java.util.Date` och `java.util.Calendar`och vi får förslag från AI-verktyg som ska hjälpa oss att koda som ser ut såhär:

![ai-java-util-date.png]({{site.baseurl}}/images/callista/ai-java-util-date.png)

Okej, vi kanske måste använda oss av `java.util.*` när vi använder gamla legacy-system eller bibliotek, men nu har de ändå haft 10 år på sig att ändra på sig.

## Så vad var det egentligen som är så fel med Java Date API?

`java.util.Date` var felkonstruerat redan från början när Java 1.0 släpptes 1996. Det visste man om från Sun och det existerar en del kul historier från den tiden om hur diskussionerna gick om just hanteringen av tid. Redan i 1.1 deprecerades i princip alla metoder och man flyttade dem till den abstrakta `java.util.Calendar` och implementationsklassen `java.util.GregorianCalendar`. Men även dessa ansågs vara mer eller mindre "trasiga".

`java.util.Date` användes brett, trots att den var gravt missförstådd av utvecklarna. Speciellt har den missförståtts och använts på ett sätt som gränsar till övergrepp av utvecklare av bibliotek och bara skapat ännu mera förvirring. Ofta var man tvingad att skapa adaptrar för att konvertera mellan olika biblioteks interna datum och tidshantering. 

Det fanns bra initiativ, som [Joda-time](https://www.joda.org/joda-time/), som blev lite av en de facto standard och som sedan ledde till JSR-310. Numera rekommenderar de själva att man använder `java.time` istället men släppte ändå en ny version så sent som den 4 mars 2023. Den innehåller lite små roligheter som inte finns i `java.time`.

Det som varit svårast att förstå för utvecklare är att en `Date`-instans representerar ett __ögonblick__ i tiden och inte ett __datum__. Det gör att:

- den har ingen information om tidzon
- den saknar format
- den saknar kalendersystem

Det ger i sin tur ett antal följdproblem:

- År hanteras som två siffror, med start 1900. Det gör att man måste göra alternativa lösningar för att hantera datum före 1900.
- Månader är 0-indexerade. Januari är 0 och december är 11. Så många "off by one" fel hade kunnat undvikas.
- Klasserna i `java.util.*` är muterbara!! Så om du inte ville att någon skulle kunna manipulera på ett datum som du skickade in i en annan metod, så var du tvungen att klona det först.
- Det skiljer på formatet mellan `java.util.Date`, som representerar en Datum-Tid-tupel, och hur datum representeras i SQL. Så då fick man konvertera till `java.sql.Date` istället och den representerar bara ett singulärt datum. Så ofta var det i själva verket `java.sql.Timestamp` som skulle ha använts. En date är inte alltid en date, så att säga.
- Under ytan används indirekt det underliggande systemets lokala tid och tidzon. T.ex i `toString()`. Gissa om det har förvirrat utvecklare som sitter i olika tidzoner då `java.util.Date` inte är tidzonmedveten.

## Den nya tiden

Något behövdes göras och i Java 8 introducerades ett helt nytt Date & Time API som addresserar de problem som fanns med `java.util.Date`. Det var Stephen Colebourne (som var den som skrivit mycket av Joda-Time) och Oracle som tillsamamns skapade nya `java.time` under JSR-310.

I JSR-310 drevs framför allt tre kärnidéer.

- __Immutable-value classes__. Den största svagheten i det gamla formaterarna, som `java.util.SimpleDateFormat`, var att de inte var trådsäkra.
- __Domändriven design__. Stephen drev hårt tesen att domänerna Datum och Tid har olika användningsfall och därför ska vara i olika domäner. Därför representeras de i det nya API:et av skilda klasser. När man anpassar sin kod från gamla APIer till Java SE 8, krävs det att man själv tänker efter hur ens egen applikations domänmodell egentligen använder sig av Datum och Tid.
- __Separeringen av kronologier.__ Det finns andra kalendrar än de som definieras i ISO-8601, som den som används i Japan. Med en helt egen domän för kalendrar kan man representera vilken kalender som helt. Inklusive den [Klingonska kalendern](https://startreklitverse.com/klingon-calendar-introduction.php).

## Välkommen `java.time`

Det nya API:et lades i Java 8 till i paketet [`java.time`](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html) och återfinns numera i `java.base` modulen. Inte helt oväntat följer den samma struktur och format som Joda-Time.

Alla klasser är oförändringsbara (immutable) och därför trådsäkra. Alla manipulationer på en klass returnerar ett nytt objekt och förmodligen finns det redan en manipulations-metod redan som du kan använda utan att behöva tänka efter eller i detalj förstå hur temporal aritmetik ska hanteras.

I `java.time` paketet finns klasser för datum, tid, datum/tid, tidzoner, ögonblick (instants), varaktighet och tidsmanipulation. Alla klasser använder sig av ISO-8601 formatet.

Några av de vanligast använda klassern är:
- [Clock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Clock.html) som ger dig access till nuvarande ögonblick, datum och tid med en tidzon. Används istället för `System.currentTimeMillis()`.
- [LocalDate](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html) som ger ett datum utan tidzon, t.ex 2024-02-26.
- [LocalTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalTime.html) som ger en tid utan tidzon, som 13:37:42.
- [LocalDateTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDateTime.html) som kombinerar LocalDate och LocalTime, men fortfarande utan tidzon.
- Behöver man tidzoner så används [ZonedDateTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZonedDateTime.html) där man dekorerar en LocaleDateTime med en [ZoneId](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZoneId.html) och [ZoneOffset](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZoneOffset.html).
- [Duration](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Duration.html) representerar en tidslängd över tidsaxeln, i millisekunder. Bland annat finns metoden [between](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Duration.html#between(java.time.temporal.Temporal,java.time.temporal.Temporal)) som tar två Temporaler, som en LocalDateTime, och returnerar hur länge det är mellan dem (i minst sekunder). 
- Klassen [Period](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Period.html) gör samma sak, men på år, månad och dag-nivå.

Exempel:

```java
// Få fram det lokala datumet
final LocalDate date = LocalDate.now();

// Få fram den lokala tiden
final LocalTime time = LocalTime.now();

// Få fram den lokala date/time
final LocalDateTime datetime = LocalDateTime.now();
// eller
final LocalDateTime dateTime = LocalDateTime.of(date, time);

// Räkna ut hur länge det är mellan två tidpunkter
final LocalDateTime from = LocalDateTime.of(2024, Month.January, 18, 17, 0, 0, 0);
final LocalDateTime to = LocalDateTime.of(2025, Month.January, 24, 13, 0, 0, 0);

// Tid/Dagar mellan Cadec 2024 och 2025.
final Duration duration = Duration.between(from, to);
final Period period = Period.between(from, to); 
```

Den här koden demonstrerar skillnaden mellan just Duration (som tidsaxel) och Period (kalenderfokuserad).

```java
final LocalDateTime to = LocalDateTime.of(2025, Month.JANUARY, 24, 13, 0, 0, 0);

// Varaktighet
final Duration duration = Duration.between(from, to);
// Skriv ut varaktigheten
System.out.println("Duration: does not handle years, " +
	" does not handle months, " +
    duration.toDays() + " days," +
    duration.toHours() + " hours."); // 24 * days + 20 timmar.

// Konvertera LocalDateTime till LocalDate och skapa en Period
final Period period = Period.between(from.toLocalDate(), to.toLocalDate());
        
// Skriv ut perioden.
System.out.println("Period: " + period.getYears() + " years, " +
	period.getMonths() + " months, " +
    period.getDays() + " days.");
```

En av de metoder som kom till i Java 9 var möjligheten att skapa en [Stream](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html) av datum med hjälp av [datesUntil(LocalDate endExclusive)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html#datesUntil(java.time.LocalDate)). Man kan också skapa en stream med Period som argument och då enkelt kunna filtrera fram t.ex. måndagar.

```java
LocalDate startDate = LocalDate.of(2024, 1, 1);
LocalDate endDate = LocalDate.of(2024, 12, 31);

// Filtrera ut Måndagar med hjälp av datesUntil() och filter()
var mondays = startDate.datesUntil(endDate.plusDays(1))
    .filter(date -> date.getDayOfWeek() == DayOfWeek.MONDAY)
    .collect(Collectors.toList());

// Skriv ut alla måndagar under 2024.
for (LocalDate monday : mondays) {
    System.out.println(monday);
}
```

Ytterst användbart när man vill titta på statistik eller göra något speciellt om det är en specifik typ av dag.

## Parsning och formattering

Parsning av strängar till objekt i `java.time` görs med `parse(String str)` metoden. De finns alltid även i en variant där man kan skicka med en [`DateTimeFormatter`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html).

En sak som är värd att nämna är parsning av varaktigheter och perioder. ISO-8601 definierar ett format för att beskriva varaktigheter som `P[n]Y[n]M[n]DT[n]H[n]M[n]S` eller `P[n]W`. Eftersom man i Java har två klasser där Duration hanterar tid upp till dagar, t.ex `P2DT3H30M` och Period hanterar dagar eller mer (allt fram till T) så blir parsningen av ISO-strängar för varaktigheter lite knepigare. Man behöver dela upp parsningen så att Period hanterar det som är till vänster om `T`och Duration det till höger. Har kan det vara bra att titta på Joda-Time.

```java
String isoDurationString = "P2Y6M14DT12H12M12S";
String[] durationParts = isoDurationString.split("T");

Period period = Period.parse(durationParts[0]);
Duration duration = Duration.parse("PT" + durationParts[1]);

System.out.println(period.toTotalMonths());
System.out.println(duration.toMinutes());
```

Om man inte skapar sitt eget format, används ISO-formaten som t.ex [ISO_ZONED_DATE_TIME](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html#ISO_ZONED_DATE_TIME) som använder formatet `2011-12-03T10:15:30+01:00[Europe/Paris]`. I DateTimeFormatter finns de flesta av de vanligaste ISO-formateringarna som konstanter.

På samma sätt kan man använda sig av metoden `format(DateTimeFormatter formatter)` för att formatera en temporal till det format man behöver. Alla `toString()`-metoder använder sig av ISO-8601-formatet.

DateTimeFormatter är, till skillnad från sin föregångare i `java.util`, trådsäker och går att återanvända mellan olika trådar.

Detaljer om formatterare och andra klasser att titta på finns i paketet [`java.time.format`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/package-summary.html).


## Kalendrar

I sitt grundutförande så används ISO-8601 kalender, eller det som kallades _GregorianCalendar_ `java.util`. Andra kalenderformat, så som Japanska kalendern, hittar man i `java.time.chrono`. Java 9 lade till en antal kalendra och förfinade dem.

## Vägen till nya Date och Time API

En `java.util.Date` representerar i paraktiken ett ögonblick på tidslinjen, i UTC, och som en kombination av tid på dagen och vilket datum. Det gör att vi kan konverterar det till ett antal olika typer i `java.time` beroende på vårt faktiska användningsfall.

![java.time.png]({{site.baseurl}}/images/callista/java.time.png)

I Java 8 lade man till metoden `toInstant()` som gör att man kan konvertera en `java.util.Date` och `java.util.Calendar` till `java.time.Instant`. `java.sql.Date` kommer däremot att kasta ett exception om man anropar `toInstant()`. Det är för att `java.sql.Date` inte har någon tids-komponent. Det finns en metod `toLocalDate()` som kan användas istället. `java.sql.Timestamp` har däremot både `toInstant()` och `toLocalDateTime()`. Det blir lätt förvirrande.

Ett exempel på hur man kan använda `toInstant():

```java
java.util.Date date = ...;
java.util.Calendar calendar = ...;
LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
LocalDateTime.ofInstant(calendar.toInstant(), ZoneId.systemDefault());
```

## Externa bibliotek

När Java 8 kom var det få externa bibliotek, så som XML, JSON och JPA som hade stöd för `java.time`. Nu, 10 år senare, har lyckligtvis alla de stora anpassat sig den nya tiden.

Om du trots det hittar bilbiotekt som forfarande använder `java.util.Date` så har du två alternativ, i prioritetsordning:

1. Om det är ett Open Source-projekt som fortfarande används mycket, skriv om det och gör en PR.
2. Om det är en kommersiell produkt, välj en annan... ;)

## Summering

Java har som princip att alltid försöka vara bakåtkompatibelt så långt det går. Där för är alla metoder i `java.util` som har med datum och tid att göra inte deprekerade, men många kodanalysverktyg och IDE:er varnar idag om man använder sig av dessa klasser.

Sedan JSR-310 har det egentligen inte hänt några större saker i förhållande till `java.time`. Det har mest varit anpassningar av andra delar av Javas standardbibliotek. Några noterbara saker som hänt är:

- I Java 11 blir `java.time` de facto standard i alla delar av Java som använder datum eller tid. Java 11 var den första LTS-versionen efter Java 8 och mycket resurser lades på att inget i Javas standardbibliotek längre skulle använda `java.util`.
- I Java 12 tillförde ett par nya metoder i LocalDate och LocalTime för att bättre hantera start på dagen `atStartOfDay(ZoneId)` över tidzoner.
- Java 14 innehöll några utökningar av datumformattering. 
- Java 16 lades det till aretmetiska operationer för framför allt med avseende på tidzoner.
- Java 17 fick slutligen utökningar av metoderna i Duration. 

Om du inte redan har gjort det, ta en halv dag och gör dig familjär med klasserna i `java.time`. Det är helt klart värt `java.time.Duration.ofHours(4)`.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2024/02/29/java-util-date/)*
