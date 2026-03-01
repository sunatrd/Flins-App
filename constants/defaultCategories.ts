export type DefaultCategory = {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expense categories
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#FF9F43', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#FECA57', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#54A0FF', type: 'expense' },
  { name: 'Health', icon: '💊', color: '#48DBBA', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#5F27CD', type: 'expense' },
  { name: 'Housing', icon: '🏠', color: '#C8D6E5', type: 'expense' },
  { name: 'Utilities', icon: '💡', color: '#FF9FF3', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#1DD1A1', type: 'expense' },
  { name: 'Subscriptions', icon: '📱', color: '#E84393', type: 'expense' },

  // Income categories
  { name: 'Salary', icon: '💼', color: '#34C759', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#1DD1A1', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#54A0FF', type: 'income' },
  { name: 'Gift', icon: '🎁', color: '#FF9F43', type: 'income' },
  { name: 'Other', icon: '💰', color: '#5856D6', type: 'both' },
];
