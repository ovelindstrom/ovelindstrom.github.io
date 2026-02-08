---
layout: post
title: and the REST is history
date: 2025-08-25
categories: callista
---

In his PhD dissertation ["Architectural Styles and the Design of Network-based Software Architectures"](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), Roy Fielding defined the REST architecture style. 

> "This has made a lot of people very angry and been widely regarded as a bad move". - _The Hitchhiker's Guide to the Galaxy, Douglas Adams_

Do I agree with this statement? Is the REST history? Or is it just misunderstood and misused?

-[readmore]-

I am, and have always been, a big fan of Roy Fielding and the mentioned dissertation paper. I think that the link above is one of my most used as a reference when it comes to architecture discussions over the last 15 years or so.

But I think that REST is misunderstood and misused in our systems today. When I started using what Fielding describes as the REST pattern, it was not even in an HTTP-based system, but in a real-time, event-driven system. It had another name back then, but the essence was the same.

I then moved on to systems that used the HTTP protocol, and with that came the almost religious mapping of the CRUD pattern and the HTTP verbs.

So let me break it down a bit and share my thoughts on what I think is wrong with the way we do RESTful APIs today.

## Ignoring The Null Style architecture

When creating a new system or a subsystem part, there are multiple ways to arrive to a satisfying architecture. Regardless of the way, it should always start with **Nothing**. A blank page, an empty whiteboard, a new Workspace in Miro. 

