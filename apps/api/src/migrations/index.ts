import * as migration_20251222_221332_initial from './20251222_221332_initial';
import * as migration_20251223_181233 from './20251223_181233';

export const migrations = [
  {
    up: migration_20251222_221332_initial.up,
    down: migration_20251222_221332_initial.down,
    name: '20251222_221332_initial',
  },
  {
    up: migration_20251223_181233.up,
    down: migration_20251223_181233.down,
    name: '20251223_181233'
  },
];
