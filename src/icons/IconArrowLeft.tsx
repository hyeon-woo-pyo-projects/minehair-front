import React from 'react';

interface IconArrowLeftProps {
    color?: string;
    height?: number;
    width?: number;
}

const IconArrowLeft: React.FC<IconArrowLeftProps> = ({ color = '#000', height = '20', width = '20' }) => (
    <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox='0 0 20 20'>
        <path fill={color} d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path>
    </svg>

);

export default IconArrowLeft;
