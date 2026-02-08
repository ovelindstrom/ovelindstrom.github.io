---
layout: post
title: Beyond Find-And-Replace - a 15-Year Java Leap using OpenRewrite
date: 2026-01-14
categories: callista
---
During the fall, I worked for a Swedish government organisation that has a large legacy codebase. This is a summary of the findings and ways of working that emerged during the project.

-[readmore]-


## The legacy challenge

I got a request in the early fall of 2025 to do a 3-month assignment for a Swedish government organisation that needed modernizing Java code. The current legacy codebase was mostly written between 2002 and 2006 and large portions of it had never been touched since. Small updates of dependencies that had vulnerabilities, but very few changes in the Java code itself. The dominant *dialect* was Java 4 and J2EE/Java EE 5. The compiler and frameworks were Java 6 and EE6, with a specific flavor. That flavor was one of the dominant application servers of the time.

Initially, the assumption was to only bring it up to Java 8 and keep Java EE 6, but since they also wanted a new flavor for the application server, the new target became Java 11 and Java EE 8. The targeted application server is very flexible, but we want to avoid running into the "Jakarta Namespace hell", so practically, the ceiling is Java EE 8 over Java 17. 

So we decided to give [OpenRewrite](https://docs.openrewrite.org/) a run. In short, OpenRewrite is the open source part of [Moderne](https://www.moderne.ai/) platform for managing and keeping huge codebases up to date. You can testrun their tool and look at what they do for 33.000+ Open Source repositories at https://app.moderne.io/. This is also the best place to search for recipes and configure them.

## The theories behind OpenRewrite

One of the first things I heard when I introduced OpenRewrite in a project a couple of years ago was "but I can do that with a simple search and replace". That is true if you are just replacing a pure string. Then regex is the way to go. But take the Java class `String`. A regex does not understand that this is a class type or a variable name. To do that, you need to start thinking like a compiler. This is where *Abstract Syntax Tree* (AST) comes in. It can parse the logic of code and represent it as a tree. This is what the Java compiler does.

But it is still blind to the human part of it: how does the code actually look. And that is what normally scares developers away from refactoring and modernisation tools. They change the code to much and we can't recognize it.

If we take this simple code

```java
// Check if the user is active before proceeding.
if( isActive ) process( );   else { return; }
```

and represent it as an Abstract Syntax Tree (AST) it would look like this:

```java
if (isActive) {
  process();
} else {
  return;
}
```

The logic is identical, but the **text** is different. The AST did not care about the comment, it normalized the spacing around `isActive` and forced the standard indentation on the `else` block.

I don't know about you, but I would not like to see this in the git diff:

```diff
--- a/src/main/java/com/example/UserProcessor.java
+++ b/src/main/java/com/example/UserProcessor.java
@@ -115,7 +115,9 @@
     public void processUser(boolean isActive) {
-        // Check if the user is active before proceeding
-        if( isActive )  process( );   else { return; }
+        if (isActive) {
+            process();
+        } else {
+            return;
+        }
     }
```

This is where the power of **Lossless Semantic Tree** (LST) comes to the rescue. OpenRewrite's LST **preserves everything**. It keeps comments, whitespaces, and other non-semantic elements as metadata, attached to the code elements. So even if it changes out the method call to `process()` with the new `processAndStore()`, it will keep the weird indentation that Carl used in 2004. The code is still "pixel-perfect".

### The Semantic part

When we are doing a migration, it is very important that we are **type-aware**. If you would just say "replace `List`", how do you know if this `List` is `java.util.List` or `java.awt.List`?

In a recipe, we can be surgically precise. You can say "Find every class that inherits from `org.quartz.Job`" rather than "Find files containing the text `implements Job`".

I look at it as the standard AST being the floor plan blueprint. It shows you the walls, doors, and windows, and it is perfect for the JVM when it is building "the house". But it doesn't show you the wall colors or the handwritten note saying "Tap not yet connected". This is what **Lossless Semantic Tree** does. It knows that the table in the corner is not just a table, but an Ikea Lisabo. So you could say that LST is a high-fidelity 3D scan of your code.

So why do I push so much on the LST part? The reason is that we need to respect the history of the legacy code. With code that was formatted and written in the style used 15 years ago, we could easily end up with 5,000 lines of code changes, where most of it would be formatting noise. What we want to see is the 4 lines of changes that swapped out Quartz.

## Quick Wins - What OpenRewrite Does Best

Before diving into the strategy, it's worth understanding where OpenRewrite shines. Not every refactoring task requires a sophisticated tool, but there are several categories where it excels:

**1. Type-Aware Import Cleanup and Reorganization**
OpenRewrite can intelligently remove unused imports and reorganize them according to your organization's standards. Unlike regex, it understands that `java.util.List` and `java.awt.List` are different things, so it won't accidentally clean up the wrong one.

**2. Framework and Library Migrations**
When a library changes its API or namespace (like Java EE → Jakarta EE), OpenRewrite can systematically update all usages. It handles the cascading changes automatically—if you change a method return type, it updates all the call sites.

**3. Annotation-Based Migrations**
Adding `@Override` to methods that should have it, replacing `@Deprecated` usages with their replacements, or migrating to newer annotation-based frameworks are all straightforward wins.

**4. Dependency Version Upgrades**
Upgrading from one major version to another often requires more than just changing the version number in `pom.xml`. OpenRewrite can apply all the necessary code changes to work with the new API and update the `pom.xml`.

**5. Static Analysis and Code Quality Rules**
Apply organization-wide code style rules: "use try-with-resources", "avoid raw types", "use diamond operator for generics", "remove empty catch blocks". These are automated, consistent, and auditable.

**6. Maven/Gradle POM and Build Configuration Changes**
As we discovered, fixing directory structures, removing deprecated Maven plugins, or standardizing build configurations can all be expressed as recipes. Repeatable, self-describing, and less error-prone than doing it manually.

**Where OpenRewrite is Less Ideal:**
- Single-file edits (your IDE's refactoring tools are better)
- Complex business logic transformations (too context-dependent)
- Codebases with heavy parsing errors (garbage in, garbage out... remember this one)

## The Strategy

The migration path we outlined to ensure stability was:
1. Step 1: Java 6 to Java 11. Quite a big hurdle.
2. Step 2: Java EE 6 to Java EE 7
3. Step 3: Java EE7 to Java EE 8.

(Verify everything...)

This would open up the next steps:
4. Java 11 to Java 17
5. Java EE 8 to Jakarta EE 8.
6. Jakarta EE 8 to Jakarta EE 9.

Looks easy, right? In theory, there are recipes for all the steps. In OpenRewrite, you have declarative and YAML-based recipes. They allow you to chain recipes and configure them to work the way you need.

This is the intended original recipe:

```yaml
---
type: specs.openrewrite.org/v1beta/recipe
name: se.govorg.recipes.modernize.Step1_to_3
displayName: 
description: 
recipeList:
  - org.openrewrite.java.migrate.Java8toJava11
  - org.openrewrite.java.migrate.javaee7
  - org.openrewrite.java.migrate.javaee8
```

This is even a bit redundant, and we could drop the `migrate.javaee7` because it is included in the `migrate.javaee8` recipe. If you go to https://app.moderne.io/recipes/org.openrewrite.java.migrate.javaee8, you can see the whole recipe list that is executed. In total, there are close to 50 different recipes executed.

**This was not what happened in real life.**

### A Speed Bump

The first thing we hit was that the `OpenRewrite Maven Plugin` that you need to use did not like the way the project had been tailored to fit how the 2006 IDE wanted the code to be structured. So we had to start with cleaning the foundation.

To do this, we used OpenRewrite recipes for manipulating XML. Yes, it does not have to be Java code. OpenRewrite supports 3 programming languages, 7 data formats, 2 build tools, and 4+ major frameworks and on top of that, there are many other useful generic recipes.

As an example, we wanted to drop the custom `<sourceDirectory>JavaSource</sourceDirectory>` in favor of the default `src/main/java/`. Then we would also need to move all the `*.java` files to the right place.

This is the Modernize POM recipe and some of the sub-recipes (many are similar):

```yaml
---
type: specs.openrewrite.org/v1beta/recipe
name: se.govorg.recipes.modernize.Pom
displayName: All POM Modernization Recipes
description: Applies all Maven Modernization recipes
recipeList:
  - se.govorg.recipes.modernize.pom.DropDevelopers
  - se.govorg.recipes.modernize.pom.DropSourceDirectory
  - se.govorg.recipes.modernize.pom.DropTestSourceDirectory
  - se.govorg.recipes.modernize.pom.DropOutputDirectory
  - se.govorg.recipes.modernize.pom.DropTestOutputDirectory
  - se.govorg.recipes.modernize.pom.MoveJavaSourceToMavenSrc
---
type: specs.openrewrite.org/v1beta/recipe
name: se.govorg.recipes.modernize.pom.DropSourceDirectory
displayName: Delete <sourceDirectory> element
description: Removes the <sourceDirectory> element from Maven POM files.
recipeList:
  - org.openrewrite.xml.RemoveXmlTag:
      # The XPath expression to target the <sourceDirectory> element anywhere in a POM file.
      xPath: /project/build/sourceDirectory
      fileMatcher: '**/pom.xml'
---
// more of the same //
---
type: specs.openrewrite.org/v1beta/recipe
name: se.govorg.recipes.modernize.pom.MoveJavaSourceToMavenSrc
displayName: Move Java files from JavaSource to Maven standard layout
description: Moves all Java source files from ./JavaSource to ./src/main/java to conform to Maven standard directory layout.
recipeList:
  - org.openrewrite.MoveFile:
      folder: JavaSource/
      moveTo: src/main/java/
```

We added a couple of other recipes to move the test classes to `src/test/java`, and so on, until we got a clean structure without having to configure the OpenRewrite Plugin. After verifying that the JAR files built identically between builds, we set off to do the migration run with `mvn org.openrewrite.maven:rewrite-maven-plugin:run -Drewrite.activeRecipes=se.govorg.recipes.modernize.Step1_to_3`.

**This was not what happened in real life.**

### Another Speed Bump

When we write a Java source file and give it to a compiler to turn it into bytecode, the compiler will happily ignore what it does not understand to make the AST. But OpenRewrite wants to keep the semantics while still making it a proper representation of a [Java source file](https://github.com/openrewrite/rewrite/blob/main/rewrite-java/src/main/java/org/openrewrite/java/tree/JavaSourceFile.java).

If the `.java` file isn't structured according to the specification, we can get into trouble.

The specification states that this is how it should be structured (simplified):

```java
/*
 * 1. BLOCK COMMENTS / COPYRIGHT
 * (Optional but recommended)
 * Copyright 2024 MyCompany.
 */

// 2. PACKAGE DECLARATION (must be first code line)
package com.mycompany.myapp;

// 3. IMPORTS
import java.util.ArrayList;
import java.util.List;

/**
 * 4. CLASS DECLARATION 
 * Comment in a JavaDoc style.
 * Top-level classes. Only one "public" class allowed per file.
 */
public class UserSession {

    // Variables, Constructors and Methods.

    // 9. STANDARD METHODS (toString, equals, hashCode)
    @Override
    public String toString() {
        return "UserSession: " + userName;
    }
}
```

We got many `[WARNING] There were problems parsing src/main/java/se/govorg/common/util/DateUtil.java` messages when we did the dry run.

This is an example of a typical file and it contains 4 that will cause a LST error. It looks good, right?

```java
/**
 * Created 2004-jun-20
 * @author John Doe
 *
 */
package se.govorg.common.util;

import java.util.Date;

public class DateUtils extends BaseUtils {
    ///
    /**
     * @param dygnStart Har bara betydelse om tidsdelen utelämnas.
     *        Om true så sätts tiden till 00.00.00.000, dvs. den första millisekunden
     *        på det angivna dygnet. Om false sätts tiden till 23.59.59.999, alltså
     *            dygnets sista millisekund.
     */
    public static Date strToDate(String s, boolean dygnetsBorjan) {
      ///
    }

    public String logException(String message, Exception e) {
      ///
    }
}
```

The first one is that John Doe used JavaDoc before the `package` statement. JavaDoc is considered code, and no code must be placed before the `package` statement. This is solved by moving this block to the class/interface documentation or removing it. For this, we wrote a custom recipe.

The next one was trickier, but it still had to do with JavaDoc. This was due to **JavaDoc incompleteness**. Again, for the compiler, this is not a problem since it ignores JavaDoc. But for the LST, it needs to connect the JavaDoc `@param dygnStart` to the `boolean dygnetsBorjan`. Here we have a mismatch between the JavaDoc and the method signature. There is no good recipe for this, since it can't make it into an LST. We did remove the elements that did not have a description using `org.openrewrite.staticanalysis.RemoveEmptyJavaDocParameters`, but for the rest, "manual" correction.

Good, now we have all the JavaDoc complete. But we still get the same errors. This required us to use extended Maven debug options to find out that we got `IndexOutOfBoundsException`. Encoding errors were the root cause. The original source file was written in Latin-1 (ISO 8859-1), but OpenRewrite tried to handle it as UTF-8. This was easily fixed by adding `project.build.sourceEncoding` to all `pom.xml` files and later converting all files to use UTF-8 instead.

Now we are down to the last one. This one took a while, and the error was actually not in this file. It was in `BaseUtils`, in the method `logException(String message, Exception e)`. Since the LST takes all logical code into consideration, it also parses the base class. The red herring here was that there was no `@Override` annotation on the method.

## OpenRewrite as SAST

OpenRewrite has a collection of recipes that take care of many issues commonly identified by SAST tools. [Add missing @Override to overriding and implementing methods](https://docs.openrewrite.org/recipes/staticanalysis/missingoverrideannotation) is one of them and part of the [OpenRewrite recipe best practices](https://docs.openrewrite.org/recipes/recipes/rewrite/openrewriterecipebestpractices) collection.

We now have a collection that holds all the rules agreed upon by the development collective at the government organisation, and there is a [Style](https://docs.openrewrite.org/concepts-and-explanations/styles) defined to format the code. This makes it much smoother when developers only need to run the recipe before committing and get things like imports organized the way the organisation wants.

## The migration

Now, when everything is in the right place and in the correct format, it was time to do the migration steps.

That was anticlimactic. It just worked. Everything compiled, all tests did what was expected, and when assembled into EAR files, it started on the new application server. Or, it sort of started... But it complained that the code did things it shouldn't. So, this is where the next chapter begins: writing custom recipes.

To migrate from one application server to another, we had to replace about 10 proprietary classes with generic EE classes or custom classes. This is where the true power of OpenRewrite becomes apparent. We used this ability to create code that logically changed from their custom properties management to another framework supported by the application server. OpenRewrite has many such migration recipes, like [org.openrewrite.quarkus.spring.ValueToCdiConfigProperty](https://docs.openrewrite.org/recipes/quarkus/spring/valuetocdiconfigproperty).

We kept creating these kinds of recipes when we found things we needed to change. Most cases were solved by using the recipes `org.openrewrite.java.ChangeType`, `org.openrewrite.java.ShortenFullyQualifiedTypeReferences`, and `org.openrewrite.java.RemoveUnusedImports`. It was only when we needed to actually change the code that we wrote Java-based custom recipes.

## The visitor

When OpenRewrite analyzes and makes changes to an LST, it uses language-specific `TreeVisitor` classes. For Java, the main one is `JavaIsoVisitor`, an isomorphic implementation of `JavaVisitor`. With `JavaIsoVisitor`, you must return the same type as the input, so `Input T -> Output T`. This is what you want 95% of the time.

In the code, you must return the same type that the visitor function takes as its main declared type.

```java
// Input is J.MethodDeclaration, Return is J.MethodDeclaration
@Override
public J.MethodDeclaration visitMethodDeclaration(J.MethodDeclaration method, P p) {
    return super.visitMethodDeclaration(method, p);
}
```

With `JavaVisitor`, you can change the return type, so `Input T -> Output J`.

```java
// Input is J.MethodDeclaration, Return is generic J
@Override
public J visitMethodDeclaration(J.MethodDeclaration method, P p) {
    return super.visitMethodDeclaration(method, p);
}
```

This makes it possible to change `String n = user.name;` to `String n = user.getName();` or vice versa.

## Summary

OpenRewrite proved to be a transformative tool for this 15-year Java leap from Java 6/EE 6 to Java 11/EE 8. Rather than relying on brittle find-and-replace operations, OpenRewrite's approach of understanding code through Lossless Semantic Trees allowed us to modernize a large legacy codebase while respecting its history and preserving code formatting quirks.

### Key Outcomes:

- **Foundation Before Migration**: The real work was preparing the codebase (standardizing POM structure, fixing encoding issues, correcting JavaDoc) rather than just running migration recipes.
- **LST is the Game-Changer**: Preserving pixel-perfect formatting while making semantic changes meant diffs stayed focused on actual logic changes, not whitespace noise.
- **Custom Recipes Required**: While built-in recipes handled ~95% of the work, writing Java-based custom recipes was essential for application-server-specific proprietary code.
- **Type-Awareness Matters**: The ability to target `org.quartz.Job` specifically instead of just any "Job" prevented unintended replacements across different libraries.

### Lessons Learned:

1. **Pre-migration preparation is critical**—Don't assume your legacy code will parse cleanly. Expect encoding issues, incomplete JavaDoc, and non-standard structures.
2. **Validation is essential**—Verify that compiled JAR files are "byte-for-byte" identical before and after formatting changes.
3. **Incremental migration paths reduce risk**—Breaking the migration into Java and EE version steps allowed for testing and validation at each stage.
4. **Documentation and consistency**—Creating reusable organizational recipes and style guides means the team benefits long-term, not just for this migration.

### When to Use OpenRewrite:

✅ **Good fit**: Large-scale Java version upgrades, framework migrations, applying organization-wide code standards  
✅ **Best used**: On well-structured code with comprehensive test coverage  
⚠️ **Prepare for**: Encoding issues, incomplete JavaDoc, custom file structures, non-standard layouts  
❌ **Not ideal**: Single-file edits (use IDE refactoring instead), codebases with heavy parsing errors

So from now on, I will always recommend OpenRewrite for government organizations, enterprises, and large open-source projects where consistency and audit trails matter. OpenRewrite transforms what would be months of manual refactoring into a manageable, reproducible, and verifiable process. If you start with it on the first Java version update, you will make the next one significantly faster.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2026/01/14/openrewrite/)*








