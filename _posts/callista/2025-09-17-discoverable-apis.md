---
layout: post
title: The Discovery of REST APIs
date: 2025-09-17
categories: callista
---

In my previous blog post [Good habits when designing REST APIs](/blogg/teknik/2025/09/03/bad-rest/), I sort of ended with a little cliffhanger that there are more things that could be done to make life easier for your fellow developers. Today, we are diving into **The Discovery of REST APIs** and the magical use of HAL and HATEOAS.

-[readmore]-

If you are lucky, you get to work with APIs that have excellent documentation. I have a list of favorites when it comes to how to document APIs that I turn to for inspiration. Two of them are [Shutterstock](https://api-reference.shutterstock.com/) and [GitHub](https://docs.github.com/en/rest/quickstart) that both have very good resource and domain-focused APIs. They have in common that they act on well-known domains and have an established vocabulary that is used. If you are familiar with the domains, you have no problem navigating the structures.

Other domains are more difficult. The one that stands out is payment providers. The domain actions that need to be done are familiar, but the actual call to use might be different if you want to pay with Swish or credit card. And for the latter, you also need to know the issuer API.

What all good REST APIs have in common is that they are *discoverable* by nature. That means that if you know the base of the resource or action you want to use, you can more or less follow the links provided by the first GET to achieve what you want to do.

![Discovery of REST APIs](/assets/blogg/discovery-of-rest.png)

## HATEOAS and HAL

There are two things that you need to know when designing discoverable APIs.

* [HATEOAS - Hypermedia as the engine of application state ](https://en.wikipedia.org/wiki/HATEOAS) 
* [HAL - Hypertext Application Language](https://en.wikipedia.org/wiki/Hypertext_Application_Language)

HATEOAS is an architectural style and a set of principles, and it might not come as a surprise that it was established by Roy Fielding in his PhD dissertation ["Architectural Styles and the Design of Network-based Software Architectures"](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

HAL is a convention that builds on the HATEOAS principles for how to structure the response objects within XML and JSON responses. It has the MIME types `application/hal+xml` and `application/hal+json` as a signal to the user what to expect.

HATEOAS and HAL come out of the fact that neither XML nor JSON has hypertext abilities. Just like when you are browsing a web page, it gives your API the ability to "click" on the link, instead of having to know what to type as the next page. There are other variants of HATEOAS specifications and I will come back to them at the end.

In the rest of this post, I will generalize the principles, but most of the examples come out of the HAL specification.

## Core spell #1: links

The base of a discoverable API are `links`.

A `link` is a target that can be called to get another resource or do an action.

In HATEOAS, it is defined as having 3 elements:
* `href` - the URI
* `rel` - the named relation
* `method` - what HTTP verb to use

For the Routes used in [the Rest Is History](/blogg/teknik/2025/08/25/the-rest-is-history/) it would look like this according to HATEOAS:

```json
"links": [
    {
        "href": "/routes",
        "rel": "self",
        "method": "GET"
    },
    {
        "href": "/routes",
        "rel": "create",
        "method": "POST"
    },
    ...
]
```

This is how most of the payment providers do it, including PayPal and this is considered to be the most pure HATEOAS style. I personally don't like this style.

HAL simplifies this a bit by moving the `rel` to a json key directly under the `_link` key.

```json
{
  "_links": {
    "self": {
      "href": "/routes",
      "method": "GET",
      "title": "List all the routes"
    },
    "create": {
      "href": "/routes",
      "method": "POST",
      "title": "Create a new route"
    }
  },
  ...
}
```

This is my preferred way to declare links in APIs since I like to keep it simple. It also has really good support in Spring Boot.

This is how a Controller would look like (with some stuff omitted):

```java
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
...
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class RouteController {

    @GetMapping("/routes")
    public ResponseEntity<CollectionModel<Void>> getRoutes() {
        // Create a CollectionModel, which is used for a collection of resources
        CollectionModel<Void> routesModel = CollectionModel.of(new ArrayList<>());

        // Add the 'self' link for the GET /routes endpoint
        Link selfLink = linkTo(methodOn(RouteController.class).getRoutes()).withSelfRel();
        routesModel.add(selfLink);

        // Add the 'create' link for the POST /routes endpoint
        // Notice the 
        Link createLink = linkTo(methodOn(RouteController.class).createRoute(null))
          .withRel("create")
          .withType(HttpMethod.POST.name());

        routesModel.add(createLink);
       
       // Return code 200
        return ResponseEntity.ok(routesModel);
    }
    
    @PostMapping("/routes")
    public ResponseEntity<Void> createRoute(@RequestBody RouteRequestDTO dto) {
        // Implementation for creating a new route
        // Return code 201        
        return ResponseEntity.created().build();
    }
}
```

Spring Boot uses the fluent API style to build this kind of links, so it is easy to read and understand.

Notice that the `withRel("create")` is defined in the `getRoutes` and not on the `createRoute` method. This is because the relation goes from the caller (get) to the target (create). If I now change the target path to:

```java
    // 
    @PostMapping("/routes/create")
    public ResponseEntity<Void> createRoute(...) {
        // Implementation for creating a new route
        // Return code 201
        return ResponseEntity.created().build();
    }
```

the `_links.create` would be updated and the calling client does not have to update the URL in the code and redeploy. This is a very useful pattern when having multiple versions of an API.

If we take a look at a specific Route it could look something like this when calling `/routes/123`:

```json
{
  "_links": {
    "self": {
      "href": "/routes/123",
      "method": "GET"
    },
    "edit": {
      "href": "/routes/123",
      "method": "PUT",
      "title": "Edit this route"
    },
    "delete": {
      "href": "/routes/123",
      "method": "DELETE",
      "title": "Delete this route"
    },
    "buses": {
      "href": "/routes/123/buses",
      "method": "GET",
      "title": "Buses assigned to this route"
    },
    "collection": {
      "href": "/routes",
      "method": "GET",
      "title": "List of all routes"
    }
  }
}
```

The `edit` and `delete` links are called **affordances**. The word comes from James J. Gibson and he explains it like this:

> The affordances of the environment are what it offers …​ what it provides or furnishes, either for good or ill. The verb 'to afford' is found in the dictionary, but the noun 'affordance' is not. I have made it up.

Most of the frameworks I have used to create discoverable APIs have some sort of mechanism to add affordances to a link. When it comes to Spring Boot HATEOAS, they have several variants that gets triggered by the `Accept` header the client sends in where the default is `application/hal+json`.

If you send in `application/prs.hal-forms+json`, Spring Boot will add an extra `_template` section that describes the differnt fields and their meta-data. This is useful when the client creates a form. Read carefully how your framework handles this, because it is most likelly not how you expect it to in the first place.It is really powerfull so it is worth the effort. If you want to lock down an endpoint to accept only specific `Accept` headers, you should use the `produces` property in the path mappings declarations.

### Collection and item relations

The link relation `buses` tells the user where it can get a related resource and the `collection` relation on an item is a way to tell where to go if you need many of this resource.

In this case, the client would need to do an extra call to `/routes/{routeId}/buses` when they want to retrieve that information. The downside is that it requires another roundtrip to the backend. The upside is that if you don't need the information every time, the client has the control. It is also the one I use if the requested collection is large or needs to be pageable.

But what if we have a pattern where we always see `GET /routes/123` followed by `GET /routes/123/buses`?

## Core spell #2: embedded

Enter the other base component of a discoverable API: `embedded`.

HAL defines the `_embedded` key as a way to add related data to the request. The downside is that the responses become larger. The upside is fewer roundtrips. If we assume that the roundtrip cost is larger than the bandwidth, we would now add the `_embedded` part to the response above.

```json
{
  "_links": {
    // Same as above
  },
  "_embedded": {
    "buses": [
      {
        "id": 456,
        "licensePlate": "BUS-456",
        "model": "Model X",
        "_links": {
          "self": {
            "href": "/buses/456",
            "method": "GET"
          }
        }
      },
      {
        "id": 789,
        "licensePlate": "BUS-789",
        "model": "Model Y",
        "_links": {
          "self": {
            "href": "/buses/789",
            "method": "GET"
          }
        }
      }
    ]
  }
}
```

How do you know when to use a link and when to use an embedding? The answer is, you don't, that is up to the client.

A well designed REST API allows the client to choose what to embed. This is how I implemented it in the RouteController (but I use a DTO in the real code, not the entity):

```java
// Imports not shown

@RestController
public class RouteController {

    private final RouteService routeService;
    private final BusService busService;

    public RouteController(RouteService routeService, BusService busService) {
        this.routeService = routeService;
        this.busService = busService;
    }

    @GetMapping(value = "/routes/{routeId}", produces = MediaTypes.HAL_JSON_VALUE)
    public ResponseEntity<RepresentationModel<?>> getRoute(
            @PathVariable Long routeId,
            @RequestParam(required = false) String embed) {

        Route route = routeService.findById(routeId);
        if (route == null) {
            return ResponseEntity.notFound().build();
        }

        // Start building the HAL model for the route
        HalModelBuilder builder = HalModelBuilder.halModelOf(route)
            // Add self link for the current resource
            .link(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RouteController.class).getRoute(routeId, null)).withSelfRel())
            // Add other standard action links
            .link(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RouteController.class).editRoute(routeId, null))
              .withRel("edit"))
              .withType(HTTPMethod.PUT.name)
              .withTitle("Edit this route.")
            .link(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RouteController.class).deleteRoute(routeId))
              .withRel("delete"))
              .withType(HttpMethod.DELETE.name())
              .withTitle("Delete this route"));
            // Add link to all of the routes
            .link((WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RouteController.class).getRoutes(null, null)).withRel("collection"));
        
        // Conditional logic for embedding buses
        if ("buses".equals(embed)) {
            List<Bus> buses = busService.findByIds(routeId);
            
            // Embed the buses as a collection under the "buses" relation
            builder.embed(buses, HalModelBuilder::halModelOf, "buses");
            
        } else {
            // Add a link to the buses resource
            builder.link(linkTo(WebMvcLinkBuilder.methodOn(RouteController.class).getBusesForRoute(routeId)).withRel("buses"));
        }
        
        // Build the final model and return the response
        return ResponseEntity.ok(builder.build());
    }

    // Helper methods for the link builders (not shown for brevity)
    // @PutMapping("/routes/{routeId}") public void editRoute(...) {}
    // @DeleteMapping("/routes/{routeId}") public void deleteRoute(...) {}
    // @GetMapping("/routes/{routeId}/buses") public List<Bus> getBusesForRoute(...) {}
}
```

As you see, I am using the more specific Spring Boot HATEOAS class `org.springframework.hateoas.server.core.HalModelBuilder`. The first example gives you full control over all the links and how to assign them. The `HalModelBuilder` is less verbose and it encapsulates the creation of the entire `_embedded` element in one statement.

This is nice, but if you have a lot of endpoints and a lot of entities that reference each other, it will get difficult to keep track of what you used for referencing an item or a collection of something.

In Spring Boot, there is the `@Relation` [annotation](https://docs.spring.io/spring-hateoas/docs/current/api/org/springframework/hateoas/server/core/Relation.html) that helps you define and control how an entity is referenced, but to cover that topic, I need to dive into assemblers and such, and this is not really a Spring Boot tutorial.

## Hexes and Hang-ups: Avoiding HATEOAS curses

As with all magic, you have to be a bit careful when you practice it, and creating a nice and discoverable API is not an exception. There are some curses that can come back and bite you.

The most common, we have already touched: **The inconsistent relations curse.** The relations `self` and `collection` are easy to remember and sort of "non-negotiable". So is `delete`.

 But what about when you use `POST` to make a new resource. Should you use `new`, `create`, `make`, `bake` or what? Again, this comes down to the domain. I like to use the proper action as far as possible. The most common is `create`. However, for adding an item to an **immutable collection**, like an Audit log, I would use `record`. If we are creating a new Customer instance, I would use the relation `onboard`. For an application, you would `register` or `apply`.

When we have created an instance, we might want to change it. I fall back to the [IANA `edit` relation](https://www.iana.org/assignments/link-relations/link-relations.xhtml) over using `update`. The justification for this is that you as a client request to `edit` the resource, but the backend is the one that actually does the `update` and it might come with a workflow. (Maybe I should have used `assigned-buses` in the `Routes` above.)

**The main rule is that once you have decided what relation name to use, make sure that it is used in all the APIs in a consistent way.**

The second most common one is to determine when and how to use `_embedded`. It should not be used as a way to do queries so that you could expand and do drilldowns using a stack of embeddings in the request. In my opinion, an embedding should also only return what is needed to know in the context of the embedding resource. One can start with doing some embeddings and when more common use cases are known, create their own sub-endpoints.

As an example, the `GET /routes/{routeId}` always returns the full, canonical representation of a route, with all the details, links and embedded resources. But the `GET /routes/{routeId}/simple` only returns

```json
{
  "id": 123,
  "name": "Route 123",
  "_links": {
    "self": { "href": "/routes/123/simple" },
    "fullDetails": { "href": "/routes/123" }
  }
}
```

If you have decided that the API that you are designing is actually worth doing in HATEOAS style, make sure that you use a framework that assists you with managing the relations and the links. Don't create the links by hardcoding them. I have seen this style of code several times, please don't do this. 

```java
// Construct the URIs 
String routeUri = String.format("%s/routes/%d", API_BASE_URL, routeId);
String busesUri = String.format("%s/routes/%d/buses", API_BASE_URL, routeId);
String routesCollectionUri = String.format("%s/routes", API_BASE_URL);

HalModelBuilder builder = HalModelBuilder.halModelOf(route)
            .link(Link.of(routeUri).withSelfRel())
            .link(Link.of(routeUri, "update"))
            .link(Link.of(routeUri, "delete"))
            .link(Link.of(routesCollectionUri, "collection"));
```

## The other guilds

HAL is not the only way to format a HATEOAS/Hypermedia enabled API.

There is a variant, [HAL-FORM](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#mediatypes.hal-forms), where you provide the template for how to edit or patch a resource. They are alike in the same way as JavaScript is to Java.

If your domain is such that the client would need a lot of guidance to get through complex workflows, multiple state changes and composite actions where not everything would be possible to do in one request, I would look into [Siren](https://github.com/kevinswiber/siren). This style is best when there can be complex and differentiated entities and actions that can be performed on those entities. It allows you to specify form submission fields when creating interactive forms or multi-step wizard.

I have also used [JSON:API](https://jsonapi.org/format/) styled APIs when the need for a strict set of rules for how data, links and relationsships must be structured. This style is nice when you are working with JavaScript based frontends.

## Key Takeaways

- Discoverable APIs empower your clients to navigate and interact with your API dynamically, reducing hardcoded URLs and improving flexibility.
- HATEOAS is the core REST principle that enables discoverability by providing actionable links in responses.
- HAL is a popular convention for structuring hypermedia responses, making it easier to implement and consume discoverable APIs. 
- Starting from HAL when you discuss and design your discoverable API will save you a lot of time. 
- Use `_links` to guide clients to related resources and actions, and `_embedded` to include related data when it makes sense for performance or usability.
- Let clients choose what to embed or follow, and design your API to be adaptable to future changes without breaking clients.
- Good discoverability leads to better developer experience, easier maintenance, and more robust integrations.
- And don't forget to use a framework for this or you will only burn yourself on the cauldron.

### All the code

You can find a variant of the implementation at https://github.com/ovelindstrom/routes-api-demo/tree/discoverable-apis.


---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2025/09/17/discoverable-apis/)*