REST is suitable when you have a strong understanding of the system context but it requires knowledge of the system needs as a whole. During the design process, it will stress the development team into understanding the constraints of the system. The core of a [Null Style architecture](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm#fig_5_1) is that you have to look at it as a system where there are no distinguishable boundaries between components.

As we design and develop the system, new constraints will mercilessly be forced upon us as we progress. The first one is always the `client-server` constraint. Back in 2000 and all the way to about 2010, the main focus was on the web browser as a client. But then Apple went and released the iPhone and all of a sudden, we have the mobile clients to take into consideration.

So **Client-Server** became **Clients-Server**. And it continues. Today, we have clients that are based on browsers, desktop, mobile, office tools like Excel 365, AI and similar. **REST** was not designed for those cases.


## A Weightlifting body in a Gymnastic world

REST principles have taught us that each **resource** is its own data element that is "the conceptual target of a hypertext reference." They are identified by a resource identifier, what most of us just call a URL. That is normally how far most of the REST APIs I have seen take it.

There should be much more. Can the clients ask for different media types? Where do we find the meta-data? Is there any control data in the request such as `if-modified-since` and so on?

Let us look at an example. We have a bus managing system, where we plan bus routes, book passengers, and manage the availability of the busses.

The bus-api looks like this:

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | /routes | Retrieves a list of all routes. |
| GET | /routes/{routeId} | Retrieves a single route by its ID. |
| POST | /routes | Creates a new route. |
| PUT | /routes/{routeId} | Updates an existing route. |
| DELETE | /routes/{routeId} | Deletes a route. |
| GET | /routes/{routeId}/buses | Retrieves a list of all buses assigned to a specific route. |

When we look at what is returned by the API, we see that it is a JSON object with the route information.

```json
{
  "route_id": 101,
  "from_destination": "New York",
  "to_destination": "Boston",
}
```

But no direct access to the buses assigned to the route or meta-data such as the max number of passengers.

The `/routes/{routeId}/buses` endpoint returns a list of all the buses assigned to the specific route, but it does not provide any information about the buses themselves. It is just a list of IDs.

```json
{
  "buses": [
    {"bus_id": 1},
    {"bus_id": 2},
    {"bus_id": 3}
  ]
}
```

So to calculate the number of passengers, we have to make another API call to the `/buses/{busId}` endpoint.

```json
  {
    "bus_id": 10,
    "max_seats": 50,
    "is_active": true
  }
```

This is not RESTful. It is a collection of resources that are not connected to each other. The API does not provide any information about the relationships between the resources, and it does not provide any information about the meta-data of the resources.

The problem with all REST APIs is that they force you to design the structures of the resources before you have a full understanding of the system. The responses are all done in advance. This tends to give the effect that during the design of a system, the developers add endpoints when they need extra data. Or even worse, they filter the data in the client when they don't need the provided data.

This leads to constant over- and under-fetching of data. The client has to make multiple API calls to get the data it needs, or it has to filter the data in the client to hide the data it doesn't need. This is not efficient, and it is not RESTful.

### Components are not resources

REST architecture focuses on the Resources and their states. Modern UIs are component-based, like React, Vue, SwiftUI, and similar. REST APIs don't map well to components. Well, yes, if you have components that are easily mapped to a resource view, like a list of items, then it works. But how often does a modern UI consist of a single list of items or even a single table of rows?

**GraphQL**, on the other hand, is designed to work with components. It allows the UI to request more or less exactly the data it needs and request from multiple resources in a single request.

Let's look at the same example using GraphQL. The client can specify exactly what data it needs.

A client, for example a component that displays a route and its total passenger capacity, could send a query like this. 

```graphql
query GetRouteWithBusDetails($routeId: ID!) {
  route(id: $routeId) {
    route_id
    from_destination
    to_destination
    total_seats
    buses {
      bus_id
      max_seats
    }
  }
}
```
Notice how we can ask for a calculated field `total_seats` directly on the route.

### The GraphQL Response

The server would then respond with a JSON object that mirrors the query's structure, containing all the requested information in a single round-trip. The server calculates the `total_seats` for the client.

```json
{
  "data": {
    "route": {
      "route_id": 101,
      "from_destination": "New York",
      "to_destination": "Boston",
      "total_seats": 145,
      "buses": [
        {
          "bus_id": 1,
          "max_seats": 50
        },
        {
          "bus_id": 2,
          "max_seats": 50
        },
        {
          "bus_id": 3,
          "max_seats": 45
        }
      ]
    }
  }
}
```

With this single response, the client has everything it needs to display the route information, including the total passenger capacity, without needing to perform calculations itself. There is no over-fetching of unnecessary data and no under-fetching that requires subsequent requests. This approach aligns much better with the data needs of modern, component-based UIs.

In addition, this request could be cached, by the client and the server, to avoid unnecessary requests. The client can also use the `if-modified-since` header to only request data that has changed since the last request.

## The Stasis of a Photograph in a World of Live Video

Users of today expect the systems that they use to be dynamic, interactive and real-time. They expect to see the current information and receive updates as they happen. Nobody would like a stock market app where you have to constantly hit the Refresh button to see the latest stock prices.

REST was not built to handle this, so why do we still insist on using it for real-time systems? With some magic, you can weld a WebSocket to a REST API. With just a little hot glue on the client side, you can make the UI polling. **But that is not native to the REST architecture**.

In a system where you rely on real-time updates, you should use solutions that are designed for it. GraphQL Subscriptions as mentioned are one way to do it. Using Spring WebFlux to create reactive APIs for systems is my new favorite. It allows me to create APIs that are designed for real-time updates and can handle a large number of concurrent connections. gRPC is another option to handle streams of data that uses my favorite ProtoBuf format for data serialization.

## The Grammar of a Sentence in a World of Stories

REST maps your API to the HTTP verbs. POST, GET, PUT, DELETE were the original verbs and those are easily mapped to the CRUD operations. Sometimes you can even use PATCH to update a resource, but that one is not safe as it is not idempotent.

And what about when I want to do something that is not directly mapped to a CRUD operation? What if I want to get the backend to do a Saga? What verb should I use if I change the state of a bus from `active` to `inactive`? Should I use PUT, POST or PATCH? Or should I create a new endpoint like `/buses/{busId}/deactivate`? This in not really RESTful, is it? So many strange ways to use the HTTP grammar to tell a story in a bad way.

What happens with the other resources? Who is responsible for the update of the states of the routes where this bus is assigned but can't be used anymore?

I tend to move more and more into event driven architectures when it comes to handling states in systems with many different clients or components that need to be updated.

Using a message broker like Kafka or RabbitMQ allows me to create a system that is more flexible and can handle the complexity of the system better than a REST API.

Or more of a gRPC and WebFlux approach where it is much easier for me to tell the story in a more natural way, instead of trying to force it into the REST grammar.

Forcefully writing REST APIs in a task-centric system sometimes feels like I am trying to write a novel in Swedish, using the English grammar. It is possible, but it does not flow as naturally as it should.

## A Diplomat's Formal Address in a Family's Casual Conversation

REST has killed several good ideas and systems I have been involved in over the past years. Most of them have been microservices based systems where the communication between the service have been done using REST APIs since "that is the way we have always done it" or someone have decided that this is the framework we must use.

When it comes to external APIs, I fully understand and support the use of REST. It allows us to create a clear and understandable API that can be used and loved by our fellow developers when we interact with systems outside of our control. I love the fact that another developer or tester can take my OpenAPI/Swagger document and use it in Postman to access my API without having to write any code.

As a developer, I also love that I don't have to write the OpenAPI-files from scratch anymore. The Open API Initiative/Swagger communities have done a great job on the tooling and there are really good and useful annotation libraries out there. All the big frameworks, like [Spring Boot](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/), [Flask](https://flask-restx.readthedocs.io/en/latest/) and [Express.JS](https://www.npmjs.com/package/swagger-jsdoc) all  have them. 

As an architect I love to see the documentation and tend to choose the frameworks that ticks of the "document near the code" box so tath my developers actually writes it. That is one of the reasons why those frameworks are big.

The modern IDEs are helping both developers and architects with the documentation and with the introduction of AI-assisted coding, I predict an even bigger over adoption of REST-APIs.

But when it comes to internal APIs, please reconsider the use of REST. As mentioned before, gRPC and GraphQL are in my opinion much better solutions for inter-service communication. 

Using ProtoBuf for data serialization produces less boilerplate code, smaller payloads and faster serialization than JSON or XML. The datastructures are also shared between the services, so you don't have to worry about different versions of the API or data structures. They should be resolved at compile time.

And talking about contracts. With GraphQL and gRPC, the schema IS the contract. What you see is what you use. That is not the case when it comes to REST APIs, where you have to sync the OpenAPI/Swagger document with the actual API implementation. This is a common source of errors and misunderstandings in REST APIs. Someone forgott to update the official API site. Or someone did not bump the version of the API.

Yes, the ProtoBuf and Avro formats do give you a more efficient serialisation, but they are developer-to-developer centric and do not have the nice and human (read: architect that has not coded in years) readable feeling to it. In my opinion, it is still worth choosing those formats and techniques since they tend to drive developer-to-developer commucation in a way that REST APIs with generated Swagger documentation does not. You can't realy say "read the docs" when there is no docs. You have to explain it.

## Is REST dead?

Nope. Not a bit. REST is an absolutely awesome architecture, in the same way that the Champs-Élysées is an awesome street in Paris. But Champs-Élysées would look very silly if you placed it in Säffle.

Use REST when:
* you actually are building a simple CRUD application
* you need *public APIs* that are easy to understand and use
* you don't have any real-time requirements
* you don't want to introduce new technologies or frameworks
* you just need to prototype something quickly

So what do I suggest that you use instead? Well, it depends on the use case.

For Client-Server applications, I would suggest using GraphQL or gRPC. They are both designed to handle the complexity of modern systems and can be used to create APIs that are easy to use and understand.

For real-time applications, I would suggest using WebSockets or Server-Sent Events (SSE) to handle the real-time updates. This allows you to create a system that is more flexible and can handle a large number of concurrent connections.

For internal service use - go gRPC or WebFlux. Don't argue with me, just do it.

For systems that generates a lot of events, go with Kafka, MQTT, RabbitMQ or similar.

So when you are designing your next REST API, take a step back, wipe the whiteboard clean and start with a Null Style architecture, and ask yourself "am I asking a diplomatic weightlifter, who only tells stories one sentence at a time, to provide live commentary for a family gymnastics meet"?

For internal service use - go gRPC or WebFlux. Don't argue with me, just do it.

For systems that generates a lot of events, go with Kafka, MQTT, RabbitMQ or similar.

So when you are designing your next REST API, take a step back, wipe the whiteboard clean and start with a Null Style architecture, and ask yourself "am I asking a diplomatic weightlifter, who only tells stories one sentence at a time, to provide live commentary for a family gymnastics meet"?

Then choose the right tool for the job.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2025/08/25/the-rest-is-history/)*









