---
layout: post
title: Why Your APIs Should Be RESTful (and Not Just CSV Dumps)
date: 2025-05-30
categories: callista
---
 In today's digital landscape, APIs are the backbone of modern software systems. But not all APIs are created equal. Dive into this blog post and discover why RESTful APIs with structured data and DTOs are vastly superior to database-centric, CSV-driven approaches. We'll explore the flexibility, scalability, and security benefits that make REST the clear winner for your next integration project. Don't let clunky APIs hold you back! Read more to learn how to build APIs that developers (and your business) will love. And, there is a twist at the end.



## Introduction

Application Programming Interfaces (APIs) have become indispensable components in modern software architecture, acting as the essential pipelines for communication and data exchange between different applications and systems. 

As the demand for connected and distributed systems has grown, so has the sophistication of API design paradigms. Early approaches have given way to more standardized and flexible architectures, with Representational State Transfer (REST) emerging as a dominant style for building web-based APIs . Some reports indicate that around 70% of all public APIs are REST APIs.

If your application does not have a nice REST API, then you will most likely lose to products that have during a procurement process. Even worse is if you manage to get your product adopted by a paying customer, the developers that have to integrate with it will dislike you if your APIs are not well formed.

One issue that I have come across over the past years as a developer and architect is that many of the APIs that have been implemented, or that we have had to implement against, are based on the underlying database structure. This is more often true for older applications that have a legacy to deal with, than with modern applications built “cloud native” from the start.

## API Design Comparison

This blog will focus on two contrasting methods of API design:

* RESTful APIs, characterized by their use of standard HTTP methods, resource-oriented architecture, and structured data formats like JSON or XML, often incorporating Data Transfer Objects (DTOs) in one of the corners.  
* Database-centric "lookup" APIs, which typically involve direct database queries and primarily return data in the Comma Separated Values (CSV) format in the other corner.

The main driver of this analysis is a question that I have been asked several times over the years: “Why are RESTful APIs better than Database-Centric APIs”?

## Objective of Analysis

The objective of this analysis is to provide a comprehensive argument demonstrating the significant advantages of adopting RESTful API design principles with structured data and DTOs for building modern, scalable, maintainable, and secure applications, especially when compared to the inherent limitations of database-centric CSV APIs.

## Database-centric CSV APIs

Database-centric "lookup" APIs that primarily return CSV data typically follow a straightforward architectural pattern. These APIs often involve a direct connection from the API endpoint to one or more underlying database tables. Upon receiving a request, the API executes simple queries against the database, often based on parameters provided in the request. 

The API layer in such designs usually contains minimal data transformation or processing logic, with the primary function being to fetch data. The output format is predominantly CSV, frequently generated directly from the results of the database query . One degenerated variant that I have come across is the JSON-SV, that is, one just translates the header and the rows into a JSON, but keeps a CSV style form.

Example “Users”:

```
UserName,FirstName,LastName,Age,City  
ALSM,Alice,Smith,30,New York  
BOJO,Bob,Johnson,24,London  
CHBR,Charlie,Brown,45,Paris  
DIMI,Diana,Miller,38,Tokyo
```

becomes:
```json
{ 
"headers": ["UserName","FirstName", "LastName", "Age", "City"],
"data": [ 
    ["ALSM","Alice", "Smith", "30", "New York"], ["BOJO","Bob", "Johnson", "24", "London"],
    ["CHBR","Charlie", "Brown", "45", "Paris"],
    ["DIMI","Diana", "Miller", "38", "Tokyo"]
    ]
}
```

This approach might be initially considered or has been historically employed in scenarios involving simple data retrieval with limited complexity, within internal systems or legacy applications that already possess CSV processing capabilities, or in situations where the speed of initial development is prioritized over long-term architectural considerations.

The perceived simplicity of this method lies in the ease of implementing basic data extraction mechanisms and the potentially lower development overhead in the short term. Furthermore, CSV is a widely supported format, ensuring compatibility with various tools and systems that can readily consume this type of data.

