// Setup para testes Jest
import '@testing-library/jest-dom';

// Mock para APIs globais não disponíveis no JSDOM
global.fetch = jest.fn();

// Setup para cada teste
beforeEach(() => {
  // Limpar mocks
  jest.clearAllMocks();
  
  // Reset fetch mock
  fetch.mockClear();
});

// Configurações globais para testes
global.console = {
  ...console,
  // Suprimir logs em testes (opcional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
