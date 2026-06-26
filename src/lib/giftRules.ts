export const GIFT_OFFERS = [
  { title: 'FREE 4pc Spring Rolls', subtitle: 'when you spend $60+' },
  { title: 'FREE 6pc Spring Rolls + 4x 375ml Soft Drink', subtitle: 'when you spend $150+' },
] as const

export function getOrderGifts(totalCents: number): string[] {
  if (totalCents >= 15000) return ['6pc Spring Rolls', '4x 375ml Soft Drink']
  if (totalCents >= 6000) return ['4pc Spring Rolls']
  return []
}
