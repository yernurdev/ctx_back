// calculator.js

// CKD-EPI Formula
function ckd_epi(scr, age, sex) {
    const kappa = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.329 : -0.411;

    // Ensure scr is valid
    if (scr <= 0) return 0;

    const ratio = scr / kappa;
    const minRatio = Math.min(ratio, 1);
    const maxRatio = Math.max(ratio, 1);

    let gfr = 141 *
        Math.pow(minRatio, alpha) *
        Math.pow(maxRatio, -1.209) *
        Math.pow(0.993, age);

    if (sex === "female") {
        gfr *= 1.018;
    }

    return gfr;
}

async function runCalculation() {
    const age = parseFloat(document.getElementById("calc-age").value);
    const sex = document.getElementById("calc-sex").value;
    const unit = document.getElementById("calc-unit").value;
    let scrStart = parseFloat(document.getElementById("calc-scr-start").value);
    let scrCurrent = parseFloat(document.getElementById("calc-scr-current").value);

    // Use API Key from config.js
    const apiKey = CONFIG.GEMINI_API_KEY;

    if (!age || !scrStart || !scrCurrent) {
        alert("Please fill in all required fields.");
        return;
    }

    // Convert µmol/L to mg/dL if needed (Formula expects mg/dL usually)
    // 1 mg/dL = 88.4 µmol/L
    if (unit === "mmol") {
        scrStart = scrStart / 88.4;
        scrCurrent = scrCurrent / 88.4;
    }

    const gfrStart = ckd_epi(scrStart, age, sex);
    const gfrCurrent = ckd_epi(scrCurrent, age, sex);

    // Remaining Function % = (Current / Start) * 100
    const remainingPercent = (gfrCurrent / gfrStart) * 100;

    // Update UI
    document.getElementById("calc-results").style.display = "grid";
    document.getElementById("res-gfr-start").textContent = gfrStart.toFixed(1);
    document.getElementById("res-gfr-current").textContent = gfrCurrent.toFixed(1);
    document.getElementById("res-remaining").textContent = remainingPercent.toFixed(1);

    // AI Analysis
    const aiSection = document.getElementById("ai-results");

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
        aiSection.classList.remove("hidden");
        await fetchGeminiAnalysis(apiKey, { age, sex, scrStart, scrCurrent, gfrStart, gfrCurrent, remainingPercent });
    } else {
        console.warn("AI is missing");
        aiSection.classList.remove("hidden");
        document.getElementById("ai-rec-content").textContent = "Please configure your Gemini API Key in js/config.js to see AI analysis.";
    }
}

async function fetchGeminiAnalysis(apiKey, data) {
    const recContent = document.getElementById("ai-rec-content");
    const riskContent = document.getElementById("ai-risk-content");
    const suitContent = document.getElementById("ai-suit-content");

    // Reset loading state
    const loadingHtml = '<span class="loading-pulse">Analyzing...</span>';
    recContent.innerHTML = loadingHtml;
    riskContent.innerHTML = loadingHtml;
    suitContent.innerHTML = loadingHtml;

    const prompt = `
    IN ENGLISH ONLY
    You are a highly experienced Nephrologist and Transplant Surgeon assistant.
    Analyze the following patient data for a kidney transplant context:

    Patient Data:
    - Age: ${data.age}
    - Sex: ${data.sex}
    - Initial Creatinine: ${data.scrStart.toFixed(2)} mg/dL
    - Current Creatinine: ${data.scrCurrent.toFixed(2)} mg/dL
    - Initial GFR: ${data.gfrStart.toFixed(1)} ml/min/1.73m²
    - Current GFR: ${data.gfrCurrent.toFixed(1)} ml/min/1.73m²
    - Remaining Kidney Function: ${data.remainingPercent.toFixed(1)}% (Calculated as Current/Initial ratio)

    Please provide a comprehensive, detailed, and clinically precise medical report in Russian.
    The report must be expanded and provide deep insights for a doctor.

    Required Sections:
    1. Medical Recommendations:
       - Provide specific clinical management steps.
       - Suggest specific diagnostic tests (e.g., biopsy, ultrasound, drug level monitoring).
       - Discuss immunosuppression adjustments if relevant.
    2. Risk Hypotheses:
       - Analyze the GFR trend (decline or stability).
       - List differential diagnoses for the change (e.g., acute rejection, calcineurin inhibitor toxicity, infection, dehydration).
       - Estimate the urgency of intervention.
    3. Organ Suitability & Prognosis:
       - Evaluate the long-term viability of the graft based on current function.
       - Provide a prognostic outlook.

    Format the response as a valid JSON object with keys: "recommendations", "risks", "suitability".
    Use professional medical terminology.
    Dont use bold or italic formatting. just simple text
    `;

    try {

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        const content = JSON.parse(text);

        // Helper function to handle string or object/array content
        const formatContent = (val) => {
            if (typeof val === 'string') return val;
            if (Array.isArray(val)) return val.join('\n');
            if (typeof val === 'object' && val !== null) {
                // If it's an object, try to join its values or stringify
                return Object.values(val).join('\n') || JSON.stringify(val);
            }
            return String(val);
        };

        recContent.textContent = formatContent(content.recommendations);
        riskContent.textContent = formatContent(content.risks);
        suitContent.textContent = formatContent(content.suitability);

    } catch (error) {
        console.error("Gemini AI Error:", error);
        const errorMsg = `Error: ${error.message}. Please check your API key.`;
        recContent.textContent = errorMsg;
        riskContent.textContent = errorMsg;
        suitContent.textContent = errorMsg;
    }
}

// Attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', runCalculation);
    }
});