However, while the initial simplicity of database-centric CSV APIs might appear attractive for quickly accessing data, this approach often lacks the architectural robustness required for more complex data interactions and evolving system needs . Relying on a direct connection to the database creates a tight coupling between the API and its DTO and the database schema . Consequently, any changes to the database structure can directly impact the API's output, potentially breaking consumers and necessitating updates across multiple systems. This lack of decoupling poses a significant challenge for the maintainability and evolution of the API over time.

## RESTful APIs

In contrast, RESTful API design adheres to a set of architectural constraints that promote simplicity, scalability, and statelessness . These principles collectively contribute to building APIs that are far more robust and adaptable than their database-centric CSV counterparts. 

### Resource first

One of the fundamental principles is the **uniform interface**, which encompasses several key aspects. First, REST APIs are structured around **resources**, which represent the core abstraction of information and are uniquely identified using Uniform Resource Identifiers (URIs).

For example, an API might expose resources like */users* to represent a collection of user data or */user/123* to identify a specific user. This resource-oriented nature provides a consistent and intuitive way for clients to interact with the API, focusing on the data being accessed rather than the underlying implementation details. 

Clients then interact with these resources through **representations** of their state, typically using standard data formats such as JSON. Other common data formats are XML and Parquet. Lately ProtoBuf, Avro and Binary-JSON (BSON) have emerged as formats to serialize data. 

The format of this representation can differ from how the data is internally stored on the server, offering flexibility in data presentation. Furthermore, RESTful APIs utilize **self-descriptive messages**, employing standard HTTP methods like GET (to retrieve), POST (to create), PUT (to update), and DELETE (to remove resources).

These methods align with common Create, Read, Update, Delete (CRUD) operations, making the API's actions clear and predictable. Responses also include metadata, such as HTTP status codes, to indicate the outcome of the request. 

Finally, the principle of **Hypermedia as the Engine of Application State (HATEOAS)** suggests that API responses should contain links that allow clients to discover related resources and navigate the API dynamically. This reduces the need for clients to have hardcoded knowledge of all API endpoints, enhancing the API's evolvability.

### Example - Get all Users, Get User Details

Assume for a moment that the endpoint `GET /users` only returns an array with all the UserNames. To get all the user details, one common way to do it is by adding parameters like `GET /users?withDetails=true`. 

Now we have an endpoint that can return two different datasets. Not a problem, since we have the data represented in a CSV styled way. But the client now needs to KNOW that this is the way to interpret it.

So another way is to introduce a specifying endpoint: `GET /users/details`. 

This is now a separate specification with its own return type and we return as above.

But that is not always the case. I have more than once come across APIs that first do `GET /users` and then iterate over the array and do `GET /users/<user name>/`.

## Core Principles of REST

Another core principle of REST is **client-server decoupling**, which mandates a separation of concerns between the client application and the server application. The client is responsible for the user interface and initiates requests, while the server handles data processing and responses. This independence allows each component to evolve separately without impacting the other, as long as they continue to communicate using the agreed-upon interface that is.

**Statelessness** is another crucial constraint, requiring that each request from a client to the server must contain all the information necessary to understand and complete the request. The server does not store any session-specific information about the client between requests, which improves scalability by reducing server-side resource consumption and simplifying load balancing.

**Cacheability** is also a key aspect, allowing responses to be cached on the client or server side to improve performance and reduce the number of requests reaching the server. Proper caching strategies can significantly enhance the responsiveness of RESTful APIs. Additionally, RESTful architectures often employ a **layered system** design, where the client might connect to intermediaries (like load balancers or proxies) without being aware that it's not communicating directly with the end server. This layering can improve security and scalability. 

Lastly, the **code on demand** principle (which I actually consider as optional) allows the server to temporarily extend or customize client functionality by transferring executable code.

Collectively, these principles result in APIs that offer significant advantages. Their stateless nature and support for caching contribute to **scalability**, allowing systems to handle a growing number of requests efficiently. The client-server decoupling and independence from specific technologies provide **flexibility**, making it easier to evolve the API and integrate it with various platforms and languages.

