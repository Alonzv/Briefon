import { useState, useRef } from 'react'
import CampaignCard from './components/CampaignCard'
import ExportButton from './components/ExportButton'
import { generatePDF } from './utils/pdfExport'
import './App.css'

const createEmptyCampaign = (id) => ({
  id,
  name: '',
  platform: 'facebook',
  budget: '',
  currency: 'ils',
  startDate: '',
  endDate: '',
  url: '',
  title: '',
  videoType: 'link',
  videoLink: '',
  videoDescription: '',
  thumbnail: null,
  thumbnailPreview: null,
  hasFacebookForm: false,
  formTitle: '',
  formJobTitle: '',
  contactDetails: [],
  distinguishingQuestion: '',
  questionType: 'open',
  questionAnswers: ['', '', ''],
  acceptUpdates: true,
  notes: '',
  collapsed: false,
})

export default function App() {
  const [orgName, setOrgName] = useState('')
  const [campaigns, setCampaigns] = useState([createEmptyCampaign(1)])
  const [nextId, setNextId] = useState(2)
  const [isExporting, setIsExporting] = useState(false)

  const addCampaign = () => {
    setCampaigns(prev => [...prev, createEmptyCampaign(nextId)])
    setNextId(prev => prev + 1)
  }

  const removeCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const updateCampaign = (id, updates) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const toggleCollapse = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, collapsed: !c.collapsed } : c))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await generatePDF(orgName, campaigns)
    } catch (e) {
      console.error('PDF export failed:', e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #faf9ff 100%)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'white',
        borderBottom: '1px solid #ede9fe',
        boxShadow: '0 1px 8px rgba(138,16,235,0.08)'
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img
                src="/logo_briefon2.png"
                alt="הבריפון"
                style={{ height: 43, width: 'auto', display: 'block' }}
              />
            </div>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#6b7280' }}>בריף שיווקי | מבית שיווק דיגיטל</h1>
            <ExportButton onClick={handleExport} isLoading={isExporting} />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '24px 16px' }}>
        {/* Organization Name */}
        <section style={{
          background: 'white', borderRadius: 20,
          boxShadow: '0 1px 8px rgba(138,16,235,0.07)',
          border: '1px solid #ede9fe',
          padding: '10px 24px', marginBottom: 24
        }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            שם הארגון
          </label>
          <input
            type="text"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
            dir="auto"
            placeholder="הכנס שם ארגון..."
            style={{
              width: '100%', fontSize: 28, fontWeight: 700, color: '#1a1a2e',
              border: 'none', borderBottom: '2px solid #ede9fe',
              outline: 'none', background: 'transparent', paddingBottom: 4,
              transition: 'border-color 0.2s', caretColor: '#8A10EB',
              fontFamily: 'inherit'
            }}
            onFocus={e => e.target.style.borderBottomColor = '#8A10EB'}
            onBlur={e => e.target.style.borderBottomColor = '#ede9fe'}
          />
        </section>

        {/* Campaigns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              index={index}
              isFirst={index === 0}
              onUpdate={(updates) => updateCampaign(campaign.id, updates)}
              onRemove={() => removeCampaign(campaign.id)}
              onToggleCollapse={() => toggleCollapse(campaign.id)}
            />
          ))}
        </div>

        {/* Add Campaign Button */}
        <button
          onClick={addCampaign}
          style={{
            marginTop: 20, width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, padding: '16px 0',
            borderRadius: 20, border: '2px dashed #c4b5fd',
            color: '#8A10EB', fontWeight: 600, fontSize: 15,
            background: 'transparent', cursor: 'pointer',
            transition: 'all 0.2s', fontFamily: 'inherit'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#8A10EB'
            e.currentTarget.style.background = '#faf5ff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#c4b5fd'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <span style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#8A10EB', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 20,
            boxShadow: '0 2px 6px rgba(138,16,235,0.3)'
          }}>+</span>
          הוסף קמפיין חדש
        </button>

        {/* Bottom Export */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #ede9fe', display: 'flex', justifyContent: 'center' }}>
          <ExportButton onClick={handleExport} isLoading={isExporting} large />
        </div>
      </main>
    </div>
  )
}
