import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectSearchProps {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export function SelectSearch({
  options,
  value,
  onChange,
  placeholder = 'Pilih salah satu...',
  searchPlaceholder = 'Cari...',
  className = '',
}: SelectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
      >
        <span className={selectedOption ? 'text-slate-200' : 'text-slate-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          <div className="p-2">
            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 px-2 py-2">
              <Search size={14} className="text-slate-500" />
              <input
                type="text"
                className="ml-2 w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-1 text-sm text-slate-200">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-slate-500">Tidak ditemukan.</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-800 ${
                    value === option.value ? 'bg-slate-800 text-indigo-400' : ''
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
