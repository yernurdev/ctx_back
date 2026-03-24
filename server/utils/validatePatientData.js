const Joi = require('joi');

const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Clinical normal ranges for transplantology validation
const TRANSPLANT_RANGES = {
  age: { min: 0, max: 120 },
  creatinine: { min: 0.1, max: 20 },
  bmi: { min: 10, max: 70 },
  glucose: { min: 20, max: 600 },
  cholesterol: { min: 50, max: 500 },
  blood_pressure_systolic: { min: 50, max: 250 },
  blood_pressure_diastolic: { min: 20, max: 150 },
  hemoglobin: { min: 3, max: 25 },
  weight: { min: 5, max: 300 },
  height: { min: 50, max: 250 },
  heart_rate: { min: 20, max: 250 },
  potassium: { min: 1.0, max: 10.0 },
  sodium: { min: 100, max: 180 },
  calcium: { min: 4, max: 15 },
  phosphorus: { min: 0.5, max: 15 },
  albumin: { min: 1, max: 6 },
  total_protein: { min: 3, max: 10 },
  ast: { min: 0, max: 5000 },
  alt: { min: 0, max: 5000 },
  alp: { min: 0, max: 2000 },
  bilirubin: { min: 0, max: 50 },
  wbc: { min: 0.5, max: 100 },
  rbc: { min: 1, max: 10 },
  platelets: { min: 10, max: 2000 },
  hba1c: { min: 2, max: 20 },
  uric_acid: { min: 1, max: 20 },
  bun: { min: 1, max: 200 },
  crp: { min: 0, max: 500 },
  tsh: { min: 0.001, max: 100 },
  vitamin_d: { min: 1, max: 200 },
  iron: { min: 1, max: 500 },
};

const REQUIRED_FIELDS = [
  'age', 'creatinine', 'blood_type', 'hla', 'bmi', 'glucose', 'cholesterol',
  'blood_pressure_systolic', 'blood_pressure_diastolic', 'hemoglobin',
  'weight', 'height', 'heart_rate', 'potassium', 'sodium', 'calcium',
  'phosphorus', 'albumin', 'total_protein', 'ast', 'alt', 'alp', 'bilirubin',
  'wbc', 'rbc', 'platelets', 'hba1c', 'uric_acid', 'bun', 'crp', 'tsh',
  'vitamin_d', 'iron'
];

/**
 * Validates a single patient data row from CSV
 * Returns { valid: true, data, warnings } or { valid: false, errors }
 */
function validatePatientData(row) {
  const errors = [];
  const warnings = [];

  // 1. Check all required fields exist
  for (const field of REQUIRED_FIELDS) {
    const val = row[field];
    if (val === undefined || val === null || val === '') {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. Check blood_type
  if (!VALID_BLOOD_TYPES.includes(row.blood_type)) {
    errors.push(`Invalid blood_type: "${row.blood_type}". Must be one of: ${VALID_BLOOD_TYPES.join(', ')}`);
  }

  // 3. Check HLA is non-empty string
  if (typeof row.hla !== 'string' || row.hla.trim().length === 0) {
    errors.push(`Invalid HLA: must be a non-empty string (e.g. "A*02:01,B*07:02")`);
  }

  // 4. Validate numeric ranges
  for (const [field, range] of Object.entries(TRANSPLANT_RANGES)) {
    const val = parseFloat(row[field]);
    if (isNaN(val)) {
      errors.push(`Field "${field}" must be a number, got: "${row[field]}"`);
    } else if (val < range.min || val > range.max) {
      errors.push(
        `Field "${field}" value ${val} is out of transplantology range [${range.min}–${range.max}]`
      );
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Cast numerics
  const data = { ...row };
  for (const field of Object.keys(TRANSPLANT_RANGES)) {
    data[field] = parseFloat(row[field]);
  }
  data.blood_type = row.blood_type;
  data.hla = row.hla.trim();

  return { valid: true, data, warnings };
}

module.exports = { validatePatientData, REQUIRED_FIELDS, VALID_BLOOD_TYPES };
