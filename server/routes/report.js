const express = require('express');
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const router = express.Router();

/**
 * GET /api/report/:id
 * Generates and streams a PDF report for a given analysis ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cortexai-report-${analysis._id}.pdf"`
    );
    doc.pipe(res);

    // ── Header ──────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill('#0f1420');
    doc.fill('#01e8af').fontSize(22).font('Helvetica-Bold')
       .text('CORTEX AI', 50, 20, { align: 'left' });
    doc.fill('#ffffff').fontSize(10).font('Helvetica')
       .text('Transplant Compatibility Report', 50, 48);
    doc.fill('#aaaaaa').fontSize(9)
       .text(`Generated: ${new Date().toUTCString()}`, 50, 62);

    doc.moveDown(3);

    // ── Score Banner ─────────────────────────────────────────────
    const score = analysis.compatibilityScore;
    const riskColor =
      score >= 75 ? '#01e8af' : score >= 55 ? '#ffd700' : score >= 35 ? '#ff8c00' : '#ff4444';

    doc.rect(50, 95, doc.page.width - 100, 60).fill('#1a2233').stroke();
    doc.fill(riskColor).fontSize(32).font('Helvetica-Bold')
       .text(`${score}/100`, 60, 105, { align: 'left' });
    doc.fill('#ffffff').fontSize(12).font('Helvetica')
       .text(`Risk Level: ${analysis.riskLevel}`, 60, 142);
    doc.fill('#aaaaaa').fontSize(10)
       .text(`Organ Quality: ${analysis.organQuality}`, 300, 112);
    doc.text(`eGFR (CKD-EPI): ${analysis.ckdEpi} mL/min`, 300, 127);
    doc.text(`Donor KDPI: ${analysis.kdpi}%`, 300, 142);

    doc.y = 170;

    // ── AI Summary ───────────────────────────────────────────────
    doc.fill('#01e8af').fontSize(11).font('Helvetica-Bold').text('AI SUMMARY', 50, doc.y);
    doc.moveDown(0.3);
    doc.fill('#333333').rect(50, doc.y, doc.page.width - 100, 1).fill();
    doc.moveDown(0.5);
    doc.fill('#222222').fontSize(9).font('Helvetica')
       .text(analysis.aiSummary || '—', 50, doc.y, { width: doc.page.width - 100 });
    doc.moveDown(1.5);

    // ── Patient Data ─────────────────────────────────────────────
    const drawPatientTable = (title, data) => {
      doc.fill('#01e8af').fontSize(11).font('Helvetica-Bold').text(title, 50, doc.y);
      doc.moveDown(0.3);
      doc.fill('#333333').rect(50, doc.y, doc.page.width - 100, 1).fill();
      doc.moveDown(0.5);

      const fields = [
        ['Blood Type', data.blood_type],
        ['HLA', data.hla],
        ['Age', data.age],
        ['BMI', data.bmi],
        ['Creatinine', `${data.creatinine} mg/dL`],
        ['eGFR (CKD-EPI)', `${data.ckdEpi || '—'}`],
        ['Glucose', `${data.glucose} mg/dL`],
        ['Hemoglobin', `${data.hemoglobin} g/dL`],
        ['BUN', `${data.bun} mg/dL`],
        ['CRP', `${data.crp} mg/L`],
        ['Cholesterol', `${data.cholesterol} mg/dL`],
        ['HbA1c', `${data.hba1c}%`],
        ['Sodium', `${data.sodium} mEq/L`],
        ['Potassium', `${data.potassium} mEq/L`],
        ['Albumin', `${data.albumin} g/dL`],
        ['Platelets', `${data.platelets} ×10³/µL`],
        ['WBC', `${data.wbc} ×10³/µL`],
        ['AST/ALT', `${data.ast}/${data.alt} U/L`],
      ];

      const colW = (doc.page.width - 100) / 2;
      let col = 0;
      let rowY = doc.y;

      fields.forEach(([label, value], i) => {
        const x = 50 + col * colW;
        const bg = i % 4 < 2 ? '#f5f7fa' : '#ffffff';
        doc.rect(x, rowY, colW, 18).fill(bg).stroke('#e0e0e0');
        doc.fill('#555555').fontSize(8).font('Helvetica')
           .text(label, x + 4, rowY + 5, { width: colW / 2 - 4 });
        doc.fill('#111111').fontSize(8).font('Helvetica-Bold')
           .text(String(value ?? '—'), x + colW / 2, rowY + 5, { width: colW / 2 - 4 });
        col++;
        if (col === 2) { col = 0; rowY += 18; }
      });
      if (col === 1) rowY += 18;
      doc.y = rowY + 8;
    };

    drawPatientTable('DONOR DATA', analysis.donor || {});
    doc.moveDown(0.5);
    drawPatientTable('RECIPIENT DATA', analysis.recipient || {});
    doc.moveDown(1);

    // ── Risk Factors ─────────────────────────────────────────────
    if (analysis.riskFactors?.length) {
      if (doc.y > 680) doc.addPage();
      doc.fill('#ff4444').fontSize(11).font('Helvetica-Bold').text('RISK FACTORS', 50, doc.y);
      doc.moveDown(0.3);
      doc.fill('#333333').rect(50, doc.y, doc.page.width - 100, 1).fill();
      doc.moveDown(0.4);
      analysis.riskFactors.forEach(rf => {
        doc.fill('#cc0000').fontSize(9).font('Helvetica').text(`⚠  ${rf}`, 55, doc.y, { width: doc.page.width - 110 });
        doc.moveDown(0.4);
      });
      doc.moveDown(0.5);
    }

    // ── Recommendations ──────────────────────────────────────────
    if (analysis.recommendations?.length) {
      if (doc.y > 680) doc.addPage();
      doc.fill('#01e8af').fontSize(11).font('Helvetica-Bold').text('CLINICAL RECOMMENDATIONS', 50, doc.y);
      doc.moveDown(0.3);
      doc.fill('#333333').rect(50, doc.y, doc.page.width - 100, 1).fill();
      doc.moveDown(0.4);
      analysis.recommendations.forEach(rec => {
        doc.fill('#006644').fontSize(9).font('Helvetica').text(`✓  ${rec}`, 55, doc.y, { width: doc.page.width - 110 });
        doc.moveDown(0.4);
      });
    }

    // ── Footer ───────────────────────────────────────────────────
    doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill('#0f1420');
    doc.fill('#aaaaaa').fontSize(8).font('Helvetica')
       .text(
         'Cortex AI — Transplant Compatibility Platform  |  For clinical use only  |  Not a substitute for physician judgment',
         50, doc.page.height - 25, { align: 'center', width: doc.page.width - 100 }
       );

    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'PDF generation failed' });
    }
  }
});

module.exports = router;
