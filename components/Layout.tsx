import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
    role: UserRole;
    activeStore: string;
    onLogout: () => void;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ role, activeStore, onLogout, children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-600 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">ELITE VAREJO</h1>
                        <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">{activeStore}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium">{role === 'ADMIN' ? 'Administrador' : 'Gerente de Loja'}</span>
                        <span className="text-xs text-slate-400">Ambiente de Gestão</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
                        title="Sair"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 border-t border-slate-700 py-6 px-4 text-center">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} Elite Varejo - Programa de Excelência Gerencial. Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
};

export default Layout;
