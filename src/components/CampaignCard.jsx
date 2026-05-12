import { useRef } from 'react'
import FacebookForm from './FacebookForm'

const PURPLE = '#8A10EB'

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid #e9d5ff', outline: 'none',
  fontSize: 14, color: '#1a1a2e', background: '#faf5ff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#7c3aed', marginBottom: 6, letterSpacing: '0.04em'
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function StyledInput({ style, ...props }) {
  return (
    <input
      style={{ ...inputStyle, ...style }}
      onFocus={e => {
        e.target.style.borderColor = PURPLE
        e.target.style.boxShadow = '0 0 0 3px rgba(138,16,235,0.12)'
        e.target.style.background = 'white'
      }}
      onBlur={e => {
        e.target.style.borderColor = '#e9d5ff'
        e.target.style.boxShadow = 'none'
        e.target.style.background = '#faf5ff'
      }}
      {...props}
    />
  )
}

function StyledTextarea({ style, ...props }) {
  return (
    <textarea
      style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.6, ...style }}
      onFocus={e => {
        e.target.style.borderColor = PURPLE
        e.target.style.boxShadow = '0 0 0 3px rgba(138,16,235,0.12)'
        e.target.style.background = 'white'
      }}
      onBlur={e => {
        e.target.style.borderColor = '#e9d5ff'
        e.target.style.boxShadow = 'none'
        e.target.style.background = '#faf5ff'
      }}
      {...props}
    />
  )
}

