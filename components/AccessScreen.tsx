import React, { useState } from 'react';

interface AccessScreenProps {
    onAccess: (code: string, isForAdmin?: boolean) => void;
    error?: string;
}

const AccessScreen: React.FC<AccessScreenProps> = ({ onAccess, error }) => {
    const [code, setCode] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            onAccess(code.trim(), isAdminMode);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background blobs for aesthetics */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse transition-all duration-300"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse transition-all duration-1000"></div>

            <div className="max-w-md w-full z-10">
                <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all hover:scale-[1.01]">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <div className="inline-block bg-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-900/40 mb-4 animate-bounce">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">ELITE VAREJO</h1>
                            <p className="text-slate-400 mt-2">Gestão de Excelência em Supermercados</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    {isAdminMode ? 'Senha Administrativa' : 'Código da Loja'}
                                </label>
                                <input
                                    type={isAdminMode ? "password" : "text"}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder={isAdminMode ? "••••" : "Digite o código da unidade"}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-3 animate-head-shake">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/30 transition-all active:scale-95"
                            >
                                {isAdminMode ? 'Entrar no Portal Admin' : 'Acessar Dashboard'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setIsAdminMode(!isAdminMode);
                                    setCode('');
                                }}
                                className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                            >
                                {isAdminMode ? 'Acessar como Gerente de Loja' : 'Acesso para Administração Global'}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-xs mt-8">
                    Desenvolvido para alta performance em gestão varejista.
                </p>
            </div>
        </div>
    );
};

export default AccessScreen;
