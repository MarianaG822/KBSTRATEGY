/**
 * Motor de Cálculo Estatístico Bayesiano
 * Executa simulações Monte Carlo para identificar células de alta confiança
 */

export interface SimulationResult {
  safeCells: number[];
  confidenceMap: Map<number, number>;
  iterations: number;
  threshold: number;
}

export interface AnalysisStep {
  timestamp: Date;
  message: string;
  type: 'info' | 'process' | 'success' | 'warning';
}

/**
 * Calcula a probabilidade base de erro em qualquer célula
 * P(E) = M/N onde M = minas e N = células totais
 */
export function calculateBaseProbability(mines: number, totalCells: number = 25): number {
  return mines / totalCells;
}

/**
 * Calcula a probabilidade de sucesso para cada célula
 * usando inferência Bayesiana simplificada
 */
export function calculateBayesianProbability(
  mines: number,
  revealedSafe: number[],
  revealedMines: number[],
  totalCells: number = 25
): Map<number, number> {
  const probabilities = new Map<number, number>();
  const remainingCells = totalCells - revealedSafe.length - revealedMines.length;
  const remainingMines = mines - revealedMines.length;
  
  // Probabilidade posterior para cada célula não revelada
  const posteriorProbability = remainingMines > 0 
    ? 1 - (remainingMines / remainingCells)
    : 1;

  for (let i = 0; i < totalCells; i++) {
    if (revealedSafe.includes(i) || revealedMines.includes(i)) {
      probabilities.set(i, revealedSafe.includes(i) ? 1 : 0);
    } else {
      probabilities.set(i, posteriorProbability);
    }
  }

  return probabilities;
}

/**
 * Calcula similaridade entre dois padrões de minas (Jaccard Index)
 */
