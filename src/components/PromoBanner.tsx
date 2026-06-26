import { Gift } from 'lucide-react'

const HIGHLIGHTS: { free: string; subtitle: string; threshold: string }[] = [
  { free: 'FREE 4pc Spring Rolls',              subtitle: 'Added automatically to your order',  threshold: 'Spend $60+' },
  { free: 'FREE 6pc Spring Rolls + 4×375ml Soft Drink', subtitle: 'Added automatically to your order', threshold: 'Spend $150+' },
]

export default function PromoBanner() {
  return (
    <div className="promo-scroll hide-scrollbar" role="list" aria-label="Current offers">
      {HIGHLIGHTS.map((offer, i) => (
        <article key={i} className="coupon-card" role="listitem" aria-label={`Offer: ${offer.free} when you ${offer.threshold}`}>
          <div className="coupon-icon">
            <Gift size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <p className="coupon-title">
            <strong>{offer.free}</strong>
          </p>
          <p className="coupon-subtitle">{offer.subtitle}</p>
          <span className="coupon-threshold">{offer.threshold}</span>
        </article>
      ))}
    </div>
  )
}
