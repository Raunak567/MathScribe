import React from 'react';

export const Input = ({ type = 'text', value, onChange, placeholder = '', className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
};