---
layout: post
title: "The confession of an AI herder - Hemingway Style"
date: 2026-03-20 10:00:00 +0200
categories: english
---
> Read the original version: [The confession of an AI herder]({% post_url en/2026-03-20-ai-parallels %}).


## History of AI and Agents

AI has been "just around the corner" for seventy years.

The 1950s gave us the Turing Test and chess programs. The 1980s gave us expert systems. They looked smart until life broke their rules. The 1990s brought neural networks back. The 2010s brought deep learning, image recognition, and endless click tests about traffic lights and motorcycles.

Then 2017 arrived. *Attention Is All You Need* changed the field.

Large language models hit the mainstream around 2022. Then agents became the new obsession.

The idea is simple. Stop asking one question at a time. Give a goal. The model plans steps, calls tools, browses the web, writes and runs code, reads files, and starts sub-agents in parallel. It acts like a coordinator, not just a chatbot. We have managed junior developers this way for years.

This wave moved fast. We jumped from "nice demo" to "daily tool" in months. The hard part now is not the model. The hard part is managing it.

## Some things about Open Claw and Claude Cowork

Two tools have lived in my browser this month.

[OpenClaw](http://openclaw.ai/) is local-first and open source. It connects to chat, calendar, mail, browser, and files. It runs on your machine, not someone else's cloud. You can swap models: Claude, ChatGPT, or local models through Ollama. You own your data, extensions, and agent. The community keeps adding skills. If you want control, OpenClaw delivers.

[Claude Cowork](https://claude.com/product/cowork) is Anthropic's version inside Claude Desktop. OpenClaw is self-hosted. Cowork is managed. It reads and writes local files, runs multi-step jobs, schedules recurring work, and launches sub-agents in parallel. It asks for permission before destructive actions. That matters when an agent can write to your disk.

They show two paths in one category. One is open and hackable. One is polished and guarded. I use both, but for different jobs.

## A bit on effective writing techniques

Agents have made me a better writer.

Not in style. In precision.

The biggest shift is intent first. A human fills gaps. An agent executes them. If I say "clean this up," I get a cleaner draft that may miss my point. If I say "cut repetition, keep a dry tone, keep paragraph order," I get what I want.

> Specificity is kindness to the machine.

The second habit is scoping. Agents can do a lot, so they do a lot. A good prompt says what the task is, what it is not, and where it ends. "Refactor authentication" invites a rewrite. "Extract token validation into one function with no behavior change" gives a safe task.

The third habit is checkpoints. Long runs drift. Break work into reviewable chunks. Ask for a plan before execution. You catch mistakes before they spread.

This process pushes me toward the four C's: clear, concise, complete, correct.

My workflow stays the same. I start with an outline. I map the opening, middle, facts, and ending. Then I write either a strong opening, if I want to explore, or a strong ending, if I want to prove a point. I keep the reader in mind.

Next comes a quick draft. I set a timer for 5, 10, or 15 minutes. This post got 10. That sprint gave me headings and rough paragraph ideas. Then I walk away for at least 30 minutes. Sometimes I wait days.

When I return, real writing starts. I shape the argument. I cut weak lines. I keep what carries weight.

## Herding Agent Sheep

While I write, two agents run in my OpenClaw grid.

One is a "Writing Rules Agent." It applies these rules:
* Use short sentences.
* Use short first paragraphs.
* Use vigorous English (strong, active verbs).
* Be positive, not negative.
* Avoid adjectives and adverbs.

It also knows my style and can read almost everything I have written. This is my ruthless editor. It calls me out when I repeat myself, stack long clauses, or dodge the period. It would bark at parts of this post too. Fair enough.

I call it Black, after Hemingway's dog while he wrote *The Old Man and the Sea*.

The second is a spelling agent. It uses Svenska Akademins Ordböcker for Swedish, Merriam-Webster for English, and DeepL for translation. I can ask for an English word from a Swedish one. It can fix clear misspellings on the fly, or flag uncertain cases.

I also send Claude on a "shopping spree" for quotes, facts, and deep dives. It returns with links and summaries I can use.

## More effective or not?

This is the key question.

I asked Claude "What is the definition of effective?"

> **Effective** means producing the intended or desired result. Something is effective if it works, and reaches its goal.
>
> In this context, it means writing that gets the agent to do what you want, not writing that only looks correct.

That fits my experience. Writing with AI works. It helps me move faster, fill gaps, spellcheck, and fix grammar while I draft. Black's suggestions help about 70% of the time, and the rest still gives me something useful to push against.

That is the main gain. I have someone to push against, like a human editor. It helps when I get stuck. It helps me write faster and with more precision. I still write most words, but AI now contributes about 30 to 40%.

In this post, the first two paragraphs started as roughly 90% AI output. Then I reshaped them into my voice. Early on, AI contributed less because it had not learned my patterns yet.

Now I reach a draft I like in less time and with fewer spelling errors.

If I test the line "writing that gets the agent to do what you want," the verdict is still open. Most days, yes. Some days, I still hit hallucinations and agent mirages.

Does this produce better writing, or just text slop? I stand behind every word I publish. At Code & Cadence, most text is still mine. At work, agents write more because many documents are variants of known formats.

## Some final advice

First: **pay for dictionaries and translation tools**. I spend about 150 SEK per month on DeepL, M-W Unabridged, and Grammarly. SAOL, SO, and SAOB are still free.

Second: **choose your model with care**. I started with a Llama variant. It worked, but it ate too much machine power. It was also too heavy for spellchecking. Now I use Mistral Small 3 for spelling and Qwen 3 for Black.

Third: **the system prompt matters**. At first I did not name the editor. After I named it Black, and let it bark at me now and then, the process clicked. You must tell an agent what to do and how to think. I now split Black's system prompt from its editor skills, so I can tune style for each purpose.

That is the whole trick, really.

Give the machine a clear map.

Then keep one hand on the wheel.




