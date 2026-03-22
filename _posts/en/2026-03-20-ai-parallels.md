---
layout: post
title: "The confession of an AI herder"
date: 2026-03-20 10:00:00 +0200
categories: english
---

> Want the tighter cut? Read the Hemingway-style version: [The confession of an AI herder - Hemingway Style]({% post_url en/2026-03-20-ai-prallels-hemingway %}).


## History of AI and Agents

AI has been "just around the corner" for about seventy years. The 1950s gave us the Turing Test and the first chess-playing programs. The 1980s gave us expert systems, elaborate rule engines that were brittle the moment reality stopped following the rules. The 1990s brought neural networks back into fashion, the 2010s brought deep learning and image recognition and forced us to sßelect all the traffic lights and motorcycles in an image to prove that we were humans. 

And then in 2017 a paper called *Attention Is All You Need* quietly rearranged the furniture.

Large language models arrived at the mainstream sometime around 2022, and with them came a new obsession: agents. The idea is simple. Instead of asking an AI one question and getting one answer, you give it a goal and let it figure out the steps. It can call tools, browse the web, write and execute code, read your files, and spawn sub-agents to work in parallel. The model becomes a coordinator as much as a responder. Just like we have done with junior developers for many years now.

What makes this moment different from the previous "AI is here" moments is that the capability gap closed surprisingly fast. We went from "impressive demo" to "I use this every day" in a matter of months, not decades. The hard part now is not building the technology. It is figuring out how to herd it.

## Some things about Open Claw and Claude Cowork

Two products have been sitting open in my browser for the better part of the last month.

