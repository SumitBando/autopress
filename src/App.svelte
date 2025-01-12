<script lang="ts">
//	import '../app.css';

// Define the possible teams
  type Team = 'A' | 'B';

  // One match = { value: number, side?: Team }
  // if side is undefined, the match is neutral.
  interface Match {
    value: number;
    side?: Team;
  }

  // For recording each hole's result:
  interface HoleResult {
    holeNumber: number;
    result: 'A' | 'B' | 'Halved';
    scoreboard: string; // e.g. "1a 1b 1a"
  }

  // Our scoreboard is a reactive array of matches
  let scoreboard: Match[] = [];

  // Hole history (most recent first)
  let holeHistory: HoleResult[] = [];

  // Current hole number (1 to 18)
  let currentHole = 1;

  // Track if game is over (>= 18 holes played)
  let gameOver = false;

  /**
   * Convert scoreboard matches to a readable string, e.g. "1a 1b 1a"
   */
  function scoreboardToString(sb: Match[]): string {
    return sb.map(matchToString).join(' ');
  }

  /**
   * A small utility to display match data
   *  - e.g. {value: 2, side: 'A'} => "2a"
   *  - e.g. {value: 0} => "0"
   *  - e.g. {value: 1, side: 'B'} => "1b"
   */
  function matchToString(match: Match): string {
    const { value, side } = match;
    if (value === 0 && !side) {
      return '0';
    }
    if (value === 0 && side) {
      return `0${side}`;
    }
    return `${value}${side ?? ''}`;
  }

  /**
   * Main "hole played" function: handle a hole’s result:
   *  - "A" => Team A wins
   *  - "B" => Team B wins
   *  - "Halved" => no change in scoreboard
   */
  function recordHole(result: 'A' | 'B' | 'Halved') {
    if (gameOver) return;

    switch (result) {
      case 'A':
        handleHoleWin('A');
        break;
      case 'B':
        handleHoleWin('B');
        break;
      case 'Halved':
        // do nothing
        break;
    }

    // Record the final scoreboard for this hole
    const newHoleResult: HoleResult = {
      holeNumber: currentHole,
      result,
      scoreboard: scoreboardToString(scoreboard)
    };

    // Unshift so that the most recent hole is at the top
    holeHistory = [...holeHistory, newHoleResult];
    // console.log('scoreboard: ', scoreboard, 'holeHistory: ', holeHistory);

    // Move on to the next hole
    currentHole++;

    // End game after hole #18
    if (currentHole > 18) {
      gameOver = true;
    }
  }

  /**
   * Handle a hole win by a given team (A or B).
   */
  function handleHoleWin(winner: Team) {
    const loser = winner === 'A' ? 'B' : 'A';

    // If no matches exist yet, open three matches:
    //  1 in favor of winner, 1 in favor of loser, 1 in favor of winner
    if (scoreboard.length === 0) {
      scoreboard = [
        { value: 1, side: winner },
        { value: 1, side: loser },
        { value: 1, side: winner }
      ];
    } else {
      // Update each existing match
      scoreboard = scoreboard.map((m) => {
        if (m.side === winner) {
          // If it's already in the winner's favor, increment
          return { value: m.value + 1, side: winner };
        } else if (m.side === loser) {
          // If it’s in the loser’s favor, decrement
          const newVal = m.value - 1;
          if (newVal === 0) {
            // If it goes to zero, match becomes neutral
            return { value: 0 };
          } else {
            // Remains in the loser's favor, just new value
            return { value: newVal, side: loser };
          }
        } else {
          // Neutral match => it becomes 1 in the winner's favor
          return { value: 1, side: winner };
        }
      });
    }

    // Auto press: if the right-most match just hit 2, open a new neutral match at 0
    const lastMatch = scoreboard[scoreboard.length - 1];
    if (lastMatch?.value === 2) {
      scoreboard.push({ value: 0 }); // neutral new match
    }
  }

  /**
   * Calculate final result showing which team won how many matches
   */
  function calculateFinalResult() {
    let teamAWins = 0;
    let teamBWins = 0;
    
    scoreboard.forEach(match => {
      if (match.side === 'A') teamAWins++;
      if (match.side === 'B') teamBWins++;
    });
    
    if (teamAWins === teamBWins) return "Game tied!";
    const winner = teamAWins > teamBWins ? 'A' : 'B';
    const margin = Math.abs(teamAWins - teamBWins);
    return `Team ${winner} wins by ${margin} ${margin === 1 ? 'match' : 'matches'}!`;
  }
</script>

<div class="max-w-2xl mx-auto space-y-8">
    <!-- Header -->
    <header class="text-center">
        <h1 class="text-4xl font-bold tracking-tight mb-12">Auto Press Scoring</h1>
    </header>

      {#if gameOver}
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-gray-700 mb-3">Game Over</h2>
          <p class="text-xl text-blue-600 font-semibold">{calculateFinalResult()}</p>
        </div>
      {:else}
        <h2 class="text-center text-2xl font-semibold text-gray-700 mb-3">Enter Score for Hole {currentHole}</h2>
        <!-- Score Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">

            <button  on:click={() => recordHole('A')} disabled={gameOver} 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-blue-600 text-white">
                Team A Wins Hole {currentHole}
            </button>
            <button  on:click={() => recordHole('B')} disabled={gameOver}
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-blue-600 text-white">
                Team B Wins Hole {currentHole}
            </button>
            <button on:click={() => recordHole('Halved')} disabled={gameOver}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 bg-gray-200 text-gray-900">
                Hole  {currentHole} Halved
            </button>
          </div>
      {/if}

    <!-- History Section -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm bg-white p-6 mt-8">
  <h2 class="text-2xl font-semibold leading-none tracking-tight mb-4">{gameOver ? 'Final' : ''} Hole-by-Hole</h2>
  <div class="space-y-3">
      <div class="grid gap-4">
          {#each [...holeHistory].reverse() as hole}
              <div class="grid grid-cols-3 items-center hover:bg-gray-50 p-2 rounded-md">
                  <span class="font-semibold">Hole {hole.holeNumber}</span>
                  <span class="text-gray-600">{hole.result === 'Halved' ? 'Halved' : `Team ${hole.result} won`}</span>
                  <span class="text-gray-600">{hole.scoreboard}</span>
              </div>
          {/each}
      </div>
  </div>
</div>
  </div>