The uniform interface and separation of concerns enhance **maintainability**, as the API becomes more understandable and easier to modify. Furthermore, REST APIs are **independent** of the underlying technology stack, allowing for diverse implementations on both the client and server sides. These benefits extend beyond technical considerations, impacting business agility and cost-effectiveness by facilitating easier integration and potentially faster development cycles.

The choice of data format for API requests and responses significantly impacts the efficiency, interoperability, and maintainability of the API. While database-centric APIs often rely on CSV, RESTful APIs typically utilize structured formats as mentioned above. This offers substantial advantages over CSV. 

One key benefit is **improved data parsing and serialization efficiency**. JSON, with its lightweight, text-based structure and key-value pair format, is generally faster to parse and serialize compared to XML, especially in JavaScript environments, which are prevalent in web development.

In contrast, CSV, being a simple text format with comma-separated values, lacks inherent structure and requires more manual parsing and interpretation, increasing the overhead on the client side. The choice between JSON and XML often depends on the specific requirements of the application, with JSON frequently favored for its simplicity and performance in modern web APIs, while XML might be preferred in enterprise environments that demand rigorous data validation and have complex, hierarchical data structures. Personally, I have started using binary formats like Avro and ProtoBuf over XML when the need of a schema backed format is needed. Most of the time, this communication is machine-to-machine communication where the overhead of serialization is less than the more efficient file transfer and backward compatibility.

Another significant advantage of JSON (and XML) over CSV is their **enhanced data validation capabilities through schemas**. JSON Schema and XML Schema Definition (XSD) provide standardized ways to define the structure, data types, and constraints of the data being exchanged.

This allows for automated validation of both incoming requests and outgoing responses, ensuring data integrity and reducing the likelihood of errors caused by malformed or unexpected data. CSV lacks a standardized mechanism for defining and enforcing a schema, making data validation more challenging and often requiring custom implementation on both the client and server sides. The ability to validate data against a schema provides a crucial layer of reliability that is absent in CSV-based APIs.

Furthermore, structured data formats like JSON and XML offer **better interoperability across diverse systems and programming languages**. Both formats are language-agnostic and have extensive support in virtually every modern programming language and platform. This widespread support simplifies the process of integrating RESTful APIs with a wide range of client applications. While CSV is also a universally readable format, its lack of explicit structure makes automated processing and interpretation across different systems more complex.

JSON and XML also excel in their ability to **support complex data structures and relationships**. JSON's support for nested objects and arrays allows for the direct representation of hierarchical data and complex relationships within a single response.

XML's tag-based structure is inherently hierarchical and well-suited for representing intricate data structures with nested elements and attributes. Representing such complex data in CSV, with its flat, tabular format, is cumbersome and often requires denormalization, which can lead to data redundancy and inconsistencies, or necessitates the use of multiple CSV files with complex joining logic on the client side.

## Side by side comparison

The following table summarizes the key differences and advantages of the different formats mentioned.

| Feature | JSON | XML | Avro | Protobuf | CSV |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Syntax** | Key-value pairs, arrays | Tags, attributes | Binary; Schema defined in JSON | Binary; Schema defined in .proto files | Delimited values (e.g., value1,value2,value3) |
| **Verbosity** | Less verbose | More verbose | Low (compact binary format) | Very Low (most compact binary format) | Low (just data and delimiters) |
| **Readability** | Generally easier for humans and machines | Highly structured, good for document markup | Low (binary, not human-readable directly) | Low (binary, not human-readable directly) | High (tabular, easy to scan) |
| **Parsing Speed** | Generally faster | Can be slower for large documents | Fast (binary parsing, schema-driven) | Very Fast (optimized binary parsing, compiled schemas) | Fast (simple line-by-line, delimiter-based parsing) |
| **Schema** | JSON Schema | XML Schema Definition (XSD) | Mandatory (JSON-defined, often embedded/registered) | Mandatory (.proto file, compiled into code) | Implicit (first row often acts as header), no formal schema |
| **Data Types** | Basic (strings, numbers, booleans, etc.) | Extensible, supports more complex types | Rich set of primitive types, complex types (records, enums, arrays, maps, unions) | Rich set of primitive types, enums, nested messages, maps | Primarily strings; types are inferred or handled by client |
| **Metadata** | Limited built-in support | Strong support through attributes | Schema defines data types and names | Field numbers and names defined in schema | Column headers (first row) |
| **Hierarchical** | Supports nesting | Inherently hierarchical | Yes (nested records, arrays, maps) | Yes (nested messages) | No (flat, tabular data only) |
| **Browser Support** | Native JavaScript support | Good browser rendering capabilities | None natively (requires client-side libraries/decoding) | None natively (requires client-side libraries/decoding) | Excellent (can be downloaded and opened in spreadsheets, often handled by JS libraries) |
| **Use Cases** | Web APIs, mobile apps, data storage | Enterprise applications, document exchange | High-volume streaming, big data pipelines, inter-service communication, schema evolution | High-performance RPC, inter-service communication, mobile/IoT, embedded systems | Simple tabular data exchange, spreadsheets, bulk data import/export |