[OpenClaw](http://openclaw.ai/) is a local-first, open-source AI assistant that connects to your chat apps, calendar, email, browser, and file system. It runs on your machine rather than in someone else's cloud, and it supports swappable models: Claude, ChatGPT, or a local model through Ollama. The pitch is autonomy: you own the data, you own the extensions, you own the agent. The community can and does build custom skills for it. For people who want the power of an AI assistant without handing their digital life to a SaaS subscription, it is a compelling option.

[Claude Cowork](https://claude.com/product/cowork) is Anthropic's own take on the same idea, baked into Claude Desktop. Where OpenClaw is a platform you self-host, Cowork is a managed research preview. It can read and write local files, run multi-step tasks autonomously, schedule recurring work, and spin up sub-agents for parallel workstreams — all from within Claude's interface. It asks for your permission before doing anything destructive, which matters when an agent has write access to your file system.

They represent two philosophies in the same emerging category: one open and hackable, one polished and guardrailed. I am using both to write, but in different ways.

## A bit on effective writing techniques

Working with agents has forced me to become a better writer. Not in the literary sense but in the technical sense of being precise about what I actually want.

The biggest shift is front-loading intent. A human reader fills in gaps, an agent executes the gaps literally. If I write "clean this up a bit" I will get something technically cleaner that may not resemble what I had in mind. If I write "remove the redundant sentences, keep the tone dry, do not restructure the paragraphs" I am more likely to get what I meant. 

> Specificity is kindness to the machine.

The second habit is scoping. Agents can do a lot, which means they will do a lot if you let them. A well-scoped prompt defines what the task is, what it is not, and when to stop. "Refactor the authentication module" invites a rewrite of half the codebase. "Extract the token validation logic into its own function without changing its behavior" does not.

The third is checkpointing. Long agentic tasks drift. Breaking work into reviewable chunks — even just asking the agent to summarize its plan before executing it — catches misunderstandings before they compound. It feels slower but usually is not, because the alternative is cleaning up a confidently-executed misinterpretation.

So writing with an agent forces me as a writer to be a lot closer to the 4 C's of (academic) writing; clear, concise, complete, and correct. When I set out to write something like this blog post, I follow the same pattern all the time.

I start with an outline - creating the map of my story, the beginning, the middle, the facts, the end. I want to have some sense of the logical flow. I then do one of two things: I write a strong opening if I want to explore a topic through my writing or I write a strong ending if I want to prove a point. This one I do with the reader in mind. Who is going to read this?

The next step I do is quick-draft. I set a timer for 5, 10 or 15 minutes, depending on what length of text I want to produce. The quick-draft for this one was a 10-minute session and produced all the headlines and some ideas for the paragraphs. When that time is up, I normally leave the text and do something else for at least 30 minutes and let everything simmer for a while. Leaving the draft for a couple of days is not unusual.

When I return to the text, that is when the real writing begins. I twist and turn, I write with force, I find the graceful ideas and I explore the jungle of metaphors and the plains of facts.

## Herding Agent Sheep

While I am writing, I have two agents running in the background on my OpenClaw grid. One is a "Writing Rules Agent" that has two purposes: applying a writing style, like Hemingway's Rules:
* Use short sentences.
* Use short first paragraphs.
* Use vigorous English (strong, active verbs).
* Be positive, not negative.
* Avoid adjectives and adverbs.

It is also tuned to my style of writing and has access to (almost) everything I have written. This is my ruthless editor and is constantly giving me a little hell if I repeat myself, use sentences that are too long and just keep adding more and more words to a sentence that should have seen a period a long time ago, so you can imagine what it has almost yelled at me for writing this one and totally ignoring all advice. ;)

This one is named Black, after Hemingway's Springer mix that was his companion when he wrote *The Old Man and The Sea*.

The second one is a spelling agent, that has access to Svenska Akademins Ordböcker for swedish words, Merriam-Webster Thesaurus for english and DeepL for translations. With it, I can ask for an english translation if I know the swedish word. It has the authority to change obviously misspelled words on the fly, or mark them if it wants clarification.

Now and then, I send Claude on a "shopping spree" for quotes, facts and deep dives and come back with links where I can read what I need or with summaries that could be used when I write.

## More effective or not?

This is the important question.

I asked Claude "What is the definition of effective?"

> **Effective** means producing the intended or desired result. Something is effective if it actually works — it achieves the goal it was meant to achieve.
>
> In the context of the section title "A bit on effective writing techniques," it means writing that gets the agent to do what you actually want — as opposed to writing that is grammatically correct or well-intentioned but produces the wrong outcome.

Let me dissect this a bit. "Something is effective if it actually works" - yes, writing with AI works in that it allows me to write faster and helps me fill in the gaps, spellcheck and help me with grammar on the fly. It is nice to have an editor that goes through my text continuously and about 70% of the suggestions Black suggests are good ones or at least something that I can argue about.

And that is the big effectiveness gain: I have "someone" to argue with, like with a human editor. It helps me when I get stuck and it allows me to write faster and more precise. Whereas I previously wrote every word, I am now on about 60-70% and 30-40% is AI generated.

In this post, the first two paragraphs are around 90% AI generated and I have then thought it up to give it my own voice. When I started to write using AI as a companion, that percentage was a lot lower, since it had not tuned to my style yet.

I can produce a text I am happy with in less time than before and with a lot less misspelled words.

If I look at the sentence "writing that gets the agent to do what you actually want", the jury is still out. Most of the time it does, but I have had my fair share of AI-hallucinations and Agent mirages.

Is it effective to get good writing done or does it just produce test slop? I do stand for every word that I publish and here at Code & Cadence, most of the writing is still my own. I do produce texts for work in the same way, and there I can say that a lot more is generated by Agents, since they are in many cases variants of commonly known texts, with some adoptions.

## Some final advice

The first one is **pay for the dictionaries and translation tools**. I pay about 150 SEK/month for access to DeepL, M-W Unabridged and Grammarly. SAOL, SO and SAOB are still free.

The next one is **select your model wisely**. I started out with a Llama variant that was good, but the pure size of it took too much of the computer's power. It was also a bit of an overkill for spellchecking. Now I am using a Mistral Small 3 for the spellchecking and Qwen 3 for running Black.

And as always when dealing with AI: **The System Prompt** matters more than you think. At first, I did not give the editor a name, but after naming it Black and in some cases actually have it barking at me, I kind of enjoy bickering with it. Sometimes just for the sake of it. You have to not only tell the agent **what** to do, but also **how** to think. I have recently split the system prompt for Black and the different editor skills to be able to play around with different styles for different purposes.

That is the whole trick, really.

Give the machine a clear map.

Then keep one hand on the wheel.





