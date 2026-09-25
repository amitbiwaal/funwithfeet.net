import { all, get, run } from './db'

export type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: number
  created_at: string
}

export async function createMessage(input: { name: string; email: string; subject: string; message: string }) {
  await run('INSERT INTO messages (name, email, subject, message) VALUES (@name, @email, @subject, @message)', input)
}

export async function listMessages(): Promise<Message[]> {
  return all<Message>('SELECT * FROM messages ORDER BY created_at DESC, id DESC')
}

export async function unreadMessageCount(): Promise<number> {
  return (await get<{ c: number }>('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0'))?.c ?? 0
}

export async function setMessageRead(id: number, read: boolean) {
  await run('UPDATE messages SET is_read = ? WHERE id = ?', [read ? 1 : 0, id])
}

export async function deleteMessage(id: number) {
  await run('DELETE FROM messages WHERE id = ?', [id])
}
