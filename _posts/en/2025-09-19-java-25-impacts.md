---
layout: post
title:  "Impacts of Java 25 - what will they learn?"
date: 2025-09-19 08:00:00 +0200
categories: english
---

A couple of days ago, [Java 25](https://openjdk.org/projects/jdk/25/) reached General Availability and all the big vendors officially released their JDK 25 versions.

Much of the news has been around since Java 22, and I have been following some of the JEPs. There are some pretty cool changes in what we can do with the language, and four of them are about getting new developers started faster and getting rid of a lot of boilerplate code.

But it got me thinking: What will happen with how Java is written by those who start learning the language today? What will us old farts need to know when we start reading code written in this new style?

## KISS! (JEP 512)

Yes, teaching new students Java will be a lot easier and make the learning process way better, more accessible, and most of all, a lot less intimidating. This all comes down to the new Compact Source Files and new instance `main` methods.

The initial, simple "Hello World" will be a lot easier and more intuitive.

In the future, we will see more of this Java 25 compact source file style:

```java
void main() {
    IO.println("Hello, World!");
}
```

So we have hidden the class, the *access modifier* `public` is implied, the *class instance modifier* `static` is gone, and the *parameter list* on the main method is gone, so this is now a regular instance method.

And the old `System.out.println()` is replaced by IO.

Reading console input is equally easy.

```java
String greeting = "Hello, ";

void main() {
   var name = IO.readln("What is your name? > ");
   IO.println(greeting + name);
}
```

and then run it as:

```sh
src > java App.java

What is your name? > Ove 
Hello, Ove
```

So, no need to compile and find the class. No need to know about `BufferedReader` and `InputStreams`. Man, do new Java developers get away easy.

The "paving of the on-ramp" for new developers, where they can be introduced to Java in a more script-like style, is a good one. The way to step by step evolve into a full-fledged class is a lot better. And since the `import module java.base;` is considered implicit in a compact styled Java source file, we can talk about those things when the new developer is already hooked. ;) 

## To import or not to import? (JEP 511)

Continuing on the path of "need to know" is the new way of importing a whole module. In a compact style source file, the module `java.base` is implicitly imported.

A seasoned Java developer would write the code like this:

```java
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

void main(String[] commandlineStrings) {
   String[] electronics = new String[] { "apple", "blackberry", "raspberry pi" };
   Map<String, String> m =
    Stream.of(electronics)
          .collect(Collectors.toMap(s -> s.toUpperCase()
          .substring(0,1), Function.identity()));
   IO.println(m);
}
```

but since the `import module java.base;` is implicitly in this code, we **don't need to** write it, in the same way as we never write `import java.lang.*;` but it is always there in the bytecode.

I predict that we will have to get used to seeing the statement `import module java.base` as the second row in almost all new Java files to get instant access to the 50-something most commonly used packages.

The import precedence order is still intact, so we can refine what we explicitly want to use.

Assume the following:

```java
import module java.base;
import module java.sql;
import java.util.Date;
```

Since both `java.base` and `java.sql` expose the `Date` class, we can, as before, specify that in this case, I want to use `java.util.Date` when I say date, and I will type `new java.sql.Date(date.getTime())` when I want to store it in the database.

There is some debate if module import is good or not in the community, and the comments on the JEPs involved are fun to read. Myself, I like this. One of the first things I do in any IDE is to turn on automatic folding of imports.

## Yoga for Java (JEP 513)

I have never understood why calls to `super()` or `this()` have to come first in a constructor, and I've hunted down both validation errors and memory consumption that happens way up in the constructor chain when instantiation of resources has been done in a base class without knowing if it is needed or not. I have worked around this by using auxiliary methods as an inline in the `super()` call.

```java
public class Vehicle {

    public Vehicle(..., int wheels) {
        if (wheels < 1) 
            throw new IllegalArgumentException("A vehicle must have at least one wheel.");
         ...
         pumpTheWheels();
    }

}

public class Car extends Vehicle {
    
    private static int verifyWheels(int wheels) {
        if (wheels != 3 && wheels != 4) {
            throw new IllegalArgumentException("A car must have either 3 or 4 wheels.");
        }
        return wheels;
    }

    public Car(int wheels) {
        super(..., verifyWheels(wheels));
    }
    
}
```

