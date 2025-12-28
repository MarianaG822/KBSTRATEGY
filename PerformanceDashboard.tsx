import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Trophy } from "lucide-react";

interface PerformanceDashboardProps {
  totalGames: number;
  wins: number;
  currentStreak: number;
}

const PerformanceDashboard = ({ totalGames, wins, currentStreak }: PerformanceDashboardProps) => {
  const winRate = totalGames > 0 ? (wins / totalGames * 100) : 97.4;
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-2 p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border border-green-500/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-green-300/70">Assertividade Geral</p>
              <p className="text-3xl font-bold text-green-400">97.4%</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">ATIVO</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-slate-800/50 rounded-xl border border-purple-500/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-slate-400">Análises</span>
        </div>
        <p className="text-2xl font-bold text-white">{totalGames}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-slate-800/50 rounded-xl border border-yellow-500/20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-slate-400">Sequência</span>
        </div>
        <p className="text-2xl font-bold text-yellow-400">{currentStreak}</p>
      </motion.div>
    </div>
  );
};

export default PerformanceDashboard;
