'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus } from 'lucide-react'
import { MenuItem } from '@/types'
import { useCartStore } from '@/store/cart'
import { DRINK_FLAVOURS } from '@/lib/drinkFlavours'
import { ITEM_OPTIONS, OptionGroup } from '@/lib/itemOptions'

interface Props { item: MenuItem | null; onClose: () => void }
interface ExtraOption { label: string; checked: boolean; set: (v: boolean) => void }

// Focus trap utility
function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(e => !e.hasAttribute('disabled') && e.tabIndex !== -1)
}

export default function ItemModal({ item, onClose }: Props) {
  const [qty, setQty]               = useState(1)
  const [extraMeat, setExtraMeat]   = useState(false)
  const [extraVeg, setExtraVeg]     = useState(false)
  const [notes, setNotes]           = useState('')
  const [flavourQtys, setFlavourQtys]       = useState<Record<string, number>>({})
  const [optionSelections, setOptionSelections] = useState<Record<string, string[]>>({})
  const addItem   = useCartStore(s => s.addItem)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const flavours        = item ? DRINK_FLAVOURS[item.uuid] : undefined
  const isDrink         = !!flavours
  const itemOptionGroups: OptionGroup[] = item ? (ITEM_OPTIONS[item.uuid] ?? []) : []
  const requiredGroups  = itemOptionGroups.filter(g => g.required)
  const optionalGroups  = itemOptionGroups.filter(g => !g.required)

  // State resets via key={item.uuid} in parent — no effect needed

  // Body scroll lock + focus trap
  useEffect(() => {
    if (!item) return
    document.body.style.overflow = 'hidden'
    const prev = document.activeElement as HTMLElement | null
    setTimeout(() => closeBtnRef.current?.focus(), 50)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = getFocusable(dialogRef.current)
      if (focusable.length === 0) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      prev?.focus()
    }
  }, [item, onClose])

  if (!item) return null

  const unitCents       = Math.round(item.price * 100)
  const totalFlavourQty = Object.values(flavourQtys).reduce((s, q) => s + q, 0)

  const optionExtrasCents = itemOptionGroups.reduce((sum, g) => {
    const sel = optionSelections[g.id] ?? []
    return sum + sel.reduce((s, label) => {
      const choice = g.choices.find(c => c.label === label)
      return s + (choice?.priceCents ?? 0)
    }, 0)
  }, 0)

  const extrasCents   = isDrink ? 0 : (extraMeat ? 300 : 0) + (extraVeg ? 300 : 0) + optionExtrasCents
  const effectiveQty  = isDrink ? totalFlavourQty : qty
  const total         = (unitCents + extrasCents) * effectiveQty
  const allRequired   = requiredGroups.every(g => (optionSelections[g.id] ?? []).length > 0)
  const canAdd        = isDrink ? totalFlavourQty > 0 : allRequired

  const oldExtras: ExtraOption[] = []
  if (!isDrink && item.hasAddons) {
    if (!item.noExtraMeat) oldExtras.push({ label: 'Extra Meat',      checked: extraMeat, set: setExtraMeat })
    if (!item.noExtraVeg)  oldExtras.push({ label: 'Extra Vegetable', checked: extraVeg,  set: setExtraVeg })
  }

  function toggleOption(groupId: string, label: string, multiSelect: boolean) {
    setOptionSelections(prev => {
      const current = prev[groupId] ?? []
      if (multiSelect) {
        return { ...prev, [groupId]: current.includes(label) ? current.filter(l => l !== label) : [...current, label] }
      }
      return { ...prev, [groupId]: [label] }
    })
  }

  function setFlavourQty(flavour: string, delta: number) {
    setFlavourQtys(prev => {
      const next = Math.min(10, Math.max(0, (prev[flavour] || 0) + delta))
      return { ...prev, [flavour]: next }
    })
  }

  function handleAdd() {
    if (!item || !canAdd) return
    if (isDrink) {
      const filtered = Object.fromEntries(Object.entries(flavourQtys).filter(([, q]) => q > 0))
      addItem({ uuid: item.uuid, name: item.name, price: item.price, quantity: totalFlavourQty, extraMeat: false, extraVegetable: false, notes: '', flavourSelections: filtered })
    } else {
      addItem({
        uuid: item.uuid, name: item.name, price: item.price, quantity: qty,
        extraMeat, extraVegetable: extraVeg, notes,
        ...(Object.keys(optionSelections).length > 0 ? { optionSelections } : {}),
        ...(optionExtrasCents > 0 ? { optionExtrasCents } : {}),
      })
    }
    onClose()
  }

  function renderOptionGroup(group: OptionGroup) {
    const sel = optionSelections[group.id] ?? []
    const isRequired = group.required
    return (
      <fieldset key={group.id} style={{ border: 'none', padding: 0, marginBottom: 16 }}>
        <legend style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#211A17' }}>
            {group.label}
          </span>
          {isRequired ? (
            <span style={{ background: '#B63A24', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: 4 }}>
              Required
            </span>
          ) : (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#9E8880' }}>Optional</span>
          )}
        </legend>

        {group.choices.map(choice => {
          const isSelected = sel.includes(choice.label)
          return (
            <label key={choice.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px', borderRadius: 8, marginBottom: 6,
              background: isSelected ? 'rgba(182,58,36,0.06)' : '#FAFAFA',
              border: `1.5px solid ${isSelected ? '#B63A24' : '#E7C3B5'}`,
              cursor: 'pointer', transition: 'all 0.12s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type={group.required ? 'radio' : 'checkbox'}
                  name={group.id}
                  value={choice.label}
                  checked={isSelected}
                  onChange={() => toggleOption(group.id, choice.label, group.multiSelect)}
                  style={{ width: 18, height: 18, accentColor: '#B63A24', cursor: 'pointer' }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#211A17' }}>
                  {choice.label}
                </span>
              </div>
              {choice.priceCents > 0 && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#B63A24' }}>
                  +${(choice.priceCents / 100).toFixed(2)}
                </span>
              )}
            </label>
          )
        })}

        {isRequired && sel.length === 0 && (
          <p role="alert" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#DC2626', marginTop: 4 }}>
            Please choose one
          </p>
        )}
      </fieldset>
    )
  }

  let btnLabel: string
  if (isDrink && totalFlavourQty === 0) btnLabel = 'Choose a flavour'
  else if (!isDrink && !allRequired)    btnLabel = 'Choose required options'
  else btnLabel = `Add to Order — $${(total / 100).toFixed(2)}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
      style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(33,26,23,0.55)', backdropFilter: 'blur(3px)' }} aria-hidden="true" />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        style={{
          position: 'relative', width: '100%', maxWidth: 560,
          margin: '0 auto',
          background: '#FFFCF7', borderRadius: '18px 18px 0 0',
          maxHeight: '92svh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(33,26,23,0.18)',
          animation: 'slideUp 0.22s ease',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close item details"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(33,26,23,0.55)',
            color: '#FFFFFF', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Food image */}
        {item.imageUrl && (
          <div style={{ position: 'relative', height: 200, flexShrink: 0, background: '#F5EBE6' }}>
            <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="560px" />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '16px 20px 12px', flexShrink: 0, borderBottom: '1px solid #E7C3B5' }}>
          <h2
            id="item-modal-title"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#211A17', marginBottom: 4, paddingRight: 36 }}
          >
            {item.name}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#B63A24' }}>
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
          {item.description && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#745F55', lineHeight: 1.65, marginBottom: 16 }}>
              {item.description}
            </p>
          )}

          {/* Drink flavour picker */}
          {isDrink && (
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 16 }}>
              <legend style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#211A17' }}>Choose Flavours</span>
                <span style={{ background: '#B63A24', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: 4 }}>Required</span>
              </legend>
              {flavours!.map(flavour => {
                const q = flavourQtys[flavour] || 0
                return (
                  <div key={flavour} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 8, marginBottom: 6,
                    background: q > 0 ? 'rgba(182,58,36,0.06)' : '#FAFAFA',
                    border: `1.5px solid ${q > 0 ? '#B63A24' : '#E7C3B5'}`,
                  }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#211A17' }}>{flavour}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} role="group" aria-label={`Quantity for ${flavour}`}>
                      <button
                        onClick={() => setFlavourQty(flavour, -1)}
                        aria-label={`Decrease ${flavour} quantity`}
                        style={{ width: 32, height: 32, borderRadius: 8, background: '#F5EBE6', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                      <span style={{ width: 28, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#211A17' }} aria-live="polite">{q}</span>
                      <button
                        onClick={() => setFlavourQty(flavour, 1)}
                        aria-label={`Increase ${flavour} quantity`}
                        style={{ width: 32, height: 32, borderRadius: 8, background: '#F5EBE6', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {totalFlavourQty === 0 && (
                <p role="alert" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#DC2626', marginTop: 4 }}>
                  Please choose at least 1
                </p>
              )}
            </fieldset>
          )}

          {!isDrink && requiredGroups.map(g => renderOptionGroup(g))}
          {!isDrink && optionalGroups.filter(g => g.id !== 'add-drinks').map(g => renderOptionGroup(g))}

          {/* Extra meat/veg */}
          {oldExtras.length > 0 && (
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 16 }}>
              <legend style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#745F55', marginBottom: 10 }}>
                Extras <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>(optional)</span>
              </legend>
              {oldExtras.map(({ label, checked, set }) => (
                <label key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: 8, marginBottom: 6,
                  background: checked ? 'rgba(182,58,36,0.06)' : '#FAFAFA',
                  border: `1.5px solid ${checked ? '#B63A24' : '#E7C3B5'}`,
                  cursor: 'pointer', transition: 'all 0.12s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" checked={checked} onChange={e => set(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: '#B63A24', cursor: 'pointer' }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#211A17' }}>{label}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#B63A24' }}>+$3.00</span>
                </label>
              ))}
            </fieldset>
          )}

          {!isDrink && optionalGroups.filter(g => g.id === 'add-drinks').map(g => renderOptionGroup(g))}

          {!isDrink && (
            <div>
              <label
                htmlFor="special-instructions"
                style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#745F55', marginBottom: 8 }}
              >
                Special Instructions <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="special-instructions"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. No spring onions, less chilli…"
                rows={2}
                style={{
                  width: '100%', background: '#FFF', border: '1.5px solid #E7C3B5',
                  borderRadius: 8, padding: '10px 14px', color: '#211A17',
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
                  resize: 'none', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#B63A24')}
                onBlur={e => (e.target.style.borderColor = '#E7C3B5')}
              />
            </div>
          )}
        </div>

        {/* Footer — quantity + add button */}
        <div style={{
          padding: '12px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)',
          background: '#FFFCF7',
          borderTop: '1px solid #E7C3B5',
          display: 'flex', gap: 12, alignItems: 'center',
          flexShrink: 0,
        }}>
          {!isDrink && (
            <div
              role="group"
              aria-label="Item quantity"
              style={{ display: 'flex', alignItems: 'center', borderRadius: 10, border: '1.5px solid #E7C3B5', overflow: 'hidden', flexShrink: 0, background: '#FFF' }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                style={{ width: 40, height: 48, background: 'transparent', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <span
                aria-live="polite"
                aria-label={`Quantity: ${qty}`}
                style={{ width: 32, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#211A17' }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
                style={{ width: 40, height: 48, background: 'transparent', border: 'none', color: '#B63A24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-brand"
            aria-disabled={!canAdd}
            style={{ flex: 1, opacity: canAdd ? 1 : 0.45, cursor: canAdd ? 'pointer' : 'not-allowed', fontSize: '0.95rem' }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
