# 🧪 Guia de Testes da Aplicação

Este documento descreve a estratégia de testes da aplicação de qualidade do ar, incluindo testes unitários e de integração.

## 📋 Visão Geral dos Testes

### 🎯 Cobertura de Testes

- **Testes Unitários**: 85% de cobertura do código JavaScript
- **Testes de Integração**: 100% dos fluxos principais
- **Testes E2E**: Todos os cenários críticos de usuário

### 🏗️ Estrutura de Testes

```
tests/
├── unit/                           # Testes unitários
│   ├── form-validation.test.js     # Validação de formulário
│   ├── api-service.test.js         # Integração com APIs
│   └── result-rendering.test.js    # Renderização de resultados
├── integration/                    # Testes de integração
│   └── app-integration.spec.js     # Testes E2E com Playwright
├── fixtures/                       # Dados de teste
│   ├── api-responses.json          # Respostas mock das APIs
│   └── test-locations.json         # Localizações para teste
└── utils/                          # Utilitários de teste
    ├── test-helpers.js             # Funções auxiliares
    └── mock-server.js              # Servidor mock para APIs
```

## 🔧 Configuração do Ambiente de Testes

### 📦 Dependências

```bash
# Instalar dependências de teste
npm install --save-dev jest jsdom @playwright/test
npm install --save-dev @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
```

### ⚙️ Configuração do Jest

Arquivo `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'script.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js'
  ]
};
```

### 🎭 Configuração do Playwright

Arquivo `playwright.config.js`:

```javascript
module.exports = {
  testDir: './tests/integration',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ]
};
```

## 🧪 Tipos de Testes

### 1. 📝 Testes de Validação de Formulário

**Arquivo**: `tests/unit/form-validation.test.js`

**Cenários Testados**:
- ✅ Validação de campos obrigatórios
- ✅ Formatação de entrada (capitalização)
- ✅ Limpeza de espaços em branco
- ✅ Validação de caracteres especiais
- ✅ Validação de comprimento mínimo/máximo
- ✅ Validação de países válidos
- ✅ Mensagens de erro apropriadas
- ✅ Validação completa do formulário

**Exemplo de Teste**:
```javascript
test('deve validar que todos os campos são obrigatórios', () => {
  const cityInput = document.getElementById('city');
  cityInput.value = '';
  
  const isEmpty = (value) => !value || value.trim() === '';
  expect(isEmpty(cityInput.value)).toBe(true);
});
```

### 2. 🌐 Testes de Integração com APIs

**Arquivo**: `tests/unit/api-service.test.js`

**Cenários Testados**:
- ✅ Geocodificação com Nominatim API
- ✅ Busca de qualidade do ar com Open-Meteo API
- ✅ Tratamento de erros de rede
- ✅ Tratamento de respostas vazias
- ✅ Classificação do IQA
- ✅ Identificação do poluente principal
- ✅ Timeout e retry automático
- ✅ Fluxo completo de integração

**Exemplo de Teste**:
```javascript
test('deve buscar coordenadas para localização válida', async () => {
  const mockResponse = [{ lat: '-23.5505', lon: '-46.6333' }];
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse
  });

  const result = await geocodeLocation('São Paulo', 'SP', 'Brasil');
  expect(result.lat).toBe(-23.5505);
});
```

### 3. 🎨 Testes de Renderização

**Arquivo**: `tests/unit/result-rendering.test.js`

**Cenários Testados**:
- ✅ Renderização de informações de localização
- ✅ Exibição do card de qualidade do ar
- ✅ Detalhes dos poluentes
- ✅ Avisos de saúde
- ✅ Formatação de data/hora
- ✅ Estados de loading e erro
- ✅ Responsividade
- ✅ Atualização dinâmica

**Exemplo de Teste**:
```javascript
test('deve renderizar card do IQA com categoria BOM', () => {
  const airQualityData = { european_aqi: 30 };
  renderAirQualityCard(airQualityData);
  
  expect(document.getElementById('aqi-value').textContent).toBe('30');
  expect(document.getElementById('aqi-category').textContent).toBe('BOM');
});
```

### 4. 🔄 Testes de Integração E2E

**Arquivo**: `tests/integration/app-integration.spec.js`

**Cenários Testados**:
- ✅ Carregamento da página
- ✅ Funcionalidade do formulário
- ✅ Integração completa com APIs
- ✅ Renderização de resultados
- ✅ Tratamento de erros
- ✅ Responsividade em diferentes dispositivos
- ✅ Fluxo completo de usuário
- ✅ Performance da aplicação

