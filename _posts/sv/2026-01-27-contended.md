---
layout: post
title: Hur många har koll på Javas @Contended annotation?
date: 2026-01-27 08:00:00 +0200
categories: svenska java
---

Hur många har koll på Javas @Contended annotation?

Jag satt igår och rättade ett fel i OpenRewrite och stötte på just den annotationen som jag aldrig sett förut och var tvungen att forska lite. Intressant liten sak vars fulla namn är `jdk.internal.vm.annotation.Contended`.

När JVMen läser minne så gör den det typiskt i 32 eller 64 bytes "linjer". Man kan optimera sin JVM så att den hanterar objekt av olika storlek på ett bra sätt och även hur stora dessa linjer ska vara.

Men primitiverna i Java är mellan 8 bitar (byte och boolean) och 64 bitar (long och double) och med ett gäng 16 och 32-bitars däremellan.  Så om vi läser i chunk om 64 bytes, så får man in 8 olika long-värden i samma läsning.

Så ponera att vi har klassen GroupedCounters som håller ett gäng räknare. Då ser minnesallokeringen ut såhär i Temurin 21 - 64 bitars på Mac (JOL):

```java
public class GroupedCounters {
    // --- 12 bytes för Class Header + 4 bytes utfyllnad = 16 bytes för klassen ---
    long c1; // Bytes 17-24
    long c2; // Bytes 25-32
    long c3; // Bytes 33-40
    long c4; // Bytes 41-48
    long c5; // Bytes 49-56
    long c6; // Bytes 57-64
    // --- CACHE LINE BOUNDARY ---
    long c7; // c7 och c8 är i nästa 64-bytes chunk.
    long c8;
}
```

Om flera trådar då försöker uppdatera GroupedCounters c-värden samtidigt, så kommer flera av dem att begära skrivning av samma 64-bitars-chunk samtidigt. Och det tillåts inte. Så det här är en performance-dödare. Man kan givetvis använda sig av en intern long[] så att när man väl är förbi arrayens 16 bytes (de har också en header och 4 bytes padding som alla andra klasser) så passar nästföljande 8 long prefekt i en 64.

Om man vill läsa värdena så är det perfekt att de är i samma cache-line. Men om man skriver väldigt mycket så vill man ha dem i olika cache-lines. Det är här @Contendedkommer in. Den lägger på runt 128 bytes före och efter ett värde för att få den ensam i en cache-line. Så om man annoterar dem med @Contendedså blir varje long isolerad. Nackdelen: mycket mera minnesåtgång.

Nu kan man gruppera sina Contenders så de hör ihop. Så om vi tar vår exempel-klass där c1 alltid skrivs för sig, c2-c4 alltid tillsammans, c5-c7 tillsammans och c8 isolerat så blir det att se ut så här:

```java
import jdk.internal.vm.annotation.Contended;

public class GroupedCounters {

    @Contended("group1") // Isolated
    public long c1;

    // These three will be packed together on one cache line
    @Contended("group2")
    public long c2;
    @Contended("group2")
    public long c3;
    @Contended("group2")
    public long c4;

    // These three will be packed together on another cache line
    @Contended("group3")
    public long c5;
    @Contended("group3")
    public long c6;
    @Contended("group3")
    public long c7;

    @Contended("group4") // Isolated
    public long c8;
}
```

Så nu spelar det ingen roll om Tråd-1 räknar upp c1 hela tiden (varje anrop) och Tråd-2 räknar på saker i anropet och lägger i c2-c4 osv. CPUn kommer inte att behöva spela pingis med minnet.

Men... det här är en anotering i jdk.internal så man måste använda `--add-exports java.base/jdk.internal.vm.annotation=ALL-UNNAMED` som kompileringsflagga och `-XX:-RestrictContended` i runtime.

Det här är då extrem-optimering och används i en del Concurrency-klasser och varianter av det i t.ex. LongAdder.  Nyfiken som jag är så skrev jag ihop en liten test med Java Microbench Harness (JMH)  med en optimerad och en icke optimerad klass i sig och en himla massa trådar som hamrade på dem samtidigt. Ironiskt nog så gav mitt första försök BÄTTRE resultat för den dåliga koden än för den med @Contended så där trillade jag ner i ett litet extra hål. Visade sig att Java 25's Just-In-Time compiler faktiskt löste problemet bättre åt mig och identifierade att det är en loop och optimerade skiten ur koden istället. :smile:

Efter att ha stäng av JIT och konstruerat om koden så att de faktiskt strider med varandra, bland annat genom att bråka lite med black-hole-implementationen, så fick jag följande resultat:

| Benchmark | Mode | Cnt | Score | Error | Units |
|-----------|------|-----|-------|-------|-------|
| ContentionBenchmark.optimized | thrpt | 10 | 5177,175 | ± 98,185 | ops/us |
| ContentionBenchmark.optimized:·gc.alloc.rate | thrpt | 10 | 0,006 | ± 0,001 | MB/sec |
| ContentionBenchmark.optimized:·gc.alloc.rate.norm | thrpt | 10 | ≈ 10⁻⁶ | | B/op |
| ContentionBenchmark.optimized:·gc.count | thrpt | 10 | ≈ 0 | | counts |
| ContentionBenchmark.unoptimized | thrpt | 10 | 1921,962 | ± 49,797 | ops/us |
| ContentionBenchmark.unoptimized:·gc.alloc.rate | thrpt | 10 | 0,006 | ± 0,001 | MB/sec |
| ContentionBenchmark.unoptimized:·gc.alloc.rate.norm | thrpt | 10 | ≈ 10⁻⁶ | | B/op |
| ContentionBenchmark.unoptimized:·gc.count | thrpt | 10 | ≈ 0 | | counts |

Så på min Mac M2 är det bara 2.7x långsammare att köra den o-optimerade koden (1.9 miljarder ops/sekund) mot optimerat (5.2 miljader ops/sekund).

På en datorn med en äldre Intel fick samma kod nästa 8x skillnad.

Det är kul att läsa källkod ibland.


