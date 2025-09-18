import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Program } from '../types';
import { Info, Search } from 'lucide-react';

interface ProgramSelectionProps {
  programs: Program[];
  onSelect: (program: Program) => void;
}

const ProgramSelection: React.FC<ProgramSelectionProps> = ({ programs, onSelect }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');

  // Extract categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(programs.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [programs]);

  // Elastic-style filtering
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (p.subtitle?.toLowerCase().includes(query.toLowerCase()) ?? false);

      const matchesCategory = category === 'All' || p.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [programs, query, category]);

  return (
    <section
      style={{ fontFamily: 'Epilogue, sans-serif' }}
      className="bg-white p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto animate-fade-in"
    >
      {/* Header */}
      <header className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-brand-dark mb-2 tracking-tight">
          Select a Program
        </h2>
        <p className="text-lg text-gray-600">
          Search, filter, and choose a program to begin the eligibility verification process.
        </p>
      </header>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search programs (e.g. scholarship, housing, healthcare)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-gray-700"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-gray-700"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Program Cards */}
      {filteredPrograms.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <motion.div
              key={program.id}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 250, damping: 15 }}
              onClick={() => onSelect(program)}
              className="group cursor-pointer rounded-xl border border-gray-200 bg-gray-50 hover:border-brand-primary/70 shadow hover:shadow-xl transition-all flex flex-col"
            >
              <div className="flex flex-col items-center px-6 pt-8 pb-4 flex-1">
                <program.icon className="h-16 w-16 text-brand-primary mb-4 group-hover:text-indigo-600 transition-colors" />
                <h3 className="text-xl font-semibold text-brand-dark mb-1">
                  {program.name}
                </h3>

                {program.subtitle && (
                  <p className="text-sm text-gray-500 mb-2">{program.subtitle}</p>
                )}

                <p className="text-gray-600 text-center text-sm flex-1">
                  {program.description}
                </p>
              </div>

              <div className="px-6 pb-6">
                <button
                  className="w-full px-4 py-2 rounded-md bg-brand-primary text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition"
                >
                  Select Program
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No programs match your search or filter criteria.
        </p>
      )}

      {/* Footer Legend */}
      <footer className="mt-10 text-center text-sm text-gray-500 flex justify-center items-center gap-2">
        <Info className="w-4 h-4" />
        Click on a program card to view and start the eligibility check.
      </footer>
    </section>
  );
};

export default ProgramSelection;
