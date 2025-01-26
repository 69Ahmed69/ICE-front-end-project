export function transparentColor(hex, opacity) {
  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Invalid hex color string:' + hex)
  }

  if (hex.length === 4) {
    hex = '#' + [...hex.slice(1)].map((c) => c + c).join('')
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
