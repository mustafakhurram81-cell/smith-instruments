import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum: number) => (
        <button
            key={pageNum}
            onClick={() => {
                onPageChange(pageNum);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === pageNum
                ? 'bg-brand-orange text-white font-medium shadow-md shadow-brand-orange/20 scale-105'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:bg-gray-50'
                }`}
        >
            {pageNum}
        </button>
    );

    // Generate page numbers to show
    // Always show first, last, current, and neighbors
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

    // Insert ellipsis using a derived array
    const pagesWithEllipsis: (number | string)[] = [];
    pages.forEach((p, i) => {
        if (i > 0) {
            const prev = pages[i - 1];
            if (p - prev > 1) {
                pagesWithEllipsis.push('...');
            }
        }
        pagesWithEllipsis.push(p);
    });

    return (
        <div className="flex justify-center items-center gap-2 mt-16">
            <button
                onClick={() => {
                    onPageChange(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-brand-orange/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
                aria-label="Previous Page"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
                {pagesWithEllipsis.map((p, idx) => (
                    typeof p === 'number' ? (
                        renderPageButton(p)
                    ) : (
                        <span key={`ellipsis-${idx}`} className="text-stone-400 px-1 select-none">...</span>
                    )
                ))}
            </div>

            <button
                onClick={() => {
                    onPageChange(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-brand-orange/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-colors"
                aria-label="Next Page"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};
