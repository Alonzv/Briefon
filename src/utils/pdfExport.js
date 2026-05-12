import jsPDF from 'jspdf'

// Hebrew-supporting PDF generation using jsPDF with canvas rendering
// We render an HTML page to canvas, then embed in PDF for proper Hebrew/RTL support

const PURPLE = '#8A10EB'
const PURPLE_LIGHT = '#f5f3ff'
const GRAY_DARK = '#1a1a2e'
const GRAY_MID = '#6b7280'
const GRAY_LIGHT = '#9ca3af'

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
    ? `<a href="${campaign.url}" class="pdf-link">${esc(campaign.url)}</a>`
    : '<span class="empty">לא הוזן</span>'

  const videoLinkDisplay = campaign.videoLink
    ? `<a href="${campaign.videoLink}" class="pdf-link">${esc(campaign.videoLink)}</a>`
    : '<span class="empty">לא הוזן</span>'

  const videoSection = campaign.videoType === 'link'
    ? `<div class="field-row"><span class="field-label">לינק לסרטון:</span><span class="field-value ltr">${videoLinkDisplay}</span></div>`
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

  const thumbSection = campaign.thumbnailPreview ? `
    <div class="field-row thumb-row">
      <span class="field-label">תמונה ממוזערת:</span>
      <img src="${campaign.thumbnailPreview}" class="thumb-img" alt="thumbnail" />
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
          <div class="field-row"><span class="field-label">כותרת:</span><span class="field-value">${esc(campaign.title) || '<span class="empty">לא הוזן</span>'}</span></div>
          ${videoSection}
          ${thumbSection}
        </div>
        ${facebookSection}
        ${notesSection}
      </div>
    </div>
  `
}

function buildFullHTML(orgName, campaigns, logoBase64 = null) {
  const campaignsHTML = campaigns.map((c, i) => buildCampaignHTML(c, i)).join('')
  const logoHTML = logoBase64
    ? `<img src="${logoBase64}" alt="הבריפון" style="height:48px;width:auto;display:block;margin-bottom:14px;" />`
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
    width: 794px;
    padding: 0;
  }

  .page-header {
    background: linear-gradient(135deg, ${PURPLE}, #a855f7);
    color: white;
    padding: 28px 36px;
    margin-bottom: 28px;
  }

  .page-header .org-label {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.75;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .page-header .org-name {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .page-header .subtitle {
    font-size: 13px;
    opacity: 0.8;
    margin-top: 4px;
  }

  .content { padding: 0 28px 28px; }

  .campaign-card {
    border: 1.5px solid #ede9fe;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
    page-break-inside: avoid;
  }

  .campaign-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 18px;
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

  .campaign-body { padding: 16px 18px; }

  .fields-grid { margin-bottom: 12px; }

  .field-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid #f5f3ff;
  }

  .field-row:last-child { border-bottom: none; }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #7c3aed;
    min-width: 110px;
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
    text-decoration: underline;
    word-break: break-all;
  }

  .empty { color: ${GRAY_LIGHT}; font-style: italic; }

  .section {
    margin-top: 12px;
    padding: 12px 14px;
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
    margin-bottom: 10px;
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

  .thumb-img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 7px;
    border: 1px solid #e9d5ff;
  }

  .thumb-row { align-items: center; }

  .footer {
    text-align: center;
    color: ${GRAY_LIGHT};
    font-size: 10px;
    padding: 16px 0 20px;
    border-top: 1px solid #f3f4f6;
    margin-top: 8px;
  }
</style>
</head>
<body>
  <div class="page-header">
    ${logoHTML}
    <div class="org-label">בריף שיווקי</div>
    <div class="org-name">${esc(orgName)}</div>
    <div class="subtitle">הופק בתאריך ${new Date().toLocaleDateString('he-IL')}</div>
  </div>
  <div class="content">
    ${campaignsHTML}
    <div class="footer">הבריפון • מבית שיווק דיגיטל • ${new Date().toLocaleDateString('he-IL')}</div>
  </div>
</body>
</html>`
}

function getElementDocumentOffset(el) {
  let top = 0, left = 0
  while (el) {
    top += el.offsetTop || 0
    left += el.offsetLeft || 0
    el = el.offsetParent
  }
  return { top, left }
}

async function getLogoBase64() {
  try {
    const response = await fetch('/logo_briefon.png')
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function generatePDF(orgName, campaigns) {
  const logoBase64 = await getLogoBase64()
  const html = buildFullHTML(orgName, campaigns, logoBase64)

  // Open in a hidden iframe, render, then capture via html2canvas
  const { default: html2canvas } = await import('html2canvas')

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1px;border:none;visibility:hidden;'
  document.body.appendChild(iframe)

  await new Promise(resolve => {
    iframe.onload = resolve
    iframe.srcdoc = html
  })

  // Wait for fonts
  await new Promise(r => setTimeout(r, 1000))

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const body = iframeDoc.body

  // Set proper height
  iframe.style.height = body.scrollHeight + 'px'
  await new Promise(r => setTimeout(r, 200))

  // Collect clickable link positions before capturing
  const linkData = []
  const linkEls = iframeDoc.querySelectorAll('a.pdf-link[href]')
  for (const el of linkEls) {
    const offset = getElementDocumentOffset(el)
    linkData.push({
      url: el.href,
      x: offset.left,
      y: offset.top,
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
  }

  const canvas = await html2canvas(body, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794,
    logging: false,
  })

  document.body.removeChild(iframe)

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [794, canvas.height / 2],
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)

  // Add clickable link annotations over the image
  for (const link of linkData) {
    if (link.url) {
      pdf.link(link.x, link.y, link.width, link.height, { url: link.url })
    }
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const safeName = (orgName || 'הבריפון').replace(/\s+/g, '-').replace(/[\\/:*?"<>|]/g, '')
  const fileName = `${safeName}_${dateStr}.pdf`
  pdf.save(fileName)
}
