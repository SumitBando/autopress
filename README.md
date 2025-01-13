# Entirely machine generated
- App started with chatgpt-o1preview
- App refined with Copilot/Claude 3.5 Sonnet
- App styling by v0.dev, asked to pretify the screenshot with TailwindCSS

## Chatgpt
Create a Sveltekit / Typescript web page for golf scoring using the Auto press method described below.

Score is a sequence of digits, where each digit represents 1 match. The outcome of each hole affects all the matches.
The basic rules are the matches will be in either team's favor if it's 1 or more and neutral, that is in no one's favor if it is 0.
Whoever wins the next hole you add 1 to the matches in favor of that team and subtract 1 from the matches in favor of the losing team.
If a match is at 0 then it is neutral so whoever wins the next hole, it will become 1 and go in the winner's favour.

When one playing team wins a hole, three matches are opened, and  scoring starts with 1 1 1
Whoever wins the 1st match, the 1st & 3rd 1(match) is in his favor and the middle 1 is in the loser’s favor, which makes the winning team NET 1 match up.
Let's say team A wins so i'll just write A/B next to the matches in favor of A/B... 1a 1b 1a

If team B wins the next hole, the score changes from 1a 1b 1a to 0a 2b 0a.
However, if team A wins the next hole also, the score changes from 1a 1b 1a to 2a 0 2a …


2nd fixed rule(auto press) - whenever the last (right most)  match becomes 2, you have to open another match automatically
So the above score (2a 0 2a) actually becomes 2a 0 2a 0

To demonstrate, lets say team B wins 3rd hole. Now the score will change from 2a 0 2a 0 to 1a 1b 1a 1b (+1 to 0's in their favor & -1 from matches in losing opponents favor) so now 2nd and 4th match comes into Bs favour (making the net score all square) 1a 1b 1a 1b (or 1 1 1 1)

If A wins next match score becomes 2a 0 2a 0
If instead B wins, score becomes 0 2b 0 2b 0 (another match opens as last match is 2)

Summary
Hole 1 A wins 1a1b1a
Hole 2: if A wins 2a02a0, if B wins 02b0
Hole 3: Halved, no change in score
Hole 4: If score was 2a02a0, and A wins again score becomes 3a1a3a1a, if B wins score becomes 1a1b1a1b
If score was 02b0 and if A wins 1a1b1a,  if B wins 1b3b1b
Hole 5: If score was 3a1a3a1a and A wins again 4a2a4a2a0, if B wins 2a02a0
If score was 1b3b1b and if A wins 02b0, if B wins 2b4b2b0 


## Copilot/Sonnet
- Reverse the order of displaying holeHistory


- Instead of the selected code at game over, replace 'Current Scoreboard' with 'Final Scoreboard' when gameOver


- Above the buttons, display the current hole to enter score for


- Remove the section 'Current Scoreboard', and move the current score to history


- When game over, at the selection show which team won by how many matches


- in calculateFinalResult, for calculating wins, do not use the match.values. each position in the scoreboard indicates one match

- Then realized that SvelteKit is not necessary, redid config as simple Svelte/Vite

- inline generated css/js

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
