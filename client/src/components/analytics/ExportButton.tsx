// components/ExportButton.tsx
import React from 'react';

interface ExportButtonProps {
    onClick: () => void;
    label?: string; // opcionalno, default je "Export to PDF"
    classname?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, label = "Export to PDF", classname }) => {
    return (
        <button
            onClick={onClick}
            className={`
        rounded-2xl p-4 text-center font-semibold transition-all duration-300
        border border-white/10 backdrop-blur-xl
        active:bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)]
        text-white shadow-lg scale-[1.03]
        bg-white/5 text-white/60 hover:text-white hover:-translate-y-1
        ${classname}`}
        >
            {label}
        </button>
    );
};

export default ExportButton;
