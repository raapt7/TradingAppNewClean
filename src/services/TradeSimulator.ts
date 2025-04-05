import { EventEmitter } from 'events';

export interface MarketData {
  symbol: string;
  currentPrice: number;
  lastPrice: number;
  volume: number;
  timestamp: Date;
}

export interface TradeSetup {
  symbol: string;
  type: 'CALL' | 'PUT';
  strike: number;
  expiry: string;
  entry: number;
  stopLoss: number;
  target: number;
  probability: number;
  setup: string;
  analysis: string;
}

export interface ActiveTrade extends TradeSetup {
  id: string;
  entryTime: Date;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
  status: 'entering' | 'active' | 'exiting' | 'completed';
  exitReason?: string;
  exitTime?: Date;
}

export interface CompletedTrade extends ActiveTrade {
  exitTime: Date;
  lessons: string;
}

class TradeSimulator extends EventEmitter {
  private marketData: Map<string, MarketData> = new Map();
  private activeTrades: Map<string, ActiveTrade> = new Map();
  private completedTrades: CompletedTrade[] = [];
  private simulationInterval: number | null = null;
  private volatility: number = 0.002; // 0.2% base volatility
  private lastUpdateTime: number = 0;
  private updating: boolean = false;

  constructor() {
    super();
    this.initializeMarketData();
    this.startSimulation();
  }

  private initializeMarketData() {
    const initialData: [string, number][] = [
      ['AAPL', 175.50],
      ['TSLA', 185.20],
      ['NVDA', 880.30],
      ['META', 505.40],
      ['MSFT', 425.60],
    ];

    initialData.forEach(([symbol, price]) => {
      this.marketData.set(symbol, {
        symbol,
        currentPrice: price,
        lastPrice: price,
        volume: Math.random() * 1000000,
        timestamp: new Date(),
      });
    });
  }

  private generateTradeLesson(trade: ActiveTrade): string {
    const isWin = trade.profitLoss > 0;
    const exitType = trade.exitReason?.toLowerCase().includes('target') ? 'target' : 'stop';
    
    if (isWin) {
      return exitType === 'target'
        ? 'Patience and discipline paid off. The setup played out exactly as anticipated.'
        : 'Quick to recognize strength and rode the momentum. Good trade management.';
    } else {
      return exitType === 'stop'
        ? 'Protected capital by honoring stop loss. Market conditions changed - better opportunities ahead.'
        : 'Market didn\'t follow through. Important to stay mechanical with exits.';
    }
  }

  public startSimulation() {
    if (this.simulationInterval) return;
    this.lastUpdateTime = Date.now();
    this.updating = true;
    
    const updateSimulation = () => {
      if (!this.updating) return;
      
      const now = Date.now();
      if (now - this.lastUpdateTime >= 1000) {
        this.lastUpdateTime = now;
        
        // Update market data
        this.marketData.forEach((data, symbol) => {
          const change = (Math.random() - 0.5) * 2 * this.volatility;
          const newPrice = data.currentPrice * (1 + change);
  
          this.marketData.set(symbol, {
            ...data,
            lastPrice: data.currentPrice,
            currentPrice: Number(newPrice.toFixed(2)),
            volume: data.volume + Math.random() * 10000,
            timestamp: new Date(),
          });
  
          this.emit('priceUpdate', symbol, this.marketData.get(symbol));
        });
  
        // Update active trades
        this.activeTrades.forEach((trade, id) => {
          const marketData = this.marketData.get(trade.symbol);
          if (!marketData) return;
  
          const newPrice = marketData.currentPrice;
          const pl = trade.type === 'CALL' 
            ? newPrice - trade.entry 
            : trade.entry - newPrice;
          const plPercent = (pl / trade.entry) * 100;
  
          // Check for exit conditions
          if (trade.status === 'active') {
            if (trade.type === 'CALL') {
              if (newPrice <= trade.stopLoss) {
                trade.status = 'exiting';
                trade.exitReason = 'Stop loss hit';
              } else if (newPrice >= trade.target) {
                trade.status = 'exiting';
                trade.exitReason = 'Target reached';
              }
            } else {
              if (newPrice >= trade.stopLoss) {
                trade.status = 'exiting';
                trade.exitReason = 'Stop loss hit';
              } else if (newPrice <= trade.target) {
                trade.status = 'exiting';
                trade.exitReason = 'Target reached';
              }
            }
          }
  
          // Handle trade exit
          if (trade.status === 'exiting') {
            // First update the trade to completed status
            const completedTrade: CompletedTrade = {
              ...trade,
              status: 'completed',
              currentPrice: newPrice,
              profitLoss: Number(pl.toFixed(2)),
              profitLossPercent: Number(plPercent.toFixed(2)),
              exitTime: new Date(),
              lessons: this.generateTradeLesson(trade),
            };
  
            // Emit trade update for the active trades screen
            this.emit('tradeUpdate', completedTrade);
  
            // After a delay, emit trade completed to trigger the transition
            setTimeout(() => {
              this.completedTrades.push(completedTrade);
              this.emit('tradeCompleted', completedTrade);
              this.activeTrades.delete(id);
  
              // After the trade is removed from active trades, emit an event for the journal
              setTimeout(() => {
                this.emit('tradeJournalUpdate', completedTrade);
              }, 2000); // Delay to allow for fade-out animation
            }, 2000);
  
            return;
          }
  
          const updatedTrade: ActiveTrade = {
            ...trade,
            currentPrice: newPrice,
            profitLoss: Number(pl.toFixed(2)),
            profitLossPercent: Number(plPercent.toFixed(2)),
          };
  
          this.activeTrades.set(id, updatedTrade);
          this.emit('tradeUpdate', updatedTrade);
        });
      }
      
      // Schedule next update with requestAnimationFrame
      this.simulationInterval = requestAnimationFrame(updateSimulation);
    };
    
    // Start the animation loop
    this.simulationInterval = requestAnimationFrame(updateSimulation);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      cancelAnimationFrame(this.simulationInterval);
      this.simulationInterval = null;
      this.updating = false;
    }
  }

  public getMarketData(symbol: string): MarketData | undefined {
    return this.marketData.get(symbol);
  }

  public getAllMarketData(): MarketData[] {
    return Array.from(this.marketData.values());
  }

  public executeTrade(setup: TradeSetup): ActiveTrade {
    const id = Math.random().toString(36).substring(7);
    const marketData = this.marketData.get(setup.symbol);
    
    if (!marketData) {
      throw new Error(`No market data available for ${setup.symbol}`);
    }

    const trade: ActiveTrade = {
      ...setup,
      id,
      entryTime: new Date(),
      currentPrice: marketData.currentPrice,
      profitLoss: 0,
      profitLossPercent: 0,
      status: 'entering',
    };

    this.activeTrades.set(id, trade);
    this.emit('tradeUpdate', trade);

    // Simulate entry delay
    setTimeout(() => {
      trade.status = 'active';
      this.activeTrades.set(id, trade);
      this.emit('tradeUpdate', trade);
    }, 1000);

    return trade;
  }

  public getActiveTrades(): ActiveTrade[] {
    return Array.from(this.activeTrades.values());
  }

  public getCompletedTrades(): CompletedTrade[] {
    return this.completedTrades;
  }

  public setVolatility(level: 'low' | 'medium' | 'high') {
    switch (level) {
      case 'low':
        this.volatility = 0.001;
        break;
      case 'medium':
        this.volatility = 0.002;
        break;
      case 'high':
        this.volatility = 0.004;
        break;
    }
  }
}

// Create a singleton instance
export const tradeSimulator = new TradeSimulator(); 