---
layout: post
title: What about Java 26
date: 2026-01-20
categories: callista
---
Java 25 was released in September 2025 but the rampdown phase for Java 26 has already begun and it will be generally available in the middle of March 2026.

But how much can actually happen in 6 months? Let me tell you.

-[readmore]-

The final JEP list has been frozen and on top of the planned bug fixes, it contains 10 feature JEPs. I've looked through them and summarized what impact I think they will have.

## Finally make Final mean Final

Wait, what?! If I write `final` in a Java file, that means final, doesn't it? Well, not really. You can still use deep reflection to make a final field change value. It is as immutable as any non-final fields.

This is what [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/500) aims to prepare for. It is true for `record classes` but not yet for regular Java classes. I agree with the writers of the JEP that "it might seem absurd that the Java Platform includes an API that undermines the meaning of the final keyword". As usual, the quirk is due to serialization issues and in JDK 5, there was a change in the reflection API that opened for this.

The suggestion is that in the future, you have to enable final field mutation with `java --enable-final-field-mutation=ALL-UNNAMED` to allow anyone to mutate the fields or `java --enable-final-field-mutation=M1,M2 ...` if just to allow for some modules.

## No more Applet pie

Applet API was deprecated in JDK 17 back in 2021. Now it will be removed. About time since there is no browsers that in an easy way can run an Applet and the `appletviewer` was removed from the JDK Toolkit in 2018.

## Ahead-of-Time garbage collection

Yeh, the heading was a bit of a bait. There is still no way to make garbage collection before the object has been created.

What [JEP 516: Ahead-of-Time Object Caching with Any GC](https://openjdk.org/jeps/516) strives to do is to allow all the GCs to work smoothly with the Ahead-of-Time cache. Most of the GCs today pause the application threads and that messes up the AOT and increases tail latency. To minimize tail latency, the Z Garbage Collector can be used, since that one works concurrently and never pauses application threads for more than a millisecond.

Let me try to explain why this is something cool. Previously, when using AOT Caching, the JVM would take a snapshot of the memory and store it as a file. When you restart the app, it would copy-paste that snapshot back to RAM. CTRL-C, CTRL-V is really fast. But this messes up the GC that sort of wants to mark the memory with colored tags so that it knows what to collect. So you could look at this as if the JVM saved an instance of the IKEA Billy bookshelf, with post-its stuck on it. In the future, using a GC-Agnostic way, the JVM will store the instructions on how to assemble the Billy bookshelf.

With this, it can now adapt to what garbage collector that is used (G1 or ZGC) and stream it in the correct way. This was possible before but with Java 26 you can both use AOT for fast startup and ZGC for fast garbage collection.

## Welcome HTTP/3

With JDK 11, we got a modern HTTP Client API that supports HTTP/1 and HTTP/2. And the client can downgrade from HTTP/2 to HTTP/1 seamless. The problem is that HTTP/3 is using QUIC and not TCP as HTTP/2 and /1 does. 

To make the client send an HTTP/3 request by default you can do:

```java
var client = HttpClient.newBuilder()
                       .version(HttpClient.Version.HTTP_3)
                       .build();
```

There will be a couple of different strategies on how to negotiate the HTTP protocol.

1. Send HTTP/3 and wait. If timeout, send HTTP/2. This is what will happen with the `.version(HttpClient.Version.HTTP_3)` set.
2. Send HTTP/3 and HTTP/2 or HTTP/1.1 at the same time and make them race. This is what happens if you don't set anything.
3. Send the first request using HTTP/2 or /1 and if the server indicates that there is an alternative service that supports HTTP/3, use that one. The `.setOption(HttpOption.H3_DISCOVERY, Http3DiscoveryMode.ALT_SVC)` is what makes this happen.
4. Use HTTP/3 or fail! Let the builder do `.setOption(HttpOption.H3_DISCOVERY, Http3DiscoveryMode.HTTP_3_URI_ONLY)`.


## More work, less synchronization

JEP 522 is the next GC focused feature and is targeting the Garbage First Collector (G1 GC).

What G1 does is copy memory into different regions in the heap and if the object is left alone in some regions, it evicts it. Sometimes it needs to keep track of cross-region object references using what is called a card table. Looking at the GC Card Hand is efficient but like when I play Uno with my daughter, it can end up with a lot of cards on hand to sort. So the suggestion is to stop playing Uno and start playing Skip-Bo and use a common built card heap that is visible to everyone. Sort of. By using double card tables, you will get a bigger memory footprint, around 2 MB per 1 GB of heap, but the write barriers will be a lot simpler.

And since this is an intrusive change, there will be yet another option to give to the JVM, `-XX:-G1UseConcRefinement` to make it behave as today.

## Preview: PEM Encodings

JEP 524 is the second preview of the ability to encode objects that represent cryptographical keys, certificates and revocation lists using the PEM transport format. First preview came in Java 25 and this is the second iteration.

The API for hanlding this looks really promising.

## Preview: Structured Concurrency

JEP 525 and Structured Concurrency is now in its 6th preview. First one came back in JDK 19.

This iteration is focused on the Joiner API where they have discovered some flaws and improvements. This is a very long one and you have to go back to previous JEPs on the matter sometimes. One thing that is worth mentioning is the introduction of letting the `ExecutorService` interface `fork` return a `Future` object.

## Preview: Lazy developers use Lazy Constants

The second preview of Per Minborg and Maurizio Cimadamore's suggestion to introduce a way to fetch a constant in a lazy way when it is referenced and not forcefully load it when the class is loaded.

This will have a big impact on how we declare our `Loggers`. Previously, if you wanted to not instantiate the Logger before you used it, you had a `getLogger()` method that checked logger for null. But that made the Logger not immutable.

With `LazyConstant` you can do this:

```java
    private final LazyConstant<Logger> logger
        = LazyConstant.of(() -> Logger.create(OrderController.class));

    void submitOrder(User user, List<Product> products) {
        logger.get().info("order started");
        ...
        logger.get().info("order submitted");
    }
```

And then you could do chains of this so that if you have `LazyConstant.of(OneService::new)` that uses `LazyConstant.of(AnotherService::new)`, they would be created when accessed.

There is a little issue however. To make this work in a safe way, the JVM could only do this constant-folding and optimise it only if we can truly trust that a final field is actually a final field. Wait, what?! Isn't final in Java really final?

When this is implemented, the OpenRewrite recipes for managing Logging Frameworks and best practises will be a lot more complex regarding method mapping patterns. 

## Incubating: Vector API

This is the eleventh incubation of the Vector API and it will continue incubating until they can agree on some features in Project Valhalla. There are a lot of things written about this if you want to dig deeper.

## Preview: Primitive Types in Patterns, instanceof, and switch

Fourth preview, now with 2 small changes in `unconditional exactness` and tighter dominance check in switch constructs.

The short version: you don't need to make a `default -> "unknown status" + x.getStatus()`.  You could do `case int i -> "unknown status: " + i;` instead.

They also want to introduce the ability to use the long value pattern so that you can write `case 10_000_000_000L`.

## So, in one sentence...

Java 26 brings incremental but meaningful improvements that make the language more efficient, secure, and developer-friendly.

Java 26 will enhance the JVM with stricter final semantics, improved garbage collection efficiency across all collectors, have HTTP/3 support, and multiple preview features for safer concurrency and pattern matching.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/java/2026/01/20/java26-what-to-come/)*

