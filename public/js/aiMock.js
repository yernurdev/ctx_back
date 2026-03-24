// aiMock.js

const mockParams = {
    age: () => Math.floor(Math.random() * 50) + 20,
    creatinine: () => (Math.random() * 2 + 0.5).toFixed(2),
    blood_type: () => ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][Math.floor(Math.random() * 8)],
    hla: () => {
        const hlaA = ["A2", "A3", "A11", "A24"];
        const hlaB = ["B7", "B8", "B35", "B44"];
        return `${hlaA[Math.floor(Math.random() * 4)]}, ${hlaB[Math.floor(Math.random() * 4)]}`;
    },
    bmi: () => (Math.random() * 15 + 18).toFixed(1),
    glucose: () => Math.floor(Math.random() * 50) + 70,
    cholesterol: () => Math.floor(Math.random() * 100) + 120,
    blood_pressure: () => `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60}`,
    hemoglobin: () => (Math.random() * 5 + 10).toFixed(1),
    weight: () => Math.floor(Math.random() * 40) + 50,
    height: () => Math.floor(Math.random() * 40) + 150,
    heart_rate: () => Math.floor(Math.random() * 40) + 60,
    potassium: () => (Math.random() * 2 + 3.5).toFixed(1),
    sodium: () => Math.floor(Math.random() * 10) + 135,
    calcium: () => (Math.random() * 2 + 8.5).toFixed(1),
    phosphorus: () => (Math.random() * 2 + 2.5).toFixed(1),
    albumin: () => (Math.random() * 2 + 3.5).toFixed(1),
    total_protein: () => (Math.random() * 2 + 6.0).toFixed(1),
    ast: () => Math.floor(Math.random() * 30) + 10,
    alt: () => Math.floor(Math.random() * 30) + 10,
    alp: () => Math.floor(Math.random() * 100) + 30,
    bilirubin: () => (Math.random() * 1 + 0.1).toFixed(1),
    wbc: () => (Math.random() * 6 + 4.0).toFixed(1),
    rbc: () => (Math.random() * 2 + 3.5).toFixed(1),
    platelets: () => Math.floor(Math.random() * 200) + 150,
    hba1c: () => (Math.random() * 3 + 4.0).toFixed(1),
    uric_acid: () => (Math.random() * 4 + 2.0).toFixed(1),
    bun: () => Math.floor(Math.random() * 20) + 7,
    crp: () => (Math.random() * 10 + 0.1).toFixed(1),
    tsh: () => (Math.random() * 4 + 0.4).toFixed(1),
    vitamin_d: () => Math.floor(Math.random() * 50) + 10,
    iron: () => Math.floor(Math.random() * 100) + 50
};

// Colors based on styles.css var(--accent) ~ #00f0ff and dark theme
const chartColors = {
    primary: "rgba(0, 240, 255, 0.8)",
    primaryBorder: "rgba(0, 240, 255, 1)",
    secondary: "rgba(255, 255, 255, 0.2)",
    text: "#ececf1"
};

let chartInstances = {};
let parsedState = { donor: false, recipient: false };
let roleData = { donor: null, recipient: null };

function processUpload(role, filename) {
    const statusEl = document.getElementById(`${role}-upload-status`);
    statusEl.innerHTML = `<span class="loading-pulse">Parsing ${filename}...</span>`;
    
    setTimeout(() => {
        statusEl.innerHTML = `Success! Parsed 32 parameters.`;
        generateMockData(role);
        document.getElementById(`${role}-results`).style.display = 'block';
        parsedState[role] = true;
        checkFinalMatch();
    }, 1500);
}

