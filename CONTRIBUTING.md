# Contribuindo para o Projeto Air Quality API

Obrigado por considerar contribuir para nossa aplicação de qualidade do ar! 🌬️

## 🤝 Como Contribuir

### 1. Reportando Bugs

Se você encontrou um bug, por favor:

1. Verifique se já não existe uma [issue aberta](https://github.com/octocaio/sinquia_evertec_workshop/issues) sobre o problema
2. Se não existir, [crie uma nova issue](https://github.com/octocaio/sinquia_evertec_workshop/issues/new?template=bug_report.md) usando nosso template
3. Inclua o máximo de detalhes possível:
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do navegador/dispositivo

### 2. Sugerindo Funcionalidades

Para sugerir uma nova funcionalidade:

1. [Abra uma feature request](https://github.com/octocaio/sinquia_evertec_workshop/issues/new?template=feature_request.md)
2. Descreva claramente:
   - O problema que a funcionalidade resolve
   - A solução proposta
   - Alternativas consideradas

### 3. Fazendo Mudanças no Código

#### 🔧 Configuração do Ambiente

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/sinquia_evertec_workshop.git
   cd sinquia_evertec_workshop
   ```

3. **Instale as dependências**:
   ```bash
   npm install
   ```

4. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nome-da-funcionalidade
   ```

#### 📝 Padrões de Código

- **JavaScript**: Use ES6+ com async/await
- **CSS**: Siga a metodologia BEM para nomenclatura
- **HTML**: Use elementos semânticos
- **Commits**: Siga o padrão [Conventional Commits](https://conventionalcommits.org/)

#### ✅ Testes

Antes de submeter sua contribuição:

1. **Execute os testes**:
   ```bash
   npm test
   ```

2. **Teste manualmente**:
   - Abra `index.html` no navegador
   - Teste com diferentes localizações
   - Verifique responsividade

3. **Validação de código**:
   ```bash
   # Linting
   npm run lint
   
   # Formatação
   npm run format
   ```

#### 📤 Submetendo Mudanças

1. **Commit** suas mudanças:
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

2. **Push** para sua branch:
   ```bash
   git push origin feature/nome-da-funcionalidade
   ```

3. **Abra um Pull Request**:
   - Use um título descritivo
   - Preencha o template de PR
   - Referencie issues relacionadas

## 📋 Padrões de Commit

Usamos [Conventional Commits](https://conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (sem mudança de lógica)
- `refactor:` Refatoração de código
- `test:` Adição/modificação de testes
- `chore:` Tarefas de manutenção

**Exemplos:**
```bash
feat: adiciona suporte para novas unidades de medida
fix: corrige erro na validação de formulário
docs: atualiza README com novas instruções
```

## 🧪 Diretrizes de Teste

### Testes Obrigatórios

1. **Funcionalidade básica**:
   - Formulário aceita entrada válida
   - APIs são chamadas corretamente
   - Resultados são exibidos

2. **Tratamento de erros**:
   - Localização não encontrada
   - Falha de API
   - Entrada inválida

3. **Responsividade**:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

### Executando Testes E2E

```bash
# Todos os testes
npm test

# Testes específicos
npm run test:mobile    # Testes mobile
npm run test:api       # Testes de API
npm run test:desktop   # Testes desktop
```

## 🎨 Diretrizes de Design

### Cores

- **Primary**: `#1e3a8a` (azul escuro)
- **Success**: `#10b981` (verde)
- **Warning**: `#f59e0b` (amarelo)
- **Error**: `#ef4444` (vermelho)
- **Info**: `#3b82f6` (azul)

### Tipografia

- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Titles**: font-weight 600
- **Body**: font-weight 400

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Segurança

### Diretrizes de Segurança

1. **Validação de entrada**: Sempre valide dados do usuário
2. **Sanitização**: Sanitize dados antes de exibir
3. **HTTPS**: Use apenas em produção
4. **Não armazene**: Não persista dados pessoais

### Reportando Vulnerabilidades

Para reportar vulnerabilidades de segurança, envie um email para:
📧 **security@sinqia.com.br**

**NÃO** abra issues públicas para problemas de segurança.

## 📖 Recursos Úteis

### Documentação das APIs

- **[Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/)**: Geocodificação
- **[Open-Meteo API](https://open-meteo.com/en/docs/air-quality-api)**: Qualidade do ar

### Ferramentas de Desenvolvimento

- **[VS Code](https://code.visualstudio.com/)**: Editor recomendado
- **[Playwright](https://playwright.dev/)**: Testes E2E
- **[MDN Web Docs](https://developer.mozilla.org/)**: Referência Web

## 👥 Comunidade

### Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, espera-se que você mantenha este código.

### Canais de Comunicação

- 🐛 **Issues**: Para bugs e funcionalidades
- 📧 **Email**: [suporte@sinqia.com.br](mailto:suporte@sinqia.com.br)
- 📚 **Wiki**: Documentação adicional

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Sistema de favoritos para localizações
- [ ] Histórico de consultas
- [ ] Notificações push para alertas
- [ ] Modo escuro
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)

### Como Ajudar

1. Veja as [issues abertas](https://github.com/octocaio/sinquia_evertec_workshop/issues)
2. Procure por labels:
   - `good first issue`: Ideal para iniciantes
   - `help wanted`: Precisa de ajuda
   - `enhancement`: Novas funcionalidades

## 🏆 Reconhecimentos

Contribuições são reconhecidas no arquivo `CONTRIBUTORS.md` e no README principal.

### Hall da Fama

Agradecemos a todos os contribuidores que ajudaram a melhorar este projeto! 🙏

---

**Obrigado por contribuir para tornar o ar mais limpo! 🌱**

Para dúvidas, abra uma [issue](https://github.com/octocaio/sinquia_evertec_workshop/issues) ou entre em contato conosco.
