// seed-data.js - Banco de dados inicial de conteúdos, exercícios e turmas

export const INITIAL_LESSONS = [
  {
    id: "aula-1",
    title: "1. A Estrutura Básica: Quem faz o quê?",
    level: "Fácil",
    category: "Estrutura Básica (SVO)",
    summary: "Como organizar as palavras na ordem direta para a frase fazer sentido.",
    icon: "🧩",
    content: `
      <h3>A Ordem Direta da Língua Portuguesa</h3>
      <p>Na língua portuguesa, a forma mais natural e clara de organizar uma frase é a ordem <strong>SVO</strong>:</p>
      <div class="grammar-formula">
        <span class="pill-role role-sujeito">SUJEITO (Quem?)</span>
        <span class="math-sign">+</span>
        <span class="pill-role role-verbo">VERBO (Ação/Estado)</span>
        <span class="math-sign">+</span>
        <span class="pill-role role-complemento">COMPLEMENTO (O quê? A quem? Onde?)</span>
      </div>
      <div class="example-box">
        <p><strong>Exemplo Prático:</strong></p>
        <p><span class="badge-tag blue">Maria</span> <span class="badge-tag orange">estuda</span> <span class="badge-tag purple">todos os dias</span>.</p>
        <ul>
          <li><strong>Quem estuda?</strong> Maria (Sujeito)</li>
          <li><strong>O que ela faz?</strong> estuda (Verbo)</li>
          <li><strong>Quando?</strong> todos os dias (Complemento de tempo / Adjunto)</li>
        </ul>
      </div>
      <p class="pedagogical-tip">💡 <strong>Dica de Ouro:</strong> Se as palavras estiverem bagunçadas, faça primeiro a pergunta mágica: <em>"Quem está praticando a ação?"</em>. Esse é o seu Sujeito!</p>
    `,
    quickCheck: {
      question: "Qual frase está na ordem direta (Sujeito + Verbo + Complemento)?",
      options: [
        "O livro leu o menino ontem.",
        "O menino leu o livro ontem.",
        "Leu ontem o livro o menino."
      ],
      correctIndex: 1,
      explanation: "'O menino' é o sujeito (quem leu), 'leu' é o verbo e 'o livro ontem' são os complementos."
    }
  },
  {
    id: "aula-2",
    title: "2. Maiúsculas e Pontuação Final",
    level: "Fácil",
    category: "Pontuação e Escrita",
    summary: "Toda frase começa com letra maiúscula e termina com sinal de pontuação.",
    icon: "🔤",
    content: `
      <h3>O Início e o Fim de Toda Frase</h3>
      <p>Uma frase é uma unidade de sentido completo. Para que o leitor saiba onde ela começa e termina, usamos duas regras obrigatórias:</p>
      <ol class="styled-list">
        <li><strong>Letra Maiúscula no Início:</strong> A primeira letra da primeira palavra deve ser sempre maiúscula.</li>
        <li><strong>Sinal de Pontuação no Final:</strong> A frase precisa de um ponto final (.), ponto de interrogação (?) ou ponto de exclamação (!).</li>
      </ol>
      <div class="example-box">
        <div class="comparison-row">
          <div class="comparison-item bad">
            <span class="label">Incompleta ❌</span>
            <code>o pássaro canta alegremente</code>
            <small>(Falta maiúscula no 'O' e ponto final no fim)</small>
          </div>
          <div class="comparison-item good">
            <span class="label">Correta e Elegante ✅</span>
            <code>O pássaro canta alegremente.</code>
          </div>
        </div>
      </div>
      <p class="pedagogical-tip">💡 <strong>Dica:</strong> Em exercícios de palavras soltas, a palavra que já tem letra maiúscula muitas vezes dá a pista do início da frase!</p>
    `,
    quickCheck: {
      question: "Qual das opções está pontuada e iniciada corretamente?",
      options: [
        "as crianças foram ao parque",
        "As crianças foram ao parque.",
        "As crianças foram ao parque"
      ],
      correctIndex: 1,
      explanation: "A frase tem inicial maiúscula ('As') e termina com ponto final ('.')."
    }
  },
  {
    id: "aula-3",
    title: "3. Tipos de Frases e Entoação",
    level: "Intermédio",
    category: "Tipos de Frases",
    summary: "Frases afirmativas, negativas, interrogativas e exclamativas.",
    icon: "💬",
    content: `
      <h3>Os 4 Tipos Principais de Frases</h3>
      <div class="types-grid">
        <div class="type-card">
          <h4>Afirmativa (.)</h4>
          <p>Afirma um fato ou certeza.</p>
          <em>"A escola abre às oito horas."</em>
        </div>
        <div class="type-card">
          <h4>Negativa (.)</h4>
          <p>Usa palavras de negação (não, nunca, jamais).</p>
          <em>"A escola <strong>não</strong> abre aos domingos."</em>
        </div>
        <div class="type-card">
          <h4>Interrogativa (?)</h4>
          <p>Faz uma pergunta direta.</p>
          <em>"A escola abrirá amanhã?"</em>
        </div>
        <div class="type-card">
          <h4>Exclamativa (!)</h4>
          <p>Expressa emoção, surpresa ou entusiasmo.</p>
          <em>"Que escola bonita nós temos!"</em>
        </div>
      </div>
      <p class="pedagogical-tip">💡 <strong>Atenção à negação:</strong> Na frase negativa, a palavra 'não' geralmente se posiciona imediatamente antes do verbo: <em>"Lucas <strong>não</strong> comeu o bolo."</em></p>
    `,
    quickCheck: {
      question: "Qual das seguintes frases é uma frase interrogativa?",
      options: [
        "Nós não vamos viajar amanhã.",
        "Você gosta de ler histórias de aventura?",
        "Que dia maravilhoso nós tivemos!"
      ],
      correctIndex: 1,
      explanation: "A frase faz uma pergunta direta e termina com ponto de interrogação (?)."
    }
  },
  {
    id: "aula-4",
    title: "4. Sujeito e Predicado",
    level: "Intermédio",
    category: "Sintaxe",
    summary: "Aprenda a dividir a frase em seus dois blocos fundamentais.",
    icon: "🔍",
    content: `
      <h3>Os Dois Pilares da Oração</h3>
      <p>Praticamente toda oração se divide em duas partes indispensáveis:</p>
      <div class="pillars-container">
        <div class="pillar-box blue-pillar">
          <h4>1. SUJEITO</h4>
          <p>É o ser sobre o qual se faz uma declaração (ou quem pratica/sofre a ação).</p>
          <div class="question-pill">Pergunta: <em>"Quem?"</em> ou <em>"O que?"</em></div>
        </div>
        <div class="pillar-box green-pillar">
          <h4>2. PREDICADO</h4>
          <p>É tudo aquilo que se diz sobre o sujeito. O verbo sempre fica dentro do predicado!</p>
          <div class="question-pill">Pergunta: <em>"O que o sujeito faz / como está?"</em></div>
        </div>
      </div>
      <div class="example-box">
        <p><strong>Frase:</strong> <em>"Os pássaros coloridos construíram um ninho alto."</em></p>
        <p>• <strong>Sujeito:</strong> <span class="badge-tag blue">Os pássaros coloridos</span></p>
        <p>• <strong>Predicado:</strong> <span class="badge-tag green">construíram um ninho alto</span> (com o verbo 'construíram')</p>
      </div>
    `,
    quickCheck: {
      question: "Na frase 'A professora explicou a matéria com calma.', qual é o PREDICADO?",
      options: [
        "A professora",
        "explicou a matéria com calma.",
        "com calma."
      ],
      correctIndex: 1,
      explanation: "'A professora' é o sujeito. Tudo o que resta com o verbo ('explicou a matéria com calma.') é o predicado."
    }
  },
  {
    id: "aula-5",
    title: "5. Concordância entre Sujeito e Verbo",
    level: "Intermédio",
    category: "Concordância Verbal",
    summary: "Se o sujeito está no singular ou plural, o verbo precisa acompanhar!",
    icon: "⚖️",
    content: `
      <h3>A Harmonia Entre Sujeito e Verbo</h3>
      <p>O verbo deve sempre combinar em <strong>número (singular/plural)</strong> e <strong>pessoa (1ª, 2ª, 3ª)</strong> com o núcleo do sujeito.</p>
      <div class="comparison-table">
        <div class="table-row head">
          <span>Sujeito</span>
          <span>Verbo</span>
          <span>Frase Completa</span>
        </div>
        <div class="table-row">
          <span>O aluno (singular)</span>
          <span>leu (singular)</span>
          <span>O aluno leu o poema.</span>
        </div>
        <div class="table-row">
          <span>Os alunos (plural)</span>
          <span>leram (plural)</span>
          <span>Os alunos leram o poema.</span>
        </div>
        <div class="table-row">
          <span>Eu e você = Nós</span>
          <span>vamos (1ª plural)</span>
          <span>Você e eu vamos à biblioteca.</span>
        </div>
      </div>
      <p class="pedagogical-tip">💡 <strong>Erro frequente:</strong> 'Os menino correu' ❌. Correto: 'Os meninos correram' ✅.</p>
    `,
    quickCheck: {
      question: "Qual frase apresenta concordância verbal correta?",
      options: [
        "Os atletas correu muito rápido na pista.",
        "Os atletas correram muito rápido na pista.",
        "O atleta correram muito rápido na pista."
      ],
      correctIndex: 1,
      explanation: "O sujeito 'Os atletas' está no plural, portanto o verbo deve ser 'correram' (no plural)."
    }
  },
  {
    id: "aula-6",
    title: "6. Flexibilidade e Variações Aceitáveis",
    level: "Avançado",
    category: "Estilo e Inversão",
    summary: "Descubra quando a ordem pode mudar sem ferir a gramática portuguesa.",
    icon: "🔄",
    content: `
      <h3>A Língua Portuguesa é Rica e Flexível!</h3>
      <p>Embora a ordem direta seja <em>Sujeito + Verbo + Complemento</em>, adjuntos adverbiais (tempo, lugar, modo) podem se mover pela frase:</p>
      <div class="example-box">
        <p><strong>Observe estas três organizações perfeitamente corretas:</strong></p>
        <p>1. <code>Maria estuda todos os dias.</code> (Ordem direta padrão)</p>
        <p>2. <code>Todos os dias, Maria estuda.</code> (Tempo no início com vírgula)</p>
        <p>3. <code>Maria, todos os dias, estuda.</code> (Tempo intercalado)</p>
      </div>
      <p>Por isso, nosso sistema inteligente aceita diferentes arranjos válidos, desde que mantenham a coerência e as regras gramaticais da língua portuguesa!</p>
    `,
    quickCheck: {
      question: "A frase 'No domingo, a família foi à praia.' está gramaticalmente correta?",
      options: [
        "Sim, a indicação de tempo ('No domingo') pode vir no início da frase.",
        "Não, o sujeito sempre tem que ser a primeira palavra obrigatória.",
        "Não, frases não podem ter vírgula."
      ],
      correctIndex: 0,
      explanation: "Perfeito! Adjuntos de tempo ou lugar podem vir no início da frase, preferencialmente seguidos de vírgula."
    }
  }
];