## You get a DTO and you get a DTO! Everyone gets a DTO!

In addition to leveraging structured data formats, well-designed RESTful APIs often incorporate **Data Transfer Objects (DTOs)**. DTOs are objects specifically designed to carry data between different layers or components of an application, particularly across network boundaries . They are typically simple objects with minimal or no business logic beyond the storage and retrieval of data . DTOs play several crucial roles in enhancing API design.

Firstly, they facilitate **data encapsulation and controlled data exposure**. By defining the exact data that needs to be transferred, DTOs prevent the exposure of sensitive or unnecessary internal details of domain models or database entities to API consumers . This is a significant security advantage over CSV APIs that might inadvertently expose entire database rows, including potentially sensitive information .

Secondly, DTOs enable **decoupling of domain models from API contracts**. Acting as an intermediary layer, DTOs insulate the API from changes in the underlying domain models or database schema . This ensures that API consumers are not directly affected by internal changes, promoting stability and reducing the risk of breaking changes, a crucial aspect often lacking in the tightly coupled nature of CSV APIs .

Thirdly, DTOs are instrumental in **facilitating API versioning and evolution**. Different DTO structures can be defined for different versions of the API, allowing for backward compatibility and a smoother transition for clients when new features or changes are introduced . This is a significant advantage over the less structured nature of CSV outputs, where managing different versions and ensuring compatibility can be considerably more challenging .

Finally, DTOs contribute to **optimizing data transfer and reducing payload**. They can be tailored to include only the necessary data for a specific use case, minimizing the amount of data transferred over the network and improving performance, especially in scenarios with limited bandwidth or high latency . This efficiency contrasts with CSV outputs, which might contain redundant or unnecessary data, leading to larger payloads and slower response times .

A well structured DTO specification that defines the requests and responses is one of the most important evaluation parameters that I use when in a procurement process.

## Be explicit about it

While database-centric APIs that return CSV data might seem simple to implement initially, they suffer from several inherent limitations. One significant drawback is the **lack of explicit data typing and schema definition**. In CSV, all data is treated as strings, and there is no built-in mechanism to specify data types such as integers, booleans, or dates . This absence of explicit typing makes it difficult for clients to reliably parse and interpret the data, often requiring them to make assumptions or implement complex logic to infer data types. 

Furthermore, the lack of a standardized schema hinders automated validation, increasing the risk of errors and inconsistencies. Another major limitation of CSV is the **challenges in representing hierarchical or related data**. Its flat, tabular structure makes it cumbersome to effectively represent complex relationships or nested information. This often leads to denormalization, which can introduce data redundancy and inconsistencies, or requires clients to perform complex joins across multiple CSV files to reconstruct relationships . The **increased complexity in client-side data parsing and interpretation** is another significant drawback. 

Clients consuming CSV data must implement their own parsing logic, which can be error-prone and time-consuming, especially when dealing with variations in CSV formats (e.g., different delimiters, quoting rules) . The lack of a standardized schema further complicates this process. Additionally, CSV has **difficulties in handling metadata and hyperlinks**. It primarily focuses on the raw data and lacks a standard way to include metadata such as timestamps or record counts, or hyperlinks to related resources, limiting the self-descriptive nature of the API and hindering discoverability.

