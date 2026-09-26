import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

const ticketToken = crypto.randomUUID()

export function TicketSpike() {
  const [qrDataUrl, setQrDataUrl] = useState<string>()
  const [error, setError] = useState<string>()
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    void QRCode.toDataURL(ticketToken, { width: 240, margin: 1 }).then(setQrDataUrl).catch(() => setError('Unable to generate QR code.'))
  }, [])

  async function generatePdf() {
    if (!qrDataUrl) return
    setError(undefined)
    setIsGenerating(true)
    try {
      const pdf = new jsPDF()
      pdf.setFontSize(20)
      pdf.text('Architecture Spike', 20, 25)
      pdf.setFontSize(13)
      pdf.text('Guest: Test Guest', 20, 40)
      pdf.text('Table: 4', 20, 50)
      pdf.addImage(qrDataUrl, 'PNG', 20, 65, 70, 70)
      pdf.setFontSize(8)
      pdf.text(`Token: ${ticketToken}`, 20, 145)
      pdf.save('architecture-spike-ticket.pdf')
    } catch {
      setError('Unable to generate PDF.')
    } finally {
      setIsGenerating(false)
    }
  }

  return <section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="font-semibold">Ticket Spike</h2><p className="mt-1 text-sm text-slate-600">Architecture Spike · Test Guest · Table 4</p><div className="mt-4 flex flex-wrap items-center gap-4">{qrDataUrl ? <img src={qrDataUrl} className="h-28 w-28 border border-slate-200" alt="QR code for the test ticket" /> : <span className="text-sm text-slate-500">Generating QR...</span>}<button className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" type="button" disabled={!qrDataUrl || isGenerating} onClick={() => void generatePdf()}>{isGenerating ? 'Generating PDF...' : 'Generate PDF'}</button></div>{error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}</section>
}
