import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { loadGame, saveGame, trackVisit, trackUser, trackReturn } from '../lib/storage';

const GameContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_SYMBOL': {
      const { symbolId, answer, tags } = action;
      const alreadyDone = state.completedSymbols.includes(symbolId);
      const completedSymbols = alreadyDone
        ? state.completedSymbols
        : [...state.completedSymbols, symbolId];
      const scrollEntries = { ...state.scrollEntries, [symbolId]: answer };
      const chosenOptions = tags
        ? { ...state.chosenOptions, [symbolId]: tags }
        : state.chosenOptions;
      return { ...state, completedSymbols, scrollEntries, chosenOptions, currentSymbol: null };
    }
    case 'SET_CURRENT_SYMBOL':
      return { ...state, currentSymbol: action.symbolId };
    case 'CLEAR_CURRENT_SYMBOL':
      return { ...state, currentSymbol: null };
    case 'RESET':
      return { completedSymbols: [], scrollEntries: {}, chosenOptions: {}, currentSymbol: null };
    default:
      return state;
  }
}

const DEFAULT_STATE = { completedSymbols: [], scrollEntries: {}, chosenOptions: {}, currentSymbol: null };

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const saved = loadGame();
    // Merge with default to handle old saves lacking chosenOptions
    return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
  });

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  // tags = { covenTag, typeTag } — passed from Screen3 on option selection
  const completeSymbol = (symbolId, answer, tags) => {
    const isFirst = state.completedSymbols.length === 0;
    if (isFirst) trackUser();
    if (state.completedSymbols.length > 0 && !state.completedSymbols.includes(symbolId)) {
      trackReturn();
    }
    dispatch({ type: 'COMPLETE_SYMBOL', symbolId, answer, tags });
  };

  const setCurrentSymbol = (symbolId) => dispatch({ type: 'SET_CURRENT_SYMBOL', symbolId });
  const clearCurrentSymbol = () => dispatch({ type: 'CLEAR_CURRENT_SYMBOL' });
  const resetGame = () => dispatch({ type: 'RESET' });

  return (
    <GameContext.Provider value={{ state, completeSymbol, setCurrentSymbol, clearCurrentSymbol, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
