import React, { useState, useMemo, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Proposal, CategoryData } from '../types';
import useIsMobile from '../hooks/useIsMobile';
import ProposalCard from './ProposalCard';
import FilterControls from './FilterControls';

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#14b8a6', // teal-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#22c55e', // green-500
  '#ec4899', // pink-500
  '#6b7280', // gray-500
  '#d946ef', // fuchsia-500 for "Outros"
];

const CATEGORY_ORDER = [
  'Iluminação Pública',
  'Sinalização e Trânsito',
  'Pavimentação e Vias',
  'Manutenção e Limpeza Urbana',
  'Gestão de Resíduos',
  'Planejamento Urbano e Programas',
  'Espaços Públicos e Infraestrutura',
  'Prédios Públicos',
  'Outros',
];

interface DashboardProps {
    proposals: Proposal[];
}

const Dashboard: React.FC<DashboardProps> = ({ proposals }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const listRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const categoryData: CategoryData[] = useMemo(() => {
    const totalCount = proposals.length;
    if (totalCount === 0) return [];
    
    const counts = CATEGORY_ORDER.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<string, number>);

    proposals.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return CATEGORY_ORDER.map((name, index) => ({
      name,
      count: counts[name],
      percentage: totalCount > 0 ? (counts[name] / totalCount) * 100 : 0,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })).filter(item => item.count > 0);
  }, [proposals]);

  const colorMap = useMemo(() => {
    return categoryData.reduce((acc, cat) => {
        acc[cat.name] = cat.fill;
        return acc;
    }, {} as Record<string, string>);
  }, [categoryData]);
  
  const handleBarClick = useCallback((payload: any) => {
    if (payload && payload.name) {
      const newCategory = payload.name;
      setSelectedCategory(prev => (prev === newCategory ? null : newCategory));
      
      if (isMobile) { 
        const listElement = listRef.current;
        if (listElement) {
            const listTop = listElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: listTop - 120, behavior: 'smooth' }); // Adjust scroll offset
        }
      }
    }
  }, [isMobile]);
  
  const handleClearFilter = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const filteredAndSortedProposals = useMemo(() => {
    let result = [...proposals];

    if (selectedCategory) {
        result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        result = result.filter(p =>
            p.title.toLowerCase().includes(lowercasedTerm) ||
            p.description.toLowerCase().includes(lowercasedTerm) ||
            p.locations?.some(l => l.toLowerCase().includes(lowercasedTerm))
        );
    }

    const parseDate = (dateStr: string) => new Date(dateStr.split('/').reverse().join('-')).getTime();

    switch (sortOrder) {
        case 'date-asc':
            result.sort((a, b) => parseDate(a.protocolDate) - parseDate(b.protocolDate));
            break;
        case 'category-asc':
            result.sort((a, b) => a.category.localeCompare(b.category) || (parseDate(b.protocolDate) - parseDate(a.protocolDate)));
            break;
        case 'date-desc':
        default:
            // Data is pre-sorted, but we re-sort to be safe if other filters are applied
            result.sort((a, b) => parseDate(b.protocolDate) - parseDate(a.protocolDate));
            break;
    }
    return result;
  }, [proposals, selectedCategory, searchTerm, sortOrder]);


  const barLabelFormatter = (name: string): string => {
    const item = categoryData.find(d => d.name === name);
    if (!item || item.count === 0) return '';
    return `${item.count} (${item.percentage.toFixed(1)}%)`;
  };

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const categoryInfo = categoryData.find(d => d.name === payload.value);

    const handleClick = () => {
        if(categoryInfo){
            handleBarClick(categoryInfo);
        }
    };

    const label = payload.value;
    const truncatedLabel = isMobile && label.length > 18 ? `${label.substring(0, 16)}...` : label;
  
    return (
      <g transform={`translate(${x},${y})`} onClick={handleClick} className="cursor-pointer recharts-yAxis-clickable-tick">
        <title>{label}</title>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#9ca3af" fontSize={isMobile ? 10 : 12}>
          {truncatedLabel}
        </text>
      </g>
    );
  };
  
  const chartHeight = categoryData.length * (isMobile ? 35 : 40) + 30;

  return (
    <main className="flex flex-col gap-8 lg:gap-12">
        <section className="bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Indicações por Categoria</h2>
          <div style={{ width: '100%', height: chartHeight }}>
              <ResponsiveContainer>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={isMobile ? 120 : 200}
                    tick={<CustomYAxisTick />}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <Bar dataKey="percentage" isAnimationActive={false}>
                     <LabelList
                        dataKey="name"
                        position="right"
                        formatter={barLabelFormatter}
                        style={{ fill: 'white', fontSize: isMobile ? 10 : 12 }}
                      />
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        onClick={() => handleBarClick(entry)}
                        opacity={selectedCategory === null || selectedCategory === entry.name ? 1 : 0.3}
                        className="transition-all duration-300 cursor-pointer hover:brightness-125"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>
        </section>

        <section className="flex flex-col animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div ref={listRef}>
            <FilterControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>
          <div className="mb-4 min-h-[2rem] flex items-center">
              {selectedCategory && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                      <span>Filtrando por:</span>
                      <span style={{ backgroundColor: colorMap[selectedCategory] ? `${colorMap[selectedCategory]}20` : '#6b728020', color: colorMap[selectedCategory] || '#6b7280', borderColor: colorMap[selectedCategory] ? `${colorMap[selectedCategory]}50` : '#6b728050' }} className="text-xs font-semibold px-2.5 py-1 rounded-full border">
                        {selectedCategory}
                      </span>
                    </div>
                    <button
                        onClick={handleClearFilter}
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        Limpar filtro de categoria
                    </button>
                </div>
              )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Resultados ({filteredAndSortedProposals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" role="feed" key={selectedCategory + searchTerm + sortOrder}>
              {filteredAndSortedProposals.length > 0 ? (
                  filteredAndSortedProposals.map((proposal, index) => (
                      <ProposalCard key={proposal.id} proposal={proposal} index={index} color={colorMap[proposal.category] || '#6b7280'} />
                  ))
              ) : (
                  <div className="md:col-span-2 xl:col-span-3 text-center py-16 text-gray-500 bg-slate-800/50 rounded-xl">
                      <p className="text-lg font-semibold">Nenhuma proposta encontrada.</p>
                      <p>Tente ajustar sua busca ou limpar os filtros.</p>
                  </div>
              )}
          </div>
        </section>
      </main>
  );
}

export default Dashboard;
