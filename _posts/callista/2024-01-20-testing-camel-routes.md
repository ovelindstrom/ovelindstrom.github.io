---
layout: post
title: Tesing Camel Routes
date: 2024-01-20
categories: callista
---

Sometimes you need to test your Camel Flows without the messaging servers running. Luckly, there is a way to go around that, but it is not that obvious how to. This is a small example where we use Active MQ, Apache Camel and Spring Boot to test a flow, with and without Active MQ running.

-[readmore]-

The flow

from(activeMQ:foo)
log msg-in
transform String X, String Y
log msg-out
to(activeMQ:bar)

Bild: på flödet, använd Structurizr

Test med Mock.

Bild: på hur det ser ut nu

Stäng av Active MQ - Fail.

Test med @AdviceWith

Bild på hur det ser ut istället.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2024/01/20/testing-camel-routes/)*

