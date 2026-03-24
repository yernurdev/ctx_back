import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAnalysis, getHistory } from '../services/api';
import { io } from 'socket.io-client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const socket = io('/', { autoConnect: false });

function ScoreCircle({ score }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);
  const color = score >= 75 ? '#01e8af' : score >= 55 ? '#ffd700' : score >= 35 ? '#ff8c00' : '#ff4444';
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x={60} y={55} textAnchor="middle" fill="white" fontSize={18} fontWeight={700}>{score}%</text>
      <text x={60} y={72} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={10}>SCORE</text>
    </svg>
  );
}

function FileUploadBox({ label, role, onFile, file }) {
  const inputRef = useRef();
  return (
    <div
      className={`upload-block ${file ? 'has-file' : ''}`}
      onClick={() => inputRef.current.click()}
      style={{ cursor: 'pointer' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{file ? '✅' : '📂'}</div>
      <p style={{ margin: 0, fontWeight: 600 }}>{file ? file.name : `Upload ${label} CSV`}</p>
      <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
        {file ? 'Click to change file' : 'Click to browse — .csv only'}
      </p>
    </div>
  );
}

function ParamGrid({ data }) {
  const skip = ['blood_type', 'hla', '_id', '__v'];
  const entries = Object.entries(data).filter(([k]) => !skip.includes(k));
  return (
    <div className="param-grid">
      {entries.map(([k, v]) => (
        <div className="param-item" key={k}>
          <span className="param-label">{k.replace(/_/g, ' ')}</span>
          <span className="param-value">{typeof v === 'number' ? v.toFixed(2) : v}</span>
        </div>
      ))}
    </div>
  );
}

function RiskBadge({ level }) {
  return <span className={`risk-badge risk-${level}`}>{level} Risk</span>;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [donorFile, setDonorFile] = useState(null);
  const [recipientFile, setRecipientFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'history'
  const [showDonorParams, setShowDonorParams] = useState(false);
  const [showRecipientParams, setShowRecipientParams] = useState(false);
  const [realtimeAlert, setRealtimeAlert] = useState(null);

  // Load history
  useEffect(() => {
    getHistory().then(r => setHistory(r.data.analyses)).catch(() => {});
  }, []);

  // Socket.io realtime
  useEffect(() => {
    socket.connect();
    socket.on('new-analysis', (data) => {
      setRealtimeAlert(data);
      setTimeout(() => setRealtimeAlert(null), 5000);
      // Refresh history
      getHistory().then(r => setHistory(r.data.analyses)).catch(() => {});
    });
    return () => socket.disconnect();
  }, []);

  const handleAnalyze = async () => {
    if (!donorFile || !recipientFile) {
      setError('Please upload both Donor and Recipient CSV files.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadAnalysis(donorFile, recipientFile);
      setResult(res.data);
      setActiveTab('analysis');
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed.';
      const errors = err.response?.data?.errors;
      setError(errors ? `${msg}\n• ${errors.join('\n• ')}` : msg);
    } finally {
      setLoading(false);
    }
  };

  // Radar chart data from result
  const radarData = result ? [
    { param: 'Compat', value: result.result.compatibilityScore },
    { param: 'eGFR', value: Math.min(result.result.ckdEpi / 1.2, 100) },
    { param: 'KDPI inv.', value: Math.max(100 - result.result.kdpi, 0) },
    { param: 'HLA', value: result.result.riskFactors.some(r => r.includes('HLA')) ? 40 : 80 },
    { param: 'ABO', value: result.result.riskFactors.some(r => r.includes('ABO')) ? 20 : 100 },
    { param: 'Metabolic', value: result.result.riskFactors.some(r => r.includes('gluc') || r.includes('CRP') || r.includes('anemia')) ? 50 : 90 },
  ] : [];

  // Bar chart from result (key labs)
  const barData = result ? [
    { name: 'Creatinine D', value: result.donor.creatinine, fill: '#20437a' },
    { name: 'Creatinine R', value: result.recipient.creatinine, fill: '#01e8af' },
  ] : [];

  return (
    <>
      <div className="entry-label">Clinical Portal</div>

      {realtimeAlert && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 100,
          background: 'rgba(15,20,32,0.95)', border: '1px solid var(--amber)',
          borderRadius: '12px', padding: '1rem 1.5rem', maxWidth: '300px',
          backdropFilter: 'blur(8px)',
        }}>
          <span className="pulse-dot" style={{ marginRight: '0.5rem' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>New analysis completed</span>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
            Score: {realtimeAlert.score}/100 — {realtimeAlert.riskLevel} risk
          </p>
        </div>
      )}

      <header className="navbar" style={{ padding: '1rem 2rem' }}>
        <a className="logo" href="/"><img src="/logo.png" alt="Cortex AI" width={50} /></a>
        <div className="nav-main">
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {user?.name} ({user?.email})
          </span>
          <button
            className="btn small ghost"
            onClick={() => { logout(); navigate('/login'); }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ marginTop: 0, padding: '0 2rem 4rem' }}>
        <section className="section">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Comprehensive Assessment</p>
            <h2>Donor–Recipient Match Analysis</h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <button
              className={`btn small ${activeTab === 'analysis' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveTab('analysis')}
            >New Analysis</button>
            <button
              className={`btn small ${activeTab === 'history' ? 'primary' : 'ghost'}`}
              onClick={() => setActiveTab('history')}
            >History ({history.length})</button>
          </div>

          {/* ─ ANALYSIS TAB ─ */}
          {activeTab === 'analysis' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Donor */}
                <div className="ai-card">
                  <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    1. Donor Profile
                  </h3>
                  <FileUploadBox label="Donor" role="donor" file={donorFile} onFile={setDonorFile} />
                  {result && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>KDPI Score</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.result.kdpi}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Organ Quality</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{result.result.organQuality}</div>
                        </div>
                      </div>
                      <button className="btn ghost small" style={{ width: '100%' }} onClick={() => setShowDonorParams(p => !p)}>
                        {showDonorParams ? 'Hide' : 'Show'} Clinical Parameters
                      </button>
                      {showDonorParams && <div style={{ marginTop: '1rem' }}><ParamGrid data={result.donor || {}} /></div>}
                    </>
                  )}
                </div>

                {/* Recipient */}
                <div className="ai-card">
                  <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    2. Recipient Profile
                  </h3>
                  <FileUploadBox label="Recipient" role="recipient" file={recipientFile} onFile={setRecipientFile} />
                  {result && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>CKD-EPI eGFR</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{result.result.ckdEpi} <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>mL/min</span></div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Risk Level</span>
                          <div style={{ marginTop: '0.3rem' }}><RiskBadge level={result.result.riskLevel} /></div>
                        </div>
                      </div>
                      <button className="btn ghost small" style={{ width: '100%' }} onClick={() => setShowRecipientParams(p => !p)}>
                        {showRecipientParams ? 'Hide' : 'Show'} Clinical Parameters
                      </button>
                      {showRecipientParams && <div style={{ marginTop: '1rem' }}><ParamGrid data={result.recipient || {}} /></div>}
                    </>
                  )}
                </div>
              </div>

              {/* Analyze button */}
              {error && (
                <div className="auth-error" style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                  ⚠️ {error}
                </div>
              )}
              <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  className="btn primary"
                  onClick={handleAnalyze}
                  disabled={loading || !donorFile || !recipientFile}
                  style={{ minWidth: 200 }}
                >
                  {loading
                    ? <><span className="spinner" style={{ marginRight: '0.5rem' }} /> Analyzing...</>
                    : '⚡ Run Compatibility Analysis'
                  }
                </button>
                {result && (
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setDonorFile(null);
                      setRecipientFile(null);
                      setResult(null);
                      setShowDonorParams(false);
                      setShowRecipientParams(false);
                    }}
                  >
                    Clear Files
                  </button>
                )}
              </div>

              {/* Results */}
              {result && (
                <div className="ai-analysis" style={{ marginTop: '2rem' }}>
                  <p className="eyebrow" style={{ color: 'var(--accent)' }}>Final Prediction</p>
                  <h2 style={{ marginBottom: '1rem' }}>Estimated Compatibility Score</h2>

                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <ScoreCircle score={result.result.compatibilityScore} />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <RiskBadge level={result.result.riskLevel} />
                  </div>

                  <p style={{ color: 'var(--muted)', maxWidth: 700, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.7 }}>
                    {result.result.aiSummary}
                  </p>

                  {/* Charts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Radar */}
                    <div>
                      <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Compatibility Radar</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="param" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar dataKey="value" stroke="#01e8af" fill="#01e8af" fillOpacity={0.3} />
                          <Tooltip contentStyle={{ background: '#0f1420', border: '1px solid rgba(255,255,255,0.12)' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Bar */}
                    <div>
                      <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Creatinine Comparison</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                          <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: '#0f1420', border: '1px solid rgba(255,255,255,0.12)' }} />
                          <Bar dataKey="value" fill="#01e8af" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Risk factors */}
                  {result.result.riskFactors.length > 0 && (
                    <div style={{ textAlign: 'left', maxWidth: 700, margin: '0 auto 1.5rem' }}>
                      <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>Risk Factors Identified</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {result.result.riskFactors.map((r, i) => (
                          <li key={i} style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', marginBottom: '0.4rem', background: 'rgba(255,80,80,0.08)', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <span>⚠️</span><span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.result.recommendations.length > 0 && (
                    <div style={{ textAlign: 'left', maxWidth: 700, margin: '0 auto' }}>
                      <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>Clinical Recommendations</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {result.result.recommendations.map((r, i) => (
                          <li key={i} style={{ padding: '0.5rem 0.8rem', borderRadius: '8px', marginBottom: '0.4rem', background: 'rgba(1,232,175,0.06)', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                            <span>✅</span><span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ─ HISTORY TAB ─ */}
          {activeTab === 'history' && (
            <div>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</p>
                  <p>No analyses yet. Upload your first donor–recipient pair.</p>
                </div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Compat. Score</th>
                      <th>Risk</th>
                      <th>eGFR</th>
                      <th>KDPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(a => (
                      <tr key={a._id}>
                        <td>{new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div className="score-bar" style={{ width: '80px' }}>
                              <div className="score-bar-fill" style={{ width: `${a.compatibilityScore}%` }} />
                            </div>
                            <span style={{ fontWeight: 600 }}>{a.compatibilityScore}%</span>
                          </div>
                        </td>
                        <td><RiskBadge level={a.riskLevel} /></td>
                        <td>{a.ckdEpi} mL/min</td>
                        <td>{a.kdpi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
