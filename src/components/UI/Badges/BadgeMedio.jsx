import React from 'react';

const BadgeMedio = ({medio, compact = false}) => {
  const customClassName =
    medio === 'WhatsApp'
      ? 'bg-green-100 text-green-600'
      : medio === 'Formulario'
        ? 'bg-blue-100 text-blue-600'
        : 'bg-red-100 text-red-600';

  if (compact) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customClassName}`}
      >
        {medio}
      </span>
    );
  }

  return (
    <div
      className={`flex justify-center item-center px-3 py-2 rounded-lg ${customClassName}`}
    >
      <p className="font-bold text-center">{medio}</p>
    </div>
  );
};

export default BadgeMedio;