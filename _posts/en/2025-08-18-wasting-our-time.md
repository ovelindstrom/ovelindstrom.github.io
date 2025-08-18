---
layout: post
title:  "Wasting our time - Thoughts about technical debt"
date: 2025-08-18 08:00:00 +0200
categories: english
---

I think it was Ward Cunningham who described how a system grows in complexity as it grows in capability. As systems grow, they inevitably create [cruft](https://en.wikipedia.org/wiki/Cruft), so there is no way to keep an evolving system "clean." Since our understanding of a system evolves with its design, our definition of "clean" changes as the system improves or when another piece is introduced.

The deviation between our current definition of clean and the ideal design for the system is what Ward metaphorically called "technical debt," at least as I have understood what he has written.

So, the "right design" for the system's current capabilities is dependent on our knowledge of its abilities and the available technology at this moment. As time goes by, our knowledge of our system and the technology evolves. That makes today's "right system" tomorrow's "wrong system."

That difference — the newly-imagined design minus the existing one — is technical debt. In some cases, that difference is "too small to care about," and we can't justify the cost of making the small change needed to move towards the "right design." In other cases, the gap is so small that it takes less time to fix it than to work around it.

As developers gain more knowledge, we obtain a larger stack of clean designs, patterns, and practices that we see as obvious. My personal view is that there is no point in taking shortcuts when it comes to "clean design" and "clean coding." Every design flaw you introduce today will come back and bite you tomorrow. And by "tomorrow," I don't mean some distant future; I mean, literally, tomorrow.

Yes, our design will deviate from the best design imaginable. That will even happen to the design we are thinking of right now. That is the pure essence of system development. You can, and actually should, start out with a "quick and dirty" design. The "quick" part of that statement is a paradox since that approach will ultimately slow you down.

We might use a particular solution purely because we can't imagine a simpler or more robust one at the moment. But we still need to implement this first design into the system as cleanly as we can. We need to obtain more experience with our system and create the "right design" by letting time pass. Time can pass in calendar days while we learn ourselves or by introducing someone with a different set of "obvious" solutions.

![Photo of a hockey goalie by Markus Spiske on Unsplash](/images/posts/waste/waste-hockey-golie.jpg)

As a first-response paramedic, I sometimes have to do things in an unsterile way to save the patient, and have the proper health care use heavy antibiotics later. But we are not saving lives here. We are writing code. To go fast, we have to go clean. Dirty code in itself isn't technical debt. We can't save time by writing sloppy code. That is not introducing technical debt. That is sabotage!

![Photo of cleaning signs by Oliver Hale on Unsplash](/images/posts/waste/waste-cleaning-signs.jpg)

"Technical debt" is the wrong term to use, if you ask me. "Technical waste" or "deliberate code littering" is a better description. We are not borrowing from the systems we are building; we are building them in either a clean or a crappy way. It is up to us to decide how much we waste or litter.

This waste isn't just an abstract concept; it has tangible costs. It manifests as longer bug-fixing times, increased difficulty in adding new features, and a steeper learning curve for new developers joining the team. Every piece of "litter" is a future roadblock for ourselves and our colleagues.

And then we loop through the whole thought process again, but this time with the entire process of developing software in mind: from writing requirements, refinement, and building, to deployment.

Where do we waste? Where do we litter? Where are we introducing organisational dept?