import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configuration
export const MODEL = 'claude-sonnet-4-5-20250929';

// Max tokens for responses
export const MAX_TOKENS = 1024;
