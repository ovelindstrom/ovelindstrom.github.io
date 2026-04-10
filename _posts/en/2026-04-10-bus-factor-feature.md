---
layout: post
title: "The Bus Factor is a feature, not a bug"
date: 2026-04-10
categories: english software architecture
---

Last summer I was on the track with a group of four riders. I led the fast group, showed them the line through the chicane, braking points, where to look. They got faster. Some of them significantly so. And then Monday came, I was back at my desk, and the track went quiet.

That image poped up again earlier this week. Because the same thing happens in every software organisation I have ever worked in.

## Mr Creosote and the Knowledge Lake

One of my all time favourite humorous sketches is [Mr Creosote](https://en.wikipedia.org/wiki/Mr_Creosote) from Monty Python's _The Meaning of Life_. Mr Creosote, for the younger audience, is visiting a french restaurant and is given more and more food until he finally explodes due to "a tiny wafer mint".

Positions like Staff Engineer, VP of Engineering, Lead Developer and Software Architect are all Mr Creosote-roles. The better we are at our jobs, the more we become a single point of failure. We accumulate context like a Data Lake — everything goes in, nothing comes out in a structured way, and after a while nobody dares to touch it because only one person knows what is in there.

Here is the irony: We get rewarded for _having_ the knowledge but not for _distributing_ it.

## The Paradox of Expertise

The value of a Staff Engineer — or any expert, really — comes from being the person that _knows stuff._ It is hard to lower your bus factor when it feels like you are lowering your own value. And to be honest: it feels great when developers come and ask for advice and you can just reach into the big pile of accumulated knowledge and pull out the right piece of wisdom.

This feeling is something that an expert must learn to master and overcome. **Because it is a trap**.

## When I leave the track

I am a motorcycle instructor for the Swedish Motorcycle Association (SMC). I teach people to ride so they _don't_ need me beside them anymore. That is the thing any expert in an organisation should do. And there is a reason for it.

As an instructor, I am quite fast. I am confident that I can keep up with most of the motorcyclists I meet on a track. If I am there, I can lead a slower rider and make them drive a little bit faster. But what happens when I am not on the track anymore? The pace drops, the participants go back to the way they used to ride, and they get scared of the apex again.

It is the same in software development. We love to optimise and have "the right person" do the stuff they know how to do because then we feel quick and with less waste. Every organisation has the informal knowledge paths. People who sort of _are_ the documentation. The ones we always go to for knowledge about that special database or ask to make the DNS changes.

If you start mapping those paths, you will write a Stephen King worthy novel. Creating those paths is what keeps me awake at night. I am not afraid of the ghosts in the closet. I am terrified of the "Ask John Architectures".

## The real win

Decisions and the process of taking them is like riding on the track. If you have the privilege of having a fast instructor, they can show you a better line. But the big gain comes when you learn to find the line yourself and can run equally fast with maintained risk level.

And that is the key to the mindset change. Now we are two riders that can lead and teach others. We can reach twice as many slower riders. And even if you are not as fast as the fastest instructor, you are still faster than a non-instructor.

This is the real win. When the sum of the knowledge and the abilities grows in an organisation, not just the depth of one person's head.

This insight did hit me like a seagul to the head at Philips Island during one of the first bigger project I was Scrum Master at. We did good in the team and ever morning, I started "the script" on my computer and fetched all the new translations from the translation engine and pushed it to the Git repository.

And then came Vabbruari, and I had to focus on a very sick 4 year old and my computer was still locked in my cabinet at work. But that should not be a problem right? The script was checked into our script repo. But the access key was not. It was only on my computer and I had never come around to automate this. Sometime, you are so close to the edge of grip that all it takes is a bit higher track temperature to crash.

## Documentation Debt

The field of Technical Debt has its own vocabulary. You can measure vulnerabilities in your dependencies, you can calculate how much time it would take to clean up the code. But what about the knowledge that only exists in someone's head?

I battle that monster by not being there from time to time. I leave for a conference or I take a vacation. In that sense, the Swedish way of having four weeks every summer where we battle-test the "Ask John Architecture" might be one of the reasons why our startups are so successful.

**By not being there, you uncover the most urgent gaps in processes, documentation and automation.**

Documentation debt is invisible until someone leaves, gets sick, or goes on semester. It compounds silently and the interest rate is paid in Slack messages.

## Making the invisible visible

So how do we actually get the knowledge out of our heads and into a form the organisation can use — even when we are not in the room?

We are not yet in William Gibson's _Neuromancer_, where Case jacks directly into cyberspace and knowledge flows through neural implants. Until then, the knowledge has to leave our brains the old-fashioned way: through our fingers, into artefacts.

This is where ADRs, structured system descriptions and documented processes stop being "nice to have" and become knowledge insurance. They are the track maps that let other riders find the racing line without the instructor in front of them.

Pair on decisions, not just code. Write ADRs. Do the vacation test — could your team ship without you for three weeks? Make sure you record the _why_, not just the _what._ And rotate ownership deliberately, even when it is slower. It will make the sum greater.

## The wafer-thin mint

Mr Creosote exploded because he could not stop consuming. The cure is not to eat less. It is to share the meal.

The goal is not to be the fastest rider on the track. It is to have a track that runs fast without you.

#### Note
This blog is written with the help of Black, my AI-editor.