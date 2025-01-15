---
layout: post
title:  "Kotlin is Java - not"
date:   2025-01-13 10:00:00 +0200
categories: english
---

It all started with a little discussion amongst the developers: what language to use for a new project. The statement, *"If you know the Java language, you can program in Kotlin!"* was thrown out by one of the developers advocating for Kotlin. As someone fluent in both Java and Kotlin, I switch between them seamlessly depending on the programming task at hand.

But it got me thinking. Over the last 40-something years, I've used 20+ different languages and dialects—starting with the BASIC of Commodore 64s and Microsoft MSX 360, Pascal and assembler for the C64, Fortran and Logo in my first proper programming job, through the C, C++, and C# families, Java, JavaScript, Python, various ASP, PHP, and JSP dialects, a bit of ADA, and, as mentioned, Kotlin. How would I explain the differences between Java and Kotlin?

The statement is a bit oversimplified, and here’s why I think it’s misleading:

### Language Paradigm Differences

Java is object-oriented, whereas Kotlin is designed to be more functional and expressive. Kotlin incorporates higher-order functions, such as lambda expressions and extension functions, in ways that are more limited in Java. Developers accustomed to Java's object-oriented paradigm, where objects are passed around extensively, might struggle with Kotlin's functional programming concepts. When I started learning Kotlin, I found the learning curve steep, even with some prior experience in functional programming.

### Null Safety

Kotlin's type system is designed to minimize NullPointerExceptions. Features like the safe call operator (`?.`) and the Elvis operator (`?:`) are among my favorite aspects of Kotlin.

```kotlin
fun getUserName(user: User?): String {
    // Safe call operator (?.) and Elvis operator (?:) handle nulls concisely
    return user?.name ?: "Unknown"
}

data class User(val name: String)
```

In Java, achieving the same functionality requires more verbose null checks:

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

Interestingly, while I generally dislike ternary operators, I don't mind Kotlin's safe call and Elvis operators.

### Syntax and features

In the example above, I used Kotlin's `data class`. While Java has introduced `record` types that serve a similar purpose, Kotlin's more concise syntax, destructuring declarations, and ability to declare default or optional parameters are features I often miss in Java. These differences can be challenging for Java developers transitioning to Kotlin.

### Coroutines

Java has its thread models and `CompletableFeature`, but when solving problems involving asynchronous programming and concurrency, I prefer Kotlin's coroutines. While they add to Kotlin's learning curve, mastering coroutines and structured concurrency is immensely rewarding.

### Interoperability is not Familiarity

Yes, Kotlin and Java are fully interoperable. You can use a Java class in Kotlin and vice versa. However, writing idiomatic Kotlin code is not the same as writing Java code, and mixing the two languages can lead to confusion and suboptimal code.

For instance, Kotlin declares properties without explicit getter/setter methods. A Java developer might try `javaUser.getName()` instead of `javaUser.name`, leading to initial confusion.

Similarly, consider this Kotlin class:

```kotlin
class KotlinUser(var name: String) {
    fun printGreeting() {
        println("Hello, $name!")
    }
}
```

A Java developer might wonder where the property is declared and how the getter works:

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

Ask ChatGPT for more examples of interoperability, and you’ll find plenty of interesting scenarios.

### Tooling and ecosystem

Like any programming language, Kotlin introduces unique tooling, which can be confusing at times. For example, older Stack Overflow posts often mention `kapt` for annotation processing, even though it has been replaced by Kotlin Symbol Processing (KSP).

The testing ecosystem in Kotlin is also distinct from Java’s, but that’s a topic for another blog post.





