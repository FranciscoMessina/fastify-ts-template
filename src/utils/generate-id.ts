export async function generateId() {
  const { nanoid } = await import('nanoid');

  return nanoid();
}