Finally, CSV offers **limited support for error handling and status codes beyond basic HTTP**. While HTTP status codes can indicate general success or failure, CSV itself does not provide a structured way to convey specific error details or validation messages, making it harder for clients to understand the cause of errors and take appropriate action.

## Conclusion

Comparing the two API approaches across critical dimensions reveals **the clear superiority of RESTful APIs with DTOs.**

In terms of **flexibility**, RESTful APIs are highly adaptable due to client-server decoupling, support for multiple data formats (JSON, XML), and the ability to tailor data structures using DTOs to meet specific client needs .

API evolution and versioning are also significantly easier with DTOs. Database-centric CSV APIs, on the other hand, are less flexible, being tightly coupled to the database schema and limited to a single data format, making adaptation to different client requirements or API evolution challenging .

Regarding **maintainability**, RESTful APIs with DTOs offer better maintainability through separation of concerns, a uniform interface, and the use of structured data formats that are easier to understand and validate . DTOs further aid in managing changes to the underlying data model without directly impacting the API contract . Database-centric CSV APIs are less maintainable due to tight database coupling, lack of explicit structure, and potential inconsistencies in CSV generation and parsing .

In terms of **scalability**, RESTful APIs are highly scalable due to their statelessness, support for caching, and layered architecture . DTOs can also help optimize data transfer. The scalability of database-centric CSV APIs can be limited by direct database connections and the potential for increased load, along with a lack of built-in caching mechanisms. 

Concerning **security**, RESTful APIs with DTOs offer better security through standard HTTP protocols (e.g., HTTPS), various authentication and authorization mechanisms, and the ability to control data exposure through DTOs. One could argue that this is the same for CSV, but since CSVs are by nature not typed, it becomes more labor intensive to validate the input based on the column name.

Database-centric CSV APIs can pose security risks due to direct database access and the potential for over-exposure of data. Finally, in terms of **ease of integration**, RESTful APIs with DTOs are generally easier to integrate with diverse client applications due to the use of standard HTTP methods, well-defined resource structures, and widely supported data formats like JSON and XML. The self-descriptive nature of REST APIs also simplifies integration . Integration with database-centric CSV APIs can be cumbersome for clients that do not readily support CSV parsing or require more structured data.

Modern API design best practices emphasize principles like designing for discoverability, using standard HTTP methods appropriately, returning meaningful status codes, implementing proper authentication and authorization, validating requests and responses, handling errors gracefully, documenting the API thoroughly, and considering API versioning from the outset. A well-structured RESTful API with DTOs naturally aligns with these principles. REST's resource-oriented architecture and uniform interface support discoverability and the correct use of HTTP methods . Structured response formats (JSON/XML) allow for the inclusion of detailed error messages and metadata. DTOs facilitate request and response validation and play a crucial role in API versioning. Adhering to these best practices through REST and DTOs contributes to a better overall system architecture characterized by improved modularity through the separation of client, server, and data transfer layers, enhanced testability as each component can be tested independently, increased resilience due to decoupling and statelessness, and better long-term maintainability and scalability .

Consider the example of an e-commerce platform. A RESTful API for retrieving product details might return a JSON object containing specific fields like name, price, description, and images, utilizing a DTO to precisely define this structure. This approach offers several benefits over a CSV API that simply exports all columns from the products database table.

The RESTful API delivers a smaller payload, improving performance, provides flexibility by allowing different representations for various clients (e.g., a simplified view for mobile), and enhances security by not exposing internal database columns that are irrelevant to the client.

In contrast, the CSV API would likely transfer more data than necessary, require clients to parse and filter the relevant information, and potentially expose sensitive internal data. Another example is a financial data service. A RESTful API could allow clients to request specific financial data, such as stock prices for a given symbol and date range, returning the data in JSON format. This is far more efficient than a CSV API that provides a daily dump of all stock data.

The RESTful approach ensures clients only receive the data they need, simplifies integration with structured data, and offers better scalability by reducing the volume of data transferred. Furthermore, integrating with third-party services, such as payment gateways or mapping services, almost universally relies on RESTful APIs using structured data formats like JSON, highlighting the limited interoperability of CSV-based APIs in modern ecosystems.

