# Pinoti - Sistema de Formulários

Sistema de cadastro de proprietários e locatários com geração de PDF e compartilhamento.

## Estrutura do Projeto

```
pinoti/
├── index.html                  # Página inicial com links
├── anexo-I-proprietario.html   # Formulário de cadastro de proprietário
├── anexo-II-locatario.html     # Formulário de cadastro de locatário
└── js/                         # Módulos JavaScript
    ├── common.js               # Funções compartilhadas e formatadores
    ├── print-helper.js         # Impressão via iframe
    ├── pdf-generator.js        # Geração de PDF programática
    ├── anexo-I.js              # Lógica específica do Anexo I
    └── anexo-II.js             # Lógica específica do Anexo II
```

## Módulos JavaScript

### common.js
Funções compartilhadas entre todos os formulários:
- **Formatadores**: `formatCPF`, `formatCNPJ`, `formatCEP`, `formatTelefoneFixo`, `formatTelefoneCelular`
- **Utilidades**: `applyFormatters`, `isMobile`, `isVercel`, `setupShareButtonVisibility`, `limparFormulario`

### print-helper.js
Impressão através de iframe oculto (sem pop-ups):
- **printViaIframe**: Função para impressão limpa em dispositivos móveis

### pdf-generator.js
Geração programática de PDFs usando html2pdf.js:
- **generatePdfFromClone**: Gera PDF a partir de clone do DOM com otimizações para mobile e desktop

### anexo-I.js
Lógica específica do formulário de proprietário:
- `gerarPDF()`: Impressão nativa (gold standard)
- `compartilharWhatsApp()`: Roteamento mobile/desktop
- `compartilharDesktop()`: Gera e baixa PDF
- `compartilharMobile()`: Gera PDF e abre share nativo

### anexo-II.js
Lógica específica do formulário de locatário:
- Mesmas funções do Anexo I, adaptadas para campos de locatário e cônjuge

## Funcionalidades

### 1. Impressão Nativa (Gold Standard)
- Botão "Gerar PDF" usa `window.print()` nativo
- Melhor qualidade e compatibilidade
- CSS de impressão otimizado para A4

### 2. Compartilhamento
- **Desktop**: Gera PDF e baixa automaticamente
- **Mobile**: Gera PDF e abre menu de compartilhamento nativo (WhatsApp, etc.)
- Botão oculto automaticamente no Vercel (desktop)

### 3. Formatação Automática
- CPF: `000.000.000-00`
- CNPJ: `00.000.000/0000-00`
- CEP: `00000-000`
- Telefone Fixo: `(00) 0000-0000`
- Telefone Celular: `(00) 00000-0000`

### 4. Limpar Formulário
- Botão para resetar todos os campos e opções

## Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização responsiva com print media queries
- **JavaScript Vanilla**: Sem frameworks, código modular
- **html2pdf.js**: Biblioteca para geração programática de PDF (html2canvas + jsPDF)

## Requisitos

- Navegador moderno com suporte a ES6+
- Conexão com internet (para carregar html2pdf.js via CDN)

## Como Usar

1. Abra `index.html` no navegador
2. Selecione o formulário desejado (Anexo I ou Anexo II)
3. Preencha os campos (formatação automática)
4. Use "Gerar PDF" para impressão nativa ou "Compartilhar" para mobile

## Desenvolvimento

### Padrões de Código
- Separação de responsabilidades (modularização)
- Funções puras sempre que possível
- Nomenclatura clara e descritiva
- Comentários em pontos-chave

### Manutenção
- Todos os scripts estão externalizados em `/js`
- Sem código inline nos HTMLs
- Zero erros no console
- Validação de campos e tratamento de erros

## Versão

v1.2.3 - Refatoração modular completa
