import { motion } from "framer-motion";
import { Activity, Cpu, Database, Gauge } from "lucide-react";

interface StatsPanelProps {
  baseProbability: number;
  entropy: number;
  iterations: number;
  threshold: number;
}

const StatsPanel = ({ baseProbability, entropy, iterations, threshold }: StatsPanelProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-black/60 rounded-lg border border-cyan-500/30"
      >
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] mb-1">
          <Gauge className="w-3 h-3" />
          <span>P(ERROR)</span>
        </div>
        <p className="text-lg font-bold text-white">
          {(baseProbability * 100).toFixed(1)}%
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-3 bg-black/60 rounded-lg border border-purple-500/30"
      >
        <div className="flex items-center gap-2 text-purple-400 text-[10px] mb-1">
          <Activity className="w-3 h-3" />
          <span>ENTROPY</span>
        </div>
        <p className="text-lg font-bold text-white">
          {entropy.toFixed(2)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-3 bg-black/60 rounded-lg border border-green-500/30"
      >
        <div className="flex items-center gap-2 text-green-400 text-[10px] mb-1">
          <Cpu className="w-3 h-3" />
          <span>ITERATIONS</span>
        </div>
        <p className="text-lg font-bold text-white">
          {iterations.toLocaleString()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-3 bg-black/60 rounded-lg border border-yellow-500/30"
      >
        <div className="flex items-center gap-2 text-yellow-400 text-[10px] mb-1">
          <Database className="w-3 h-3" />
          <span>THRESHOLD</span>
        </div>
        <p className="text-lg font-bold text-white">
          {(threshold * 100).toFixed(0)}%
        </p>
      </motion.div>
    </div>
  );
};

export default StatsPanel;
