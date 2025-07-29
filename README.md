# 🌬️ API da Qualidade do Ar - Aplicação Web

![CI/CD Status](https://github.com/octocaio/sinquia_evertec_workshop/workflows/CI-CD/badge.svg)
![E2E Tests](https://github.com/octocaio/sinquia_evertec_workshop/workflows/E2E%20Tests/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Uma aplicação web moderna para consulta da qualidade do ar em tempo real, desenvolvida para o Workshop Sinqia Evertec.

## 🎯 Sobre o Projeto

Esta aplicação permite aos usuários consultar o índice de qualidade do ar (IQA) atual de qualquer localização mundial, utilizando APIs públicas para fornecer dados precisos e atualizados.

### ✨ Funcionalidades

- 🌍 **Busca Global**: Consulte qualquer cidade, estado/província e país
- 📊 **Dados em Tempo Real**: Informações atualizadas sobre qualidade do ar
- 📱 **Design Responsivo**: Interface otimizada para desktop e mobile
- 🎨 **Visualização Intuitiva**: Códigos de cores para fácil interpretação dos dados
- ⚡ **Performance Otimizada**: Carregamento rápido e eficiente
- 🔒 **Seguro**: Validação de entrada e tratamento seguro de dados

## 🔧 APIs Utilizadas

- **[Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/)**: Geocodificação gratuita
- **[Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)**: Dados de qualidade do ar sem necessidade de autenticação

## Estrutura do Projeto

```text
├── index.html      # Página principal com formulário
├── styles.css      # Estilos CSS com design responsivo
├── script.js       # Lógica JavaScript com validação
└── README.md       # Documentação do projeto
```

## 📊 Informações Exibidas

### Dados de Localização

- Endereço completo encontrado
- Coordenadas geográficas (latitude e longitude)

### Qualidade do Ar

- **Índice de Qualidade do Ar (IQA)**: Escala de 1-6 com cores e descrições
- **Poluente Principal**: Identifica o poluente com maior concentração relativa
- **Detalhes dos Poluentes**:
  - MP10 (Material Particulado < 10μm)
  - MP2.5 (Material Particulado < 2.5μm)
  - CO (Monóxido de Carbono)
  - NO₂ (Dióxido de Nitrogênio)
  - SO₂ (Dióxido de Enxofre)
  - O₃ (Ozônio)
- **Horário da Medição**: Timestamp da última atualização dos dados
- **Avisos de Saúde**: Mensagens baseadas no nível de qualidade do ar

## 🎨 Níveis de Qualidade do Ar

| Nível | Descrição | Cor | Recomendação |
|-------|-----------|-----|--------------|
| 1 | Bom | 🟢 Verde | Qualidade satisfatória para todos |
| 2 | Moderado | 🟡 Amarelo | Pessoas sensíveis podem ter sintomas menores |
| 3 | Insalubre para Grupos Sensíveis | 🟠 Laranja | Grupos sensíveis devem ter cuidado |
| 4 | Insalubre | 🔴 Vermelho | Todos podem experimentar efeitos na saúde |
| 5 | Muito Insalubre | 🟣 Roxo | Condições de emergência |
| 6 | Perigoso | 🔴 Vermelho Escuro | Alerta de saúde para todos |

## ✅ Validações Implementadas

### Campos Obrigatórios

- **Cidade**: Obrigatório, 2-50 caracteres
- **Estado/Região**: Obrigatório, 2-50 caracteres
- **País**: Opcional, padrão "Estados Unidos"

### Regras de Validação

- Apenas letras, espaços, hífens e apostrofes
- Comprimento máximo de 50 caracteres
- Formatação automática (primeira letra maiúscula)

## Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Preencha os campos obrigatórios:
   - Cidade (obrigatório)
   - Estado/Província/Região (obrigatório)
   - País (opcional, padrão: Estados Unidos)
3. Clique em "Consultar Qualidade do Ar" para buscar os dados
4. Aguarde o carregamento e visualize os resultados detalhados
5. Use "Limpar" para resetar o formulário

## 🔧 Tratamento de Erros

A aplicação trata elegantemente diferentes tipos de erro:

- **Localização não encontrada**: Quando a geocodificação falha
- **Erro de API**: Quando há problemas com as APIs externas
- **Erro de conexão**: Quando há problemas de rede
- **Validação de campos**: Feedback em tempo real para campos inválidos

## Funcionalidades Especiais

- **Validação em Tempo Real**: Feedback imediato enquanto digita
- **Estado de Carregamento**: Indicador visual durante as consultas às APIs
- **Atalhos de Teclado**:
  - `ESC`: Limpa o formulário
  - `Enter`: Envia o formulário (quando focado)
- **Responsivo**: Funciona em dispositivos móveis e desktop
- **Acessibilidade**: Labels adequados e navegação por teclado

## Tecnologias Utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Animações)
- JavaScript ES6+ (Async/Await, Fetch API, Classes)
- APIs REST (Nominatim, Open-Meteo)

## 🚀 Melhorias Futuras

- Cache de resultados para consultas recentes
- Histórico de consultas
- Gráficos de tendência da qualidade do ar
- Notificações push para alertas de qualidade do ar
- Suporte a múltiplos idiomas
- Modo escuro/claro
- Exportação de dados em PDF/CSV

## Compatibilidade

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

⚠️ **Nota**: Requer conexão com internet para funcionar, pois utiliza APIs externas.
