"use client";

import React, { useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Info,
    PlusCircle,
    Check,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import { BrandIcon } from "./BrandIcon";

export default function EvaluatorDark() {
    const [status, setStatus] = useState("idle");
    const [feedback, setFeedback] = useState(null);
    const [activeTab, setActiveTab] = useState("evaluator");

    const handleAction = () => {
        setStatus("analyzing");
        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setStatus("idle");
        setFeedback(null);
    };

    return (
        <section className="h-[580px] overflow-hidden rounded-3xl border border-slate-800 bg-[#12141a] shadow-2xl flex flex-col font-sans w-full">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-4 shrink-0 bg-[#12141a] z-10 relative">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                        <BrandIcon className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-bold tracking-tight text-white">
                        ARQA
                    </span>
                    <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-violet-300">
                        Beta
                    </span>
                </div>

                <div role="tablist" className="inline-flex gap-1 rounded-xl bg-[#0a0c10] border border-slate-800 p-1">
                    <button
                        role="tab"
                        aria-selected={activeTab === "generator"}
                        onClick={() => handleTabChange("generator")}
                        className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none ${activeTab === "generator" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        Generator
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === "evaluator"}
                        onClick={() => handleTabChange("evaluator")}
                        className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none ${activeTab === "evaluator" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        Evaluator
                    </button>
                </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0 relative">

                {/* LEFT COLUMN: Input form (Fixed layout) */}
                <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col bg-[#12141a] border-b md:border-b-0 md:border-r border-slate-800 h-full justify-between">
                    {activeTab === "generator" ? (
                        <div className="flex flex-col flex-1 h-full justify-between">
                            <div className="mb-4">
                                <h3 className="text-white font-medium flex items-center gap-2 text-sm mb-1.5">
                                    <PlusCircle size={18} className="text-violet-400" />
                                    User Story generieren
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Stichpunkte oder Freitext eingeben — KI generiert eine vollständige User Story im Format <span className="text-violet-400 font-medium italic">Als... möchte ich..., damit...</span>
                                </p>
                            </div>

                            <div className="flex-1 flex flex-col mb-4 min-h-0">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Stichpunkte / Anforderungen</h4>
                                <textarea
                                    className="flex-1 bg-[#1a1c23] border border-slate-700/50 rounded-xl p-3.5 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed font-mono"
                                    defaultValue="- Nutzer soll Stichpunkte eingeben&#10;- Automatisch User Story generieren&#10;- Ergebnis kopieren können"
                                />
                            </div>

                            <button
                                onClick={handleAction}
                                disabled={status === "analyzing"}
                                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-sm shrink-0"
                            >
                                {status === "analyzing" ? "Generiere..." : "User Story generieren →"}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1 h-full justify-between">
                            <div className="mb-4">
                                <h3 className="text-white font-medium flex items-center gap-2 text-sm mb-1.5">
                                    <CheckCircle2 size={18} className="text-slate-400" />
                                    User Story analysieren
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Bestehende User Story eingeben — KI bewertet nach <span className="text-violet-400 font-medium">INVEST-Kriterien</span> und gibt Verbesserungsvorschläge.
                                </p>
                            </div>

                            <div className="flex-1 flex flex-col mb-4 min-h-0">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">User Story</h4>
                                <textarea
                                    className="flex-1 bg-[#1a1c23] border border-violet-500/40 rounded-xl p-3.5 text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                                    defaultValue="Als Nutzer möchte ich mich einloggen, damit ich die App nutzen kann."
                                />
                            </div>

                            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-500/90 text-xs mb-4 shrink-0">
                                <Info size={16} className="mt-0.5 shrink-0" />
                                <p>Format: <span className="font-semibold">Als [Rolle] möchte ich [Ziel], damit [Nutzen].</span></p>
                            </div>

                            <button
                                onClick={handleAction}
                                disabled={status === "analyzing"}
                                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-sm shrink-0"
                            >
                                {status === "analyzing" ? "Analysiere..." : "INVEST-Analyse starten →"}
                            </button>
                        </div>
                    )}
                    <p className="text-center text-[10px] text-slate-600 mt-3 shrink-0 font-medium">
                        Demo-Modus · Simulierte KI-Antwort
                    </p>
                </div>

                {/* RIGHT COLUMN: Results panel - Wrapper is relative, inner is absolute for perfect scrolling */}
                <div className="w-full md:w-1/2 bg-[#050608] relative min-h-0 h-full">

                    {/* INNER SCROLL CONTAINER: Absolute positioning puts scrollbar on the far right edge, with internal padding */}
                    <div className="absolute inset-0 overflow-y-auto p-6 lg:p-8 flex flex-col">

                        {status === "idle" && (
                            <div className="h-full flex flex-col items-center justify-center text-center my-auto flex-1">
                                <div className="w-12 h-12 bg-[#12141a] rounded-2xl flex items-center justify-center mb-4 text-violet-500 border border-slate-800 shadow-inner">
                                    {activeTab === "generator" ? <BrandIcon className="w-6 h-6" /> : <CheckCircle2 size={24} />}
                                </div>
                                <h3 className="text-white font-semibold text-sm mb-1.5">
                                    {activeTab === "generator" ? "Bereit zur Generierung" : "Bereit zur Analyse"}
                                </h3>
                                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                                    {activeTab === "generator"
                                        ? 'Stichpunkte eingeben und auf "Generieren" klicken'
                                        : 'User Story eingeben und auf "Analyse starten" klicken'}
                                </p>
                            </div>
                        )}

                        {status === "analyzing" && (
                            <div className="h-full flex flex-col items-center justify-center my-auto flex-1">
                                <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-400 text-xs font-medium">
                                    {activeTab === "generator" ? "Generating User Story..." : "Evaluating INVEST criteria..."}
                                </p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex flex-col gap-5 flex-1 animate-in fade-in duration-500">
                                {activeTab === "generator" ? (
                                    /* GENERATOR RESULTS */
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-emerald-500/20">
                                                <Check size={12} /> Generiert
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">Score: <strong className="text-emerald-400">82%</strong></span>
                                        </div>

                                        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4">
                                            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Generierte User Story</h4>
                                            <p className="text-sm text-slate-200 leading-relaxed">
                                                Als <span className="bg-violet-600/30 text-violet-200 px-1.5 py-0.5 rounded font-medium mx-0.5">Produktmanager:in</span> möchte ich <span className="bg-violet-600/30 text-violet-200 px-1.5 py-0.5 rounded font-medium mx-0.5">Anforderungen als Stichpunkte in ein Eingabefeld eingeben</span>, damit <span className="bg-violet-600/30 text-violet-200 px-1.5 py-0.5 rounded font-medium mx-0.5">schnell eine vollständige, standardisierte User Story generiert wird</span>.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Story-Komponenten</h4>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-3">
                                                    <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Rolle</h5>
                                                    <p className="text-xs text-slate-200 font-medium">Produktmanager:in</p>
                                                </div>
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-3">
                                                    <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Ziel</h5>
                                                    <p className="text-xs text-slate-200 font-medium">Anforderungen als Stichpunkte in ein Eingabefeld eingeben</p>
                                                </div>
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-3">
                                                    <h5 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Nutzen</h5>
                                                    <p className="text-xs text-slate-200 font-medium">schnell eine vollständige, standardisierte User Story generiert wird</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* EVALUATOR RESULTS */
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                            <div className="w-full sm:w-1/4 bg-[#12141a] border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-md">
                                                <span className="text-3xl font-black text-amber-400">59%</span>
                                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Gesamt</span>
                                            </div>
                                            <div className="w-full sm:w-3/4 bg-[#141622] border border-indigo-500/20 rounded-xl p-3.5 shadow-md">
                                                <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">+ Verbesserter Vorschlag</h4>
                                                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                                    Als registrierter Nutzer möchte ich mich mit E-Mail und Passwort anmelden, damit ich auf meine persönlichen Daten und gespeicherten Einstellungen zugreifen kann.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Invest-Kriterien</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {/* Independent */}
                                                <div className="bg-[#12141a] border border-emerald-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold flex items-center justify-center border border-emerald-500/20">I</span>
                                                            <span className="text-xs font-bold text-slate-200">Independent</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold text-xs">80%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">Die Story est eigenständig und kann unabhängig von anderen umgesetzt werden.</p>
                                                </div>
                                                {/* Negotiable */}
                                                <div className="bg-[#12141a] border border-amber-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-amber-500/10 text-amber-500 text-[9px] font-bold flex items-center justify-center border border-amber-500/20">N</span>
                                                            <span className="text-xs font-bold text-slate-200">Negotiable</span>
                                                        </div>
                                                        <span className="text-amber-500 font-bold text-xs">55%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">Grundlegend verhandelbar, aber Implementierungsdetails könnten offener sein.</p>
                                                </div>
                                                {/* Valuable */}
                                                <div className="bg-[#12141a] border border-rose-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-rose-500/10 text-rose-400 text-[9px] font-bold flex items-center justify-center border border-rose-500/20">V</span>
                                                            <span className="text-xs font-bold text-slate-200">Valuable</span>
                                                        </div>
                                                        <span className="text-rose-400 font-bold text-xs">45%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">"Die App nutzen" ist zu vage — kein konkreter Mehrwert erkennbar.</p>
                                                </div>
                                                {/* Estimable */}
                                                <div className="bg-[#12141a] border border-amber-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-amber-500/10 text-amber-500 text-[9px] font-bold flex items-center justify-center border border-amber-500/20">E</span>
                                                            <span className="text-xs font-bold text-slate-200">Estimable</span>
                                                        </div>
                                                        <span className="text-amber-500 font-bold text-xs">60%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">Schätzbar, aber fehlende Details erschweren präzise Aufwandsermittlung.</p>
                                                </div>
                                                {/* Small */}
                                                <div className="bg-[#12141a] border border-emerald-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold flex items-center justify-center border border-emerald-500/20">S</span>
                                                            <span className="text-xs font-bold text-slate-200">Small</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-bold text-xs">75%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">Angemessener Umfang — innerhalb eines Sprints umsetzbar.</p>
                                                </div>
                                                {/* Testable */}
                                                <div className="bg-[#12141a] border border-rose-500/20 rounded-xl p-3 flex flex-col justify-between">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-4 h-4 rounded bg-rose-500/10 text-rose-400 text-[9px] font-bold flex items-center justify-center border border-rose-500/20">T</span>
                                                            <span className="text-xs font-bold text-slate-200">Testable</span>
                                                        </div>
                                                        <span className="text-rose-400 font-bold text-xs">40%</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-normal">Keine Akzeptanzkriterien — unklar, wann die Story als "done" gilt.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Verbesserungsvorschläge</h4>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
                                                    <span className="text-violet-400 font-bold text-xs">→</span>
                                                    <span className="text-xs text-slate-300 font-medium">Nutzerrolle konkretisieren: "registrierter Nutzer" statt generisch "Nutzer"</span>
                                                </div>
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
                                                    <span className="text-violet-400 font-bold text-xs">→</span>
                                                    <span className="text-xs text-slate-300 font-medium">Nutzenformulierung verbessern: Was ermöglicht der Login konkret?</span>
                                                </div>
                                                <div className="bg-[#12141a] border border-slate-800 rounded-xl p-2.5 flex items-start gap-2.5">
                                                    <span className="text-violet-400 font-bold text-xs">→</span>
                                                    <span className="text-xs text-slate-300 font-medium">Mindestens 3 messbare Akzeptanzkriterien hinzufügen</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t border-slate-800 pt-4 flex items-center justify-between">
                                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">HCI Study Feedback:</p>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => setFeedback("up")} className={`p-1.5 rounded-lg border transition-all ${feedback === "up" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white"}`}><ThumbsUp size={14} /></button>
                                                <button onClick={() => setFeedback("down")} className={`p-1.5 rounded-lg border transition-all ${feedback === "down" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white"}`}><ThumbsDown size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}