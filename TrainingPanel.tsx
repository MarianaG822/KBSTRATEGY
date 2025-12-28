import { motion } from "framer-motion";
import { Brain, Database, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrainingPanelProps {
  trainingLevel: number;
  trainingProgress: number;
  totalEntries: number;
  isMarkingMode: boolean;
  markedMines: number[];
  expectedMines: number;
  onToggleMarkingMode: () => void;
  onConfirmMarks: () => void;
  onClearHistory: () => void;
}

const TrainingPanel = ({
  trainingLevel,
  trainingProgress,
  totalEntries,
  isMarkingMode,
  markedMines,
  expectedMines,
  onToggleMarkingMode,
  onConfirmMarks,
  onClearHistory
}: TrainingPanelProps) => {
  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-green-400';
    if (level >= 5) return 'text-yellow-400';
    if (level >= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  const getLevelLabel = (level: number) => {
    if (level >= 8) return 'EXPERT';
    if (level >= 5) return 'AVANÇADO';
    if (level >= 2) return 'INTERMEDIÁRIO';
    return 'INICIANTE';
  };

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-cyan-500/20 font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 text-cyan-400">
        <Brain className="w-4 h-4" />
        <span className="text-xs font-bold tracking-wider">TREINAMENTO DO ROBÔ</span>
      </div>

      {/* Training Level Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Nível de Treinamento</span>
          <span className={`font-bold ${getLevelColor(trainingLevel)}`}>
            {trainingLevel}/10 • {getLevelLabel(trainingLevel)}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trainingProgress}%` }}
            className="absolute h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500"
            style={{
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
            }}
          />
          {/* Level markers */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-slate-600"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0 amostras</span>
          <span className="text-cyan-400">{totalEntries} registros</span>
          <span>50 amostras</span>
        </div>
      </div>

      {/* Database info */}
      <div className="flex items-center gap-2 p-2 bg-black/40 rounded-lg text-[10px]">
        <Database className="w-3 h-3 text-green-400" />
        <span className="text-slate-400">localStorage:</span>
        <span className="text-green-400">{totalEntries} padrões salvos</span>
      </div>

      {/* Marking Mode */}
      {isMarkingMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30 space-y-2"
        >
          <p className="text-xs text-yellow-400">
            Clique nas células onde as BOMBAS estavam:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              {markedMines.length}/{expectedMines} marcadas
            </span>
            {markedMines.length === expectedMines && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isMarkingMode ? (
          <Button
            onClick={onToggleMarkingMode}
            variant="outline"
            size="sm"
            className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 text-xs"
          >
            <Brain className="w-3 h-3 mr-2" />
            MARCAR BOMBAS REAIS
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={onConfirmMarks}
              disabled={markedMines.length !== expectedMines}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-500 text-xs disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              CONFIRMAR ({markedMines.length}/{expectedMines})
            </Button>
            <Button
              onClick={onToggleMarkingMode}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-400 hover:bg-slate-700"
            >
              CANCELAR
            </Button>
          </div>
        )}

        {totalEntries > 0 && !isMarkingMode && (
          <Button
            onClick={onClearHistory}
            variant="ghost"
            size="sm"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 text-[10px]"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            LIMPAR HISTÓRICO
          </Button>
        )}
      </div>

      {/* Training bonus info */}
      {trainingLevel > 0 && (
        <div className="text-[10px] text-slate-500 p-2 bg-slate-900/50 rounded">
          <span className="text-purple-400">Bônus ativo:</span> +{Math.min(trainingLevel * 0.5, 5).toFixed(1)}% precisão
        </div>
      )}
    </div>
  );
};

export default TrainingPanel;
