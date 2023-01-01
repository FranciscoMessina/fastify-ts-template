import argon2 from 'argon2';

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function verifyPasswordHash(password: string, hash: string) {
  return argon2.verify(hash, password);
}
