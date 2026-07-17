export const LEADERBOARD_KEY = 'moyallionaire_leaderboard';
export const MAX_ENTRIES = 100;

/**
 * Save a game entry to the leaderboard
 * @param {Object} entry - { playerName, score, questionsReached, endReason, lifelinesUsed, timestamp }
 * @returns {Array} All entries sorted by score descending, then lifelines used ascending
 */
export function saveScore(entry) {
  try {
    // Get unsorted entries from storage
    let entries = [];
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) entries = JSON.parse(data);
    
    // Add new entry
    entries.push(entry);
    
    // If overflow, remove lowest ranked entry
    if (entries.length > MAX_ENTRIES) {
      // Sort to find lowest rank
      const sorted = entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.lifelinesUsed ?? 3) - (b.lifelinesUsed ?? 3);
      });
      // Remove last (lowest ranked)
      sorted.pop();
      entries = sorted;
    }
    
    // Persist
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    
    console.log('[leaderboard] Entry saved:', entry);
    return entries;
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      console.warn('[leaderboard] localStorage quota exceeded, entry not saved');
    } else {
      console.error('[leaderboard] Error saving entry:', err);
    }
    // Return existing entries even on error
    return getLeaderboard();
  }
}

/**
 * Get all leaderboard entries sorted by score descending, then by lifelines used ascending
 * @returns {Array} All entries
 */
export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    
    const entries = JSON.parse(data);
    // Sort by score DESC, then by lifelines used ASC (tie-breaker: fewer lifelines = better)
    return entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.lifelinesUsed ?? 3) - (b.lifelinesUsed ?? 3);
    });
  } catch (err) {
    console.error('[leaderboard] Error reading leaderboard:', err);
    return [];
  }
}

/**
 * Get top N scores
 * @param {number} n - Number of top entries to return (default 10)
 * @returns {Array} Top N entries by score
 */
export function getTopScores(n = 10) {
  return getLeaderboard().slice(0, n);
}

/**
 * Clear all leaderboard entries
 * @returns {boolean} true if cleared successfully
 */
export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
    console.log('[leaderboard] Leaderboard cleared');
    return true;
  } catch (err) {
    console.error('[leaderboard] Error clearing leaderboard:', err);
    return false;
  }
}
