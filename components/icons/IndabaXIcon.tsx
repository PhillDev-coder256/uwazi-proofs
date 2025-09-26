import React from 'react';

const IndabaxIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    {/* Speaker head */}
    <circle cx="12" cy="6" r="2" />
    {/* Podium */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8v4H8z"
    />
    {/* Microphone stand */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14v6"
    />
    {/* Audience heads */}
    <circle cx="6" cy="18" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
  </svg>
);

export default IndabaxIcon;
