---
layout: post
title: The cost of ignoring dependencies
date: 2025-09-25
categories: callista
---
There is a place in Norway named Hell. It is a small community of fewer than 2,000 people, and everyone knows each other. And everyone depends on each other.

But what happens when your dependencies in your application freeze over? And what is the cost of not having a Dependency Management Strategy?

![Hells gods station](https://upload.wikimedia.org/wikipedia/commons/a/a8/Hell_norway_sign.jpg)



## Introduction

I would dare to say that there are no modern software development projects that don't rely on external libraries and components. The dependencies used form the foundation of our application. We rely on frameworks like Jakarta EE, Spring Boot, and Quarkus to speed up development and avoid reinventing the wheel.

But the introduction of dependencies also brings with it the need to manage those dependencies. Several times over the years, I have gotten stuck with systems where the dependencies were selected early on and then abandoned or left stale. Or, as in one case, where a dependency was removed from the selected framework, but the company decided to wrap it instead of migrating to the new one to save time and release another version. And then another, and another. Suddenly, the application was so far removed from the current good state that it was completely stuck on older versions of the selected language, frameworks, and application servers.

Getting cornered is one of the most common situations where an organization is forced into doing big overhauls of their software.

In this blog post, I will go through the three main costs of taking on dependencies:

1. Loss of Simplicity
2. Loss of Quality
3. Loss of Control

I will do that through the aspects of Security, Aging, and Health.

## How did we end up here?

All dependencies are man-made. There is no magic behind the introduction of a dependency. Even on the hardware level, we can find those dependencies in the selection of the processor. The foundation of the Java language is that of "write once, run everywhere," and we bring in the dependency of a JVM into the system.

All of the dependencies that we introduce are a choice by a human or a group: an architect, a developer, or a supply partner. The industry today leans heavily on the [Open Source community](https://opensource.com/resources/organizations), with organizations like Apache, Eclipse, Linux, Cloud Native Computing Foundation, Red Hat, and many more delivering the bulk of most of our applications today. These organizations put a huge amount of effort into maintaining their projects. [Apache Software Foundation](https://projects.apache.org/) has close to 300 active projects. But they have also retired, or put into [The Attic](https://attic.apache.org/) as they call it, close to 160 projects and subprojects.

Putting a project in the attic is a choice of an individual or a group of people. It is the shift in their ambition and driving forces that create the drift and misaligned interest of a library. This does not only happen in Open Source. There are several cases where one company acquired another and the commonly used product disappeared. Like when Apple bought NeXT Software and the support for WebObjects was dropped in favor of Apple's own. The latter is an example of a discontinued product.

Other drifts are caused by breaking API changes, and more common nowadays is that Cloud providers pull a feature.

**The misaligned interest is the root of just about every risk in software engineering.**

It is when this misalignment occurs, without someone watching it, that systems start failing catastrophically. And start costing you money and long nights and weekends at work.

## The cost of taking on dependencies

There are three mostly ignored areas that you need to be aware of when taking on a dependency that will drive the costs.

**Sacrifice Simplicity** is the first one. Not all dependencies can be as clear as **Apache Commons Logging**, which has the sole purpose of being an adapter between your application and the injected logging framework. Most of the dependencies we bring in are built for a larger use case. They will include functions you don't need, but you still need to spend time understanding if this is something you need or not. It continues with understanding if a configuration of the dependency is relevant or not. Eventually, it will spill over into the areas of review, deployment, and maintainability.

**Sacrifice Quality** is the next hidden fee you need to be aware of. I once updated a framework from version m.m.1 to m.m.2. That is a revision change. It *should* not have contained any big rewrites, but it made our application response times more than four times longer. The culprit was a moved *synchronized* statement that effectively made the functions single-threaded.

**Sacrifice Control** is the third one. The case with the moved *synchronized* could have been avoided with proper performance tests or a good code review. But that was outside of our control. Most dependencies we add to systems are not atomic in nature. They have dependencies of their own that you, as a user, have no control over. You need to rely on others' choices to keep those dependencies up to date, secure, and useful.

We also lose control over things like the amount of disk space our application occupies, and build times can increase very rapidly depending on how your dependencies evolve.

It is important to note that through all the sacrifices, there is a difference if the misalignment comes out of *quality problems* (bugs, vulnerabilities) or *lack of interest* (read: no financial or personal gain). It is also important to understand that the dependency itself can be of excellent quality and work perfectly in the environment it was intended to work in, but when moved into an unfamiliar or unexpected fashion, it can start failing. We have all spent time trying to understand why the system works in Test with 8 GB of RAM but fails in Production with 64 GB of RAM.

## Don't blink

If the software you are designing, writing, and maintaining is the one that is in your interest focus, or in your employer's focus, you must take time to invest in managing the inevitable misalignment between what you want and what your selected dependencies want.

As soon as you take on a dependency, you have committed to looking after it. There is a need for processes, principles, and policies surrounding dependencies that will make you avoid the highway to hell.

When it comes to **Security**, it is your responsibility to make sure that you observe and detect any vulnerabilities raised on the dependency. In the Java world, we have the `org.owasp:dependency-check-maven` plugin that uses the National Vulnerability Database (NVD) hosted by [NIST](https://nvd.nist.gov/) as a source. Make your builds **fail** if there is a new vulnerability detected in the dependencies, and make it a part of the daily/weekly routines to take a look at the report and do a Risk analysis. All the major application security scanners, like BlackDuck, Snyk, and SonarCloud, support this in their SDLC.

If you are selling your application to a customer, you should also allow them to "not blink" and provide a Software Bill of Material (SBOM) of your application or service. This is an important part of your defense against malicious usage since it allows your enterprise users to use this information in their Security Information and Event Management (SIEM) systems.

The next information you need to consider is the **Aging** of your dependency. There is always a way in all modern dependency management frameworks, like Maven and Gradle, to obtain the metadata of your used dependencies and check if there are any later versions of them. Modern IDEs have built-in support that shows directly in the dependency specification files what updates are available.

It is still a good habit to run `mvn versions:display-dependency-updates` to get a feeling of what direct and indirect updates might be available. A run on one of my projects gave the following:

```sh
 The following dependencies in Dependencies have newer versions:
[INFO]   commons-logging:commons-logging ......................... 1.2 -> 1.3.5
[INFO]   io.micrometer:micrometer-registry-otlp ........... 1.15.4 -> 1.16.0-M3
[INFO]   org.projectlombok:lombok .......................... 1.18.40 -> 1.18.42
```

This does not look too bad. Commons Logging should I look into, the Micrometer to OTLP is an update to a Milestone, so that one I ignore, and Lombok I just updated, but they seem to have done a patch.

I know that I have a dependency on `com.google.gwt.inject:gin:2.1.2` in that project. That is the latest version of GIN, and it has no registered Vulnerabilities in NVD. So that one is safe then? If we run `mvn com.giovds:outdated-maven-plugin:check -Dyears=10` on the project, we get a little different view.

```sh
[WARNING] Dependency 'commons-logging:commons-logging:1.2' has not received an update since version '1.2' was last uploaded '2014-07-05'.
[WARNING] Dependency 'com.google.gwt.inject:gin:2.1.2' has not received an update since version '2.1.2' was last uploaded '2013-11-25'.
```

**That library is dead. It has not received an update in nearly 12 years.**

## The Three Pillars of Dependency Health

Considering a dependency's health combines the three mentioned tools.

| Pillar | Key Question | Key Tool | Strategic Implication |
|----|----|----|----|
| Age | How old is this dependency? | Outdated/Liferay plugins | Identifies long-term technical debt and maintenance risk. |
| Updates | Is a new version available? | Versions plugins | Identifies clear upgrade paths for patches or new features. |
| Vulnerabilities | Does it have a known CVE? | OWASP Dependency-Check | Identifies critical, actionable security threats. |


With this information, you are equipped to make an informed decision about whether this dependency is healthy or not and if it should be phased out.

But how do we vaccinate our systems from unhealthy dependencies?

## Strategies for avoiding going to hell

As with most things in life, you need money to make ends meet. So does the provider of your dependency. 
Boiling it down to the essence: you somehow have to pay the value of the dependency. The more potential damage a dependency abandonment will cause you, the more you should spend to make sure it does not go away.

So you want to **delay the decay**.

If the library that you use has a paid tier and is important to you, pay for it. That is the best way to support the product. Sometimes you can donate through the package manager, like with the *bundle-thank-you* for Ruby gems. Many libraries with a small maintaining group have links to DonorBox, PayPal, or Patreon.

If the library is a "true" open source, consider setting aside time for your developers to help maintain the library. When I file an issue on an open-source project, the least I do is make sure there is a test case written, committed, and attached to the issue that fails. If I can, I try to solve the issue and put it into a Pull Request. If you are using open source, you are a member of the community, and you should contribute. If you REALLY want to be supportive, make sure that the documentation is the one you want to read.

If you are lucky to work in a company with vast resources, sometimes you might even consider making a direct support agreement with the maintainers, buying the rights to the product, or even buying the company.

If you can't delay the decay, you need to **mitigate the decay**. 

When contributing to the cause is not enough and the dependency source code for your important dependency might disappear, I try to make sure that there is a `fork` done into the organization's GitHub or their own SCM. This tends to increase the sense of ownership for the dependency and makes it easier to contribute to "your" fork. You can set that repository under the same scrutiny as you do with your own code. Just make sure that you honor the open-source licenses and contribute back to the upstream project when you do good stuff.

To have a pruning strategy for your source code is important. The same goes for pruning your dependencies. A powerful but overlooked feature of all dependency management systems is the `exclude` one. Yes, it is a feature with quite a steep learning curve, but in the end, it is worth it. So many times have I gotten a CVE warning on a transitive dependency, only to figure out that we are nowhere near that code with our usage pattern, so I have been able to exclude it from the build.

As with all code, even the open-source one, it comes with a maintenance cost. This cost has to be managed, and **planning for decay** should be a part of the development strategy. You need to know when to make a Wrapper towards a library that might change its API or that you need to swap out. If you ask me what a system architect's most valuable contribution to a project is, it is to help you evaluate when to wrap or not to wrap.

## The Cost/Benefit Trade-Off

You cannot spend all your time managing dependencies. Sometimes you just have to do it. If you are doing a Proof of Concept, don't care about the messy dependencies. But if you decide to take the PoC to Production, that is when you should sit down and evaluate all the choices made in the PoC. You need a Surgical Robot to make the implementation. Perhaps it is best to implement everything from scratch? Then we are back into the regular way of working where we evaluate all the code that we do and all the dependencies we introduce.

What you have to do is to make sure that you have a plan and a process for handling the decay of a dependency. What might happen, and what will we do then? How likely is it that this Apache-backed library will go away? How would it affect the system?

The processes of actually doing the "decay detection" must be made a part of the SDLC, and the definition of a "bad dependency" must be made clear to all developers. What do we do if a company acquires the dependency? How do we manage a CVE, and so on. A somewhat strict process is good, but you should leave some roomt for "gut feeling".

## ISO 27001 is your friend

The first thing you need to do in order to improve something is to make sure that it is documented in a policy or a process so that you can start changing it. The same goes for managing dependencies. If you are lucky, your company is or want to be ISO 27001 certified. This is the best thing that can happen if you really want to contribute to the open source arena. Making the principles of maintaining your code-base, dependencies, and mitigations into a policies and processes that are vetted and revised periodically.

The key ones you need to know about are:
- **A.8.25 Secure Development Lifecycle:** This control requires organizations to establish and follow a secure development policy that integrates security into every phase of the SDLC. This includes setting clear security requirements, conducting security training, and performing security testing. This is where you lay the ground for how you want to work with your and the dependent code.
- **A.8.27 Secure System Architecture and Engineering Principles:** This control focuses on the need to apply security principles (like "security by design") to the architecture and engineering of systems. This is where you need to sneak in the usage of tools like Snyk or SonarQube and the processes of managing your dependencies.
- **A.8.28 Secure Coding:** This control mandates the application of secure coding principles to reduce vulnerabilities in software. This includes using structured programming techniques, preventing insecure design patterns, and performing code reviews. But we did not say that it was ONLY for our code, did we?
- **A.5.22 Monitoring, Review and Change Management of Supplier Services:** This control requires ongoing monitoring of suppliers to ensure they continue to meet security requirements. For software development, this applies to regularly reviewing and updating third-party libraries and components. It is there, in plain text, that you have to maintain your dependencies.
- **A.8.8 Management of Technical Vulnerabilities:** This control is directly relevant to managing dependencies. It requires organizations to obtain information about technical vulnerabilities, assess their exposure, and take appropriate action. This includes staying up-to-date with security advisories for all libraries and frameworks used in a project.

The ISO 27001 standard also has the core component of Risk Mitigation that you can use to really drive in the nail in the coffin. (But since you avoid going, this coffin is not going to be used...)

And even if you are not ISO-certified, you can use them as leverage and say "all the best companies in the world is doing this". 

## Closing the coffin

In this post, I have discussed the dependency management part of the Software Development Life Cycle. There are many other areas that are similar in nature to this when developing a complex software system, but for some reason, this is the one that is most often neglected. Having an idea of how you want to manage dependencies to third party vendors, libraries and other providers is essential if you want to avoid big bangs every 10 years. The principles does not only apply to libraries. Other dependencies, such as the selected programming language is equally important to manage.

To have a strategy and policy that say things like "we should move to the latest LTS of Java within 6 months from the release" helps. Same with third party library dependencies. "We should update any revision releases as soon as possble, minor releases within X months and major within Y months" sends a clear signal that this is something that needs to be staffed for and have time allocated to do. If you don't, eventually you need to make a long feature stop and just do maintainance for a year or so and that is not something that the product management, your customers or the developers will like.


## AI Genrated TL;DR

Dependencies are essential in modern software development but come with hidden costs: loss of simplicity, quality, and control. To avoid the "highway to hell," you need a robust Dependency Management Strategy. Regularly monitor security vulnerabilities, aging dependencies, and updates. Invest in supporting critical dependencies, contribute to open-source projects, and plan for decay. By doing so, you can mitigate risks, maintain control, and ensure the long-term health of your software.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2025/09/25/the-cost-of-dependency-hell/)*






