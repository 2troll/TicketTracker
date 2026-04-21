import Dexie, { Table } from 'dexie';
import type { Ticket, Folder, Rate, Settings } from '../types';

class WanderDB extends Dexie {
  tickets!: Table<Ticket, number>;
  folders!: Table<Folder, number>;
  rates!:   Table<Rate, string>;
  settings!: Table<Settings, 'app'>;

  constructor() {
    super('wander');
    this.version(1).stores({
      tickets:  '++id, date, folderId, currency, createdAt',
      folders:  '++id, name, createdAt',
      rates:    'code',
      settings: 'id',
    });
  }
}

export const db = new WanderDB();

export async function ensureSettings(): Promise<Settings> {
  const existing = await db.settings.get('app');
  if (existing) return existing;
  const initial: Settings = { id: 'app', homeCurrency: 'EUR', theme: 'auto' };
  await db.settings.put(initial);
  return initial;
}
