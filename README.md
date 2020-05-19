# Meesterproef @cmda-minor-web 1920

## Debriefing

### Case

From the different cases I could chose from I went with the 'Strvct' case as presented by Wallscope.
Wallscope is a company that focusses on developing technologies associated with big data and is located in Edinbrough, Scotland.
One of their technologies that they are working on right now is called Strvct. Strvct is a tool that helps their clients capture their knowledge in a _Structured Vocabulary_ (a tree of terms).  
The clients will be able to create/read/update and delete their own structured vocabularies which Wallscope can use to help their clients further.

### Assignment

I will create a website that will function as a front-end to Strvct.
This website will visualise the clients structured vocabulary in a way that will be easy to navigate.  
The user will also have the option to create parts and edit this vocabulary.

### Requirements

- Product is a website functioning as a front-end to Strvct
- Website is viewable on different devices and browsers
- Website uses real data
- Website is created for the clients of Wallscope (specific audience)

### Research

Currently the research consists of any jargon or subjects that I wasn't familiar with when starting the project. Further research question will go into the actual developement of the product in question. Probably about the end-user as well as researching certain assumptions I make during brainstorming/developement.

#### Structured vocabulary

Structured vocabulary or sometimes also called controlled vocabularies are a collection of different terms organised according to methodology that can specify the relationship between different concepts to help the access to that information.
They are a great way to describe, organize and provide acces to information.

#### Linked Data

Linked Data is a term that refers to the best practices when publishing structured data on the internet.
The principles as well as the information I used can be found on the W3 page for [Linked Data](https://www.w3.org/wiki/LinkedData)

#### URI

Another defining characteristic of Linked Data is that all entities are represented by a URI, a Uniform Resource Identifier. This means the same entity can be used by different people for different purposes -but as long as they have the same URI, they will mean the same thing.

#### Knowledge graphs

A knowledge graph is knowledge organized in a way that a machine can read, understand and get information from. It's about entities, nodes, attributes and relationships between those.
A collection of descriptions of entities in a formal structure where both the machine and people can process them in an efficient matter.

#### Turtle

Turtle is a textual syntax for RDF (which I will mention next).
This will provide a way for a RDF graph to be writtin in a natural text for with abbreviations and patterns.
These .ttl-files will also be the format I will be using for my project.
Wallscope was nice enough to deliver their RDF/XML in Turtle wince it was more readable and had more of the 'mess' removed.

#### RDF

RDF stands for Resource Description Framework, and it is a standard for representation and interchange of data.
Its defining characteristic is that it represents data as statements composed of three parts, subject, predicate and object.
These are also called a triple.
You declare a subject which is connected to an object through a predicate.
In the Turtle format this will be:
`dbr:Bob_Marley foaf:knows dbr:Lee_Scratch_Perry .`
Bob Marley is connected to Lee Scratch Perry through a predicate; knows.

#### OWL

OWL is a Semantic Web Language. OWL is W3C's Web Ontology Language designed to represent rich and complex knowledge about thing and the relationship between those things.
OWL is part of the W3C Semantic Web technology stack which also includes RDF which I also explained in the section above and SPARQL which is being used by Wallscope as well.
More information can be found on the [W3.org page for Web Ontology Language](https://www.w3.org/2001/sw/wiki/OWL)

### Planning

I'm creating different prototypes and demo's each growing in scope as the weeks go on. I will start by using the smaller datasets and eventually/hopefully move on to the largest ones or ones made by the users themselves.

- Week 1: First meeting, debriefing, research
- Week 2: First tests, iterations, code- / designreview
- Week 3 & 4: More testing/iterations as well as more reviews
- Week 5: Test final prototype & presentation

## Deliverables

- Design rationale (debriefing, assignment, code-explanation, substantiation)
- Product biography (iterations, method, procces, planning, sketches, tests)
- Reflection
- Working prototype for a target audience, available on multiple devices with real data and a good UX. (a.k.a. a happy client)

## First meeting

From the first meeting I have learned quite a lot about Wallscope and this assignment.  
Our main contact will be Johnny who describes Strvct as his baby.
Antero will also be there to keep an eye on us and to see if we're moving in the right directions.
Ian will play the role of big grumpy boss (his words).

Clients will have an unique (to them) dataset and Wallscope needs to manipulate that dataset for their tools.
Stvct will be the tool that will let clients manipulate this data themselves so it's ready for the other tools Wallscope uses so it's easier for Wallscope to help their clients.  
This manipulated dataset will be a structured vocabulary and be built by Strvct.

The front-end of the tool might also want to introduce the concept of linked data and structured vocabularies to users so it's easier for them to understand.

Wallscope has already tried visualising data by using sunbursts and circle packing but that's not the prettiest and the most useful, especially with big datasets.

They have vocabularies, datasets and an API for me to test with.
I don't have to understand how _linked data_ / _knowledge graphs_ but it's a big part of what they do, so I probably should.

They use Taiga for projectplanning.
We meet every monday 1pm and keep in touch via Slack.

Our user is someone who knows something and wants to visualize that knowledge. The user doesn't necessarily get the technology that Strvct uses.

## Questions

- Everything in English?
- Deliverables as Word documents or a wiki?
- Strvct, strvct or STRVCT?
- More specific target audience (B2C, B2B, academia, office workers)
