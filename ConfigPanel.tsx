import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Bomb, Star } from "lucide-react";

interface ConfigPanelProps {
  mines: number;
  stars: number;
  onMinesChange: (value: number) => void;
  onStarsChange: (value: number) => void;
}

const ConfigPanel = ({ mines, stars, onMinesChange, onStarsChange }: ConfigPanelProps) => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-purple-500/20 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        Configurações
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-slate-300 flex items-center gap-2">
            <Bomb className="w-4 h-4 text-red-400" />
            Dificuldade (Minas): <span className="text-purple-400 font-bold">{mines}</span>
          </Label>
          <Slider
            value={[mines]}
            onValueChange={(value) => onMinesChange(value[0])}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>Fácil → Difícil</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-300 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Alvos (Estrelas): <span className="text-yellow-400 font-bold">{stars}</span>
          </Label>
          <Slider
            value={[stars]}
            onValueChange={(value) => onStarsChange(value[0])}
            min={1}
            max={25 - mines}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>Alvos desejados</span>
            <span>{25 - mines}</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400">
          <span className="text-purple-400">Probabilidade base:</span>{" "}
          {((25 - mines) / 25 * 100).toFixed(1)}% por célula
        </p>
      </div>
    </div>
  );
};

export default ConfigPanel;
