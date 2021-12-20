import sharp from 'sharp'

export const getDominantColor = async (imageUrl: string) => {
  const img = await fetch(imageUrl)
  const arrayBuffer = await img.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { dominant } = await sharp(buffer).stats()

  return dominant
}

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
