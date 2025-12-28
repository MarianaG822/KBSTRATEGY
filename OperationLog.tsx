import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";
import { AnalysisStep } from "@/lib/probabilityEngine";

interface OperationLogProps {
  logs: AnalysisStep[];
  isActive: boolean;
}

const OperationLog = ({ logs, isActive }: OperationLogProps) => {
  const getIcon = (type: AnalysisStep['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-400" />;
      case 'process':
        return <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />;
      default:
        return <Info className="w-3 h-3 text-purple-400" />;
    }
  };

  const getColor = (type: AnalysisStep['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'process':
        return 'text-cyan-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/80 rounded-xl border border-green-500/30 overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-green-900/30 border-b border-green-500/30">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-xs text-green-400 font-bold tracking-wider">OPERATION_LOG</span>
        {isActive && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-green-500">LIVE</span>
          </span>
        )}
      </div>

      {/* Log content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[11px] scrollbar-thin scrollbar-thumb-green-500/30">
        <AnimatePresence mode="popLayout">
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 p-2"
            >
              {'>'} Aguardando comando...
              <span className="animate-pulse">_</span>
            </motion.div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className={`flex items-start gap-2 p-1 rounded ${getColor(log.type)}`}
              >
                <span className="mt-0.5 flex-shrink-0">{getIcon(log.type)}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-[9px]">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <p className="break-words leading-tight">{log.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 bg-slate-900/50 border-t border-green-500/20 text-[10px] text-slate-500">
        <div className="flex justify-between">
          <span>ENTRIES: {logs.length}</span>
          <span>MEM: {(Math.random() * 50 + 20).toFixed(1)}MB</span>
        </div>
      </div>
    </div>
  );
};

export default OperationLog;
