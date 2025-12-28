import { motion } from "framer-motion";
import { Star, Bomb, Target } from "lucide-react";

interface MinesGridProps {
  grid: ('hidden' | 'star' | 'mine' | 'suggested')[];
  onCellClick: (index: number) => void;
  suggestedCells: number[];
  confidenceMap: Map<number, number>;
  isScanning: boolean;
  scanIndex: number;
  isMarkingMode?: boolean;
  markedMines?: number[];
}

const MinesGrid = ({ 
  grid, 
  onCellClick, 
  suggestedCells, 
  confidenceMap, 
  isScanning, 
  scanIndex,
  isMarkingMode = false,
  markedMines = []
}: MinesGridProps) => {
  return (
    <div className={`grid grid-cols-5 gap-2 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border shadow-[0_0_30px_rgba(139,92,246,0.3)] ${isMarkingMode ? 'border-yellow-500/50' : 'border-purple-500/30'}`}>
      {grid.map((cell, index) => {
        const isSuggested = suggestedCells.includes(index);
        const confidence = confidenceMap.get(index) || 0;
        const isBeingScanned = isScanning && index <= scanIndex;
        const isMarkedAsMine = markedMines.includes(index);
        
        return (
          <motion.button
            key={index}
            onClick={() => onCellClick(index)}
            className={`
              relative aspect-square rounded-lg font-bold text-lg transition-all duration-300 font-mono
              ${isMarkingMode
                ? isMarkedAsMine
                  ? 'bg-gradient-to-br from-red-600 to-red-700 ring-2 ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-gradient-to-br from-yellow-600/80 to-orange-700/80 hover:from-yellow-500 hover:to-orange-600 cursor-crosshair'
                : cell === 'hidden' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/50' 
                  : cell === 'star' 
                    ? 'bg-gradient-to-br from-yellow-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                    : 'bg-gradient-to-br from-red-600 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              }
              ${isSuggested && cell === 'hidden' && !isMarkingMode ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900' : ''}
              ${isBeingScanned && cell === 'hidden' ? 'animate-pulse ring-1 ring-cyan-400' : ''}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: isBeingScanned ? '0 0 15px rgba(34,211,238,0.6)' : undefined
            }}
            transition={{ 
              delay: index * 0.02
            }}
          >
            {/* Marking mode indicator */}
            {isMarkingMode && isMarkedAsMine && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Target className="w-8 h-8 text-red-200" />
              </motion.div>
            )}

            {/* Scan effect overlay */}
            {isBeingScanned && cell === 'hidden' && !isMarkingMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg"
              />
            )}

            {cell === 'star' && !isMarkingMode && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Star className="w-8 h-8 text-yellow-200 fill-yellow-300 drop-shadow-lg" />
              </motion.div>
            )}
            
            {cell === 'mine' && !isMarkingMode && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Bomb className="w-8 h-8 text-red-200" />
              </motion.div>
            )}
            
            {isSuggested && cell === 'hidden' && !isScanning && !isMarkingMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span className="text-green-300 text-lg font-bold">✓</span>
                <span className="text-[8px] text-green-400/80">
                  {(confidence * 100).toFixed(0)}%
                </span>
              </motion.div>
            )}

            {/* Cell coordinate label */}
            {!isMarkedAsMine && cell === 'hidden' && !isSuggested && !isBeingScanned && (
              <span className="absolute bottom-0.5 right-1 text-[8px] text-blue-300/40 font-mono">
                {Math.floor(index / 5)},{index % 5}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MinesGrid;
