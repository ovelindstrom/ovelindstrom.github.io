---
layout: post
title:  "Update to Spring Boot 4.0.x"
date: 2025-09-01 08:00:00 +0200
categories: english
---

During the summer of 2025, Spring Boot 4 was finally released as a M1 and M2, so in a near future (target is November 20, 2025), there will be a proper 4.0.0 release. 

But what does this bring to the developer table?

## Major dependencies

Spring Boot continues the path they started with the 3.3.x version and keeps Java 17 as the baseline version. I was running an older version of Maven when I did the migration of my demo project and got some warnings. Switching to a Maven that was above 3.6 did the trick as usual. I think it has to do with how the POM files are structured by Spring Boot.

It seems like Spring Boot has made a big effort of cleaning out the last remains of Java 11 API in favour of the 17-API to make sure that it aligns with Spring Framework 7 Milestone versions so an update is really needed. The Spring Boot 4 and Spring Framework 7 are planned to be GA at the same time. Spring Boot 3.5.4 used the Spring Framework 6.2.9 so it is adviced to first update your project to this versions before you attempt to update to 4.0.x. I didn't and that came back and bit me in the butt...

If you want to write in Kotlin, version 2.2 or later must be used.

## Better modularity

One of the biggest issues I have had with Spring Boot is that the `spring-boot-starter-*` dependencies tends to bring in the whole world and that you need to do some cherry picking and exlusions to get a managable sized application. In Spring Boot 4.0, there is a new modular design that focuses on creating and shipping smaller modules.  The emphasis is on the internal modularization of the auto-configuration logic, which is a significant architectural shift. 

The `spring-boot-autoconfigure` module held a central and comprehensive role in the 3.x architecture. This releationship has been altered and redesigned in 4.0.x and now gives you a finer granularity when choosing dependencies. The current starters will still exist in the 4.0.x version for backwards compability, but there will be new alternatives.

As an example, the `spring-boot-starter-web` that in 3.x did an extensive auto-configuration through `spring-boot-autoconfigure` can now be much more granulary managed by the new `spring-boot-starter-webmvc`. The `spring-boot-webmvc` dependency now holds the *strict minimum configuration* and the *-starter-* modules acts as aggregators. Still with a strong opinion on how to do it but you could skip the starters if you want to.

In 3.5.x, the dependenices where such that `spring-boot-starter-web` used `spring-boot-autoconfigure` to pull in `spring-boot-starter-tomcat`. In 4.0.x, the `spring-boot-starter-webmvc` instead depends on `spring-boot-webmvc` that now handles the auto-config and the `spring-boot-starter-tomcat` that uses `spring-boot-tomat` for the config.

This will lead to better controll and a smaller footprint than before. The startuptimes is also reduced, but I can't say if that is due to updates in the framework or just less loading of classes.

While looking into some of the changes, the **Single Responsability Princilple** seems to have been plastered on the walls of the Spring Boot developers dens. It looks like each of the auto-configurations now handles only their own well-defined responsabilities, like with the **Web MVC** example above.

I can also sense a strategic decision to align with the modern Java ecosystem in Spring Boot 4. A lot more sealed classes/interfaces are used, records instead of classes for pure data transfer and much more virtual threads. This is good when using Ahead-of-Time (AOT) compilation and when generating GraalVM Native images.


## How I did the migration

As mentioned above, I tried to update a 3.4.x project to 4.0.x. Don't do that. First, update to the LATEST Spring Boot 3.5.4 and Spring Framework 6.2.9. Take a good look at the **deprecations** and make sure that you have removed them before you start the 4.0 path.

When you start on that 4.0 path, the official migration documentation states that "If your application uses Spring Boot “starter” POMs, most of your dependencies should be correct and your application will work as before". The little keyword here is "most"... Most of the migration time was spent figuring out what starters to keep and when to change to the new ones. This require some digging into the release notes of the new modules, but it is worth the effort.

Use the `spring-boot-properties-migrator`! This little tool will assist you with the proper renaming or removal of properties. Just add the runtime dependency:

 ```xml
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-properties-migrator</artifactId>
    <version>4.0.0-M1</version>
    <scope>runtime</scope>
</dependency>
```






