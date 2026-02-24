---
layout: post
title: "Feedback or Not? - The Game"
date: 2026-02-24 10:00:00 +0200
categories: english
---
Have you ever received feedback that felt more like criticism than coaching? Or worse—feedback that crossed professional boundaries? The ability to distinguish between different types of feedback is a crucial skill in any workplace, yet it's often taken for granted. That's why I built **Feedback or Not?** — an interactive game designed to help developers, testers, managers, and team members develop their feedback recognition skills.

## What Is the Game?

[Feedback or Not?](https://feedback.codecadence.se/) is a web-based educational game that challenges players to classify statements into specific feedback categories. When you play, you'll encounter statements like:

- "You always make the same mistakes"
- "I've noticed the code review took longer than usual—is there something I can help with?"
- "That's a great improvement compared to last week!"

Your task? Determine what type of feedback each statement represents. Is it **Advice**? **Appreciation**? **Coaching**? Or perhaps **Criticism**? The game includes ten distinct feedback categories, each with specific characteristics and contexts where they're appropriate or problematic.

## Why This Matters: The Candor Gap

One of the key inspirations for this game is the concept of the **Candor Gap**—the space between what we think (our honest observations) and what we actually say. Understanding this gap is essential for creating psychologically safe teams where people are willing to give and receive honest feedback without fear.

The game teaches you to recognize the difference between:

- **Constructive feedback** (marked in green) — helpful, boundary-respecting, growth-oriented
- **Problematic feedback** (marked in red) — manipulative, boundary-violating, or masked criticism

## How It Works: Spaced Repetition Learning

The game isn't just about getting questions right—it's built on proven learning science. Each game session presents 12 questions:

- **4 questions (~33%)** from previously encountered questions — reinforces what you've already learned
- **8 questions (~67%)** from new, unseen questions — continues to expand your knowledge

This spaced repetition approach mirrors how our brains actually learn. By revisiting questions at strategic intervals, you build lasting memory and deep understanding—far more effective than cramming.

Your progress is automatically saved in your browser's localStorage, so the game intelligently tracks which questions you've seen and adjusts future sessions accordingly.

## The Feedback Categories

The game covers a comprehensive range of feedback types:

- **Advice** — Suggesting specific actions or directions
- **Appreciation** — Acknowledging effort and contributions
- **Coaching** — Asking questions to help someone discover solutions
- **Criticism** — Pointing out faults or shortcomings
- **Encouragement** — Motivating someone toward goals
- **Evaluation** — Assessing performance against standards
- **Praise** — Highlighting strengths and successes
- **Psychological Evaluation** — Making judgments about mental states or character
- **Interpersonal Feedback** — Addressing how someone's behavior affects others
- **And more...**

Learning to distinguish between these types helps you both give better feedback and respond more constructively when receiving it.

## Technical Details

The game is a lightweight, client-side web application built with:

- **HTML** for structure
- **CSS** for styling and visual hierarchy
- **JavaScript** for game logic and interactivity
- **localStorage** for progress tracking

Want to run it locally? It's simple:

```bash
cd feedback-or-not-game
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

The full source code is available on [GitHub](https://github.com/ovelindstrom/feedback-or-not-game), licensed under CC BY 4.0.

## Built with AI—and It Shows

Here's something interesting: this entire project was coded using prompting, agents, and what I call "vibe coding"—all for the fun of experimenting with AI-assisted development. The whole thing took about 2 hours to build:

1. I started with 12 questions from a presentation I regularly give on feedback
2. I used an OpenAI agent to research and generate additional questions
3. I used GitHub Copilot Pro for the majority of the coding

It's a great example of how modern AI tools can help rapidly prototype educational experiences without lengthy development cycles.

I even wrote this blogpost with AI, just asking it to look at other stuff I have written here at CodeCadence. :D

## Try It Out

Whether you're a developer, QA engineer, manager, or team lead, feedback skills are universally valuable. The game is quick to play—a session takes just a few minutes—and you'll leave with a sharper sense of how different feedback types work.

**[Play the game now →](https://feedback.codecadence.se/)**

You can also read more about the different feedback types and the candor gap concept directly on the game's [intents page](https://feedback.codecadence.se/intents.html) and [candor gap page](https://feedback.codecadence.se/candorgap.html).

What types of feedback do you find most challenging in your work environment? I'd love to hear your thoughts!