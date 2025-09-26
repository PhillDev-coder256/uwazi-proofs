// BankIcon
import React from 'react';

const BankIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.688C21.403 4.144 23 4.953 23 6v2H1V6c0-1.047 1.597-1.856 2.917-2.312C6.545 3.232 9.245 3 12 3zM4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h.01M12 14h.01M16 14h.01M9 18h6" />
    </svg>
);

export default BankIcon;