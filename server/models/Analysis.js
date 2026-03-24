const mongoose = require('mongoose');

const PatientDataSchema = new mongoose.Schema({
  age: Number,
  creatinine: Number,
  blood_type: String,
  hla: String,
  bmi: Number,
  glucose: Number,
  cholesterol: Number,
  blood_pressure_systolic: Number,
  blood_pressure_diastolic: Number,
  hemoglobin: Number,
  weight: Number,
  height: Number,
  heart_rate: Number,
  potassium: Number,
  sodium: Number,
  calcium: Number,
  phosphorus: Number,
  albumin: Number,
  total_protein: Number,
  ast: Number,
  alt: Number,
  alp: Number,
  bilirubin: Number,
  wbc: Number,
  rbc: Number,
  platelets: Number,
  hba1c: Number,
  uric_acid: Number,
  bun: Number,
  crp: Number,
  tsh: Number,
  vitamin_d: Number,
  iron: Number,
});

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  donor: PatientDataSchema,
  recipient: PatientDataSchema,
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
  },
  ckdEpi: Number,
  kdpi: Number,
  organQuality: String,
  riskFactors: [String],
  recommendations: [String],
  aiSummary: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