function generateMockData(role) {
    const extractedData = {};
    for (const [key, genFunc] of Object.entries(mockParams)) {
        extractedData[key] = genFunc();
    }
    roleData[role] = extractedData;

    const paramsList = document.getElementById(`${role}-params-list`);
    paramsList.innerHTML = '';
    for (const [key, value] of Object.entries(extractedData)) {
        paramsList.innerHTML += `
            <div style="background: rgba(255,255,255,0.02); padding: 0.5rem; border-radius: 4px;">
                <span style="display: block; font-size: 0.65rem; color: var(--muted); text-transform: uppercase;">${key.replace('_', ' ')}</span>
                <strong style="color: var(--text);">${value}</strong>
            </div>
        `;
    }

    if (role === 'donor') {
        const kdpi = Math.floor(Math.random() * 50) + 40; 
        const currentQuality = 100 - (kdpi * 0.5); 

        document.getElementById('res-kdpi').textContent = kdpi + '%';
        document.getElementById('res-quality').textContent = currentQuality.toFixed(0) + '%';

        renderDonorChart(extractedData);
    } else if (role === 'recipient') {
        let ckdepiResult = 80;
        if (typeof ckd_epi === 'function') {
            ckdepiResult = ckd_epi(parseFloat(extractedData.creatinine), extractedData.age, Math.random() > 0.5 ? 'male' : 'female');
        }

        const riskValue = Math.random();
        let riskLevel = "Low";
        let riskColor = "#00f0ff";
        if (riskValue > 0.7) { riskLevel = "High"; riskColor = "#ff4d4d"; }
        else if (riskValue > 0.4) { riskLevel = "Medium"; riskColor = "#ffcc00"; }
        
        document.getElementById('res-ckdepi').textContent = ckdepiResult.toFixed(1);
        const riskEl = document.getElementById('res-risk');
        riskEl.textContent = riskLevel;
        riskEl.style.color = riskColor;

        renderRecipientChart(extractedData);
    }
}

function initChart(ctxId, config) {
    if (chartInstances[ctxId]) {
        chartInstances[ctxId].destroy();
    }
    const canvas = document.getElementById(ctxId);
    if(canvas) {
        const ctx = canvas.getContext('2d');
        chartInstances[ctxId] = new Chart(ctx, config);
    }
}

function renderDonorChart(data) {
    initChart('donorChart', {
        type: 'bar',
        data: {
            labels: ['Age', 'BMI', 'WBC', 'Cr'],
            datasets: [{
                label: 'Donor Key Metrics',
                data: [data.age, data.bmi, data.wbc, data.creatinine],
                backgroundColor: chartColors.primaryBorder,
                borderRadius: 4
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

function renderRecipientChart(data) {
    initChart('recipientChart', {
        type: 'radar',
        data: {
            labels: ['Immune', 'Metabolic', 'Cardiac', 'Renal', 'Hepatic'],
            datasets: [{
                label: 'Risk Factors Index',
                data: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
                backgroundColor: 'rgba(0, 240, 255, 0.2)',
                borderColor: chartColors.primaryBorder,
                pointBackgroundColor: chartColors.primaryBorder
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, pointLabels: { color: chartColors.text } } },
            plugins: { legend: { display: false } }
        }
    });
}

function checkFinalMatch() {
    if (parsedState.donor && parsedState.recipient) {
        document.getElementById('final-match-results').classList.remove('hidden');
        
        // Calculate mock compatibility score based on blood type and random factor
        let compatScore = Math.floor(Math.random() * 30) + 60; // Base 60-90
        
        // Blood type simple matching bonus
        const db = roleData.donor.blood_type;
        const rb = roleData.recipient.blood_type;
        if(db === rb || db.startsWith('O')) {
             compatScore = Math.min(99, compatScore + 10);
        }

        const scoreEl = document.getElementById('final-compat-score');
        scoreEl.textContent = compatScore + '%';
        
        const summaryEl = document.getElementById('match-summary');
        if (compatScore > 85) {
            summaryEl.innerHTML = `<strong>Excellent Compatibility.</strong> Blood types indicate a favorable match (${db} to ${rb}). Immune tracking parameters suggest minimal rejection risk. Recommendation: Proceed with active transplant protocol.`;
        } else if (compatScore > 70) {
            summaryEl.innerHTML = `<strong>Moderate Compatibility.</strong> Blood types are acceptable (${db} to ${rb}). Elevated monitoring is required for specific immunological markers. Suggest standard immunosuppression protocol.`;
        } else {
            summaryEl.innerHTML = `<strong>Warning: High Rejection Risk.</strong> Biomathematical model indicates potential complications. Blood types (${db} to ${rb}) plus HLA mismatch increase predictive risk. Stronger immunosuppression or re-evaluation required.`;
            scoreEl.style.color = '#ff4d4d'; // Red text for danger
        }
    }
}
