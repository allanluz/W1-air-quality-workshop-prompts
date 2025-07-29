# Guia de Teste da Aplicação

## Exemplos de Localização para Teste

### Brasil 🇧🇷
- **Cidade**: São Paulo
- **Estado**: São Paulo  
- **País**: Brasil

- **Cidade**: Rio de Janeiro
- **Estado**: Rio de Janeiro
- **País**: Brasil

- **Cidade**: Belo Horizonte
- **Estado**: Minas Gerais
- **País**: Brasil

### Estados Unidos 🇺🇸
- **Cidade**: New York
- **Estado**: New York
- **País**: Estados Unidos (ou deixar em branco)

- **Cidade**: Los Angeles  
- **Estado**: California
- **País**: Estados Unidos

- **Cidade**: Chicago
- **Estado**: Illinois  
- **País**: Estados Unidos

### Europa 🇪🇺
- **Cidade**: London
- **Estado**: England
- **País**: United Kingdom

- **Cidade**: Paris
- **Estado**: Île-de-France
- **País**: France

- **Cidade**: Berlin
- **Estado**: Berlin
- **País**: Germany

### Outros Países 🌍
- **Cidade**: Tokyo
- **Estado**: Tokyo
- **País**: Japan

- **Cidade**: Sydney
- **Estado**: New South Wales
- **País**: Australia

- **Cidade**: Toronto
- **Estado**: Ontario
- **País**: Canada

## Como Testar

1. **Teste Básico**: Use qualquer uma das localizações acima
2. **Teste de Validação**: Tente deixar campos obrigatórios em branco
3. **Teste de Erro**: Use uma cidade inexistente como "xyzabc123"
4. **Teste de Formatação**: Digite em minúsculas e veja a formatação automática
5. **Teste de Loading**: Observe o indicador de carregamento durante a consulta

## Dados Esperados

A aplicação deve retornar:
- ✅ Localização completa encontrada
- ✅ Coordenadas geográficas (lat/lon)
- ✅ Índice de Qualidade do Ar (1-6)
- ✅ Nível de qualidade com cor correspondente
- ✅ Poluente principal identificado
- ✅ Lista detalhada de todos os poluentes
- ✅ Horário da última medição
- ✅ Mensagem de saúde apropriada

## Possíveis Problemas e Soluções

### "Localização não encontrada"
- Verifique a ortografia da cidade e estado
- Tente usar nomes em inglês para cidades internacionais
- Use nomes oficiais dos estados/províncias

### "Erro de conexão"
- Verifique sua conexão com a internet
- Aguarde alguns segundos e tente novamente
- Algumas redes podem bloquear APIs externas

### "Erro ao buscar dados"
- A API pode estar temporariamente indisponível
- Tente com uma localização diferente
- Aguarde alguns minutos e tente novamente

## Navegadores Recomendados

- ✅ Chrome (versão 60+)
- ✅ Firefox (versão 55+)  
- ✅ Safari (versão 12+)
- ✅ Edge (versão 79+)

## Recursos Testáveis

- 🔄 Validação em tempo real
- ⌨️ Atalho ESC para limpar
- 📱 Design responsivo (teste em diferentes tamanhos de tela)
- 🎨 Animações e transições
- 🔄 Estado de carregamento
- ❌ Tratamento de erros
