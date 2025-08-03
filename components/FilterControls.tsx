import React from 'react';
import { SearchIcon, XCircleIcon } from './icons';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOrder: string;
  onSortChange: (order: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ searchTerm, onSearchChange, sortOrder, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow has-content">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por título, descrição ou local..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 rounded-md bg-slate-700 text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Pesquisar propostas"
        />
         {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center clear-search-btn"
            aria-label="Limpar pesquisa"
          >
            <XCircleIcon className="h-5 w-5 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>
      <div className="flex-shrink-0">
         <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto py-2 pl-3 pr-8 rounded-md bg-slate-700 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ordenar propostas por"
          >
            <option value="date-desc">Mais Recentes</option>
            <option value="date-asc">Mais Antigas</option>
            <option value="category-asc">Categoria (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
