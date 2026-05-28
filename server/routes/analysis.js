const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const authMiddleware = require('../middleware/auth');
const { validatePatientData, REQUIRED_FIELDS } = require('../utils/validatePatientData');
const { calculateCompatibility } = require('../utils/riskCalculator');
const Analysis = require('../models/Analysis');

const router = express.Router();

// Multer — in-memory storage for CSV
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/i)) {
      return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
  },
});

/**
 * POST /api/analysis/upload
 * Upload two CSV files (donor + recipient), validate, and run compatibility analysis.
 * Body: multipart/form-data with fields: donorFile, recipientFile
 */
router.post(
  '/upload',
  authMiddleware,
  upload.fields([
    { name: 'donorFile', maxCount: 1 },
    { name: 'recipientFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.donorFile || !req.files.recipientFile) {
        return res.status(400).json({
          success: false,
          message: 'Both donorFile and recipientFile CSV files are required.',
        });
      }

      const donorCsv = req.files.donorFile[0].buffer.toString('utf-8');
      const recipientCsv = req.files.recipientFile[0].buffer.toString('utf-8');

      // Parse CSVs
      let donorRows, recipientRows;
      try {
        donorRows = parse(donorCsv, { columns: true, skip_empty_lines: true, trim: true });
        recipientRows = parse(recipientCsv, { columns: true, skip_empty_lines: true, trim: true });
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          message: `CSV parsing failed: ${parseErr.message}`,
        });
      }

      if (donorRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Donor CSV is empty.' });
      }
      if (recipientRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Recipient CSV is empty.' });
      }

      // Validate first row of each file
      const donorValidation = validatePatientData(donorRows[0]);
      if (!donorValidation.valid) {
        return res.status(422).json({
          success: false,
          message: 'Donor CSV validation failed. This does not appear to be transplantology data.',
          errors: donorValidation.errors,
          hint: `CSV must contain these columns: ${REQUIRED_FIELDS.join(', ')}`,
        });
      }

      const recipientValidation = validatePatientData(recipientRows[0]);
      if (!recipientValidation.valid) {
        return res.status(422).json({
          success: false,
          message: 'Recipient CSV validation failed. This does not appear to be transplantology data.',
          errors: recipientValidation.errors,
          hint: `CSV must contain these columns: ${REQUIRED_FIELDS.join(', ')}`,
        });
      }

      const donorData = donorValidation.data;
      const recipientData = recipientValidation.data;

      // Run medical calculations
      const result = calculateCompatibility(donorData, recipientData);

      // Save to DB
      const analysis = new Analysis({
        userId: req.user.userId,
        donor: donorData,
        recipient: recipientData,
        ...result,
      });
      await analysis.save();

      // Emit via socket.io (attached to app)
      const io = req.app.get('io');
      if (io) {
        io.emit('new-analysis', {
          analysisId: analysis._id,
          score: result.compatibilityScore,
          riskLevel: result.riskLevel,
          timestamp: new Date(),
        });
      }

      res.json({
        success: true,
        analysisId: analysis._id,
        donor: donorData,
        recipient: recipientData,
        result,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

/**
 * GET /api/analysis/history
 * Returns analysis history for logged-in user
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-donor -recipient'); // Don't send full patient data in list
    res.json({ success: true, analyses });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/analysis/:id
 * Returns a single analysis by ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Get analysis error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
