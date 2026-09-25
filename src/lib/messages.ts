import { getDb } from './db'

export type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: number
  created_at: string
}

export function createMessage(input: { name: string; email: string; subject: string; message: string }) {
  getDb()
    .prepare('INSERT INTO messages (name, email, subject, message) VALUES (@name, @email, @subject, @message)')
    .run(input)
}

export function listMessages(): Message[] {
  return getDb().prepare('SELECT * FROM messages ORDER BY created_at DESC, id DESC').all() as Message[]
}

export function unreadMessageCount(): number {
  return (getDb().prepare('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0').get() as { c: number }).c
}

export function setMessageRead(id: number, read: boolean) {
  getDb().prepare('UPDATE messages SET is_read = ? WHERE id = ?').run(read ? 1 : 0, id)
}

export function deleteMessage(id: number) {
  getDb().prepare('DELETE FROM messages WHERE id = ?').run(id)
}
