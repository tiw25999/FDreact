import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    allowCustomInput?: boolean;
}

export default function CustomSelect({ options, value, onChange, placeholder = "Select...", className = "", allowCustomInput = false }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<Option | null>(
        options.find(option => option.value === value) || null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const option = options.find(option => option.value === value);
        setSelectedOption(option || null);
    }, [value, options]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onChange(option.value);
        setSearchTerm('');
        if (!allowCustomInput) {
            setIsOpen(false);
        }
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);
        
        if (allowCustomInput) {
            // If custom input is allowed, update the value immediately
            onChange(inputValue);
        }
        
        if (!isOpen) {
            setIsOpen(true);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        if (!allowCustomInput) {
            setSearchTerm('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            if (!allowCustomInput) {
                setSearchTerm('');
            }
        }
    };

    return (
        <div className={`relative z-[100] ${className}`} ref={dropdownRef} style={{ isolation: 'isolate' }}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={allowCustomInput ? value : (isOpen ? searchTerm : (selectedOption ? selectedOption.label : ''))}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-10"
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            
            {isOpen && (
                <div className="absolute z-[999999] w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden" style={{ isolation: 'isolate' }}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
                                    selectedOption?.value === option.value 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'text-gray-900 hover:text-blue-600'
                                }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
