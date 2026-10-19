# 📘 Gramática Interativa — Organização de Frases
### Mini Sistema Educacional para o Ensino da Língua Portuguesa

Um sistema educacional completo, moderno e interativo desenvolvido sob medida para a disciplina de **Gramática**, com foco no tema **Organização de Frases**. Projetado para auxiliar professores no planejamento pedagógico e acompanhamento de desempenho da turma, além de proporcionar aos alunos uma experiência lúdica, prática e envolvente.

---

## 🚀 Como Executar o Sistema

Como o sistema utiliza **módulos modernos JavaScript (ES6 Modules)**, ele deve ser executado através de um servidor HTTP local:

### Opção 1: Via Python (já em execução ou novo comando)
No terminal da pasta do projeto, execute:
```bash
python -m http.server 8080
```
Em seguida, abra o navegador e acesse:
👉 **[http://localhost:8080](http://localhost:8080)**

### Opção 2: Via Node.js
```bash
npx -y serve -l 8080
```
Ou abra com qualquer extensão de servidor local (como *Live Server* do VS Code).

---

## 🎯 Visão Geral dos Recursos

### 🎒 1. Área do Aluno
A interface do aluno foi desenhada com princípios de gamificação e acessibilidade:
- **Painel de Boas-Vindas e Estatísticas**: Exibe nome do aluno, turma, avatar, pontuação acumulada (XP), estrelas conquistadas, sequência diária (streak) e **recado pedagógico enviado pelo professor**.
- **🧩 Módulo de Organização de Frases (Core)**:
  - Palavras embaralhadas em fichas (*chips*) interativas.
  - Clique intuitivo para mover palavras do banco para a linha de montagem e vice-versa.
  - **Motor Inteligente de Correção**: Avalia a frase e reconhece variações sintáticas válidas (ex: deslocamento de adjuntos adverbiais).
  - **Diagnóstico Pedagógico com Explicação**: Se o aluno errar, o sistema não diz apenas que está errado; explica o motivo (ex: falta de inicial maiúscula, ausência de pontuação final, inversão entre sujeito e verbo).
  - **🔊 Leitura em Voz Alta**: O aluno pode ouvir a frase pronunciada em português através da API de Síntese de Voz do navegador.
  - **Filtro de Dificuldade**: Níveis *Fácil*, *Intermédio* e *Avançado*.
  - Efeito festivo de confetes (*canvas*) e acordes sonoros ao acertar.
- **📖 Módulo de Mini Aulas**:
  - 6 lições completas com esquemas visuais, fórmulas sintáticas (`SUJEITO + VERBO + COMPLEMENTO`), tabelas comparativas e testes rápidos de fixação integrados:
    1. *A Estrutura Básica: Quem faz o quê? (Ordem Direta SVO)*
    2. *Maiúsculas e Pontuação Final*
    3. *Tipos de Frases e Entoação (Afirmativa, Negativa, Interrogativa, Exclamativa)*
    4. *Sujeito e Predicado (Os dois pilares da oração)*
    5. *Concordância entre Sujeito e Verbo*
    6. *Flexibilidade e Variações Aceitáveis*
- **🔍 Módulo Detetive de Frases (Identificação de Elementos)**:
  - O aluno é desafiado a identificar o Sujeito, o Predicado, o Verbo ou os Complementos em orações reais.
  - Feedback visual detalhando a anatomia sintática da frase.
- **✏️ Módulo Desafio do Editor (Correção de Frases)**:
  - Frases com erros intencionais de concordância, pontuação ou lógica frásica para o aluno identificar e corrigir.
- **❓ Módulo Quiz de Fixação**:
  - Perguntas conceituais de múltipla escolha com explicações imediatas para cada alternativa.
- **🏆 Módulo Meu Desempenho**:
  - Taxa de acerto em tempo real.
  - Sistema de medalhas desbloqueáveis (*Iniciante Curioso*, *Mestre da Ordem SVO*, *Sentinela da Pontuação*, *Detetive Gramatical Ouro*).
  - Identificação clara de tópicos que necessitam de mais treino.
  - Histórico detalhado de todas as tentativas.
- **Troca de Aluno**:
  - Modal interativo que permite testar múltiplos perfis de alunos pré-carregados (*Maria Silva*, *João Pedro*, *Beatriz Santos*, *Lucas Ferreira*) ou cadastrar novos estudantes na hora.

---

### 👨‍🏫 2. Área do Professor (Painel Pedagógico)
Acessível a qualquer momento através do alternador no topo da página:
- **📊 Indicadores da Turma (KPIs)**:
  - Total de alunos matriculados.
  - Aproveitamento médio da turma (%).
  - Total de exercícios realizados.
  - Média de pontuação.
- **⚠️ Diagnóstico Automático de Dificuldades Coletivas**:
  - O sistema agrupa e contabiliza os erros mais frequentes (ex: *Falta de pontuação final*, *Concordância verbal*, *Uso de maiúsculas*), permitindo ao docente direcionar as próximas aulas.
- **👥 Acompanhamento Individual dos Alunos**:
  - Tabela com métricas de cada estudante.
  - **Visualização de Detalhes**: Histórico completo com a data, status, frase digitada/organizada pelo aluno e o diagnóstico de erro registrado.
  - **💬 Feedback Pedagógico Personalizado**: O professor pode escrever recados e orientações direcionadas a cada aluno (com sugestões pré-definidas ou texto livre), que são exibidos no painel do estudante.
- **📝 Gestão de Atividades (CRUD Completo)**:
  - Adicionar, editar, buscar, filtrar e excluir exercícios.
  - Suporte a múltiplos tipos de atividades (Ordenação, Identificação, Correção e Quiz).
  - Cadastro de **resposta esperada principal** e **múltiplas variações sintáticas aceitáveis** (ex: aceitar adjuntos de tempo no início ou no fim).
  - Definição de dicas pedagógicas e explicações educativas.
- **📚 Gestão de Regras e Critérios**:
  - Adicionar e revisar critérios pedagógicos de avaliação.
- **📋 Relatório Consolidado para Impressão e Exportação**:
  - Folha de relatório formal com cabeçalho escolar, métricas globais, pontos de atenção pedagógica, tabela de alunos e campos para assinatura do professor e coordenação.
  - Botão de **Imprimir / Gerar PDF** (estilizado via `@media print`).
  - Botão para **Baixar Dados em JSON**.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação acessível com tags semânticas (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<dialog>`).
- **CSS3 Moderno**:
  - Variáveis CSS (design tokens para temas e paletas de cores harmônicas).
  - Grid & Flexbox para layouts responsivos em computadores, tablets e smartphones.
  - Efeitos de glassmorphism, micro-animações CSS (`@keyframes popIn`, `shake`, `bounceSoft`).
  - Folha de estilo dedicada para impressão (`@media print`).
- **JavaScript Moderno (ES6+)**:
  - Arquitetura modular (`import` / `export`).
  - Estado reativo com padrão Observer e persistência via `localStorage`.
  - **Web Audio API**: Sintetizador sonoro para cliques, acertos e fanfarras (sem depender de arquivos de áudio externos).
  - **Web Speech API**: Síntese de voz em Língua Portuguesa (`pt-BR`).
  - **HTML5 Canvas**: Efeito de confetes dinâmicos nas celebrações de acerto.

---

## 📂 Estrutura de Arquivos

```
brilhante gramatica/
├── index.html                  # Ponto de entrada da aplicação web
├── css/
│   ├── main.css                # Variáveis, fontes, reset e layout global
│   ├── components.css          # Botões, fichas de palavras, modais e alertas
│   ├── student.css             # Estilos da área do aluno e exercícios interativos
│   ├── teacher.css             # Estilos do painel do professor, KPIs e relatórios
│   └── responsive.css          # Adaptações para mobile, tablet e desktop
├── js/
│   ├── app.js                  # Inicialização e controle de navegação
│   ├── state.js                # Gerenciador de estado, persistência e métricas
│   ├── sound.js                # Sintetizador de efeitos sonoros (Web Audio API)
│   ├── grammar-engine.js       # Motor de correção sintática e diagnósticos
│   ├── seed-data.js            # Exercícios, lições e alunos pré-carregados
│   ├── student-view.js         # Controlador da interface do aluno
│   └── teacher-view.js         # Controlador do painel do professor
└── README.md                   # Documentação pedagógica e técnica do sistema
```

---

## 👩‍🏫 Exemplo do Exercício Solicitado no Prompt

- **Enunciado**: Organize as palavras para formar uma frase correta.
- **Palavras disponíveis**: `estuda | Maria | todos | os dias`
- **Resposta esperada principal**: `Maria estuda todos os dias.`
- **Alternativas aceitáveis**: `Todos os dias Maria estuda.` / `Todos os dias, Maria estuda.`
- **Feedback inteligente**:
  - Se montada com precisão: *"Muito bem! 'Maria' é o sujeito, 'estuda' é o verbo da ação e 'todos os dias' indica a frequência com que ela estuda."*
  - Se faltar maiúscula ou pontuação: o sistema aponta explicitamente a ausência do ponto ou da maiúscula.
  - Se a ordem estiver confusa: orienta o aluno a procurar primeiro quem pratica a ação (*Sujeito*).