export const INITIAL_EXERCISES = [
  // 1. ORDENAÇÃO DE PALAVRAS (Nível Fácil)
  {
    id: "ex-ord-1",
    type: "ordenacao",
    level: "Fácil",
    category: "Ordem das Palavras",
    prompt: "Organize as palavras para formar uma frase correta e com sentido.",
    words: ["estuda", "Maria", "todos", "os dias"],
    expected: "Maria estuda todos os dias.",
    validAlternatives: [
      "Todos os dias Maria estuda.",
      "Todos os dias, Maria estuda.",
      "Maria, todos os dias, estuda."
    ],
    hint: "Identifique primeiro quem pratica a ação (o sujeito) e depois organize as restantes palavras.",
    explanation: "Muito bem! 'Maria' é o sujeito, 'estuda' é o verbo da ação e 'todos os dias' indica a frequência com que ela estuda.",
    points: 10
  },
  {
    id: "ex-ord-2",
    type: "ordenacao",
    level: "Fácil",
    category: "Frases Afirmativas",
    prompt: "Ordene as palavras para relatar o que o gato fez.",
    words: ["bebeu", "O", "gato", "leite", "fresco"],
    expected: "O gato bebeu leite fresco.",
    validAlternatives: [
      "O gato bebeu o leite fresco."
    ],
    hint: "Procure a palavra que começa com letra maiúscula para iniciar a oração.",
    explanation: "Excelente! 'O gato' é o sujeito, 'bebeu' é o verbo e 'leite fresco' é o complemento do que ele bebeu.",
    points: 10
  },
  {
    id: "ex-ord-3",
    type: "ordenacao",
    level: "Fácil",
    category: "Frases Interrogativas",
    prompt: "Organize as palavras para formar uma pergunta simpática.",
    words: ["você", "amanhã", "ao parque", "Vai", "?"],
    expected: "Vai você ao parque amanhã?",
    validAlternatives: [
      "Você vai ao parque amanhã?",
      "Você vai amanhã ao parque?",
      "Amanhã você vai ao parque?",
      "Amanhã, você vai ao parque?"
    ],
    hint: "Em frases interrogativas, você pode começar com o pronome 'Você' ou com a ação 'Vai', e terminar com o ponto de interrogação.",
    explanation: "Ótimo! Em perguntas diretas, a pontuação final com '?' é indispensável para indicar a entoação da dúvida.",
    points: 10
  },
  {
    id: "ex-ord-4",
    type: "ordenacao",
    level: "Intermédio",
    category: "Frases Negativas",
    prompt: "Forme uma frase negativa organizada corretamente.",
    words: ["não", "Os alunos", "fizeram", "barulho", "na biblioteca"],
    expected: "Os alunos não fizeram barulho na biblioteca.",
    validAlternatives: [
      "Na biblioteca, os alunos não fizeram barulho.",
      "Na biblioteca os alunos não fizeram barulho."
    ],
    hint: "A palavra 'não' deve vir antes do verbo 'fizeram'.",
    explanation: "Perfeito! Em frases negativas, o advérbio 'não' acompanha o verbo para indicar a negação da ação.",
    points: 15
  },
  {
    id: "ex-ord-5",
    type: "ordenacao",
    level: "Intermédio",
    category: "Concordância e Ordem",
    prompt: "Organize a frase garantindo a concordância entre as flores e o seu perfume.",
    words: ["perfumam", "As flores do jardim", "toda a casa", "pela manhã"],
    expected: "As flores do jardim perfumam toda a casa pela manhã.",
    validAlternatives: [
      "Pela manhã, as flores do jardim perfumam toda a casa.",
      "Pela manhã as flores do jardim perfumam toda a casa."
    ],
    hint: "Comece pelo sujeito completo: quem é que perfuma?",
    explanation: "Muito bem! 'As flores do jardim' é o sujeito no plural que concorda com 'perfumam'.",
    points: 15
  },
  {
    id: "ex-ord-6",
    type: "ordenacao",
    level: "Avançado",
    category: "Estruturas Complexas",
    prompt: "Reorganize esta frase rica em detalhes, mantendo a coerência gramatical.",
    words: ["com grande entusiasmo", "apresentaram", "o projeto de ciências", "Os alunos da turma"],
    expected: "Os alunos da turma apresentaram o projeto de ciências com grande entusiasmo.",
    validAlternatives: [
      "Com grande entusiasmo, os alunos da turma apresentaram o projeto de ciências.",
      "Com grande entusiasmo os alunos da turma apresentaram o projeto de ciências.",
      "Os alunos da turma, com grande entusiasmo, apresentaram o projeto de ciências."
    ],
    hint: "Quem apresentou? 'Os alunos da turma'. O que apresentaram? 'o projeto de ciências'. De que modo? 'com grande entusiasmo'.",
    explanation: "Brilhante! Essa frase une Sujeito + Verbo + Objeto Direto + Adjunto Adverbial de Modo.",
    points: 20
  },

  // 2. IDENTIFICAÇÃO DE ELEMENTOS DA FRASE (Detetive Gramatical)
  {
    id: "ex-elem-1",
    type: "identificacao",
    level: "Fácil",
    category: "Identificação de Elementos",
    prompt: "Identifique o SUJEITO da frase: 'O pássaro azul cantou no galho alto.'",
    sentence: "O pássaro azul cantou no galho alto.",
    targetRole: "sujeito",
    options: [
      "O pássaro azul",
      "cantou",
      "no galho alto"
    ],
    correctOption: "O pássaro azul",
    hint: "Faça a pergunta mágica: 'Quem cantou no galho alto?'",
    explanation: "Correto! 'O pássaro azul' é o sujeito, pois é o ser que realiza a ação de cantar.",
    elementsDetail: {
      sujeito: "O pássaro azul",
      verbo: "cantou",
      predicado: "cantou no galho alto",
      complemento: "no galho alto"
    },
    points: 10
  },
  {
    id: "ex-elem-2",
    type: "identificacao",
    level: "Intermédio",
    category: "Identificação de Elementos",
    prompt: "Identifique o PREDICADO na frase: 'A professora de ciências preparou um experimento.'",
    sentence: "A professora de ciências preparou um experimento.",
    targetRole: "predicado",
    options: [
      "A professora de ciências",
      "preparou um experimento",
      "um experimento"
    ],
    correctOption: "preparou um experimento",
    hint: "O predicado é tudo o que se declara a respeito do sujeito, incluindo o verbo.",
    explanation: "Exato! 'A professora de ciências' é o sujeito. Tudo o que resta com o verbo ('preparou um experimento') forma o predicado.",
    elementsDetail: {
      sujeito: "A professora de ciências",
      verbo: "preparou",
      predicado: "preparou um experimento",
      complemento: "um experimento"
    },
    points: 15
  },
  {
    id: "ex-elem-3",
    type: "identificacao",
    level: "Intermédio",
    category: "Identificação de Elementos",
    prompt: "Identifique o VERBO (a ação) na frase: 'Os jogadores comemoraram a vitória com a torcida.'",
    sentence: "Os jogadores comemoraram a vitória com a torcida.",
    targetRole: "verbo",
    options: [
      "Os jogadores",
      "comemoraram",
      "a vitória com a torcida"
    ],
    correctOption: "comemoraram",
    hint: "Qual palavra expressa a ação realizada pelos jogadores?",
    explanation: "'Comemoraram' é o verbo (pretérito perfeito do indicativo), indicando a ação que os jogadores realizaram.",
    elementsDetail: {
      sujeito: "Os jogadores",
      verbo: "comemoraram",
      predicado: "comemoraram a vitória com a torcida",
      complemento: "a vitória com a torcida"
    },
    points: 15
  },

  // 3. CORREÇÃO DE ERROS E RECONSTRUÇÃO
  {
    id: "ex-corr-1",
    type: "correcao",
    level: "Fácil",
    category: "Correção de Frases",
    prompt: "A frase abaixo contém erros de maiúscula e pontuação. Selecione a versão corrigida:",
    faultySentence: "os livros estão sobre a mesa da biblioteca",
    options: [
      "os livros estão sobre a mesa da biblioteca.",
      "Os livros estão sobre a mesa da biblioteca.",
      "Os livros estão sobre a mesa da biblioteca?"
    ],
    correctIndex: 1,
    hint: "Verifique se a primeira letra é maiúscula e se termina com o ponto adequado a uma afirmação.",
    explanation: "Muito bem! A frase precisa começar com 'Os' maiúsculo e finalizar com ponto final ('.').",
    points: 10
  },
  {
    id: "ex-corr-2",
    type: "correcao",
    level: "Intermédio",
    category: "Concordância Verbal",
    prompt: "Encontre o erro de concordância na frase: 'As crianças brincou no parque da cidade.'",
    faultySentence: "As crianças brincou no parque da cidade.",
    options: [
      "As crianças brincaram no parque da cidade.",
      "A crianças brincou no parque da cidade.",
      "As crianças brincava no parque da cidade."
    ],
    correctIndex: 0,
    hint: "O sujeito 'As crianças' está no plural, por isso o verbo também precisa ficar no plural.",
    explanation: "Perfeito! 'As crianças' exige a forma verbal plural 'brincaram'.",
    points: 15
  },
  {
    id: "ex-corr-3",
    type: "correcao",
    level: "Avançado",
    category: "Ordem e Lógica",
    prompt: "Qual alternativa corrige a ordem sem sentido das palavras: 'Ontem comida cachorro comeu o saborosa'?",
    faultySentence: "Ontem comida cachorro comeu o saborosa",
    options: [
      "Ontem o cachorro comeu comida saborosa.",
      "Comida saborosa o ontem cachorro comeu.",
      "O cachorro ontem comida comeu saborosa."
    ],
    correctIndex: 0,
    hint: "Organize primeiro quem realizou a ação (o cachorro), o que ele fez (comeu) e o que ele comeu (comida saborosa).",
    explanation: "Excelente reconstrução! 'Ontem o cachorro comeu comida saborosa.' faz total sentido sintático e semântico.",
    points: 20
  },

  // 4. QUESTIONÁRIOS DE ESCOLHA MÚLTIPLA
  {
    id: "ex-quiz-1",
    type: "quiz",
    level: "Fácil",
    category: "Conceitos de Frase",
    prompt: "O que é necessário para que um conjunto de palavras forme uma FRASE?",
    options: [
      "Precisa apenas de palavras difíceis e longas.",
      "Precisa ter sentido completo, organização coerente e pontuação.",
      "Precisa ter no mínimo vinte palavras.",
      "Precisa ser sempre uma pergunta."
    ],
    correctIndex: 1,
    hint: "Pense na função da frase: comunicar uma ideia que qualquer pessoa consiga entender.",
    explanation: "Exatamente! Uma frase é um enunciado de sentido completo, capaz de estabelecer comunicação clara.",
    points: 10
  },
  {
    id: "ex-quiz-2",
    type: "quiz",
    level: "Intermédio",
    category: "Tipos de Frases",
    prompt: "Identifique a frase que expressa uma interrogação direta:",
    options: [
      "Que sobremesa deliciosa nós comemos!",
      "Nós não encontramos a chave do armário.",
      "A que horas começará a aula de gramática?",
      "O sol nasceu radiante hoje pela manhã."
    ],
    correctIndex: 2,
    hint: "Procure a pergunta que pede uma resposta do ouvinte.",
    explanation: "Correto! 'A que horas começará a aula de gramática?' é uma frase interrogativa com ponto de interrogação.",
    points: 10
  },
  {
    id: "ex-quiz-3",
    type: "quiz",
    level: "Avançado",
    category: "Estrutura Sintática",
    prompt: "Considere a oração: 'Durante a tempestade, o vento forte quebrou vários galhos.' Qual é o sujeito?",
    options: [
      "Durante a tempestade",
      "vários galhos",
      "o vento forte",
      "quebrou"
    ],
    correctIndex: 2,
    hint: "Pergunte ao verbo: quem quebrou vários galhos durante a tempestade?",
    explanation: "Brilhante! 'O vento forte' praticou a ação de quebrar. 'Durante a tempestade' é adjunto adverbial de tempo.",
    points: 15
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "aluno-1",
    name: "Maria Silva",
    avatar: "👧",
    class: "5º Ano A",
    score: 135,
    stars: 14,
    streak: 5,
    completedExercises: ["ex-ord-1", "ex-ord-2", "ex-ord-3", "ex-elem-1", "ex-corr-1", "ex-quiz-1", "ex-quiz-2"],
    attemptsCount: 11,
    correctCount: 9,
    incorrectCount: 2,
    difficulties: ["Pontuação final em perguntas", "Concordância em sujeitos compostos"],
    history: [
      { exerciseId: "ex-ord-1", date: "2026-10-18 10:15", correct: true, scoreEarned: 10, userAnswer: "Maria estuda todos os dias." },
      { exerciseId: "ex-ord-2", date: "2026-10-18 10:20", correct: true, scoreEarned: 10, userAnswer: "O gato bebeu leite fresco." },
      { exerciseId: "ex-ord-3", date: "2026-10-18 10:28", correct: false, scoreEarned: 0, userAnswer: "Vai você ao parque amanhã", mistake: "Falta de ponto de interrogação" },
      { exerciseId: "ex-elem-1", date: "2026-10-18 10:35", correct: true, scoreEarned: 10, userAnswer: "O pássaro azul" },
      { exerciseId: "ex-quiz-1", date: "2026-10-18 10:40", correct: true, scoreEarned: 10, userAnswer: "Precisa ter sentido completo, organização coerente e pontuação." }
    ],
    teacherFeedback: "Excelente dedicação, Maria! Lembre-se sempre de colocar o ponto de interrogação ao fazer perguntas."
  },
  {
    id: "aluno-2",
    name: "João Pedro",
    avatar: "👦",
    class: "5º Ano A",
    score: 95,
    stars: 9,
    streak: 3,
    completedExercises: ["ex-ord-1", "ex-ord-2", "ex-elem-1", "ex-corr-1", "ex-quiz-1"],
    attemptsCount: 10,
    correctCount: 6,
    incorrectCount: 4,
    difficulties: ["Identificação de Sujeito e Predicado", "Ordem de frases com adjuntos"],
    history: [
      { exerciseId: "ex-ord-1", date: "2026-10-17 14:10", correct: true, scoreEarned: 10, userAnswer: "Maria estuda todos os dias." },
      { exerciseId: "ex-elem-2", date: "2026-10-17 14:18", correct: false, scoreEarned: 0, userAnswer: "um experimento", mistake: "Confundiu predicado com complemento" },
      { exerciseId: "ex-corr-2", date: "2026-10-17 14:25", correct: false, scoreEarned: 0, userAnswer: "A crianças brincou no parque da cidade.", mistake: "Concordância verbal errada" }
    ],
    teacherFeedback: "João, foque nas perguntas mágicas 'Quem?' para o sujeito e lembre que o verbo fica sempre dentro do predicado!"
  },
  {
    id: "aluno-3",
    name: "Beatriz Santos",
    avatar: "👩‍🦱",
    class: "5º Ano A",
    score: 160,
    stars: 16,
    streak: 7,
    completedExercises: ["ex-ord-1", "ex-ord-2", "ex-ord-3", "ex-ord-4", "ex-ord-5", "ex-elem-1", "ex-elem-2", "ex-elem-3", "ex-quiz-1", "ex-quiz-2", "ex-quiz-3"],
    attemptsCount: 12,
    correctCount: 11,
    incorrectCount: 1,
    difficulties: ["Nenhuma dificuldade crítica identificada."],
    history: [
      { exerciseId: "ex-ord-4", date: "2026-10-19 09:12", correct: true, scoreEarned: 15, userAnswer: "Os alunos não fizeram barulho na biblioteca." },
      { exerciseId: "ex-elem-3", date: "2026-10-19 09:20", correct: true, scoreEarned: 15, userAnswer: "comemoraram" },
      { exerciseId: "ex-quiz-3", date: "2026-10-19 09:30", correct: true, scoreEarned: 15, userAnswer: "o vento forte" }
    ],
    teacherFeedback: "Desempenho exemplar, Beatriz! Continue com esse ritmo fantástico nos desafios avançados."
  },
  {
    id: "aluno-4",
    name: "Lucas Ferreira",
    avatar: "🧑",
    class: "5º Ano A",
    score: 70,
    stars: 7,
    streak: 2,
    completedExercises: ["ex-ord-1", "ex-elem-1", "ex-quiz-1"],
    attemptsCount: 8,
    correctCount: 4,
    incorrectCount: 4,
    difficulties: ["Uso de maiúsculas no início da frase", "Pontuação final"],
    history: [
      { exerciseId: "ex-ord-1", date: "2026-10-18 16:05", correct: true, scoreEarned: 10, userAnswer: "Maria estuda todos os dias." },
      { exerciseId: "ex-corr-1", date: "2026-10-18 16:15", correct: false, scoreEarned: 0, userAnswer: "os livros estão sobre a mesa da biblioteca.", mistake: "Início com minúscula" }
    ],
    teacherFeedback: "Lucas, atenção redobrada: toda frase em português DEVE começar com letra maiúscula!"
  }
];

export const INITIAL_TEACHER_RULES = [
  {
    id: "regra-1",
    title: "Critério de Avaliação: Ordem SVO e Variações Aceitáveis",
    description: "A ordem direta (Sujeito + Verbo + Objeto/Complemento) é o padrão. No entanto, o sistema aceita adjuntos adverbiais antepostos ou pospostos (ex: 'Ontem nós estudamos' ou 'Nós estudamos ontem')."
  },
  {
    id: "regra-2",
    title: "Critério de Correção: Maiúsculas e Pontuação Final",
    description: "Toda frase deve iniciar com letra maiúscula e conter pontuação terminal coerente (ponto final, exclamação ou interrogação). Se a frase carecer disso, o feedback deve orientar especificamente sobre esse requisito."
  },
  {
    id: "regra-3",
    title: "Critério de Concordância Verbal",
    description: "O verbo deve harmonizar em número e pessoa com o núcleo do sujeito. Erros como 'os menino correu' devem ser diagnosticados como discordância de número (singular vs. plural)."
  }
];
