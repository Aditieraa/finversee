/**
 * Track AI requests per day
 */

const STORAGE_KEY = 'finverse_ai_requests';

interface AIRequestLog {
  date: string;
  count: number;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getStoredLog(): AIRequestLog | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getAIRequestsToday(): number {
  const log = getStoredLog();
  if (!log || log.date !== getTodayDateString()) {
    return 0; // Reset on new day
  }
  return log.count;
}

export function incrementAIRequests(): number {
  const today = getTodayDateString();
  const log = getStoredLog();
  
  let newCount = 1;
  if (log && log.date === today) {
    newCount = log.count + 1;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

export function resetAIRequests(): void {
  localStorage.removeItem(STORAGE_KEY);
}