In conclusion, the analysis presented in this blog strongly supports the argument that creating a RESTful API with a well-defined request/response/DTO structure offers significant and compelling advantages over a database-centric CSV "lookup" API for building modern software systems. 

The fundamental principles of REST, the benefits of structured data formats like JSON and XML, and the crucial role of DTOs collectively contribute to APIs that are more flexible, maintainable, scalable, secure, and easier to integrate. While the initial simplicity of a CSV-based API might hold some appeal for very basic use cases, the long-term benefits of adopting a more sophisticated and standardized approach like REST far outweigh the initial investment.

Embracing robust and scalable API design through RESTful principles and the strategic use of DTOs ultimately leads to a more sustainable, adaptable, and secure software ecosystem.

## The twist: How was this blog written?

(Content continues...)

I promised you a little twist in the end. This is how I wrote this blog post, using AI tools.

I started by asking Gemini for references around REST APIs and loaded those references into Google NotebookLM. This is the list of web references I added.

- What is a REST API? | IBM, added Mars 28, 2025, [https://www.ibm.com/think/topics/rest-apis](https://www.ibm.com/think/topics/rest-apis)  
- REST API Tutorial: What is REST?, added Mars 28, 2025, [https://restfulapi.net/](https://restfulapi.net/)  
- Top 3 benefits of REST APIs \- MuleSoft, added Mars 28, 2025, [https://www.mulesoft.com/api/rest/top-3-benefits-of-rest-apis](https://www.mulesoft.com/api/rest/top-3-benefits-of-rest-apis)  
- java \- REST API \- DTOs or not? \- Stack Overflow, added Mars 28, 2025, [https://stackoverflow.com/questions/36174516/rest-api-dtos-or-not](https://stackoverflow.com/questions/36174516/rest-api-dtos-or-not)  
- What is RESTful API? \- RESTful API Explained \- AWS, added Mars 28, 2025, [https://aws.amazon.com/what-is/restful-api/](https://aws.amazon.com/what-is/restful-api/)  
- Understanding RESTful API design principles \- Upsun, added Mars 28, 2025, [https://upsun.com/blog/restful-api-design-principles/](https://upsun.com/blog/restful-api-design-principles/)  
- REST API Principles | A Comprehensive Overview \- DreamFactory Blog, added Mars 28, 2025, [https://blog.dreamfactory.com/rest-apis-an-overview-of-basic-principles](https://blog.dreamfactory.com/rest-apis-an-overview-of-basic-principles)  
- Understanding REST API: A Comprehensive Guide \- Kong Inc., added Mars 28, 2025, [https://konghq.com/blog/learning-center/what-is-restful-api](https://konghq.com/blog/learning-center/what-is-restful-api)  
- What Is REST API? \- Mailchimp, added Mars 28, 2025, [https://mailchimp.com/resources/rest-api/](https://mailchimp.com/resources/rest-api/)  
- REST API and Data Formats | by Alrazak \- Medium, added Mars 28, 2025, [https://medium.com/@alrazak/rest-api-and-data-formats-cd842e81d914](https://medium.com/@alrazak/rest-api-and-data-formats-cd842e81d914)  
- JSON API: Best Practices, Benefits & Core Concepts, added Mars 28, 2025, [https://botpenguin.com/glossary/json-api](https://botpenguin.com/glossary/json-api)  
- Difference between JSON and XML \- REST API Tutorial, added Mars 28, 2025, [https://restfulapi.net/json-vs-xml/](https://restfulapi.net/json-vs-xml/)  
- How to Choose the Right API Response Content Type for Your Project \- Apidog, added Mars 28, 2025, [https://apidog.com/blog/api-response-content-type/](https://apidog.com/blog/api-response-content-type/)  
- JSON vs XML \- Difference Between Data Representations \- AWS, added Mars 28, 2025, [https://aws.amazon.com/compare/the-difference-between-json-xml/](https://aws.amazon.com/compare/the-difference-between-json-xml/)  
- The Role of JSON and XML in API Data Transfers \- Smart Parse SmartParse, added Mars 28, 2025, [https://smartparse.io/posts/json-xml-api-data-transfer/](https://smartparse.io/posts/json-xml-api-data-transfer/)  
- XML and JSON \-- Advantages and Disadvantages? \[closed\] \- Stack Overflow, added Mars 28, 2025, [https://stackoverflow.com/questions/5615352/xml-and-json-advantages-and-disadvantages](https://stackoverflow.com/questions/5615352/xml-and-json-advantages-and-disadvantages)  
- Structured Outputs \- OpenAI API, added Mars 28, 2025, [https://platform.openai.com/docs/guides/structured-outputs](https://platform.openai.com/docs/guides/structured-outputs)  
- The DTO Pattern (Data Transfer Object) | Baeldung, added Mars 28, 2025, [https://www.baeldung.com/java-dto-pattern](https://www.baeldung.com/java-dto-pattern)  
- model view controller \- What is a Data Transfer Object (DTO)? \- Stack Overflow, added Mars 28, 2025, [https://stackoverflow.com/questions/1051182/what-is-a-data-transfer-object-dto](https://stackoverflow.com/questions/1051182/what-is-a-data-transfer-object-dto)  
- The DTO Pattern: Simplifying Data Transfer | by Liberatoreanita | Medium, added Mars 28, 2025, [https://medium.com/@liberatoreanita/the-dto-pattern-simplifying-data-transfer-f99ab4f25c34](https://medium.com/@liberatoreanita/the-dto-pattern-simplifying-data-transfer-f99ab4f25c34)  
- What is the point of using DTO (Data Transfer Objects)?, added Mars 28, 2025, [https://softwareengineering.stackexchange.com/questions/171457/what-is-the-point-of-using-dto-data-transfer-objects](https://softwareengineering.stackexchange.com/questions/171457/what-is-the-point-of-using-dto-data-transfer-objects)  
- Efficient Data Transfer in REST APIs: A Deep Dive into the DTO Pattern with Spring Boot and MySQL \- Stackademic, added Mars 28, 2025, [https://blog.stackademic.com/efficient-data-transfer-in-rest-apis-a-deep-dive-into-the-dto-pattern-with-spring-boot-and-mysql-df2bdf1ece74](https://blog.stackademic.com/efficient-data-transfer-in-rest-apis-a-deep-dive-into-the-dto-pattern-with-spring-boot-and-mysql-df2bdf1ece74)  
- Create Data Transfer Objects (DTOs) \- Learn Microsoft, added Mars 28, 2025, [https://learn.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5](https://learn.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5)  
- Why you should use DTOs in your REST API \- cassiomolin, added Mars 28, 2025, [https://cassiomolin.com/programming/why-you-should-use-dtos-in-your-rest-api/](https://cassiomolin.com/programming/why-you-should-use-dtos-in-your-rest-api/)  
- Web API versioning in real world applications \- Vlad's blog, added Mars 28, 2025, [https://vladsukhachev.wordpress.com/2016/12/12/web-api-versioning-in-real-world-applications/](https://vladsukhachev.wordpress.com/2016/12/12/web-api-versioning-in-real-world-applications/)  
- Versioning DTOs for APIs and NoSQL DBs | by Shalin Garg | Medium, added Mars 28, 2025, [https://medium.com/@shalin.garg/versioning-dtos-for-apis-and-nosql-dbs-10f273fbbd20](https://medium.com/@shalin.garg/versioning-dtos-for-apis-and-nosql-dbs-10f273fbbd20)  
- Data Transfer Objects: The Contractual Lowdown on DTOs \- Gable.ai, added Mars 28, 2025, [https://www.gable.ai/blog/data-transfer-objects](https://www.gable.ai/blog/data-transfer-objects)  
- Data Transfer Objects (DTOs): A Comprehensive Guide | by Abderahmane Toumi | Medium, added Mars 28, 2025, [https://abderahmanetoumi.medium.com/data-transfer-objects-dtos-a-comprehensive-guide-2d00e8fa2ec3](https://abderahmanetoumi.medium.com/data-transfer-objects-dtos-a-comprehensive-guide-2d00e8fa2ec3)  
- Structured vs. Unstructured Data: A Complete Guide \- Talend, added Mars 28, 2025, [https://www.talend.com/resources/structured-vs-unstructured-data/](https://www.talend.com/resources/structured-vs-unstructured-data/)  
- Should I Use DTOs in a REST API? \- Latenode Official Community, added Mars 28, 2025, [https://community.latenode.com/t/should-i-use-dtos-in-a-rest-api/1912](https://community.latenode.com/t/should-i-use-dtos-in-a-rest-api/1912)

I also added a couple of books I have in my library as PDFs.

- RESTful Web API Patterns & Practices Cookbook \- Mike Amundsen, O’Reilly, added Mars 29, 2025\. [https://www.oreilly.com/library/view/restful-web-api/9781098106737/](https://www.oreilly.com/library/view/restful-web-api/9781098106737/) \[book\]   
- Continuous API Management, 2nd edition, O'Reilly, added Mars 29, 2025\. [https://www.oreilly.com/library/view/continuous-api-management/9781098103514/](https://www.oreilly.com/library/view/continuous-api-management/9781098103514/)  
- REST API Design Rulebook, O’Reilly, added Mars 29, 2025\. [https://www.oreilly.com/library/view/rest-api-design/9781449317904/](https://www.oreilly.com/library/view/rest-api-design/9781449317904/) \[book\]  
- Fundamentals of Data Enineering, O’Reilly, added Mars 29, 2025\. [https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/](https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/) \[book\]

After that I used NotebookLMs feature “Briefing doc”. Most of the hard facts and tables are taken from that one. I then took the table containing JSON, XML and CSV and asked Gemini to add the columns about Avro and Protobuf.

I had a little conversation with NotebookLM around how we should structure the blog, created that document in NotebookLM and then started writing. I think NotebookLM uses Gemini under the hood, and while I was writing, I got suggestions from the AI around better ways to formulate things I wrote. It quite quickly picked up on my way of writing.

So this blog actually has two purposes; formulating why REST and DTOs are better than CSV and database driven APIs and seeing how effective I could be using AI tools to do research and writing.

Gemini has helped me fine tune this blog, proofread it, suggested headers and then exporting it to Markdown format.

Finally, we decided to change the title from **The Superiority of RESTful APIs with Structured Data and DTOs over Database-Centric APIs** to the used **Why Your APIs Should Be RESTful (and Not Just CSV Dumps)** since that would attract more readers. ClaudeAI then wrote the splash text.

Google NotebookLM and Gemini want me to thank them for their contributions. ;)

## Final thoughs

Much of the text are AI generated and I removed **a lot**. The AI had a habbit of repeating itself and sometimes it did the same quotation twice, because if found it at several sources. It is kind of funny to read that "Person A say that the moon is green, and Person A also say that the moon is green". Happens a lot more with frequently quoted authors.

As a collegue of mine expressed it after reading it: "You can tell it's written with AI-support from the style - very chatty English, like listening to a radio program in the background."

Would I have written it like this? No, it would have been much more anecdotal and more wordplay.

Was it fun to write with an AI? Yes, it is like having a quick reseacher and editor that helps you reflect over what you write. Things like creating the tables of facts goes in seconds where it would have taken me much more time. The suggestions for the rest of the sentences and the constant proof reading is also very helpful.

The one BIG takeaway from writing this blog is how to use NotebookLM to search and summarize documents. Since I started writing this blog, about a month ago, I have used NotebookLM for researching and condensing big chunks of text several times. The ability to ask questions and get the reference directly into where it can find the information is like having your own librarian that knows exactly at what shelf a book can be found and at what page the information you are looking for can be found.

Will I continue writing like this? Yes, but mostly for corporate documentation and factual summaries, less for blogs. I do enjoy just expressing myself in text way to much to let AI do all the writing.

---

*The original posting was done on the [Callista Enterprise Blog](https://callistaenterprise.se/blogg/teknik/2025/05/30/rest-over-csv/)*
