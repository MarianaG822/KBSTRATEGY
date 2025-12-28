import { motion } from "framer-motion";
import { Loader2, Wifi, Database, Cpu } from "lucide-react";

interface ScanningOverlayProps {
  progress: number;
  stage: string;
}

const ScanningOverlay = ({ progress, stage }: ScanningOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
    >
      <div className="space-y-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full" />
          <div 
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <Cpu className="absolute inset-0 m-auto w-8 h-8 text-purple-400" />
        </motion.div>

        <div className="space-y-2">
          <p className="text-purple-300 font-medium">{stage}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>Processando dados...</span>
          </div>
        </div>

        <div className="w-64 space-y-2">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{progress}%</span>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Análise RNG</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-8 bg-purple-500/50 rounded-full"
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ScanningOverlay;
