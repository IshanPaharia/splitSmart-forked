export function formatUsername(user) {
  if (!user) return 'Unknown'
  if (user.isGuest && user.username.includes('_')) {
    const parts = user.username.split('_')
    if (parts.length > 1 && /^[a-fA-F0-9]{8}$/.test(parts[parts.length - 1])) {
      parts.pop()
      return parts.join('_')
    }
  }
  return user.username
}

export function getInitials(name) {
  return (name || '?')
    .split(/[\s]+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
