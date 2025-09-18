
import React from 'react';

const QrCodeIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5 text-gray-400' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h-1m-2-11h1v1h-1v-1zm-1 0h-1v1h1v-1zm-2 0h-1v1h1v-1zm-1 0H9v1h1v-1zm7 4h1v1h-1v-1zm0 2h-1v1h1v-1zm-2-4h-1v1h1v-1zm-1-2h-1v1h1v-1zm-2 0h-1v1h1v-1zm-1 0h-1v1h1v-1zm-1 2h-1v1h1v-1zm-1 0h-1v1h1v-1zm-2 2h-1v1h1v-1zm-1-2h-1v1h1v-1zm-2 0h-1v1h1v-1zm-1 0H9v1h1v-1zm-1 2H8v1h1v-1zm-1 0H6v1h1v-1zm-1 2H5v1h1v-1zm-1 0H3v1h1v-1zm14 2h1v1h-1v-1zm-2-2h1v1h-1v-1zm-1 0h1v1h-1v-1zm-1 2h1v1h-1v-1zm-2 0h1v1h-1v-1zm-2 0h1v1h-1v-1zm-2 2h1v1h-1v-1zm-2 0h1v1h-1v-1zm-1-2h1v1h-1v-1zm-2-2h1v1h-1v-1zm-1 2h1v1h-1v-1zm-1 0h1v1h-1v-1zm-1-2h1v1h-1v-1zm-1 0h1v1h-1v-1z"/>
    </svg>
);

export default QrCodeIcon;
   