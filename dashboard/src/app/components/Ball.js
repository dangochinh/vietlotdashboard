export default function Ball({ num, isSpecial, className = '', onClick }) {
    if (!num) return null;
    const isRed = parseInt(num) > 40;
    return (
        <div 
          onClick={onClick}
          className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_4px_6px_rgba(0,0,0,0.3)] 
      ${isSpecial ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : isRed ? 'bg-gradient-to-br from-red-500 to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-700'} 
      transition-all transform border-2 border-white/20 
      ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg active:scale-95' : 'hover:scale-110'} 
      ${className}`}
        >
            {num}
        </div>
    );
}