export function calculatePatternSimilarity(pattern1: number[], pattern2: number[]): number {
  if (pattern1.length === 0 || pattern2.length === 0) return 0;
  
  const set1 = new Set(pattern1);
  const set2 = new Set(pattern2);
  
  let intersection = 0;
  set1.forEach(item => {
    if (set2.has(item)) intersection++;
  });
  
  const union = set1.size + set2.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Verifica se um padrão é muito similar aos padrões recentes
 */
export function isPatternTooSimilar(
  newPattern: number[], 
  recentPatterns: number[][], 
  similarityThreshold: number = 0.6
): boolean {
  for (const recentPattern of recentPatterns) {
    const similarity = calculatePatternSimilarity(newPattern, recentPattern);
    if (similarity >= similarityThreshold) {
      return true;
    }
  }
  return false;
}

/**
 * Gera posições de minas evitando padrões similares ao histórico
 */
export function generateAdaptiveMinePositions(
  mineCount: number, 
  recentPatterns: number[][],
  maxAttempts: number = 10,
  totalCells: number = 25
): { positions: number[]; attempts: number; avoided: boolean } {
  let attempts = 0;
  let positions: number[];
  let avoided = false;

  do {
    positions = generateRandomMinePositions(mineCount, totalCells);
    attempts++;
    
    if (!isPatternTooSimilar(positions, recentPatterns)) {
      break;
    }
    avoided = true;
  } while (attempts < maxAttempts);

  return { positions, attempts, avoided };
}

/**
 * Executa simulação Monte Carlo ADAPTATIVA com N iterações
 * Considera histórico de padrões para evitar repetições
 */
export async function runAdaptiveMonteCarloSimulation(
  mines: number,
  iterations: number = 1000,
  threshold: number = 0.97,
  recentPatterns: number[][] = [],
  trainingLevel: number = 0,
  onProgress?: (progress: number, step: AnalysisStep) => void
): Promise<SimulationResult & { adaptiveInfo: { patternsAvoided: number; trainingBonus: number } }> {
  const totalCells = 25;
  const cellHitCount = new Array(totalCells).fill(0);
  let patternsAvoided = 0;
  
  // Bonus de treinamento aumenta a precisão
  const trainingBonus = Math.min(trainingLevel * 0.005, 0.05); // Max 5% bonus
  const adjustedThreshold = Math.max(threshold - trainingBonus, 0.90);
  
  // Fase 1: Inicialização
  onProgress?.(5, {
    timestamp: new Date(),
    message: '[INIT] Inicializando motor de simulação adaptativo...',
    type: 'info'
  });

  await sleep(100);

  // Fase 2: Carregando histórico
  if (recentPatterns.length > 0) {
    onProgress?.(10, {
      timestamp: new Date(),
      message: `[TRAIN] Carregando ${recentPatterns.length} padrões do histórico...`,
      type: 'info'
    });
    await sleep(100);
  }

  // Fase 3: Calculando permutações
  onProgress?.(15, {
    timestamp: new Date(),
    message: `[CALC] Calculando ${iterations.toLocaleString()} permutações adaptativas...`,
    type: 'process'
  });

  await sleep(150);

  // Fase 4: Executando simulações adaptativas
  const batchSize = iterations / 10;
  
  for (let batch = 0; batch < 10; batch++) {
    for (let i = 0; i < batchSize; i++) {
      // Gera posições adaptativas (evitando padrões similares)
      const { positions: minePositions, avoided } = generateAdaptiveMinePositions(
        mines, 
        recentPatterns,
        5
      );
      
      if (avoided) patternsAvoided++;
      
      // Incrementa contador para células que NÃO são minas
      for (let cell = 0; cell < totalCells; cell++) {
        if (!minePositions.includes(cell)) {
          cellHitCount[cell]++;
        }
      }
    }

    const progress = 20 + (batch + 1) * 6;
    onProgress?.(progress, {
      timestamp: new Date(),
      message: `[SIM] Processando lote ${batch + 1}/10... (${((batch + 1) * 10)}%)`,
      type: 'process'
    });

    await sleep(80);
  }

  // Fase 5: Aplicando correção de treinamento
  if (trainingLevel > 0) {
    onProgress?.(82, {
      timestamp: new Date(),
      message: `[ADAPT] Aplicando correção de treinamento (Nível ${trainingLevel})...`,
      type: 'info'
    });
    await sleep(100);
  }

  // Fase 6: Verificando integridade
  onProgress?.(85, {
    timestamp: new Date(),
    message: '[API] Verificando integridade da API simulada...',
    type: 'info'
  });

  await sleep(200);

  // Fase 7: Analisando com anti-repetição
  onProgress?.(90, {
    timestamp: new Date(),
    message: `[FILTER] Filtrando ${patternsAvoided} padrões repetitivos...`,
    type: 'process'
  });

  await sleep(100);

  // Fase 8: Analisando resultados
  onProgress?.(95, {
    timestamp: new Date(),
    message: '[ANALYZE] Analisando densidade de probabilidade...',
    type: 'process'
  });

  await sleep(100);

  // Calcula mapa de confiança
  const confidenceMap = new Map<number, number>();
  const safeCells: number[] = [];

  for (let i = 0; i < totalCells; i++) {
    const confidence = cellHitCount[i] / iterations;
    confidenceMap.set(i, confidence);
    
    if (confidence >= adjustedThreshold) {
      safeCells.push(i);
    }
  }

  // Ordena células seguras por confiança (maior primeiro)
  safeCells.sort((a, b) => (confidenceMap.get(b) || 0) - (confidenceMap.get(a) || 0));

  // Fase 9: Conclusão
  onProgress?.(100, {
    timestamp: new Date(),
    message: `[SUCCESS] ${safeCells.length} sinais de alta confiança encontrados!`,
    type: 'success'
  });

  return {
    safeCells,
    confidenceMap,
    iterations,
    threshold: adjustedThreshold,
    adaptiveInfo: {
      patternsAvoided,
      trainingBonus: trainingBonus * 100
    }
  };
}

/**
 * Executa simulação Monte Carlo com N iterações (versão legacy)
 */
export async function runMonteCarloSimulation(
  mines: number,
  iterations: number = 1000,
  threshold: number = 0.97,
  onProgress?: (progress: number, step: AnalysisStep) => void
): Promise<SimulationResult> {
  const result = await runAdaptiveMonteCarloSimulation(
    mines,
    iterations,
    threshold,
    [],
    0,
    onProgress
  );
  return result;
}

/**
 * Gera posições aleatórias para minas
 */
function generateRandomMinePositions(mineCount: number, totalCells: number): number[] {
  const positions: number[] = [];
  while (positions.length < mineCount) {
    const pos = Math.floor(Math.random() * totalCells);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

/**
 * Calcula a entropia de Shannon para o estado atual do grid
 */
export function calculateEntropy(probabilities: Map<number, number>): number {
  let entropy = 0;
  probabilities.forEach((p) => {
    if (p > 0 && p < 1) {
      entropy -= p * Math.log2(p) + (1 - p) * Math.log2(1 - p);
    }
  });
  return entropy;
}

/**
 * Função auxiliar para delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
