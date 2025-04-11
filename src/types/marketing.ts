export const MarketingChannels = [
  'Social Media',
  'Email Marketing',
  'Content Marketing',
  'SEO',
  'PPC Advertising',
  'Affiliate Marketing',
  'Influencer Marketing',
  'Direct Mail',
  'Trade Shows',
  'PR',
  'Radio/TV',
  'Print Media'
] as const;

export const MarketingPlatforms = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter',
  'TikTok',
  'YouTube',
  'Google Ads',
  'Pinterest',
  'Amazon Advertising',
  'Microsoft Advertising',
  'Snapchat',
  'Reddit'
] as const;

export type MarketingChannel = typeof MarketingChannels[number];
export type MarketingPlatform = typeof MarketingPlatforms[number];