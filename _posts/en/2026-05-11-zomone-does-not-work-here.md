---
layout: post
title: "Who is this Some-One?"
date: 2026-05-11
categories: english decisions
---

A ticket has been sitting in review for nine days. The PR is fine. The author has moved on, assuming Some-One will pick it up. The reviewer is waiting for product to confirm the edge case. Product is waiting for engineering to flag any concerns. Nobody is blocked. Nobody is moving either.

It is not one ticket. It is a pattern. We start things — features, decisions, processes — without agreeing who owns what. Then we are surprised when things stall, or when two people end up doing the same work, or when a decision quietly gets made by whoever happens to be in the right Slack thread that morning. I have been part of every version of this. So have you, probably.

## Why have a framework?

In my experience the problem is almost never that people are lazy or unclear. It is that the role in a given activity is undefined.

> Starting a task without named roles is like heading out on a group ride without agreeing who carries the repair kit. Everyone assumes Some-One has it. Nobody does.

Frameworks like these are not bureaucracy. They are a forcing function for an honest conversation. When you hear "Some-One needs to take care of this," it matters less which framework you use to decide who that Somebody is. It matters that you agreed on Somebody at all.

But you need a framework to anchor the conversation. Let us look at a few.

## RACI — The granddaddy of responsibility

The oldest of the frameworks. Four letters, one person clearly on the hook.

**Responsible** — does the work. Can be a group, like a development team.

**Accountable** — owns the outcome. One person (maybe with a backup). Like a PM or EM.

**Consulted** — two-way input before the work is done. Like a System Architect or Staff Engineer.

**Informed** — one-way notification that it is done. Like all the other teams, sales...

The origin is a US management consultancy that used this heavily in the 1970s and 80s. The pitfall I have seen most often is that people conflate R and A. This is extremely common in Sweden, since they are both translated to the same word. And if two people are accountable, Somebody's cousin No-One is.

![Google Translate of the difference between Accountable and Responsible and how they both translate to Swedish with Ansvarig.](/images/posts/accountable-responsible.png)

## DACI — For decisions that need to move

A variant of RACI, but focused on decision-making.

**Driver** — keeps the decision moving (logistics, deadline, getting people in the room). Like an EM or Team Lead.

**Approver** — makes the call, usually one person or a small group where it doesn't really matter who approves it.

**Contributors** — provide expertise and input during the decision.

**Informed** — one-way notification that it is done. Like all the other teams, sales...

This one was popularised by Atlassian because they added a template for it.

The distinction from RACI: DACI is built for decisions, not work. The Driver isn't the decider — they're the project-manager-of-the-decision. RACI doesn't have that role and decisions often stall without it.

## RASCI — When execution is genuinely complex

Same as RACI but with S = Support added.

**Support** — people who actively help R do the work but don't own it (e.g. an SRE pairing on a release, a junior shadowing).

Use this when execution is complex and the supporting cast is real and worth naming. It avoids Support people drifting into thinking they're Responsible. The main distinction: S is a helper role, not a consultant. Consulted = "give input and comment on the mess". Support = "roll up sleeves and get dirty".

## RAPID — For big, infrequent, high-stakes decisions

When the going get tough, RAPID get's going.

**Recommend** — proposes the decision (does the analysis, makes the case).

**Agree** — must sign off. Typically legal, compliance, or a critical stakeholder. They can veto.

**Perform** — executes once decided.

**Input** — provides input but doesn't agree or veto.

**Decide** — the single decision-maker.

Origin: Bain & Company. Big-org strategy work.

The letters are not in process order. It is an acronym, not a sequence. RAPID separates "must agree" (veto power) from "input" (heard but not blocking). That distinction is rare and useful for high-stakes calls where one wrong-headed stakeholder can torpedo a months-long initiative.

## DARE — When meetings have become the work

If you find yourself in endless meetings because Some-One "just needs to discuss this a bit" and Some-Other-One constantly is absent, dare to ask about this:

**Deciders** — make the call.

**Advisors** — consulted, no veto.

**Recommenders** — propose options.

**Execution** — does the work.

Origin: Bain & Company sort of. Alumni from that company reframed it to suit agile coaches. Designed to combat decision-by-meeting.

The main thing with DARE is to explicitly limit who is in the room where it happens. The radical move is that Advisors and Recommenders are smaller groups than RACI's Consulted tend to grow to. It fights the bottleneck of giant status meetings and focuses on getting exactly those who have a role in the room. Everyone else is not there.

## Why it matters which one you pick

I had a discussion with a PM once. As usual, I reached for RACI. Luckily, that PM realised RACI was NOT the right framework and went for DACI instead. There are two main aspects.

**Work vs Decisions:** RACI and RASCI are about work. DACI, RAPID, and DARE are about decisions.

**Speed vs Stakes:** DACI is for fast, frequent decisions — the ones you do in a team. RAPID is for high-stakes ones: incident management, critical vulnerabilities, one-door decisions. DARE is the meeting-killer.

> Pick one. Have the conversation.

I am not arguing you should roll out RACI across your organisation next Monday. These frameworks are a thinking tool, not a process. What I am arguing is this: before we start anything that involves more than two people, we should spend three minutes deciding who is doing what.

For most engineering work, RASCI is enough. For decisions that need to move, DACI is sharper. For the rare big calls, RAPID is worth the overhead. For the meetings that have started to feel like the actual work, DARE is the corrective.

Pick the one that fits the shape of the problem. Or pick RACI and apply it loosely.

The acronym matters less than the act of choosing.

The pattern that fails is implicit roles, optimistic assumptions, and decisions made by whoever is most awake in the Slack thread that morning.

Some-One and No-One do not work here anymore. But we hired their cousin Somebody.

The fix is small. Names against letters. Three minutes, before we start. Somebody is named and is Accountable. The rest of us know which lane we are in.

The ticket from the opening should not have been sitting for nine days. Somebody named should have known it was theirs from day one.

Three minutes. Names against letters. That is the fix.
