import Dexie, { type Table } from 'dexie'

export type HistoryKind = 'scan' | 'qr' | 'barcode'

export type HistoryItem = {
  id?: number
  kind: HistoryKind
  format: string
  value: string
  createdAt: number
  favorite: boolean
}

type NewHistoryItem = Pick<HistoryItem, 'kind' | 'format' | 'value'>

class ScanAndCreateDatabase extends Dexie {
  items!: Table<HistoryItem, number>

  constructor() {
    super('scan-and-create')
    this.version(1).stores({
      items: '++id, kind, format, createdAt, [kind+createdAt]',
    })
  }
}

export const database = new ScanAndCreateDatabase()

export async function saveHistoryItem(item: NewHistoryItem) {
  return database.items.add({
    ...item,
    createdAt: Date.now(),
    favorite: false,
  })
}

export async function getHistoryItems() {
  return database.items.orderBy('createdAt').reverse().toArray()
}

export async function deleteHistoryItem(id: number) {
  await database.items.delete(id)
}

export async function clearHistoryItems() {
  await database.items.clear()
}

export async function setHistoryFavorite(id: number, favorite: boolean) {
  await database.items.update(id, { favorite })
}
