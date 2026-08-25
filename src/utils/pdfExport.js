import jsPDF from 'jspdf'

const PURPLE = '#8A10EB'
const PURPLE_LIGHT = '#f5f3ff'
const GRAY_DARK = '#1a1a2e'
const GRAY_MID = '#6b7280'
const GRAY_LIGHT = '#9ca3af'

// A4 at 96dpi: 794 x 1123px  |  595.28 x 841.89pt
const A4_W = 794
const A4_H = 1123
const PT_PER_PX = 595.28 / A4_W

const CONTACT_LABELS = {
  phone: 'טלפון',
  email: 'אימייל',
  name: 'שם מלא',
  city: 'עיר',
}

const PLATFORM_LABELS = {
  facebook: 'פייסבוק',
  outbrain: 'אאוטבריין',
  google: 'גוגל',
}

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildCampaignHTML(campaign, index) {
  const currencySymbol = campaign.currency === 'usd' ? '$' : '₪'
  const budgetDisplay = campaign.budget
    ? `${currencySymbol}${campaign.budget}`
    : '<span class="empty">לא הוזן</span>'

  const urlDisplay = campaign.url
    ? `<a href="${esc(campaign.url)}" class="pdf-link">${esc(campaign.url)}</a>`
    : '<span class="empty">לא הוזן</span>'

  const additionalUrlsHTML = (campaign.additionalUrls || []).filter(u => u).map(u =>
    `<div class="field-row"><span class="field-label">קישור נוסף:</span><span class="field-value ltr"><a href="${esc(u)}" class="pdf-link">${esc(u)}</a></span></div>`
  ).join('')

  const copySection = campaign.copy
    ? `<div class="field-row"><span class="field-label">קופי:</span><span class="field-value" style="white-space:pre-wrap">${esc(campaign.copy)}</span></div>`
    : ''

  const videoLinkDisplay = campaign.videoLink
    ? `<a href="${esc(campaign.videoLink)}" class="pdf-link">${esc(campaign.videoLink)}</a>`
    : '<span class="empty">לא הוזן</span>'

  const additionalVideoLinksHTML = (campaign.additionalVideoLinks || []).filter(u => u).map(u =>
    `<div class="field-row"><span class="field-label">קובץ נוסף:</span><span class="field-value ltr"><a href="${esc(u)}" class="pdf-link">${esc(u)}</a></span></div>`
  ).join('')

  const videoSection = campaign.videoType === 'link'
    ? `<div class="field-row"><span class="field-label">לינק להורדת קבצים:</span><span class="field-value ltr">${videoLinkDisplay}</span></div>${additionalVideoLinksHTML}`
    : `<div class="field-row"><span class="field-label">תיאור סרטון:</span><span class="field-value">${esc(campaign.videoDescription) || '<span class="empty">לא הוזן</span>'}</span></div>`

  const contactLabels = (campaign.contactDetails || []).map(c => CONTACT_LABELS[c] || c).join(' | ')

  const answersHTML = campaign.questionType === 'multiple' && (campaign.questionAnswers || []).some(a => a)
    ? `<div class="answers-list">${(campaign.questionAnswers || []).map((a, i) => a ? `<div class="answer-item">${['א', 'ב', 'ג'][i]}. ${esc(a)}</div>` : '').join('')}</div>`
    : ''

  const facebookSection = campaign.hasFacebookForm ? `
    <div class="section">
      <div class="section-title">טופס פייסבוקי</div>
      <div class="field-row"><span class="field-label">כותרת הטופס:</span><span class="field-value">${esc(campaign.formTitle) || '<span class="empty">לא הוזן</span>'}</span></div>
      <div class="field-row"><span class="field-label">תיאור תפקיד:</span><span class="field-value">${esc(campaign.formJobTitle) || '<span class="empty">לא הוזן</span>'}</span></div>
      <div class="field-row"><span class="field-label">פרטי התקשרות:</span><span class="field-value">${esc(contactLabels) || '<span class="empty">לא נבחרו</span>'}</span></div>
      <div class="field-row"><span class="field-label">שאלה מבדלת:</span><span class="field-value">${esc(campaign.distinguishingQuestion) || '<span class="empty">לא הוזן</span>'}${answersHTML}</span></div>
      <div class="field-row"><span class="field-label">אישור עדכונים:</span><span class="field-value">${campaign.acceptUpdates ? '✓ מסומן' : '✗ לא מסומן'}</span></div>
    </div>
  ` : ''

  const notesSection = campaign.notes ? `
    <div class="section">
      <div class="section-title">הערות</div>
      <div class="notes-text">${esc(campaign.notes)}</div>
    </div>
  ` : ''

  const dateRange = campaign.startDate || campaign.endDate
    ? `${campaign.startDate || '?'} — ${campaign.endDate || '?'}`
    : '<span class="empty">לא נקבע</span>'

  const platformLabel = PLATFORM_LABELS[campaign.platform] || campaign.platform || '<span class="empty">לא נבחר</span>'

  return `
    <div class="campaign-card">
      <div class="campaign-header">
        <div class="campaign-number">${index + 1}</div>
        <div class="campaign-title">${esc(campaign.name) || `קמפיין ${index + 1}`}</div>
        ${campaign.platform ? `<div class="campaign-platform">${platformLabel}</div>` : ''}
      </div>
      <div class="campaign-body">
        <div class="fields-grid">
          <div class="field-row"><span class="field-label">שם קמפיין:</span><span class="field-value">${esc(campaign.name) || '<span class="empty">לא הוזן</span>'}</span></div>
          <div class="field-row"><span class="field-label">פלטפורמה:</span><span class="field-value">${platformLabel}</span></div>
          <div class="field-row"><span class="field-label">תקציב:</span><span class="field-value">${budgetDisplay}</span></div>
          <div class="field-row"><span class="field-label">תאריכים:</span><span class="field-value ltr">${dateRange}</span></div>
          <div class="field-row"><span class="field-label">קישור יעד:</span><span class="field-value ltr">${urlDisplay}</span></div>
          ${additionalUrlsHTML}
          <div class="field-row"><span class="field-label">כותרת:</span><span class="field-value">${esc(campaign.title) || '<span class="empty">לא הוזן</span>'}</span></div>
          ${copySection}
          ${videoSection}
        </div>
        ${facebookSection}
        ${notesSection}
      </div>
    </div>
  `
}

