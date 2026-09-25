import crypto from 'node:crypto'

const KEYLEN = 64
const PARAMS = { N: 16384, r: 8, p: 1 }

/** Hash a password with scrypt. Format: scrypt$N$r$p$salt$hash (base64). */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, KEYLEN, PARAMS)
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), hash.toString('base64')].join('$')
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64, 'base64')
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, {
    N: Number(n), r: Number(r), p: Number(p),
  })
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

export const MIN_PASSWORD_LENGTH = 10
