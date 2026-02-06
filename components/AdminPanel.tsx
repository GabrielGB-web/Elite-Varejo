import React, { useState } from 'react';
import { Store, KPI, StoreTier, KPICategory } from '../types';

interface AdminPanelProps {
    stores: Store[];
    updateStore: (s: Store) => void;
    addStore: (s: Store) => void;
    onSelectStore: (idx: number) => void;
    activeIdx: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ stores, updateStore, addStore, onSelectStore, activeIdx }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStore, setEditedStore] = useState<Store | null>(null);

    const activeStore = stores[activeIdx];

    const handleEditClick = (store: Store) => {
        setEditedStore(JSON.parse(JSON.stringify(store))); // Deep clone
        setIsEditing(true);
    };

    const handleAddNewStore = () => {
        const newStore: Store = {
            id: crypto.randomUUID(),
            code: `LOJA-${stores.length + 1}`,
            razaoSocial: 'Nova Razão Social',
            fantasia: 'Nova Loja',
            manager: 'Novo Gerente',
            lastUpdate: new Date().toISOString(),
            kpis: [
                { id: crypto.randomUUID(), name: 'Meta do Trimestre', description: '', category: KPICategory.FINANCE, target: 100000, actual: 0, unit: 'R$', weight: 1 },
                { id: crypto.randomUUID(), name: 'Crescimento vs Ano Anterior', description: '', category: KPICategory.GROWTH, target: 5, actual: 0, unit: '%', weight: 1 },
                { id: crypto.randomUUID(), name: 'Participação no PDV', description: '', category: KPICategory.MARKET, target: 30, actual: 0, unit: '%', weight: 1 },
            ],
            customRewards: { [StoreTier.NONE]: 0, [StoreTier.BRONZE]: 500, [StoreTier.SILVER]: 1000, [StoreTier.GOLD]: 2500, [StoreTier.ELITE]: 5000 },
            tierColors: { [StoreTier.NONE]: '#94a3b8', [StoreTier.BRONZE]: '#cd7f32', [StoreTier.SILVER]: '#c0c0c0', [StoreTier.GOLD]: '#ffd700', [StoreTier.ELITE]: '#00ffff' }
        };
        addStore(newStore);
        handleEditClick(newStore);
    };

    const saveChanges = () => {
        if (editedStore) {
            updateStore({ ...editedStore, lastUpdate: new Date().toISOString() });
            setIsEditing(false);
            setEditedStore(null);
        }
    };

    const updateKPI = (kpiId: string, field: keyof KPI, value: any) => {
        if (!editedStore) return;
        const updatedKpis = editedStore.kpis.map(k => k.id === kpiId ? { ...k, [field]: value } : k);
        setEditedStore({ ...editedStore, kpis: updatedKpis });
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de Lojas */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">Unidades</h3>
                            <button
                                onClick={handleAddNewStore}
                                className="p-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-lg shadow-orange-900/40"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {stores.map((s, idx) => (
                                <div
                                    key={s.id}
                                    onClick={() => onSelectStore(idx)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${activeIdx === idx ? 'bg-orange-600/10 border-orange-500 shadow-lg shadow-orange-900/20' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                                >
                                    <div>
                                        <p className={`font-bold ${activeIdx === idx ? 'text-orange-400' : 'text-white'}`}>{s.fantasia}</p>
                                        <p className="text-xs text-slate-500">{s.code} • {s.manager}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditClick(s); }}
                                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visualização Rápida */}
                    <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 mb-4 shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white">Gestão Global Ativa</h2>
                        <p className="text-slate-400 max-w-md">Para editar metas ou visualizar indicadores específicos, selecione uma unidade ao lado ou clique no botão de edição rápida de cada loja.</p>
                        <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-sm">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-500 uppercase">Total Unidades</p>
                                <p className="text-3xl font-black text-orange-500">{stores.length}</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-500 uppercase">Nível Médio</p>
                                <p className="text-3xl font-black text-blue-500">Prata</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl animate-fade-in">
                    <div className="bg-slate-900/50 px-8 py-6 border-b border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Voltar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold">Editando: <span className="text-orange-400">{editedStore?.fantasia}</span></h3>
                        </div>
                        <button
                            onClick={saveChanges}
                            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-900/30 active:scale-95"
                        >
                            Salvar Alterações
                        </button>
                    </div>

                    <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Dados Básicos */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Informações da Unidade</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">Nome Fantasia</label>
                                    <input
                                        type="text"
                                        value={editedStore?.fantasia}
                                        onChange={(e) => setEditedStore(prev => prev ? { ...prev, fantasia: e.target.value } : null)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">Gerente Responsável</label>
                                    <input
                                        type="text"
                                        value={editedStore?.manager}
                                        onChange={(e) => setEditedStore(prev => prev ? { ...prev, manager: e.target.value } : null)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">Código Identificador</label>
                                    <input
                                        type="text"
                                        value={editedStore?.code}
                                        onChange={(e) => setEditedStore(prev => prev ? { ...prev, code: e.target.value } : null)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold">Razão Social</label>
                                    <input
                                        type="text"
                                        value={editedStore?.razaoSocial}
                                        onChange={(e) => setEditedStore(prev => prev ? { ...prev, razaoSocial: e.target.value } : null)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Gestão de KPIs */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Gerenciar Indicadores (KPIs)</h4>
                            <div className="space-y-3">
                                {editedStore?.kpis.map((kpi) => (
                                    <div key={kpi.id} className="bg-slate-900/30 border border-slate-700 p-6 rounded-xl grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                                        <div className="lg:col-span-2">
                                            <input
                                                type="text"
                                                value={kpi.name}
                                                onChange={(e) => updateKPI(kpi.id, 'name', e.target.value)}
                                                className="bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-orange-500 outline-none w-full"
                                            />
                                            <select
                                                value={kpi.category}
                                                onChange={(e) => updateKPI(kpi.id, 'category', e.target.value)}
                                                className="bg-slate-900 text-[10px] uppercase font-bold text-slate-500 mt-2 rounded border border-slate-700 p-1 outline-none"
                                            >
                                                {Object.values(KPICategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Meta</label>
                                            <input
                                                type="number"
                                                value={kpi.target}
                                                onChange={(e) => updateKPI(kpi.id, 'target', parseFloat(e.target.value))}
                                                className="bg-slate-800 border-slate-700 rounded px-2 py-1 text-white border focus:border-orange-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Realizado</label>
                                            <input
                                                type="number"
                                                value={kpi.actual}
                                                onChange={(e) => updateKPI(kpi.id, 'actual', parseFloat(e.target.value))}
                                                className="bg-slate-800 border-slate-700 rounded px-2 py-1 text-orange-400 font-bold border focus:border-orange-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Unidade</label>
                                            <input
                                                type="text"
                                                value={kpi.unit}
                                                onChange={(e) => updateKPI(kpi.id, 'unit', e.target.value)}
                                                className="bg-slate-800 border-slate-700 rounded px-2 py-1 text-slate-300 border focus:border-orange-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase text-slate-500 font-bold">Desempenho</p>
                                                <p className={`text-xl font-black ${(kpi.actual / kpi.target) * 100 >= 100 ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {Math.round((kpi.actual / kpi.target) * 100)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Configuração de Tiers/Cores (Opcional - Layout simplificado) */}
                        <section className="space-y-4">
                            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Sistema de Níveis e Cores</h4>
                            <div className="flex flex-wrap gap-4">
                                {Object.entries(editedStore?.tierColors || {}).map(([tier, color]) => (
                                    <div key={tier} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: color as string }}></div>
                                        <span className="text-xs font-bold">{tier}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
