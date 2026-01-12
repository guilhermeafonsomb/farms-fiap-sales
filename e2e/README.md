# E2E Tests - Sales Management

## 🎯 Objetivo

Testes End-to-End focados em **fluxos críticos de negócio** da aplicação de gestão de vendas e estoque.

## 📋 Cenários Testados

### 1. **Complete Stock Management Flow**

- Adicionar produto com dados válidos
- Verificar produto aparece na lista
- Atualizar quantidade do estoque
- Confirmar atualização refletida na lista

### 2. **Complete Sales Flow with Stock Update**

- Criar produto com estoque inicial
- Registrar venda
- Verificar estoque diminuiu automaticamente

### 3. **Business Validations**

- Produto não encontrado ao atualizar
- Campos vazios ao adicionar produto
- Correção de dados no formulário

### 4. **Cross-Device Compatibility**

- Testes em Desktop (Chrome, Firefox, Safari)
- Testes em Mobile (Chrome, Safari)

## 🚀 Como Rodar

### Pré-requisitos

```bash
# Instalar dependências
pnpm install

# Instalar browsers do Playwright
pnpm exec playwright install
```

### Executar Testes

```bash
# Rodar todos os testes E2E
pnpm test:e2e

# Rodar apenas Chrome (mais rápido)
pnpm test:e2e --project=chromium

# Rodar com UI interativa
pnpm test:e2e:ui

# Rodar em modo debug
pnpm test:e2e:debug

# Ver relatório HTML
pnpm test:e2e:report
```

## ⚙️ Configuração

Os testes estão configurados para:

- **Auto-start dev server** na porta 5003
- **Screenshots** em falhas
- **Vídeos** em falhas
- **Retry** 2x em CI
- **Timeout** 120s para dev server

## 📊 Relatórios

Após rodar os testes:

- **HTML Report:** `playwright-report/index.html`
- **JSON Results:** `test-results/results.json`
- **Screenshots:** `test-results/*/test-failed-*.png`
- **Videos:** `test-results/*/video.webm`

## 🔍 Debugging

### Ver último relatório

```bash
pnpm exec playwright show-report
```

### Rodar teste específico

```bash
pnpm test:e2e -g "Complete Stock Management"
```

### Modo debug

```bash
pnpm test:e2e:debug
```

## ⚠️ Notas Importantes

> **Appwrite Backend:** Os testes E2E interagem com o Appwrite real. Certifique-se de que as credenciais em `.env` estão corretas.

> **Timing:** Alguns testes usam `waitForTimeout` para aguardar operações assíncronas. Ajuste se necessário.

> **Dados de Teste:** Os testes criam produtos com timestamp único para evitar conflitos.

## 📈 Métricas

- **Total de Testes:** 8
- **Browsers:** 5 (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- **Tempo Médio:** ~2-3 minutos (todos os browsers)
- **Tempo Chrome:** ~30-40 segundos

## 🎯 Próximos Passos

- [ ] Adicionar testes de performance
- [ ] Adicionar testes de acessibilidade
- [ ] Integrar com CI/CD
