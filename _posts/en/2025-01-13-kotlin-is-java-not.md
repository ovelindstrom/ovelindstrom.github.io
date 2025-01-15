---
layout: post
title:  "Kotlins is Java - not"
date:   2025-01-13 10:00:00 +0200
categories: english
---

It all started with a little discussion amongst the developers. What language to use for a new project. The statement "If you know the Java language, you can program in Kotlin!" was thrown out by one of the developers that advocates the Kotlin language. Myself, I am quite fluent in both Java and Kotlin and switches between them seamlessly depending on what type of programing task I need to do.

But it got me thinking. As someone who over the last 40-something years has used 20+ different languages and dialects, from the BASIC of Comodore 64's and Microsoft MSX 360, Pascal and assembler for the C64, Fortran and Logo in my first proper programming job, through the C, C++ and C# families, Java, JavaScript, Python, over the different ASP, PHP and JSP-dialects, a bit of ADA and, as mentioned, Kotlin... how would I explain the differences between Java and Kotlin?

The statment is a bit oversimplified if you ask me and here is why I think it is missleading:

### Language paradigm differences

Java is object oriented where Kotlin is designed to be more functional and expressive. Kotlin, in my opinion, incorporates higher-order functions, such as lambda expressions and extension functions where that is more limited in Java. Developers that are familiar with the object oriented paradigm of Java and like to send object all over the place might struggle with the somewhat unfamiliar functional programming concepts in Kotlin. When I started learning Kotlin, the learning curve was a bit steep even if I had some experience of functional programming.

### Null safety

Kotlin's type system is designed in a different way than Java and makes it a lot harder to generate a Null Pointer exception. The Safe call operator (?.) and the Elvis operator (?:) are one of the things I really like with Kotlin.

```kotlin
fun getUserName(user: User?): String {
    // Safe call operator (?.) and Elvis operator (?:) handle nulls concisely
    return user?.name ?: "Unknown"
}

data class User(val name: String)
```

Java equivalent

```java
public class User {
    private String name;

    public User(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

public String getUserName(User user) {
    // Explicit null checks required
    if (user == null || user.getName() == null) {
        return "Unknown";
    }
    return user.getName();
}

```

The interesting part is that I am generally against ternary operators but don't mind the Safe and Elvis operators in Kotlin.

### Syntax and features

In the example above, I am using the Kotlin `data class`. Java has introduced the `record` type that does the same thing, but the more concise syntax, destructuring declarations, the way you can declare default or optional parameters is something I lack in Java. This is also something that I see as one of the things that developers that comes from Java has to struggle a bit with.

### Coroutines

Java has its thread models and the `CompletableFeature` but if I have a problem that is best solvable using asynchronous programming and concurrency, I rather use Kotlins Coroutines. Yes, it is another of those areas that makes the learning curve a bit steeper, but mastering Coroutines and structured concurrency is well worth it in the end.

### Interoperability is not Familiarity

Yes, you can use a class declared in Java in your Kotlin code and you can use a Kotlin declared function from Java. The languages are fully interoperable and a Java developer could seamlessly write idiomatic Kotlin code, but that would defeat the purpose of the language. And, it tends to lead to suboptimal code.

One of the things that can be confusing when using Kotlin and Java togheter is when accessing properties. Kotlin declare properties and access them without any getter/setter methods and this can initially lead to some confusion when a Java developer tries to do `javaUser.getName()` instead of `javaUser.name`.

Or the other way around. If I have a `KotlinUser` declared like this:
```kotlin
class KotlinUser(var name: String) {
    fun printGreeting() {
        println("Hello, $name!")
    }
}
```

the Java programmer gets confused. Where is the property declared? Where is the getter? Why can I do like this?

```java
public class Main {
    public static void main(String[] args) {
        // Create the KotlinUser
        KotlinUser kotlinUser = new KotlinUser("John Doe");

        // Access Kotlin properties and methods
        System.out.println("User's name: " + kotlinUser.getName());
        kotlinUser.setName("Dave");
        kotlinUser.printGreeting();
    }
}
```

Ask ChatGPT for more examples of interoperabilites and you will get a lot of nice ones.

### Tooling and ecosystem

As all programming languages, Kotlin introduces some unique tooling that can be somewhat confusing, since Kotlin has evolved over the years. One of those that is often found in older responses at Stack Overflow is `kapt` for annotation processing, that was replaced by the Kotlin Symbol Processing (KSP) but there is still a lot of information around that talks about `kapt`. 

The testing eco system is also quite different from the Java ones, but that is a completely different blog post.