async function getLogoDataUrl() {
  try {
    const res = await fetch('/logo_briefon2.png')
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function buildFullHTML(orgName, campaigns, logoDataUrl) {
  const campaignsHTML = campaigns.map((c, i) => buildCampaignHTML(c, i)).join('')
  const logoImg = logoDataUrl
    ? `<div class="logo-wrap"><img src="${logoDataUrl}" class="header-logo" alt="הבריפון" /></div>`
    : ''

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Heebo', Arial, sans-serif;
    direction: rtl;
    background: white;
    color: ${GRAY_DARK};
    font-size: 13px;
    line-height: 1.6;
    width: ${A4_W}px;
    padding: 0;
  }

  .page-header {
    background: linear-gradient(135deg, ${PURPLE}, #a855f7);
    color: white;
    padding: 24px 32px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .logo-wrap {
    background: white;
    border-radius: 10px;
    padding: 6px 14px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .header-logo {
    height: 40px;
    width: auto;
    display: block;
  }

  .header-text { flex: 1; }

  .page-header .org-label {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.8;
    letter-spacing: 0.06em;
    margin-bottom: 3px;
  }

  .page-header .org-name {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .page-header .subtitle {
    font-size: 12px;
    opacity: 0.75;
    margin-top: 3px;
  }

  .content { padding: 0 24px 24px; }

  .campaign-card {
    border: 1.5px solid #ede9fe;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 18px;
    page-break-inside: avoid;
  }

  .campaign-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: ${PURPLE_LIGHT};
    border-bottom: 1px solid #ede9fe;
  }

  .campaign-number {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: ${PURPLE};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .campaign-title {
    font-size: 15px;
    font-weight: 700;
    color: ${GRAY_DARK};
    flex: 1;
  }

  .campaign-platform {
    font-size: 11px;
    font-weight: 600;
    color: ${PURPLE};
    background: white;
    border: 1px solid #e9d5ff;
    border-radius: 6px;
    padding: 3px 9px;
  }

  .campaign-body { padding: 14px 16px; }

  .fields-grid { margin-bottom: 10px; }

  .field-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid #f5f3ff;
  }

  .field-row:last-child { border-bottom: none; }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #7c3aed;
    min-width: 120px;
    flex-shrink: 0;
    padding-top: 1px;
  }

  .field-value {
    font-size: 13px;
    color: ${GRAY_DARK};
    word-break: break-word;
    flex: 1;
  }

  .field-value.ltr {
    direction: ltr;
    text-align: right;
    unicode-bidi: embed;
  }

  a.pdf-link {
    color: ${PURPLE};
    font-weight: 700;
    text-decoration: underline;
    word-break: break-all;
    background: #f3e8ff;
    border: 1.5px solid #c4b5fd;
    border-radius: 5px;
    padding: 2px 6px;
    display: inline-block;
  }

  .empty { color: ${GRAY_LIGHT}; font-style: italic; }

  .section {
    margin-top: 10px;
    padding: 10px 12px;
    background: ${PURPLE_LIGHT};
    border-radius: 10px;
    border: 1px solid #e9d5ff;
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }

  .notes-text {
    font-size: 13px;
    color: ${GRAY_DARK};
    white-space: pre-wrap;
    line-height: 1.7;
  }

  .answers-list {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .answer-item {
    font-size: 12px;
    color: ${GRAY_MID};
    padding-right: 4px;
  }

  .footer {
    text-align: center;
    color: ${GRAY_LIGHT};
    font-size: 10px;
    padding: 14px 0 18px;
    border-top: 1px solid #f3f4f6;
    margin-top: 8px;
  }
</style>
</head>
<body>
  <div class="page-header">
    ${logoImg}
    <div class="header-text">
      <div class="org-label">בריף שיווקי</div>
      <div class="org-name">${esc(orgName)}</div>
      <div class="subtitle">הופק בתאריך ${new Date().toLocaleDateString('he-IL')}</div>
    </div>
  </div>
  <div class="content">
    ${campaignsHTML}
    <div class="footer">הבריפון • מבית שיווק דיגיטל • ${new Date().toLocaleDateString('he-IL')}</div>
  </div>
</body>
</html>`
}

export async function generatePDF(orgName, campaigns) {
  const logoDataUrl = await getLogoDataUrl()
  const html = buildFullHTML(orgName, campaigns, logoDataUrl)

  const { default: html2canvas } = await import('html2canvas')

  const iframe = document.createElement('iframe')
  iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${A4_W}px;height:1px;border:none;visibility:hidden;`
  document.body.appendChild(iframe)

  await new Promise(resolve => {
    iframe.onload = resolve
    iframe.srcdoc = html
  })

  await new Promise(r => setTimeout(r, 1500))

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const body = iframeDoc.body

  iframe.style.height = body.scrollHeight + 'px'
  await new Promise(r => setTimeout(r, 300))

  const linkData = []
  for (const el of iframeDoc.querySelectorAll('a.pdf-link[href]')) {
    const rect = el.getBoundingClientRect()
    const scrollY = iframe.contentWindow.scrollY || 0
    const scrollX = iframe.contentWindow.scrollX || 0
    linkData.push({
      url: el.href,
      x: rect.left + scrollX,
      y: rect.top + scrollY,
      w: rect.width,
      h: rect.height,
    })
  }

  const SCALE = 2
  const canvas = await html2canvas(body, {
    scale: SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: A4_W,
    windowWidth: A4_W,
    logging: false,
  })

  document.body.removeChild(iframe)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pdfW = pdf.internal.pageSize.getWidth()
  const pdfH = pdf.internal.pageSize.getHeight()

  const canvasPageH = A4_H * SCALE
  const totalPages = Math.ceil(canvas.height / canvasPageH)

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage()

    const srcY = page * canvasPageH
    const srcH = Math.min(canvasPageH, canvas.height - srcY)

    const strip = document.createElement('canvas')
    strip.width = canvas.width
    strip.height = srcH
    strip.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)

    const imgData = strip.toDataURL('image/png')
    const renderedPtH = (srcH / SCALE) * PT_PER_PX

    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, renderedPtH)

    const pageTopPx = page * A4_H
    const pageBottomPx = pageTopPx + A4_H

    for (const link of linkData) {
      if (!link.url) continue
      if (link.y + link.h < pageTopPx || link.y > pageBottomPx) continue
      pdf.link(
        link.x * PT_PER_PX,
        (link.y - pageTopPx) * PT_PER_PX,
        link.w * PT_PER_PX,
        link.h * PT_PER_PX,
        { url: link.url }
      )
    }
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const safeName = (orgName || 'הבריפון').replace(/\s+/g, '-').replace(/[\\\/:\*?"<>|]/g, '')
  pdf.save(`${safeName}_${dateStr}.pdf`)
}
