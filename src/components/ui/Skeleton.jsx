import React from 'react';

// Skeleton base component
const Skeleton = ({ className = '', children }) => (
  <div className={`animate-pulse bg-slate-800 rounded ${className}`}>
    {children}
  </div>
);

// SkeletonCard para ClientList
export const SkeletonCard = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
    {/* Header */}
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-10 h-10 rounded" />
        <Skeleton className="w-10 h-10 rounded" />
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>

    {/* Total y Estado */}
    <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
      <div>
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>

    {/* Fecha */}
    <div className="mb-3">
      <Skeleton className="h-3 w-24 mb-1" />
      <Skeleton className="h-4 w-32" />
    </div>

    {/* Acciones */}
    <div className="flex gap-2">
      <Skeleton className="flex-1 h-10 rounded" />
      <Skeleton className="flex-1 h-10 rounded" />
      <Skeleton className="w-16 h-10 rounded" />
    </div>
  </div>
);

// SkeletonTableRow para tabla de clientes
export const SkeletonTableRow = () => (
  <tr className="border-b border-slate-800">
    <td className="px-6 py-4">
      <Skeleton className="h-5 w-32 mb-1" />
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-28 mb-1" />
      <Skeleton className="h-3 w-20" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-6 w-24 rounded-full" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-5 w-20" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-6 w-20 rounded-full" />
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </td>
  </tr>
);

// Skeleton para estadísticas del Dashboard
export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-slate-800 p-6 rounded-xl">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Skeleton para chart del Dashboard
export const SkeletonChart = () => (
  <div className="bg-slate-800 p-6 rounded-xl">
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-64 w-full rounded" />
  </div>
);

// Skeleton para formulario
export const SkeletonForm = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
    <div>
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-24 w-full rounded" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-10 w-24 rounded" />
      <Skeleton className="h-10 w-20 rounded" />
    </div>
  </div>
);

// Skeleton para sidebar
export const SkeletonSidebar = () => (
  <div className="w-64 bg-slate-900 h-screen p-4">
    <div className="mb-8">
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
    <nav className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </nav>
  </div>
);

// Skeleton para header
export const SkeletonHeader = () => (
  <div className="bg-slate-800 border-b border-slate-700 p-4">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Loading spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-slate-600 border-t-indigo-500 ${sizeClasses[size]} ${className}`} />
  );
};

// Loading overlay
export const LoadingOverlay = ({ message = 'Cargando...' }) => (
  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mx-auto mb-4" />
      <p className="text-slate-300">{message}</p>
    </div>
  </div>
);

// Skeleton para lista genérica
export const SkeletonList = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-slate-800 rounded">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    ))}
  </div>
);

// Skeleton para tabla genérica
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="bg-slate-800 rounded-xl overflow-hidden">
    {/* Header */}
    <div className="border-b border-slate-700 p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-slate-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
