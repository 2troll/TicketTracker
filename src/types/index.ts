export type Currency = string;

export type Tag =
  | 'food' | 'transport' | 'accommodation'
  | 'shopping' | 'entertainment' | 'other';

export interface Ticket {
  id?: number;
  merchant: string;
  amount: number;
  currency: Currency;
  date: string;
  tags: Tag[];
  folderId?: number | null;
  lat?: number | null;
  lng?: number | null;
  place?: string | null;
  notes?: string | null;
  imageUri?: string | null;
  createdAt: number;
}

export interface Folder {
  id?: number;
  name: string;
  emoji?: string;
  color?: string;
  createdAt: number;
}

export interface Rate {
  code: Currency;
  perUSD: number;
  updatedAt: number;
  manual?: boolean;
}

export interface Settings {
  id: 'app';
  homeCurrency: Currency;
  theme: 'auto' | 'light' | 'dark';
  lastRatesFetch?: number;
}

export const TAG_META: Record<Tag, { label: string; color: string; emoji: string }> = {
  food:          { label: 'Food',          color: '#ff7a59', emoji: '🍽️' },
  transport:     { label: 'Transport',     color: '#3b5bff', emoji: '🚆' },
  accommodation: { label: 'Accommodation', color: '#9b5bff', emoji: '🛏️' },
  shopping:      { label: 'Shopping',      color: '#ff5b9b', emoji: '🛍️' },
  entertainment: { label: 'Entertainment', color: '#00b8a9', emoji: '🎬' },
  other:         { label: 'Other',         color: '#6b7180', emoji: '✨' },
};

export const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CAD', symbol: '$',  name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$',  name: 'Australian Dollar' },
  { code: 'MXN', symbol: '$',  name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won' },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht' },
  { code: 'TRY', symbol: '₺',  name: 'Turkish Lira' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$',name: 'Hong Kong Dollar' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand' },
];
