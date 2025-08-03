import React from 'react';
import { Proposal } from '../types';
import { CalendarIcon, DocumentIcon, LocationIcon } from './icons';

interface ProposalCardProps {
    proposal: Proposal;
    index: number;
    color: string;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, index, color }) => {
    const hexToRgba = (hex: string, alpha: number): string => {
        if (!hex || hex.length < 7) hex = '#6b7280'; // gray-500 fallback
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const tagStyle = {
        backgroundColor: hexToRgba(color, 0.15),
        color: color,
        borderColor: hexToRgba(color, 0.3),
    };

    return (
        <div
            className="bg-slate-800 rounded-lg p-5 shadow-lg flex flex-col justify-between animate-fade-in-up transition-transform duration-300 hover:transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
            role="article"
            aria-labelledby={`proposal-title-${proposal.id}`}
        >
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <h3 id={`proposal-title-${proposal.id}`} className="text-lg font-bold text-blue-400 pr-2 order-2 sm:order-1">{proposal.title}</h3>
                    <span style={tagStyle} className="text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap order-1 sm:order-2">
                        {proposal.category}
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{proposal.description}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-700/70 space-y-3">
                 {proposal.locations && proposal.locations.length > 0 && (
                    <div>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                            <LocationIcon className="h-5 w-5 mr-2 text-violet-400 flex-shrink-0" />
                            <span className="font-medium">Locais Mencionados:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {proposal.locations.map((location, i) => (
                                <span key={i} className="bg-slate-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-md">
                                    {location}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-400 flex-wrap gap-y-2">
                    <span className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-teal-400" />
                        <span>{proposal.protocolDate}</span>
                    </span>
                    {proposal.pdfUrl && (
                        <a
                            href={proposal.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-medium text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <DocumentIcon className="h-5 w-5 mr-1" />
                            Ver Documento
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProposalCard;
