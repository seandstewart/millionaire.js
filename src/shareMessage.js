/**
 * Generate Wordle-style share message for game over / win screens.
 * Format: title + emoji grid + lifelines used
 */

function formatAmount(num) {
  return num.toLocaleString();
}

export function generateEmojiGrid(questions, snapshot) {
  const gridSize = 10;
  let grid = '';

  // Map answered questions to results
  for (let i = 0; i < gridSize; i++) {
    if (i < snapshot.questionIndex) {
      // Answered & correct
      grid += '🟩';
    } else if (i === snapshot.questionIndex && snapshot.selectedOptionSlug) {
      // Current question (locked in but not revealed) - treat as answered
      const q = questions[i];
      if (q.correctOptionSlug === snapshot.selectedOptionSlug) {
        grid += '🟩';
      } else {
        grid += '🟥';
      }
    } else if (i === snapshot.questionIndex && snapshot.gameOverReason) {
      // Failed on this question (state is game_over)
      grid += '🟥';
    } else {
      // Not yet reached
      grid += '⬜';
    }
  }

  return grid;
}

export function getLifelineEmojis(lifelinesUsed) {
  const map = {
    '50-50': '✂️',
    'ask-audience': '🎤',
    'phone-friend': '☎️',
  };

  const used = Object.keys(lifelinesUsed)
    .filter(key => lifelinesUsed[key])
    .map(key => map[key] || '?')
    .join('');

  const total = Object.keys(map).length;
  const count = Object.values(lifelinesUsed).filter(Boolean).length;

  return `${used} (${count}/${total})`;
}

export function generateShareMessage(snapshot, questions) {
  const playerName = snapshot.playerName || 'Player';
  const questionIndex = snapshot.questionIndex;
  const won = snapshot.state === 'win' || snapshot.state === 'WIN';
  const prize = snapshot.currentWinnings;
  const emoji = won ? '🏆' : '💰';

  // Line 1: Title with player name
  const title = `${playerName} on Moy-onaire #${getGameNumber()}: $${prize ? formatAmount(prize) : '0'} ${emoji}`;

  // Line 2: Emoji grid
  const grid = generateEmojiGrid(questions, snapshot);

  // Lifelines already included in return statement

  return `${title}\n${grid}\nLifelines: ${getLifelineEmojis(snapshot.lifelines)}`;
}

export function getGameNumber() {
  return 40;
}

export function copyShareMessage(snapshot, questions) {
  const msg = generateShareMessage(snapshot, questions);
  navigator.clipboard.writeText(msg).then(() => {
    // Success - caller can show feedback
    return true;
  }).catch(err => {
    console.error('Failed to copy:', err);
    return false;
  });
}