This is not the easiest to explain to a new developer, and even harder is to explain what will happen if the super class calls a method defined in the super class and implemented in the sub-class, before the initialization is fully done in the sub class constructor.

That top-down rule where all the constructors are invoked, explicitly or implicitly, at the start of the constructor, is softened. So now we can, in a more logical way, say "Check the number of wheels on your Car and if it is correct, construct the whole Vehicle".

```java
public class Vehicle {

    public Vehicle(..., int wheels) {
        if (wheels < 1) 
            throw new IllegalArgumentException("A vehicle must have at least one wheel.");
         ...
    }

}

public class Car extends Vehicle {
    
    public Car(..., int wheels, String model) {
        if (wheels != 3 && wheels != 4) {
            throw new IllegalArgumentException("A car must have either 3 or 4 wheels.");
        }
        // No need to do this work if wrong number of wheels.
        this.model = model;
        super(..., wheels);
        ...
    }
    
}
```

The [JEP 513](https://openjdk.org/jeps/513) uses the terms **prologue** and **epilogue**. I like those terms since they give us a way to describe what we want to do in a constructor.

## When Primitive types enter the cage (JEP 507)

Wrestling with types in the context of patterns has been a bit cumbersome and hard to explain to new developers. "Just do it like that" has been used in classes, and there are some constructs that I have asked really smart people involved in the language about when they have attended Jfokus and gotten the same response.

The *Primitive Types in Patterns, instanceof, and switch* is still in preview, so to use it, one needs to use the `--enable-preview` flag.

In short, what it does is allow a developer to use primitives like `int` and `double` in a lot of places where it is currently restricted. The `switch` statement only allows `byte`, `short`, `char`, and `int` values. Why not allow `boolean`, `float`, `double`, or `long` values?

Why would you want to use a `boolean` in a `switch`? One reason is that you despise the [ternary operator](https://en.wikipedia.org/wiki/Ternary_conditional_operator).

I find this example from the JEP appealing.

```java
startProcessing(OrderStatus.NEW, 
      switch (user.isLoggedIn()) {
         case true  -> user.id();
         case false -> { log("Unrecognized user"); yield -1; }
      }
   );
```

At [The Java Playground](https://dev.java/playground/) you can find some nice examples around the Primitive type patterns that are worth looking at.

## And we go to the judges' scorecards

All the judges score this Java version 40-26. ;)

The alignment of Java to a more modern and more approachable language has been ongoing for many versions. Since Java 17, it picked up the pace and has had a "paving the on-ramp" for new developers initiative. When I started learning Java, 30 years ago, I already had some programming experience. The changes that are now finalized in Java 25 are a nice addition and allow those who teach our beloved Java language to make the introduction a lot smoother.

This brings Java closer to the two main first language competitors: Python and JavaScript. The ability to run your Java class directly from the .java file is the one that will be most appreciated. No real need for an IDE anymore just to play around with some constructs.

In my opinion, the new additions do not change the language in any significant way that us old farts can't cope with. I have heard whining about the module import and how we will only see those in the future. "So what", I say, "I don't like to scroll for a page to find the code." Using `public static void main(String[] args)` is NOT boilerplate, it is **discipline**. Yeah, in the same way that a disciplined athlete started with small weights in the gym to build up muscles. `void main()` is a 5 kg dumbbell and `public static void main(String[] args)` is a 20 kg.

Hiding the boilerplate is not getting rid of it. It is still there, but invisible. It is only putting glitter on a turd.

Too much, too fast... yes, Java picked up the pace and the monumental events that were a new Java version, held many years apart, are no more. We will get a new LTS every two years and new feature releases every 6 months. Get on the treadmill and do your steps to learn Records, Sealed Classes, and Pattern Matching.

Those who argue that the enterprise feel of Java gets lost when we constantly "break" things and add overhead to the ecosystem are just plain wrong. As an example, Gradle had full support for Java 25 only 3 days after the official release and most of the IDEs will be updated in the near future. The pain of going from Java 1.6 to Java 8 or from Java 8 to 11 (with the javax-to-jakarta move) was a HUGE pain. The small steps between 21 and 22 were not.

All in all, the changes will continue to come and I will continue to read JEPs.