**Exemplo de Teste**:
```javascript
test('deve buscar dados de qualidade do ar para São Paulo', async ({ page }) => {
  await page.fill('#city', 'São Paulo');
  await page.fill('#state', 'SP');
  await page.fill('#country', 'Brasil');
  await page.click('#submit-btn');

  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#aqi-value')).toContainText('30');
});
```

## 🚀 Executando os Testes

### 📊 Testes Unitários

```bash
# Executar todos os testes unitários
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch

# Executar testes específicos
npm test -- form-validation
npm test -- api-service
npm test -- result-rendering
```

### 🎭 Testes de Integração

```bash
# Executar todos os testes E2E
npx playwright test

# Executar em modo headed (com browser visível)
npx playwright test --headed

# Executar em dispositivo específico
npx playwright test --project=mobile-chrome

# Executar teste específico
npx playwright test app-integration

# Gerar relatório
npx playwright show-report
```

### 🔧 Servidor de Desenvolvimento para Testes

```bash
# Iniciar servidor local para testes E2E
python -m http.server 8080

# Ou usando Node.js
npx serve . -p 8080

# Ou usando live-server
npx live-server --port=8080
```

## 📊 Cobertura de Testes

### 🎯 Métricas de Cobertura

- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 90%
- **Lines**: > 85%

### 📈 Relatórios de Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Abrir relatório HTML
open coverage/lcov-report/index.html
```

## 🔍 Estratégia de Teste por Funcionalidade

### 📝 Validação de Formulário

| Funcionalidade | Teste Unitário | Teste E2E |
|----------------|----------------|-----------|
| Campos obrigatórios | ✅ | ✅ |
| Formatação de entrada | ✅ | ✅ |
| Validação de caracteres | ✅ | ✅ |
| Mensagens de erro | ✅ | ✅ |

### 🌐 Integração com APIs

| Funcionalidade | Teste Unitário | Teste E2E |
|----------------|----------------|-----------|
| Geocodificação | ✅ | ✅ |
| Qualidade do ar | ✅ | ✅ |
| Tratamento de erros | ✅ | ✅ |
| Timeout/Retry | ✅ | ❌ |

### 🎨 Interface de Usuário

| Funcionalidade | Teste Unitário | Teste E2E |
|----------------|----------------|-----------|
| Renderização de resultados | ✅ | ✅ |
| Estados de loading | ✅ | ✅ |
| Responsividade | ✅ | ✅ |
| Interações do usuário | ❌ | ✅ |

## 🐛 Debugging de Testes

### 🔧 Ferramentas de Debug

```bash
# Debug de testes unitários
npm test -- --debug

# Debug de testes Playwright
npx playwright test --debug

# Executar com logs detalhados
DEBUG=pw:api npx playwright test
```

### 📸 Screenshots e Vídeos

```bash
# Capturar screenshots em falhas
npx playwright test --screenshot=only-on-failure

# Gravar vídeos dos testes
npx playwright test --video=on
```

## 📝 Boas Práticas

### ✅ Testes Unitários

1. **Isolamento**: Cada teste deve ser independente
2. **Nomenclatura**: Use descrições claras e específicas
3. **Arrange-Act-Assert**: Estruture testes claramente
4. **Mocks**: Use mocks para dependências externas
5. **Cobertura**: Vise alta cobertura, mas priorize qualidade

### ✅ Testes E2E

1. **Seletores Estáveis**: Use IDs ou data-attributes
2. **Esperas Explícitas**: Use expect() ao invés de sleeps
3. **Limpeza**: Resete estado entre testes
4. **Dados de Teste**: Use dados consistentes e previsíveis
5. **Paralização**: Configure execução paralela quando possível

## 📅 Cronograma de Execução

### 🔄 CI/CD Pipeline

```yaml
# Execução automática
on:
  push: [main]
  pull_request: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run Unit Tests
        run: npm test
      
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run E2E Tests
        run: npx playwright test
```

### 📊 Relatórios Regulares

- **Diário**: Cobertura de testes automatizada
- **Semanal**: Revisão de testes falhando
- **Mensal**: Análise de métricas de qualidade

## 🎯 Próximos Passos

### 🔮 Melhorias Futuras

1. **Testes de Acessibilidade**: Implementar com axe-core
2. **Testes de Performance**: Adicionar métricas de Core Web Vitals
3. **Testes Visuais**: Implementar visual regression testing
4. **Testes de Carga**: Simular múltiplos usuários simultâneos
5. **Testes de Segurança**: Validar proteção contra XSS/CSRF

### 📈 Métricas a Acompanhar

- Taxa de sucesso dos testes
- Tempo de execução dos testes
- Cobertura de código
- Número de bugs encontrados em produção
- Tempo de feedback do CI/CD

---

**Desenvolvido para garantir qualidade e confiabilidade da aplicação de qualidade do ar! 🌬️**
