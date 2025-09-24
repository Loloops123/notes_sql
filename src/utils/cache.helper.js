export const invalidateNotesCache = async (redisClient, userId) => {
  const scanStream = redisClient.scanIterator({
    MATCH: `notes:${userId}:*`
  })
  
  const keysToDelete = []
  
  for await (const rawKey of scanStream) {
    if (Array.isArray(rawKey)) {
      keysToDelete.push(...rawKey.filter(Boolean).map((key) => key.toString()))
      continue
    }
    
    const key = typeof rawKey === 'string' ? rawKey : rawKey?.toString()
    if (key) {
      keysToDelete.push(key)
    }
  }
  
  if (keysToDelete.length > 0) {
    await redisClient.del(...keysToDelete)
  }
}
