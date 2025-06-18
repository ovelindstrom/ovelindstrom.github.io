---
layout: post
title:  "A bold statement about password security"
date:   2025-06-18 10:00:00 +0200
categories: english
---
__Scene:__

<i>It is the week before Midsummers Eve and the sun is shining down on the city of Stockholm. The streets are filled with people enjoying the warm weather, and the air is filled with the sound of laughter and music. The parks are populated with teenagers in different states of clothing that has just been released from their school duties.</i>

<i>Not that our heros at the development department at our product company notices this. They are mostly focused on getting the procurement Jira issue for the new blinds for the window through the process so that they can block out the anoying sunshine.</i>

<i>In the middle of this Sysifean task, the ever so charming, but somewhat dimittet CTO, Archibald P. Marting enters the room with a big smile on his face. When Sir Clicksworth, as he is also know (because, as he once exclaimed, "These buttons! They… click!") looks this pleased with himself, you know that it will be an interesting discussion.</i>

---
"Well, good afternoon Archie, what bring you here today?", asks Henry, the Scrum Master of the developoment team.

"Oh, hello Henry! I have a great idea that I want to share with you all!", replies Archibald, his eyes sparkling with excitement. "You remember that we have gotten a lot of requests for multi-factor authentication in our product, right?"

"Yes, and we have been discussing it with our partner that provides the authentication service. We have even started to implement it in our product, but we are not there yet," says Henry.

"Yes, yes, but I have a great idea that will make it even better! And without having to involve the partner at all!", exclaims Archibald, his enthusiasm palpable.

"Really? That sounds interesting. What is it?", asks Dan, our System Architect and the one that has been working with the MFA solution for a couple of months now.

"I know that the solution that you all have been working on is to use the partner's service to send a code to the user's phone, using the parthers MFA app, and then the user has to enter that code in the dialogue to log in. But I have a better idea! Why not just show the user a dialogue with a the code already there and ask them to fill in the code and click a button to log in?", suggests Archibald, his eyes shining with pride.

"Well", starts Dan, "that is not how MFA works. The whole point of MFA it to make the user use a second thing to verify who they are, like with the code sent to their phone, a fingerprint or face scan, or even a hardware token. It has to be something on another device."

Archibald looks at Dan and Henry, still smiling. They both know him well enough to know that he has already anticipated this and has a response to the objection.

"That problem is one I have already thought about. Do you remember that my wife Rut did a UX survey a couple months ago?"

"Well, yes, but how is the UX connected to security?", asks Dan, very confused about the sudden change of context.

"If you had read the report, like I have done", Archibald continues, "you would have noticed that on page 21, there was a diagram about the number of screens that our professional users are actually using. More than 94% of the users of our system has more than one screen."

"I still can't see how this is related to the MFA", replies Dan.

"If we show the login dialog on one of the displays, and the MFA code dialogue on the other display, we are in fact using a multi device login!"

With that statement, and an almost audiable "TADA!!", sir Clicksworth leaves the room.

Dan and Henry looks at each other and agrees to not take vacation at the same time this summer.

![Direct MFA Dialogue](/images/posts/directmfa.png)