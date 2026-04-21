# Architecture Decisions - AEGIS

## Why two-layer detection (regex + AI)?

Regex catches known patterns immediately with low latency. AI analysis covers semantic threats that keyword and regex matching can miss.

## Why in-memory threat log?

For this demo project, a bounded in-memory deque (`maxlen=500`) avoids infrastructure setup while supporting fast reads for dashboard updates.

## Why expose `/demo/attack`?

Demo attacks let users exercise guardrails quickly without crafting malicious prompts manually.

## Why this visual style?

The red-on-black tactical dashboard style communicates a threat-operations context and reinforces the security product positioning.
