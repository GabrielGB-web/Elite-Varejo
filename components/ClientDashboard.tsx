import React, { useState, useEffect } from 'react';
import { Store, KPI, StoreTier } from '../types';
import { getStoreInsights } from '../geminiService';

interface ClientDashboardProps {
    store: Store;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ store }) => {
    const [insights, setInsights] = useState<string | null>(null);
    const [loadingInsights, setLoadingInsights] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoadingInsights(true);
            const res = await getStoreInsights(store);
            setInsights(res);
            setLoadingInsights(false);
        };
        fetchInsights();
    }, [store]);

    const calculateTotalPerformance = () => {
        if (store.kpis.length === 0) return 0;
        const total = store.kpis.reduce((acc, kpi) => acc + (kpi.actual / kpi.target), 0);
        return Math.round((total / store.kpis.length) * 100);
    };

    const performance = calculateTotalPerformance();

    const getTier = (perf: number): StoreTier => {
        if (perf >= 100) return StoreTier.ELITE;
        if (perf >= 90) return StoreTier.GOLD;
        if (perf >= 80) return StoreTier.SILVER;
        if (perf >= 70) return StoreTier.BRONZE;
        return StoreTier.NONE;
    };

    const currentTier = getTier(performance);
    const tierColor = store.tierColors[currentTier];
    const reward = store.customRewards[currentTier];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Resumo da Loja */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-bold">{store.fantasia}</h2>
                    <p className="text-slate-400">Gerente: <span className="text-white font-medium">{store.manager}</span></p>
                    <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-slate-900 rounded-full text-xs font-bold text-slate-400 border border-slate-700">
                            ID: {store.code}
                        </span>
                        <span className="px-3 py-1 bg-slate-900 rounded-full text-xs font-bold text-slate-400 border border-slate-700">
                            Atualizado: {new Date(store.lastUpdate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 min-w-[240px]">
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Nível de Excelência</p>
                    <div
                        className="text-4xl font-black py-2 px-6 rounded-xl shadow-inner transition-all duration-500"
                        style={{ color: tierColor, backgroundColor: `${tierColor}10`, boxShadow: `inset 0 0 20px ${tierColor}10` }}
                    >
                        {currentTier}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-bold">{performance}%</span>
                        <span className="text-slate-500 text-sm">da meta global</span>
                    </div>
                    {reward > 0 && (
                        <div className="mt-2 text-orange-400 font-bold flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-.11-1.372c.783-1.81.969-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Premiação: R$ {reward.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {store.kpis.map(kpi => {
                    const kpiPerf = Math.min(100, Math.round((kpi.actual / kpi.target) * 100));
                    return (
                        <div key={kpi.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md hover:border-orange-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{kpi.category}</p>
                                    <h3 className="text-lg font-bold group-hover:text-orange-400 transition-colors">{kpi.name}</h3>
                                </div>
                                <div className="text-sm font-black text-slate-400">{kpiPerf}%</div>
                            </div>

                            <div className="space-y-4">
                                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700 shadow-inner">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                        style={{ width: `${kpiPerf}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-slate-500">
                                        Meta: <span className="text-slate-300 font-medium">{kpi.target}{kpi.unit}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Realizado</p>
                                        <p className="text-xl font-black text-white">{kpi.actual}{kpi.unit}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Seção de IA - Gemini Insights */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Análise Estratégica IA (Gemini)</h3>
                        <p className="text-xs text-slate-500">Insights baseados no desempenho atual da unidade</p>
                    </div>
                </div>

                <div className="p-8">
                    {loadingInsights ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-500">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="animate-pulse">Consultando especialista de varejo digital...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                            {insights ? (
                                <div className="whitespace-pre-wrap">{insights}</div>
                            ) : (
                                <p className="italic text-slate-500">Aguardando geração de análise...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
