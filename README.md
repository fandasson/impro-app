# ImproApp
This app supports the impro performance of [IMPROvariace](https://www.improvariace.cz) impro group. It allows the audience to interact with the performance in real-time. All views run in the browser. No app installation or account creation is needed.

## Main terminology

<dl>
<dt>User</dt>
    <dd>Show visitor interacting via the app through a smartphone.</dd>
<dt>Admin</dt>
    <dd>Show moderator or dedicated person responsible for interacting with the app during the show.</dd>
<dt>Audience</dt>
    <dd>Dedicated view used for displaying content to the whole audience via a screen projector.</dd>
<dt>Question</dt>
    <dd>Basic entity representing one interaction with the audience. Can be one of many types, like a text question (users input text), vote (users vote for the player they like most), or matching (users match players to characters).</dd>
<dt>Question Pool</dt>
    <dd>Group of Questions. Used when we want to count the sum of votes (answers) given to players over several Questions. A performance can have any number of Question Pools.</dd>
</dl>

## Currently supported use-cases
### General
- Vote Questions can be batched into a Question Pool.

### As admin:
- I can add a _vote-type_ Question.
- I can manage Performance visibility.
- I can manage Question visibility towards Users and Audience.
- I can see users' Answers in real-time.

### As user:
- I only see a Question when the admin sets its visibility.
- I can submit an Answer to a Question.
- I can see the results of a Question (if set by Admin).

## Current limitations
- Missing CRUD operations over most of the entities (wasn't needed, Supabase's interface is used).
- Only _vote-type_ Questions can be added via the Admin interface.

## Tech stack
The whole solution stands mainly on the following pillars:

1. [Next.js](https://nextjs.org/) app using the app router and server actions (I just want to try it).
2. [shadncn/ui](https://ui.shadcn.com)
3. [Supabase](https://supabase.com/) for database, authentication, image storage, and real-time streaming.
4. [Vercel](http://vercel.com/) for frontend cloud.
5. [Zustand](https://supabase.com/) for local state management.

## Local development
This is a standard [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). If you want to run it locally, deploy it, or customize it, follow the appropriate documentation.
