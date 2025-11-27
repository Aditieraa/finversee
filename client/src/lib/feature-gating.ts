/**
 * Feature Gating System
 * Determines what features are available based on subscription tier
 */

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface FeatureSet {
  aiRequestsPerDay: number;
  maxDataDelay: number; // in minutes
  hasRealTimeData: boolean;
  canExportReports: boolean;
  hasAdFree: boolean;
  canAccessCourses: boolean;
  hasAdvancedTrading: boolean;
  hasPrioritySsupport: boolean;
  canAccessExclusiveContent: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, FeatureSet> = {
  free: {
    aiRequestsPerDay: 3,
    maxDataDelay: 15,
    hasRealTimeData: false,
    canExportReports: false,
    hasAdFree: false,
    canAccessCourses: false,
    hasAdvancedTrading: false,
    hasPrioritySupport: false,
    canAccessExclusiveContent: false,
  },
  pro: {
    aiRequestsPerDay: 999,
    maxDataDelay: 0,
    hasRealTimeData: true,
    canExportReports: true,
    hasAdFree: true,
    canAccessCourses: false,
    hasAdvancedTrading: false,
    hasPrioritySupport: true,
    canAccessExclusiveContent: false,
  },
  premium: {
    aiRequestsPerDay: 999,
    maxDataDelay: 0,
    hasRealTimeData: true,
    canExportReports: true,
    hasAdFree: true,
    canAccessCourses: true,
    hasAdvancedTrading: true,
    hasPrioritySupport: true,
    canAccessExclusiveContent: true,
  },
};

/**
 * Get feature set for a tier
 */
export function getFeatureSet(tier: SubscriptionTier): FeatureSet {
  return TIER_FEATURES[tier];
}

/**
 * Check if feature is available
 */
export function hasFeature(tier: SubscriptionTier, feature: keyof FeatureSet): boolean {
  const features = getFeatureSet(tier);
  const value = features[feature];
  
  // If it's a number, check if it's > 0
  if (typeof value === 'number') {
    return value > 0;
  }
  
  return value === true;
}

/**
 * Get upgrade path for feature
 */
export function getUpgradeForFeature(feature: keyof FeatureSet): SubscriptionTier | null {
  if (hasFeature('free', feature)) return null; // Already available on free
  if (hasFeature('pro', feature)) return 'pro';
  return 'premium';
}

/**
 * Get remaining AI requests today
 */
export function getRemainingAIRequests(tier: SubscriptionTier, usedToday: number): number {
  const allowed = getFeatureSet(tier).aiRequestsPerDay;
  if (allowed === 999) return 999;
  return Math.max(0, allowed - usedToday);
}

/**
 * Check if should show upgrade prompt
 */
export function shouldShowUpgradePrompt(tier: SubscriptionTier, feature: keyof FeatureSet): boolean {
  if (tier === 'premium') return false; // Already on highest tier
  return !hasFeature(tier, feature);
}
