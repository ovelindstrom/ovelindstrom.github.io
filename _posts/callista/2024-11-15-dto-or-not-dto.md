---
layout: post
title: DTO or not DTO?
date: 2024-11-15
categories: callista
---
In this blog we dive into the concept of Data Transfer Objects (DTOs), providing a detailed explanation of their use, design best practices, and how they relate to other object patterns like Value Objects (VO), Domain Objects (DO), and Business Objects (BO). You will gain the understanding that the key to effective use of DTOs lies in their purpose: transferring data efficiently while keeping domain logic separate and testable.

-[readmore]-

It all started with a code review. A developer had added a method in a class that created a hard dependency between several other domain classes and value objects and then exposed everything
to the Web UI.
 
My statement was "That violates the [DTO Pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html), move that method to an Assembler instead". A sentence that for me made perfect sense, since I have read mr Fowlers book on Enterprise Pattern several times.

But that was not the case with all developers. So let us dive into the world of Data Transfer objects, Value Objects and Business Objects.

## DTO - Data Transfer Object

> In the field of programming a data transfer object, DTO, is an object that
carries data between processes. The motivation for its use is is that communication between processes is usually done resorting to remote interfaces, e.g. web services, where each call is an expensive operation 
_- Wikipedia_

That is the booring definition of a DTO. In many of the object oriented languages I have used, there is a notation of a data class or record that is used to carry around information needed in differnt parts of the application. The DTO encapsulation pattern is not new. In C++ you do it like this:

~~~ c++
class PersonDTO {
public:
    std::string firstName;
    std::string lastName;
    int age;

    PersonDTO(std::string fn, std::string ln, int a) : firstName(fn), lastName(ln), age(a) {}
};
~~~

and in C# it had evolved to this that is a lot less verbose:

~~~ c#
public class PersonDTO
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
}
~~~

In Java, we have a bit more code to write to do the same thing.

~~~ java
public class PersonDTO {
    private final String firstName;
    private final String lastName;
    private final int age;

