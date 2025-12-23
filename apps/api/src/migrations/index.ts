import * as migration_20251222_221332_initial from './20251222_221332_initial'

export const migrations = [
  {
    up: migration_20251222_221332_initial.up,
    down: migration_20251222_221332_initial.down,
    name: '20251222_221332_initial',
  },
]
