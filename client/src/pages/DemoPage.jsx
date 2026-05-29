import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const [donor, setDonor] = useState({ age: 35, bloodType: 'A+', hla: 'A*02, B*07' });
  const [recipient, setRecipient] = useState({ age: 42, bloodType: 'A+', hla: 'A*02, B*08', ckd: 45 });

  const runAnalysis = () => {
    setAnalyzing(true);
    // Simulate complex network and AI computation
    setTimeout(() => {
      setAnalyzing(false);
      setStep(2);
      setResults({
        score: 92,
        risk: 'Low',
        riskColor: 'text-amber-400',
        recommendation: 'A strong biomathematical match. The simulated CKD-EPI trajectory indicates stable graft function over a 10-year horizon. Minimal immunosuppressive adjustment recommended.',
        markers: [
          { name: 'Immunologic Compatibility', status: 'Excellent', details: 'No donor-specific antibodies (DSA) detected. HLA mismatch is acceptable.' },
          { name: 'Metabolic Forecast', status: 'Optimal', details: `Recipient CKD-EPI (${recipient.ckd}) aligns with donor organ capacity.` },
          { name: 'Genetic Risk', status: 'Low Risk', details: 'APOL1 high-risk variants are absent.' }
        ]
      });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#0f1420] text-white font-sans selection:bg-[#01e8af] selection:text-[#0f1420]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-[#0f1420]/80 backdrop-blur-md border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/logo.png" alt="Cortex AI" className="w-8 h-8 rounded" />
          <span className="font-bold tracking-widest uppercase text-sm">Cortex AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#01e8af] animate-pulse"></span>
            Live API Environment
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* Left Column - Input Form */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Interactive Demo</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Experience the predictive power of Cortex AI. Input donor and recipient parameters to generate a comprehensive biomathematical compatibility forecast.
            </p>
          </div>

          <div className="bg-[#1a2233]/80 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Soft glowing orb effect on hover */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#01e8af]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <form className="relative z-10 flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); runAnalysis(); }}>

              {/* Donor Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-xl font-semibold">Donor Parameters</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">Age</label>
                    <input type="number" value={donor.age} onChange={e => setDonor({ ...donor, age: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">Blood Type</label>
                    <select value={donor.bloodType} onChange={e => setDonor({ ...donor, bloodType: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all appearance-none">
                      <option className="bg-[#1a2233]">A+</option>
                      <option className="bg-[#1a2233]">O+</option>
                      <option className="bg-[#1a2233]">B+</option>
                      <option className="bg-[#1a2233]">AB+</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">HLA Typing Snapshot</label>
                    <input type="text" value={donor.hla} onChange={e => setDonor({ ...donor, hla: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all" />
                  </div>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Recipient Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-semibold">Recipient Parameters</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">Age</label>
                    <input type="number" value={recipient.age} onChange={e => setRecipient({ ...recipient, age: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">eGFR (CKD-EPI)</label>
                    <input type="number" value={recipient.ckd} onChange={e => setRecipient({ ...recipient, ckd: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-white/50 font-medium">HLA Typing Snapshot</label>
                    <input type="text" value={recipient.hla} onChange={e => setRecipient({ ...recipient, hla: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#01e8af] focus:bg-[#01e8af]/5 transition-all" />
                  </div>
                </div>
              </div>

              <button
                disabled={analyzing}
                className="mt-4 w-full bg-gradient-to-r from-[#01e8af] to-[#00bdae] hover:from-[#00bdae] hover:to-[#009b8c] text-[#0f1420] font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(1,232,175,0.3)] hover:shadow-[0_0_40px_rgba(1,232,175,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#0f1420]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Biomathematics...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Calculate Compatibility Index
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-[500px]">

          {step === 1 && !analyzing && (
            <div className="text-center p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm max-w-md w-full border-dashed">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/30 border border-white/10">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Awaiting Parameters</h3>
              <p className="text-white/50">Enter the donor and recipient data on the left to initiate the AI compatibility forecast sequence.</p>
            </div>
          )}

          {analyzing && (
            <div className="text-center w-full max-w-md">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-[#01e8af] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-indigo-500 animate-[spin_2s_reverse_infinite]"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-pink-500 animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#01e8af] font-bold text-xl">AI</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 animate-pulse">Running Neural Models</h3>
              <div className="flex flex-col gap-2 mt-6 text-left border border-white/10 bg-black/20 p-4 rounded-xl font-mono text-xs text-[#01e8af]/70 h-32 overflow-hidden relative">
                <div className="animate-[slideUp_3s_linear_infinite] flex flex-col gap-2">
                  <p>&gt; Initializing omics data layer...</p>
                  <p className="delay-100">&gt; Cross-referencing HLA typing profiles...</p>
                  <p className="delay-200">&gt; Establishing CKD-EPI trajectory vector...</p>
                  <p className="delay-300">&gt; Calculating rejection probability matrix...</p>
                  <p className="delay-500">&gt; Validating against 10M+ historic outcomes...</p>
                  <p>&gt; Synthesizing narrative interpretation...</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && results && !analyzing && (
            <div className="w-full h-full flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">

              {/* Score Card */}
              <div className="bg-gradient-to-br from-[#1a2233] to-[#0f1420] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#01e8af]/20 blur-3xl rounded-full"></div>

                <h3 className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#01e8af]"></span>
                  Prognosis Dashboard
                </h3>

                <div className="flex items-center gap-8 mb-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-[#01e8af] animate-[fillGauge_2s_ease-out_forwards]" strokeDasharray={`${results.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{results.score}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#01e8af] font-semibold">Score</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="border border-white/10 bg-black/20 rounded-xl p-4 w-full">
                      <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Rejection Risk</span>
                      <span className={`text-xl font-bold bg-white/10 px-3 py-1 rounded-lg ${results.riskColor} inline-block`}>{results.risk}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/5 border border-[#01e8af]/30 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#01e8af] rounded-l-2xl"></div>
                  <h4 className="text-sm font-semibold mb-2 text-[#01e8af] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    AI Interpretation
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed">{results.recommendation}</p>
                </div>
              </div>

              {/* Biomarkers Breakdown */}
              <div className="bg-[#1a2233]/50 border border-white/10 p-6 rounded-3xl shadow-xl">
                <h3 className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-5 pl-2">Biomathematical Vector Analysis</h3>
                <div className="flex flex-col gap-3">
                  {results.markers.map((m, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 hover:border-white/10 transition-colors rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white/60">
                        {i === 0 ? '🧬' : i === 1 ? '🔄' : '⚕️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{m.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">{m.status}</span>
                        </div>
                        <p className="text-sm text-white/50">{m.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setStep(1); setResults(null); }} className="text-white/50 hover:text-white text-sm font-medium transition-colors py-2 flex items-center justify-center gap-2 border border-transparent hover:border-white/10 rounded-xl bg-transparent hover:bg-white/5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reset Canvas
              </button>

            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fillGauge {
          from { stroke-dasharray: 0, 100; }
        }
        @keyframes slideUp {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