    public PersonDTO(String firstName, String lastName, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getAge() {
        return age;
    }
}
~~~
but luckly for us, we have Project Lombok so it can be written like this:

~~~ java
import lombok.Data;

@Data
public class PersonDTO {
    private String firstName;
    private String lastName;
    private int age;
}
~~~

and since Java 14 (and by the looks of it fully supported in Java 23) the keyword _record_ has been added so that we can write it like this:

~~~ java
public record PersonDTO(String firstName, String lastName, int age) {}

~~~

The big difference between the new _record_ and the POJO DTO is that the _record_ is immutable and designed specifically to be passed around as a concise data carrier. We will come back to why this is good later.

## DTO design

Let us look at some of the best practises when designing a DTO.

1. __Transfer it__: The Transfer in DTO is important. Don't use DTO if you are not transfering data from one
process to another, like through a public API, to a Web Page or through a message broker. When I have adjecent services
that needs to cooperate, I tend to do a shared domain modell and Business Objects over DTOs. If we then need to separate
the services in the future, do the DTO then.
1. __Immutability__: Once a DTO instance is constructed, it should not be possible to manipulate on that 
instance. There are multiple way of achiving this and by using a _record_, you get that automatically. 
In the POJO example, I have made the fields _private final_ so that it can't be manipulated outside 
the constructor. The Lombok example however, is actually not a _true DTO_, since it will produce both 
getters and setters. There are ways around that, but that is another blogpost.
1. __Value objects__: Consider using Value Objects (VO) if the identity is not important and you can 
define the Value Object to be used by any DTO. Value objects are not really ment to be transfered and
 typically encapsulates logic about the object such as with Currency/Money. You can not have a negative
  denomination on an Currency, even if I would love to be able to pay with a -100 SEK note. A Value Object in itself should not need to be serialized and transfered between different processes, just their reference or identifyer.
1. __No circular references__: No. Never. Serializers hate them, Garbage Collectors hate them and you
 do increase the risk of getting your pull request denied by your fellow developers who also dislikes circular references.
1. __No identity__: By itself, a DTO do not have a _distinct identity_. Generally, you should be 
able to compare two DTOs by their content and understand if they are the same. If you want to update an identified resource, say the Person above, it is more RESTfull to send the PersonDTO to an endpoint with the identifyer, rather than sending the DTO and then have to open it up and look into it to understand where to save it. If the identity of a DTO is important, it is generally
better to use a datastructure that allows you to have a relation between a key and a value.
1. __Anemic design__: No business logic in a DTO. Ever. There are a lot of other patterns to use to 
manipulate, generat and map DTOs.
1. __80%-rule__: One common mistake is to start creating a different DTO for each scenario or receiver. This forces you
to have multiple mappers and the number of classes quickly becomes unmanagable. Keep your DTO concise and carefully evaluate
what to add to a DTO, when to reuse and when to add a new one. My rule of thumb is that any receive should use at
least 80% of the DTO. If you find that only half of the attributes are used in one place and the other in another place,
then it is time to split the DTO.
1. __Assemble it__: All DTOs should be assembled for a purpose of transfering it. If you are just copying the domain object
you are in fact sharing a domain and that is ok. The most common use of a DTO is to hide the business logic and keep costly
requests to remote processes down. If I need to present data in a table, that get data from several domain objects,
a specific DTO is to be prefered over pushing logic of combining multiple request into the presentation layer.

## DTO, L-DTO, VO, DO or BO?

Many of the patterns used looks similar to each other. Let us look into the difference.

A __DTO__ is used to transfer data between two differnt processes. The Assembly and Disassembly of the DTO
is the responsability of each process. There is a cost of creating, transfering and maintaining a DTO that should not
be under-estimated.

A __Local DTO__ is a DTO that is not really transfered to another process, but used to mitigate differences
in Domain Models that works on similar data. One common use of a Local DTO is when you need to be multi-threaded.
A L-DTO can then be used, with an internal queue, to eliminate the need for concurrency controlls. The `java.util.concurrent`
Collections works best over L-DTOs.

__Value Object__ is what is used to represent a concept in a domain model. Where the DTO is used to just transfer
data, the Value Object contains domain logic and business rules.

If we look at a Money VO, it contains the business logic that you can't create a negative denomination.

```java
public class MoneyVO {
    private final BigDecimal amount;
    private final String currency;

    public MoneyVO(BigDecimal amount, String currency) {
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        this.amount = amount;
        this.currency = currency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MoneyVO money = (MoneyVO) o;
        return amount.equals(money.amount) && currency.equals(money.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount, currency);
    }
}

```
The Money DTO don't need this at all.

```java
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MoneyDTO {
    private BigDecimal amount;
    private String currency;
}
```
To convert to and from DTO and VO, we need to create a mapper. 
Don't do the misstake of putting this into the VO and DTO classes. Create a MoneyMapper class.
This makes the testing easier.

```java
public class MoneyMapper {
    // Convert MoneyVO to MoneyDTO
    public static MoneyDTO toDTO(Money money) {
        return new MoneyDTO(money.getAmount(), money.getCurrency());
    }

    // Convert MoneyDTO to MoneyVO
    public static Money toValueObject(MoneyDTO dto) {
        return new Money(dto.getAmount(), dto.getCurrency());
    }
}
```

Now we have come to the __Domain Object__. Where the DTO is used to transfer Data, the Domain Object
represents business concepts or entities of a domain. The domain objects is a part of the domain layer (doh!)
and encapsulates rules, behaviours and data. In a way, the DTO can be seen as a subset of the DO.

A domain object is by design mutable and depending on how you mutate it, different things happens. Validation
is a big part of the business logic. Another big part is the relationship between domain objects. They are
represented by unique identifiers and mapping of relations. This makes the Domain Object a perfect
candidate to apply Persistence mappings to, like JPA or Hibernate. You don't want a Hibernate notation on a DTO.

Now we only have the __Business Objects__ left. As with the Domain Object, it represents a real-world concept.
However, they are used in different layers and serve different purposes. While the Domain Objects represents
a _core business concept_, the Business Object represents a Use-Case specific logic that uses the Domain Objects.
A Business Object is never persisted, but a product of the Business Object might be, if it produces a Domain Object.

My go-to example is when you create an Order in a WebShop. That one is handled in the OrderService (BO) that 
orchestrates the Customer (DO) and Order (DO) with the OrderRepository (BO) and the PaymentService (BO) so that when 
the Order is registered and PaymentDetails (DO) is received, it can send it to the WarehouseService (BO) just
to get the information that the items you ordered is shortlisted and will be in stock again after the ski season
is over. (Why can't they fix the Kafka cluster so that the StockSyncronizationService works!? ;) )

## Final Words
Choosing whether to use a DTO or not depends on your system's design and the specific needs of your application.
 While DTOs can simplify data transfer across boundaries, it's crucial to avoid overuse and maintain clear 
 separation of concerns between data transfer, business logic, and domain modeling. 
 
 By following best practices and understanding the distinctions between DTOs, Value Objects, and Domain Objects,

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2024/11/15/dto-or-not-dto/)*
 you as a developer can ensure more maintainable, efficient, and understandable code.