export default function CampaignCard({ campaign, index, isFirst, onUpdate, onRemove, onToggleCollapse }) {
  const fileInputRef = useRef(null)

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onUpdate({ thumbnail: file, thumbnailPreview: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const removeThumbnail = () => {
    onUpdate({ thumbnail: null, thumbnailPreview: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const cardHeaderBg = campaign.collapsed
    ? 'linear-gradient(135deg, #faf5ff, #f5f3ff)'
    : 'linear-gradient(135deg, #faf5ff, #f5f3ff)'

  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      border: '1px solid #ede9fe',
      boxShadow: '0 2px 12px rgba(138,16,235,0.07)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Card Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          background: cardHeaderBg,
          borderBottom: campaign.collapsed ? 'none' : '1px solid #ede9fe',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={onToggleCollapse}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: PURPLE,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
            boxShadow: '0 2px 6px rgba(138,16,235,0.25)',
            flexShrink: 0,
          }}>
            {index + 1}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
              {campaign.name || `קמפיין ${index + 1}`}
            </div>
            {campaign.collapsed && campaign.budget && (
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                תקציב: ₪{campaign.budget}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
          {!isFirst && (
            <button
              onClick={onRemove}
              title="הסר קמפיין"
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: '1.5px solid #fecaca', background: '#fff5f5',
                color: '#ef4444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, lineHeight: 1, transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#ef4444' }}
            >
              ×
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            title={campaign.collapsed ? 'הרחב' : 'כווץ'}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1.5px solid #e9d5ff', background: 'white',
              color: PURPLE, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#faf5ff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: campaign.collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Body */}
      {!campaign.collapsed && (
        <div className="campaign-body-inner" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Row 1: Campaign Name + Budget */}
          <div className="fields-2col">
            <Field label="שם קמפיין">
              <StyledInput
                type="text"
                value={campaign.name}
                onChange={e => onUpdate({ name: e.target.value })}
                dir="auto"
                placeholder="לדוגמה: קמפיין קיץ 2025"
              />
            </Field>
            <Field label="תקציב (₪)">
              <StyledInput
                type="number"
                value={campaign.budget}
                onChange={e => onUpdate({ budget: e.target.value })}
                dir="ltr"
                placeholder="0"
                min="0"
              />
            </Field>
          </div>

          {/* Row 2: Dates */}
          <div className="fields-2col">
            <Field label="תאריך התחלה">
              <StyledInput
                type="date"
                value={campaign.startDate}
                onChange={e => onUpdate({ startDate: e.target.value })}
                dir="ltr"
              />
            </Field>
            <Field label="תאריך סיום">
              <StyledInput
                type="date"
                value={campaign.endDate}
                onChange={e => onUpdate({ endDate: e.target.value })}
                dir="ltr"
              />
            </Field>
          </div>

          {/* URL */}
          <Field label="קישור לעמוד היעד">
            <StyledInput
              type="url"
              value={campaign.url}
              onChange={e => onUpdate({ url: e.target.value })}
              dir="ltr"
              placeholder="https://example.com"
              style={{ textAlign: 'left' }}
            />
          </Field>

          {/* Title */}
          <Field label="כותרת">
            <StyledInput
              type="text"
              value={campaign.title}
              onChange={e => onUpdate({ title: e.target.value })}
              dir="auto"
              placeholder="כותרת הקמפיין..."
            />
          </Field>

          {/* Videos Section */}
          <div style={{ borderRadius: 12, border: '1.5px solid #e9d5ff', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#faf5ff', borderBottom: '1px solid #e9d5ff' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', letterSpacing: '0.04em' }}>סרטון</span>
            </div>
            <div style={{ padding: 16 }}>
              {/* Video type toggle */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[{ value: 'link', label: 'לינק להורדה' }, { value: 'old', label: 'סרטון ישן – תיאור' }].map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                      padding: '8px 14px', borderRadius: 8,
                      border: `1.5px solid ${campaign.videoType === opt.value ? PURPLE : '#e9d5ff'}`,
                      background: campaign.videoType === opt.value ? '#faf5ff' : 'white',
                      fontSize: 13, fontWeight: 500,
                      color: campaign.videoType === opt.value ? PURPLE : '#6b7280',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name={`videoType-${index}`}
                      value={opt.value}
                      checked={campaign.videoType === opt.value}
                      onChange={() => onUpdate({ videoType: opt.value })}
                      style={{ accentColor: PURPLE, width: 14, height: 14 }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {campaign.videoType === 'link' ? (
                <StyledInput
                  type="url"
                  value={campaign.videoLink}
                  onChange={e => onUpdate({ videoLink: e.target.value })}
                  dir="ltr"
                  placeholder="https://drive.google.com/..."
                  style={{ textAlign: 'left' }}
                />
              ) : (
                <StyledTextarea
                  value={campaign.videoDescription}
                  onChange={e => onUpdate({ videoDescription: e.target.value })}
                  dir="auto"
                  placeholder="תאר את הסרטון הישן..."
                  rows={3}
                />
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div style={{ borderRadius: 12, border: '1.5px solid #e9d5ff', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#faf5ff', borderBottom: '1px solid #e9d5ff' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', letterSpacing: '0.04em' }}>תמונה ממוזערת (Thumbnail)</span>
            </div>
            <div style={{ padding: 16 }}>
              {campaign.thumbnailPreview ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <img
                    src={campaign.thumbnailPreview}
                    alt="thumbnail preview"
                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e9d5ff', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>
                      {campaign.thumbnail?.name}
                    </div>
                    <button
                      onClick={removeThumbnail}
                      style={{
                        padding: '5px 12px', borderRadius: 6,
                        border: '1.5px solid #fecaca', background: '#fff5f5',
                        color: '#ef4444', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit'
                      }}
                    >
                      הסר תמונה
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '28px 20px',
                    border: '2px dashed #d8b4fe', borderRadius: 12,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: '#fdfaff',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = PURPLE; e.currentTarget.style.background = '#faf5ff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d8b4fe'; e.currentTarget.style.background = '#fdfaff' }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21,15 16,10 5,21" />
                  </svg>
                  <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>לחץ להעלאת תמונה</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>PNG, JPG, WEBP עד 10MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Facebook Lead Form */}
          <div style={{ borderRadius: 12, border: `1.5px solid ${campaign.hasFacebookForm ? '#c4b5fd' : '#e9d5ff'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
            <label
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: campaign.hasFacebookForm ? '#faf5ff' : 'white',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: `2px solid ${campaign.hasFacebookForm ? PURPLE : '#d1d5db'}`,
                  background: campaign.hasFacebookForm ? PURPLE : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {campaign.hasFacebookForm && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={campaign.hasFacebookForm}
                onChange={e => onUpdate({ hasFacebookForm: e.target.checked })}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: campaign.hasFacebookForm ? PURPLE : '#4b5563' }}>
                טופס פייסבוקי להשארת ליד
              </span>
            </label>

            {campaign.hasFacebookForm && (
              <div style={{ borderTop: '1px solid #e9d5ff', padding: 16 }}>
                <FacebookForm campaign={campaign} onUpdate={onUpdate} index={index} />
              </div>
            )}
          </div>

          {/* Notes */}
          <Field label="הערות">
            <StyledTextarea
              value={campaign.notes}
              onChange={e => onUpdate({ notes: e.target.value })}
              dir="auto"
              placeholder="הערות נוספות לקמפיין..."
              rows={4}
            />
          </Field>

        </div>
      )}
    </div>
  )
}
