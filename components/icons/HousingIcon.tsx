
import React from 'react';

const HousingIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5A2.25 2.25 0 0021 18.75V9.574c0-.53-.261-1.023-.7-1.357l-7.5-6.326a2.25 2.25 0 00-2.6 0l-7.5 6.326A2.25 2.25 0 003 9.574V18.75A2.25 2.25 0 005.25 21h4.5m0 0v-4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

export default HousingIcon;
