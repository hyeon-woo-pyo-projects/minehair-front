import React from 'react';

interface IconArrowUpProps {
    color?: string;
    height?: number;
    width?: number;
}

const IconArrowUp: React.FC<IconArrowUpProps> = ({ color = '#000', height = '20', width = '20' }) => (
    <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox='0 0 20 20'>
        <path fill={color} d="M0 15c0 0.128 0.049 0.256 0.146 0.354 0.195 0.195 0.512 0.195 0.707 0l8.646-8.646 8.646 8.646c0.195 0.195 0.512 0.195 0.707 0s0.195-0.512 0-0.707l-9-9c-0.195-0.195-0.512-0.195-0.707 0l-9 9c-0.098 0.098-0.146 0.226-0.146 0.354z"></path>
    </svg>

);

export default IconArrowUp;
