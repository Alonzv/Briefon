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

const CONTACT_OPTIONS = [
  { value: 'phone', label: 'טלפון' },
  { value: 'email', label: 'אימייל' },
  { value: 'name', label: 'שם מלא' },
  { value: 'city', label: 'עיר' },
]

export default function FacebookForm({ campaign, onUpdate, index }) {
  const toggleContact = (value) => {
    const current = campaign.contactDetails || []
    if (current.includes(value)) {
      onUpdate({ contactDetails: current.filter(v => v !== value) })
    } else {
      onUpdate({ contactDetails: [...current, value] })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Form Title */}
      <div>
        <label style={labelStyle}>כותרת הטופס</label>
        <StyledInput
          type="text"
          value={campaign.formTitle}
          onChange={e => onUpdate({ formTitle: e.target.value })}
          dir="auto"
          placeholder="כותרת שתופיע בראש הטופס..."
        />
      </div>

      {/* Job Title Description */}
      <div>
        <label style={labelStyle}>תיאור תפקיד</label>
        <StyledInput
          type="text"
          value={campaign.formJobTitle}
          onChange={e => onUpdate({ formJobTitle: e.target.value })}
          dir="auto"
          placeholder="לדוגמה: מנהל שיווק..."
        />
      </div>

      {/* Contact Details - multi select */}
      <div>
        <label style={labelStyle}>פרטי התקשרות</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CONTACT_OPTIONS.map(opt => {
            const selected = (campaign.contactDetails || []).includes(opt.value)
            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  padding: '7px 13px', borderRadius: 8,
                  border: `1.5px solid ${selected ? PURPLE : '#e9d5ff'}`,
                  background: selected ? '#faf5ff' : 'white',
                  fontSize: 13, fontWeight: 500,
                  color: selected ? PURPLE : '#6b7280',
                  transition: 'all 0.15s', userSelect: 'none',
                }}
              >
                <div
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `2px solid ${selected ? PURPLE : '#d1d5db'}`,
                    background: selected ? PURPLE : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {selected && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleContact(opt.value)}
                  style={{ display: 'none' }}
                />
                {opt.label}
              </label>
            )
          })}
        </div>
      </div>

      {/* Distinguishing Question */}
      <div>
        <label style={labelStyle}>שאלה מבדלת</label>
        <StyledInput
          type="text"
          value={campaign.distinguishingQuestion}
          onChange={e => onUpdate({ distinguishingQuestion: e.target.value })}
          dir="auto"
          placeholder="שאלה שתבדיל את הלידים המעוניינים..."
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[{ value: 'open', label: 'שאלה פתוחה' }, { value: 'multiple', label: 'שאלה אמריקאית' }].map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '6px 12px', borderRadius: 8,
                border: `1.5px solid ${campaign.questionType === opt.value ? PURPLE : '#e9d5ff'}`,
                background: campaign.questionType === opt.value ? '#faf5ff' : 'white',
                fontSize: 12, fontWeight: 500,
                color: campaign.questionType === opt.value ? PURPLE : '#6b7280',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name={`questionType-${index}`}
                value={opt.value}
                checked={campaign.questionType === opt.value}
                onChange={() => onUpdate({ questionType: opt.value })}
                style={{ accentColor: PURPLE, width: 13, height: 13 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {campaign.questionType === 'multiple' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {['א', 'ב', 'ג'].map((letter, i) => (
              <StyledInput
                key={i}
                type="text"
                value={(campaign.questionAnswers || [])[i] || ''}
                onChange={e => {
                  const answers = [...(campaign.questionAnswers || ['', '', ''])]
                  answers[i] = e.target.value
                  onUpdate({ questionAnswers: answers })
                }}
                dir="auto"
                placeholder={`אפשרות ${letter}...`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accept Updates checkbox */}
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', padding: '10px 14px',
          borderRadius: 10, border: `1.5px solid ${campaign.acceptUpdates ? '#c4b5fd' : '#e9d5ff'}`,
          background: campaign.acceptUpdates ? '#faf5ff' : 'white',
          transition: 'all 0.15s',
        }}
      >
        <div
          style={{
            width: 20, height: 20, borderRadius: 5,
            border: `2px solid ${campaign.acceptUpdates ? PURPLE : '#d1d5db'}`,
            background: campaign.acceptUpdates ? PURPLE : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', flexShrink: 0,
          }}
        >
          {campaign.acceptUpdates && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={campaign.acceptUpdates}
          onChange={e => onUpdate({ acceptUpdates: e.target.checked })}
          style={{ display: 'none' }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, color: campaign.acceptUpdates ? PURPLE : '#6b7280' }}>
          אישור קבלת הודעות ועדכונים
        </span>
      </label>

    </div>
  )
}
