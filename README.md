# Introduction

Are you fun of [Advent of Code](https://adventofcode.com/)?

Then you will love this project.

It is inspired by the same idea.

But, it is implemented in the Web3/Blockchain world!.

24 Exercises, starting December 1st and ending December 24th, will challenge your
Web3/Blockchain knowledge.

They are in increasing level of difficulty and, it goes without saying, the moment
you solve the exercise, you are eligible for rewards from our sponsors.

# Developers

But you have landed on this Github repo, haven't you?

If you kneed to know how we have built this project, here is is how.

## Scaffold ETH 2

We have used [Scaffold ETH 2](https://scaffoldeth.io/) to bootstrap the repository.

This gave us a quite good head start. Both at the Smart Contract level with the Hardhat
integration and at the Web application level with the Next.js integration.

All the libraries and tools carefully selected were in place.

So, we immediately started turning our idea in real code-flesh.

### Smart Contract(s)

Working at the Smart Contract level, you have to be in the directory [packages/hardhat](./packages/hardhat/).

### Next.js application

Working at the Web application, you have to be in the directory [packages/nextjs](./packages/nextjs/).

### Working With the Codebase

Since we relied on Scaffold ETH 2, it is a good idea to get familiar with that by reading [their docs](https://docs.scaffoldeth.io/).

## Environment Variables

You need to have a `.env.local` file inside the [./packages/nextjs](./packages/nextjs/) folder. Make a copy of the
[./packages/nextjs/.env.example](./packages/nextjs/.env.example) and set the correct values.

## SUPABASE DATABASE

You need to set up a [Supabase](https://supabase.com/) database and set the corresponding credentials in the `.env.local` environment.

# Live

The application is running live [here](https://onchainadvent.xyz).

Our current deployment integrates with Base Sepolia Testnet.

# Authors

[Ruben](https://github.com/RubenSousaDinis/) and [Panos](https://github.com/pmatsinopoulos).

Work done during the ETHRome Sep 2024, started in the Friday evening (Oct 4th) and finished in the Sunday morning (Oct 6th).
