"use client";

import React, { useState } from "react";
import {
    CheckCircle2, Info, Check, ThumbsUp, ThumbsDown
} from "lucide-react";

/* --- INVEST DATA --- */
const INVEST_CRITERIA = [
    { id: "I", name: "Independent", score: "80%", status: "success", desc: "Die Story ist eigenständig und kann unabhängig von anderen umgesetzt werden." },
    { id: "N", name: "Negotiable", score: "55%", status: "warning", desc: "Grundlegend verhandelbar, aber Implementierungsdetails könnten offener sein." },
    { id: "V", name: "Valuable", score: "45%", status: "danger", desc: '"Die App nutzen" ist zu vage — kein konkreter Mehrwert erkennbar.' },
    { id: "E", name: "Estimable", score: "60%", status: "warning", desc: "Schätzbar, aber fehlende Details erschweren präzise Aufwandsermittlung." },
    { id: "S", name: "Small", score: "75%", status: "success", desc: "Angemessener Umfang — innerhalb eines Sprints umsetzbar." },
    { id: "T", name: "Testable", score: "40%", status: "danger", desc: 'Keine Akzeptanzkriterien — unklar, wann die Story als "done" gilt.' }
];

const SUGGESTIONS = [
    "Nutzerrolle konkretisieren: \"registrierter Nutzer\" statt generisch \"Nutzer\"",
    "Nutzenformulierung verbessern: Was ermöglicht der Login konkret?",
    "Mindestens 3 messbare Akzeptanzkriterien hinzufügen"
];

/* --- INVEST CARD SUB-COMPONENT --- */
const InvestCard = ({ criterion }: { criterion: any }) => {
    const styles: any = {
        success: { bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-600" },
        warning: { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-600" },
        danger: { bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-600" }
    }[criterion.status];

    return (
        <div className={`bg-white border border-${styles.border.split('-')[1]}/40 rounded-xl p-3 flex flex-col justify-between shadow-sm`}>
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded ${styles.bg} ${styles.text} text-[9px] font-bold flex items-center justify-center border ${styles.border}`}>
                        {criterion.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{criterion.name}</span>
                </div>
                <span className={`${styles.text} font-bold text-xs`}>{criterion.score}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">{criterion.desc}</p>
        </div>
    );
};

/* --- MAIN EVALUATOR COMPONENT --- */
export default function Evaluator() {
    const [status, setStatus] = useState("idle");
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleAction = () => {
        setStatus("analyzing");
        setTimeout(() => setStatus("success"), 2000);
    };

    return (
        <div className="flex flex-col md:flex-row flex-1 min-h-[500px] w-full bg-white font-sans rounded-b-3xl">

            {/* LEFT COLUMN */}
            <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-white">
                <div className="flex flex-col flex-1 h-full justify-between">
                    <div className="mb-4">
                        <h3 className="text-slate-800 font-semibold flex items-center gap-2 text-sm mb-1.5">
                            <CheckCircle2 size={18} className="text-slate-400" />
                            User Story analysieren
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Bestehende User Story eingeben — KI bewertet nach <span className="text-violet-600 font-medium">INVEST-Kriterien</span> und gibt Verbesserungsvorschläge.
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col mb-4 min-h-0">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">User Story</h4>
                        <textarea
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none leading-relaxed"
                            defaultValue="Als Nutzer möchte ich mich einloggen, damit ich die App nutzen kann."
                        />
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-amber-700 text-xs mb-4 shrink-0 shadow-sm">
                        <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
                        <p>Format: <span className="font-semibold">Als [Rolle] möchte ich [Ziel], damit [Nutzen].</span></p>
                    </div>
                </div>

                <button
                    onClick={handleAction}
                    disabled={status === "analyzing"}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 text-sm shrink-0"
                >
                    {status === "analyzing" ? "Analysiere..." : "INVEST-Analyse starten →"}
                </button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-1/2 bg-slate-50/50 relative min-h-0">
                <div className="absolute inset-0 overflow-y-auto p-6 lg:p-8 flex flex-col">

                    {status === "idle" && (
                        <div className="h-full flex flex-col items-center justify-center text-center my-auto flex-1">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-violet-500 border border-slate-200 shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-slate-800 font-semibold text-sm mb-1.5">Bereit zur Analyse</h3>
                            <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                                User Story eingeben und auf "Analyse starten" klicken
                            </p>
                        </div>
                    )}

                    {status === "analyzing" && (
                        <div className="h-full flex flex-col items-center justify-center my-auto flex-1">
                            <div className="w-8 h-8 border-4 border-violet-100 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 text-xs font-medium">Evaluating INVEST criteria...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col gap-4 flex-1 animate-in fade-in duration-500">
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <div className="w-full sm:w-1/4 bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                                    <span className="text-3xl font-black text-amber-500">59%</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Gesamt</span>
                                </div>
                                <div className="w-full sm:w-3/4 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 shadow-sm">
                                    <h4 className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1">+ Verbesserter Vorschlag</h4>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        Als registrierter Nutzer möchte ich mich mit E-Mail und Passwort anmelden, damit ich auf meine persönlichen Daten und gespeicherten Einstellungen zugreifen kann.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Invest-Kriterien</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {INVEST_CRITERIA.map((criterion) => (
                                        <InvestCard key={criterion.id} criterion={criterion} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verbesserungsvorschläge</h4>
                                <div className="flex flex-col gap-1.5">
                                    {SUGGESTIONS.map((suggestion, index) => (
                                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-start gap-2.5 shadow-sm">
                                            <span className="text-violet-500 font-bold text-xs">→</span>
                                            <span className="text-xs text-slate-600 font-medium">{suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
                                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">HCI Study Feedback:</p>
                                <div className="flex gap-1.5">
                                    <button onClick={() => setFeedback("up")} className={`p-1.5 rounded-lg border transition-all ${feedback === "up" ? "bg-emerald-50 text-emerald-600 border-emerald-300" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                                        <ThumbsUp size={14} />
                                    </button>
                                    <button onClick={() => setFeedback("down")} className={`p-1.5 rounded-lg border transition-all ${feedback === "down" ? "bg-rose-50 text-rose-600 border-rose-300" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}>
                                        <ThumbsDown size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}