import React, { Suspense, use, useMemo } from 'react';
import { Proposal } from './types';
import { fetchProposals } from './services/proposalService';
import Dashboard from './components/Dashboard';
import StatCard from './components/StatCard';
import { CalendarIcon, ChartBarIcon, HashtagIcon } from './components/icons';

// --- Helper Components ---
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center py-20 bg-red-900/20 rounded-lg">
    <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Ocorreu um Erro</h2>
      <p className="text-gray-300 break-words">{message}</p>
    </div>
  </div>
);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary pegou um erro:", error, errorInfo);
    }

    render() {
        if (this.state.hasError && this.state.error) {
            return <ErrorDisplay message={this.state.error.message} />;
        }
        return this.props.children;
    }
}

// --- Main App Component ---
const AppContent: React.FC = () => {
  const proposals = use(fetchProposals());

  const stats = useMemo(() => {
    if (proposals.length === 0) {
      return { total: 0, topCategory: 'N/A', latestDate: 'N/A' };
    }
    const counts = proposals.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0];
    const latestDate = proposals[0]?.protocolDate || 'N/A'; // Assumes data is pre-sorted

    return {
      total: proposals.length,
      topCategory: topCategory,
      latestDate: latestDate,
    };
  }, [proposals]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8 animate-fade-in">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
          Indicações - Ver. Postal (2025)
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
          Análise interativa das indicações legislativas de 2025 do Vereador Postal, com base em documento oficial.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 animate-fade-in-up">
        <StatCard 
          icon={<ChartBarIcon className="h-8 w-8 text-blue-400" />} 
          title="Total de Indicações" 
          value={stats.total.toString()} 
        />
        <StatCard 
          icon={<HashtagIcon className="h-8 w-8 text-teal-400" />} 
          title="Categoria Principal" 
          value={stats.topCategory} 
        />
        <StatCard 
          icon={<CalendarIcon className="h-8 w-8 text-violet-400" />} 
          title="Última Proposta" 
          value={stats.latestDate} 
        />
      </section>
      
      <Dashboard proposals={proposals} />

      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>Dados extraídos de documento oficial da Câmara de Bento Gonçalves, RS. Última atualização em {new Date().toLocaleDateString('pt-BR')}.</p>
        <p>Categorização e análise baseadas nos dados do documento.</p>
      </footer>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
                <AppContent />
            </Suspense>
        </ErrorBoundary>
    );
};

export default App;
