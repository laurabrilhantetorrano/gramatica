// student-view.js - Controlador Completo da Área do Aluno com Interatividade Rica

import { store } from "./state.js";
import { sound } from "./sound.js";
import { GrammarEngine } from "./grammar-engine.js";

export const StudentView = {
  activeTab: "ordenacao", // ordenacao | aulas | identificacao | correcao | quiz | progresso
  currentLevelFilter: "todos",
  currentExerciseIndex: 0,
  currentExercisesList: [],
  selectedWords: [],
  bankWords: [],

  init() {
    this.bindEvents();
    this.renderHeader();
    this.renderActiveTab();
  },

  bindEvents() {
    // Escuta mudanças de estado
    store.subscribe((event) => {
      if (["student_changed", "attempt_recorded", "data_reset"].includes(event)) {
        this.renderHeader();
        this.renderActiveTab();
      }
    });
  },

  clearAllTimers() {
    if (this.autoAdvanceTimer) { clearTimeout(this.autoAdvanceTimer); this.autoAdvanceTimer = null; }
    if (this.quizAdvanceTimer) { clearTimeout(this.quizAdvanceTimer); this.quizAdvanceTimer = null; }
    if (this.identAdvanceTimer) { clearTimeout(this.identAdvanceTimer); this.identAdvanceTimer = null; }
    if (this.corrAdvanceTimer) { clearTimeout(this.corrAdvanceTimer); this.corrAdvanceTimer = null; }
  },

  switchTab(tabId) {
    this.clearAllTimers();
    this.activeTab = tabId;
    this.renderTabsNav();
    this.renderActiveTab();
  },

  renderHeader() {
    const student = store.getActiveStudent();
    const container = document.getElementById("student-header-widget");
    if (!container || !student) return;

    container.innerHTML = `
      <div class="student-profile-bar">
        <div class="student-meta">
          <div class="student-avatar" id="btn-change-student" title="Clique para trocar de aluno">
            <span>${student.avatar || "👧"}</span>
            <span class="avatar-badge">Trocar</span>
          </div>
          <div class="student-info">
            <div class="student-name-row">
              <h2 class="student-name">${student.name}</h2>
              <span class="student-class">${student.class || "5º Ano"}</span>
            </div>
            <p class="student-status-text">Praticando: Organização e Estrutura de Frases</p>
          </div>
        </div>

        <div class="student-stats-row">
          <div class="stat-pill xp-pill" title="Pontos de Gramática">
            <span class="stat-icon">⭐</span>
            <div class="stat-data">
              <span class="stat-num">${student.score || 0}</span>
              <span class="stat-label">Pontos</span>
            </div>
          </div>
          <div class="stat-pill stars-pill" title="Estrelas Conquistadas">
            <span class="stat-icon">✨</span>
            <div class="stat-data">
              <span class="stat-num">${student.stars || 0}</span>
              <span class="stat-label">Estrelas</span>
            </div>
          </div>
          <div class="stat-pill streak-pill" title="Dias seguidos de treino">
            <span class="stat-icon">🔥</span>
            <div class="stat-data">
              <span class="stat-num">${student.streak || 1}</span>
              <span class="stat-label">Sequência</span>
            </div>
          </div>
        </div>
      </div>

      ${student.teacherFeedback ? `
        <div class="teacher-feedback-banner">
          <div class="feedback-icon">👨‍🏫</div>
          <div class="feedback-body">
            <strong>Recado do Professor:</strong>
            <p>"${student.teacherFeedback}"</p>
          </div>
        </div>
      ` : ""}
    `;

    document.getElementById("btn-change-student")?.addEventListener("click", () => {
      this.openStudentModal();
    });
  },

  renderTabsNav() {
    const navItems = [
      { id: "ordenacao", label: "🧩 Organizar Palavras", badge: null },
      { id: "aulas", label: "📖 Mini Aulas", badge: null },
      { id: "identificacao", label: "🔍 Detetive de Frases", badge: null },
      { id: "correcao", label: "✏️ Desafio do Editor", badge: null },
      { id: "quiz", label: "❓ Quiz de Fixação", badge: null },
      { id: "progresso", label: "🏆 Meu Desempenho", badge: null }
    ];

    const navContainer = document.getElementById("student-subtabs");
    if (!navContainer) return;

    navContainer.innerHTML = navItems
      .map(
        item => `
        <button class="subtab-btn ${this.activeTab === item.id ? "active" : ""}" data-tab="${item.id}">
          ${item.label}
        </button>
      `
      )
      .join("");

    navContainer.querySelectorAll(".subtab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        sound.playClick();
        this.switchTab(btn.dataset.tab);
      });
    });
  },

  renderActiveTab() {
    this.renderTabsNav();
    const content = document.getElementById("student-content-area");
    if (!content) return;

    switch (this.activeTab) {
      case "ordenacao":
        this.renderOrderingModule(content);
        break;
      case "aulas":
        this.renderLessonsModule(content);
        break;
      case "identificacao":
        this.renderIdentificationModule(content);
        break;
      case "correcao":
        this.renderCorrectionModule(content);
        break;
      case "quiz":
        this.renderQuizModule(content);
        break;
      case "progresso":
        this.renderProgressModule(content);
        break;
      default:
        this.renderOrderingModule(content);
    }
  },

  // ==========================================
  // 1. MÓDULO: ORDENAÇÃO DE PALAVRAS (CORE)
  // ==========================================
  renderOrderingModule(container) {
    const allExercises = store.getAllExercises().filter(e => e.type === "ordenacao");
    const filtered = this.currentLevelFilter === "todos"
      ? allExercises
      : allExercises.filter(e => e.level.toLowerCase() === this.currentLevelFilter.toLowerCase());

    this.currentExercisesList = filtered;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <p>Nenhum exercício de ordenação encontrado para o nível selecionado.</p>
          <button class="btn btn-outline" id="btn-reset-filter">Ver Todos os Níveis</button>
        </div>
      `;
      document.getElementById("btn-reset-filter")?.addEventListener("click", () => {
        this.currentLevelFilter = "todos";
        this.renderOrderingModule(container);
      });
      return;
    }

    if (this.currentExerciseIndex >= filtered.length) {
      this.currentExerciseIndex = 0;
    }

    const ex = filtered[this.currentExerciseIndex];

    // Se estiver carregando o exercício pela primeira vez, embaralha as palavras para o banco
    if (!this.currentExIdLoaded || this.currentExIdLoaded !== ex.id) {
      this.currentExIdLoaded = ex.id;
      // Embaralha palavras mantendo uma cópia
      this.bankWords = this.shuffleArray([...ex.words]);
      this.selectedWords = [];
    }

    container.innerHTML = `
      <div class="exercise-card anim-fade-in">
        <div class="exercise-top-bar">
          <div class="level-badges-row">
            <span class="badge-level ${ex.level.toLowerCase()}">${ex.level}</span>
            <span class="category-tag">${ex.category || "Estrutura de Frases"}</span>
            <span class="points-badge">+${ex.points || 10} Pontos</span>
          </div>

          <div class="filter-controls">
            <label for="level-select">Dificuldade:</label>
            <select id="level-select" class="styled-select">
              <option value="todos" ${this.currentLevelFilter === "todos" ? "selected" : ""}>Todos os Níveis</option>
              <option value="fácil" ${this.currentLevelFilter === "fácil" ? "selected" : ""}>Fácil</option>
              <option value="intermédio" ${this.currentLevelFilter === "intermédio" ? "selected" : ""}>Intermédio</option>
              <option value="avançado" ${this.currentLevelFilter === "avançado" ? "selected" : ""}>Avançado</option>
            </select>
          </div>
        </div>

        <div class="exercise-progress-tracker">
          <span>Exercício <strong>${this.currentExerciseIndex + 1}</strong> de <strong>${filtered.length}</strong></span>
          <div class="progress-track-bar">
            <div class="progress-fill-bar" style="width: ${((this.currentExerciseIndex + 1) / filtered.length) * 100}%"></div>
          </div>
        </div>

        <div class="prompt-box">
          <div class="prompt-icon">💡</div>
          <div class="prompt-text">
            <h3>${ex.prompt}</h3>
            <p class="prompt-subtitle">Clique nas palavras do banco para inseri-las na linha. Clique na linha para devolvê-las.</p>
          </div>
        </div>

        <!-- Linha da Frase Montada -->
        <div class="sentence-construction-area" id="drop-area">
          <div class="construction-label">
            <span>Sua Frase em Construção:</span>
            ${this.selectedWords.length > 0 ? `
              <button class="btn-text-action" id="btn-listen-sentence" title="Ouvir a frase construída">
                🔊 Ouvir Frase
              </button>
            ` : ""}
          </div>
          <div class="words-construction-line ${this.selectedWords.length === 0 ? "is-empty" : ""}" id="selected-words-container">
            ${this.selectedWords.length === 0 
              ? `<span class="placeholder-text">Clique nas palavras abaixo para começar a organizar sua frase...</span>` 
              : this.selectedWords.map((word, idx) => `
                <div class="word-chip in-sentence anim-pop" data-index="${idx}" title="Clique para remover">
                  <span class="chip-order">${idx + 1}</span>
                  <span class="chip-text">${word}</span>
                  <span class="chip-remove">×</span>
                </div>
              `).join("")
            }
          </div>
        </div>

        <!-- Banco de Palavras Disponíveis -->
        <div class="words-bank-area">
          <div class="bank-label">Palavras Disponíveis:</div>
          <div class="words-bank-container" id="bank-words-container">
            ${this.bankWords.map((word, idx) => `
              <button class="word-chip in-bank anim-pop" data-bank-index="${idx}" title="Clique para colocar na frase">
                ${word}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Feedback Dinâmico Inteligente -->
        <div id="feedback-display-area" class="feedback-container"></div>

        <!-- Barra de Ações com Navegação Completa -->
        <div class="exercise-action-buttons">
          <button class="btn btn-secondary" id="btn-prev-exercise" title="Voltar para a frase anterior">
            ⬅ Frase Anterior
          </button>
          <button class="btn btn-secondary" id="btn-reset-words" title="Desfazer e recomeçar esta frase">
            🔄 Limpar
          </button>
          <button class="btn btn-outline" id="btn-show-hint" title="Ver dica sobre o sujeito ou verbo">
            💡 Ver Dica
          </button>
          <button class="btn btn-primary btn-large" id="btn-verify-ordering" title="Verificar a frase organizada">
            ✓ Verificar Frase
          </button>
          <button class="btn btn-accent" id="btn-skip-exercise" title="Avançar para a próxima frase">
            Próxima Frase ➔
          </button>
        </div>
      </div>
    `;

    // Conectar eventos
    this.bindOrderingInteractions(ex, container);
  },

  goToNextExercise(container) {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    sound.playClick();
    this.isAlreadyCorrect = false;
    this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.currentExercisesList.length;
    this.currentExIdLoaded = null;
    this.renderOrderingModule(container);
  },

  goToPrevExercise(container) {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    sound.playClick();
    this.isAlreadyCorrect = false;
    this.currentExerciseIndex = (this.currentExerciseIndex - 1 + this.currentExercisesList.length) % this.currentExercisesList.length;
    this.currentExIdLoaded = null;
    this.renderOrderingModule(container);
  },

  bindOrderingInteractions(ex, container) {
    // Filtro de nível
    document.getElementById("level-select")?.addEventListener("change", (e) => {
      if (this.autoAdvanceTimer) clearTimeout(this.autoAdvanceTimer);
      this.currentLevelFilter = e.target.value;
      this.currentExerciseIndex = 0;
      this.currentExIdLoaded = null;
      this.isAlreadyCorrect = false;
      this.renderOrderingModule(container);
    });

    // Navegação direta: Próxima Frase
    document.getElementById("btn-skip-exercise")?.addEventListener("click", () => {
      this.goToNextExercise(container);
    });

    // Navegação direta: Frase Anterior
    document.getElementById("btn-prev-exercise")?.addEventListener("click", () => {
      this.goToPrevExercise(container);
    });

    // Clique no banco de palavras -> move para a frase
    const bankContainer = document.getElementById("bank-words-container");
    bankContainer?.querySelectorAll(".word-chip.in-bank").forEach(btn => {
      btn.addEventListener("click", () => {
        const bankIdx = parseInt(btn.dataset.bankIndex, 10);
        const word = this.bankWords[bankIdx];
        if (word !== undefined) {
          sound.playClick();
          this.bankWords.splice(bankIdx, 1);
          this.selectedWords.push(word);
          this.renderOrderingModule(container);
        }
      });
    });

    // Clique na frase montada -> devolve para o banco
    const sentenceContainer = document.getElementById("selected-words-container");
    sentenceContainer?.querySelectorAll(".word-chip.in-sentence").forEach(chip => {
      chip.addEventListener("click", () => {
        const idx = parseInt(chip.dataset.index, 10);
        const word = this.selectedWords[idx];
        if (word !== undefined) {
          sound.playUndo();
          this.selectedWords.splice(idx, 1);
          this.bankWords.push(word);
          this.renderOrderingModule(container);
        }
      });
    });

    // Ouvir a frase falada
    document.getElementById("btn-listen-sentence")?.addEventListener("click", () => {
      const sentence = this.selectedWords.join(" ");
      GrammarEngine.speakText(sentence);
    });

    // Botão Limpar / Recomeçar
    document.getElementById("btn-reset-words")?.addEventListener("click", () => {
      sound.playUndo();
      this.bankWords = this.shuffleArray([...ex.words]);
      this.selectedWords = [];
      this.isAlreadyCorrect = false;
      this.renderOrderingModule(container);
    });

    // Dica pedagógica
    document.getElementById("btn-show-hint")?.addEventListener("click", () => {
      const fb = document.getElementById("feedback-display-area");
      if (fb) {
        fb.innerHTML = `
          <div class="feedback-card info anim-slide-down">
            <div class="fb-icon">💡</div>
            <div class="fb-content">
              <h4>Dica Pedagógica</h4>
              <p>${ex.hint || "Organize primeiro quem realiza a ação (o sujeito), depois o verbo e os complementos."}</p>
            </div>
          </div>
        `;
      }
    });

    // Verificar Frase
    document.getElementById("btn-verify-ordering")?.addEventListener("click", () => {
      // Se a frase já estava certa e o aluno clicou de novo em verificar, avança direto!
      if (this.isAlreadyCorrect) {
        this.goToNextExercise(container);
        return;
      }

      const evaluation = GrammarEngine.evaluateOrdering(this.selectedWords, ex);
      this.displayEvaluationFeedback(evaluation, ex, container);
    });
  },

  displayEvaluationFeedback(evaluation, ex, container) {
    const fbArea = document.getElementById("feedback-display-area");
    if (!fbArea) return;

    const student = store.getActiveStudent();

    if (evaluation.isCorrect) {
      sound.playSuccess();
      this.triggerConfetti();
      this.isAlreadyCorrect = true;

      store.recordAttempt(
        student.id,
        ex.id,
        true,
        evaluation.score,
        evaluation.userSentence,
        null
      );

      fbArea.innerHTML = `
        <div class="feedback-card success anim-bounce">
          <div class="fb-icon">🎉</div>
          <div class="fb-content">
            <h4>${evaluation.title}</h4>
            <p>${evaluation.message}</p>
            <div class="feedback-extra-points">
              <span>+${evaluation.score} Pontos Conquistados! ⭐</span>
            </div>
            <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #047857;">
              ⏳ Avançando para a próxima frase em 2 segundos...
            </p>
            <div class="fb-actions">
              <button class="btn btn-accent btn-large" id="btn-next-exercise">
                Próxima Frase Agora ➔
              </button>
            </div>
          </div>
        </div>
      `;

      // Atualiza o texto do botão principal para indicar avanço
      const verifyBtn = document.getElementById("btn-verify-ordering");
      if (verifyBtn) {
        verifyBtn.innerHTML = "Próxima Frase ➔";
        verifyBtn.classList.remove("btn-primary");
        verifyBtn.classList.add("btn-accent");
      }

      // Transição automática para a próxima frase em 2.2 segundos
      if (this.autoAdvanceTimer) clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = setTimeout(() => {
        this.goToNextExercise(container);
      }, 2200);

      document.getElementById("btn-next-exercise")?.addEventListener("click", () => {
        this.goToNextExercise(container);
      });
    } else {
      sound.playError();
      this.isAlreadyCorrect = false;

      store.recordAttempt(
        student.id,
        ex.id,
        false,
        0,
        evaluation.userSentence,
        evaluation.mistakeCategory
      );

      fbArea.innerHTML = `
        <div class="feedback-card ${evaluation.feedbackType} anim-shake">
          <div class="fb-icon">⚠️</div>
          <div class="fb-content">
            <h4>${evaluation.title}</h4>
            <p>${evaluation.message}</p>
            ${evaluation.expectedPreview ? `
              <div class="expected-preview-box">
                <small>Ordem esperada de exemplo:</small>
                <code>${evaluation.expectedPreview}</code>
              </div>
            ` : ""}
            <div class="fb-actions">
              <button class="btn btn-secondary" id="btn-try-again">Tentar Novamente</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("btn-try-again")?.addEventListener("click", () => {
        sound.playClick();
        fbArea.innerHTML = "";
      });
    }
  },

  // ==========================================
  // 2. MÓDULO: MINI AULAS EXPLICATIVAS
  // ==========================================
  renderLessonsModule(container) {
    const lessons = store.getAllLessons();

    container.innerHTML = `
      <div class="lessons-overview anim-fade-in">
        <div class="lessons-header-box">
          <h2>📖 Mini Aulas de Organização de Frases</h2>
          <p>Conceitos claros, exemplos visuais e dicas para dominar a estrutura da língua portuguesa.</p>
        </div>

        <div class="lessons-grid">
          ${lessons.map((lesson, idx) => `
            <div class="lesson-card" data-lesson-id="${lesson.id}">
              <div class="lesson-card-header">
                <span class="lesson-icon">${lesson.icon || "📚"}</span>
                <span class="lesson-level badge-level ${lesson.level ? lesson.level.toLowerCase() : "fácil"}">${lesson.level}</span>
              </div>
              <h3 class="lesson-title">${lesson.title}</h3>
              <p class="lesson-summary">${lesson.summary}</p>
              <div class="lesson-card-footer">
                <span class="lesson-category">${lesson.category}</span>
                <button class="btn btn-sm btn-primary">Abrir Aula ➔</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    container.querySelectorAll(".lesson-card").forEach(card => {
      card.addEventListener("click", () => {
        sound.playClick();
        const id = card.dataset.lessonId;
        this.openLessonModal(id);
      });
    });
  },

  openLessonModal(lessonId) {
    const lesson = store.getLessonById(lessonId);
    if (!lesson) return;

    const modal = document.getElementById("general-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card modal-large anim-scale-up">
          <div class="modal-header">
            <div class="modal-title-with-icon">
              <span class="modal-icon">${lesson.icon || "📖"}</span>
              <div>
                <h2>${lesson.title}</h2>
                <span class="badge-level ${lesson.level.toLowerCase()}">${lesson.level}</span>
              </div>
            </div>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body lesson-detail-body">
            <div class="lesson-rich-content">
              ${lesson.content}
            </div>

            ${lesson.quickCheck ? `
              <div class="lesson-quickcheck-box">
                <h4>🎯 Teste Rápido de Fixação</h4>
                <p><strong>${lesson.quickCheck.question}</strong></p>
                <div class="quickcheck-options">
                  ${lesson.quickCheck.options.map((opt, i) => `
                    <button class="quickcheck-opt-btn" data-opt-index="${i}">
                      ${opt}
                    </button>
                  `).join("")}
                </div>
                <div id="quickcheck-feedback" class="quickcheck-feedback-area"></div>
              </div>
            ` : ""}
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-close-footer">Fechar Aula</button>
            <button class="btn btn-primary" id="btn-go-practice">Ir Praticar Exercícios ➔</button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = "block";

    const closeModal = () => {
      modal.style.display = "none";
      modal.innerHTML = "";
    };

    document.getElementById("modal-close")?.addEventListener("click", closeModal);
    document.getElementById("modal-close-footer")?.addEventListener("click", closeModal);
    document.getElementById("btn-go-practice")?.addEventListener("click", () => {
      closeModal();
      this.switchTab("ordenacao");
    });

    // Quickcheck interativo dentro da aula
    if (lesson.quickCheck) {
      modal.querySelectorAll(".quickcheck-opt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const optIdx = parseInt(btn.dataset.optIndex, 10);
          const isCorrect = optIdx === lesson.quickCheck.correctIndex;
          const fbArea = document.getElementById("quickcheck-feedback");

          modal.querySelectorAll(".quickcheck-opt-btn").forEach(b => {
            b.classList.remove("selected-correct", "selected-wrong");
          });

          if (isCorrect) {
            sound.playSuccess();
            btn.classList.add("selected-correct");
            fbArea.innerHTML = `
              <div class="quickcheck-success">
                ✅ <strong>Correto!</strong> ${lesson.quickCheck.explanation}
              </div>
            `;
          } else {
            sound.playError();
            btn.classList.add("selected-wrong");
            fbArea.innerHTML = `
              <div class="quickcheck-error">
                ❌ <strong>Tente rever a regra:</strong> ${lesson.quickCheck.explanation}
              </div>
            `;
          }
        });
      });
    }
  },

  // ==========================================
  // 3. MÓDULO: IDENTIFICAÇÃO DE ELEMENTOS (DETETIVE)
  // ==========================================
  renderIdentificationModule(container) {
    if (this.identAdvanceTimer) {
      clearTimeout(this.identAdvanceTimer);
      this.identAdvanceTimer = null;
    }

    const exercises = store.getAllExercises().filter(e => e.type === "identificacao");

    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state-card"><p>Nenhum exercício de identificação disponível no momento.</p></div>`;
      return;
    }

    if (this.currentIdentIndex === undefined || this.currentIdentIndex >= exercises.length) {
      this.currentIdentIndex = 0;
    }

    const ex = exercises[this.currentIdentIndex];

    container.innerHTML = `
      <div class="exercise-card anim-fade-in">
        <div class="exercise-top-bar">
          <div class="level-badges-row">
            <span class="badge-level ${ex.level.toLowerCase()}">${ex.level}</span>
            <span class="category-tag">Detetive de Frases</span>
            <span class="points-badge">+${ex.points || 10} Pontos</span>
          </div>
          <div class="exercise-counter">
            Desafio <strong>${this.currentIdentIndex + 1}</strong> de <strong>${exercises.length}</strong>
          </div>
        </div>

        <div class="prompt-box detective-prompt">
          <div class="prompt-icon">🔍</div>
          <div class="prompt-text">
            <h3>${ex.prompt}</h3>
            <p class="prompt-subtitle">Analise a oração e encontre o elemento gramatical solicitado.</p>
          </div>
        </div>

        <div class="sentence-highlight-display">
          <p class="sentence-text">"${ex.sentence}"</p>
        </div>

        <div class="identification-options-grid">
          ${ex.options.map((opt, i) => `
            <button class="ident-option-card anim-pop" data-option="${opt}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join("")}
        </div>

        <div id="ident-feedback-area" class="feedback-container"></div>

        <!-- Barra de Navegação -->
        <div class="exercise-action-buttons">
          <button class="btn btn-secondary" id="btn-prev-ident" title="Desafio anterior">
            ⬅ Desafio Anterior
          </button>
          <button class="btn btn-outline" id="btn-skip-ident" title="Pular para o próximo desafio">
            Próximo Desafio ➔
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-prev-ident")?.addEventListener("click", () => {
      if (this.identAdvanceTimer) clearTimeout(this.identAdvanceTimer);
      sound.playClick();
      this.currentIdentIndex = (this.currentIdentIndex - 1 + exercises.length) % exercises.length;
      this.renderIdentificationModule(container);
    });

    document.getElementById("btn-skip-ident")?.addEventListener("click", () => {
      if (this.identAdvanceTimer) clearTimeout(this.identAdvanceTimer);
      sound.playClick();
      this.currentIdentIndex = (this.currentIdentIndex + 1) % exercises.length;
      this.renderIdentificationModule(container);
    });

    let answered = false;
    container.querySelectorAll(".ident-option-card").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        container.querySelectorAll(".ident-option-card").forEach(b => {
          b.disabled = true;
          b.style.cursor = "default";
        });

        const selected = btn.dataset.option;
        const evaluation = GrammarEngine.evaluateIdentification(selected, ex);
        const fbArea = document.getElementById("ident-feedback-area");
        const student = store.getActiveStudent();

        if (evaluation.isCorrect) {
          sound.playSuccess();
          this.triggerConfetti();
          btn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, true, evaluation.score, selected, null);

          fbArea.innerHTML = `
            <div class="feedback-card success anim-bounce">
              <div class="fb-icon">🎯</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                ${evaluation.details ? `
                  <div class="elements-breakdown-tags">
                    <span class="pill-role role-sujeito">Sujeito: ${evaluation.details.sujeito}</span>
                    <span class="pill-role role-verbo">Verbo: ${evaluation.details.verbo}</span>
                    <span class="pill-role role-predicado">Predicado: ${evaluation.details.predicado}</span>
                  </div>
                ` : ""}
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #047857;">
                  ⏳ Próximo desafio em 2 segundos...
                </p>
                <div class="fb-actions">
                  <button class="btn btn-accent btn-large" id="btn-next-ident">Próximo Desafio Agora ➔</button>
                </div>
              </div>
            </div>
          `;

          this.identAdvanceTimer = setTimeout(() => {
            this.currentIdentIndex = (this.currentIdentIndex + 1) % exercises.length;
            this.renderIdentificationModule(container);
          }, 2200);

          document.getElementById("btn-next-ident")?.addEventListener("click", () => {
            if (this.identAdvanceTimer) clearTimeout(this.identAdvanceTimer);
            sound.playClick();
            this.currentIdentIndex = (this.currentIdentIndex + 1) % exercises.length;
            this.renderIdentificationModule(container);
          });
        } else {
          sound.playError();
          btn.classList.add("wrong-highlight");

          // Destaca a opção correta
          const correctBtn = container.querySelector(`.ident-option-card[data-option="${ex.correctOption}"]`);
          if (correctBtn) correctBtn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, false, 0, selected, evaluation.mistakeCategory);

          fbArea.innerHTML = `
            <div class="feedback-card error anim-shake">
              <div class="fb-icon">💡</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #B91C1C;">
                  ⏳ Avançando para o próximo desafio em 3 segundos...
                </p>
                <div class="fb-actions" style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                  <button class="btn btn-primary" id="btn-next-ident">Próximo Desafio Agora ➔</button>
                  <button class="btn btn-secondary" id="btn-retry-ident">Tentar Novamente</button>
                </div>
              </div>
            </div>
          `;

          this.identAdvanceTimer = setTimeout(() => {
            this.currentIdentIndex = (this.currentIdentIndex + 1) % exercises.length;
            this.renderIdentificationModule(container);
          }, 3200);

          document.getElementById("btn-next-ident")?.addEventListener("click", () => {
            if (this.identAdvanceTimer) clearTimeout(this.identAdvanceTimer);
            sound.playClick();
            this.currentIdentIndex = (this.currentIdentIndex + 1) % exercises.length;
            this.renderIdentificationModule(container);
          });

          document.getElementById("btn-retry-ident")?.addEventListener("click", () => {
            if (this.identAdvanceTimer) clearTimeout(this.identAdvanceTimer);
            sound.playClick();
            this.renderIdentificationModule(container);
          });
        }
      });
    });
  },

  // ==========================================
  // 4. MÓDULO: CORREÇÃO E CONSTRUÇÃO (DESAFIO DO EDITOR)
  // ==========================================
  renderCorrectionModule(container) {
    if (this.corrAdvanceTimer) {
      clearTimeout(this.corrAdvanceTimer);
      this.corrAdvanceTimer = null;
    }

    const exercises = store.getAllExercises().filter(e => e.type === "correcao");

    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state-card"><p>Nenhum exercício de correção disponível.</p></div>`;
      return;
    }

    if (this.currentCorrIndex === undefined || this.currentCorrIndex >= exercises.length) {
      this.currentCorrIndex = 0;
    }

    const ex = exercises[this.currentCorrIndex];

    container.innerHTML = `
      <div class="exercise-card anim-fade-in">
        <div class="exercise-top-bar">
          <div class="level-badges-row">
            <span class="badge-level ${ex.level.toLowerCase()}">${ex.level}</span>
            <span class="category-tag">${ex.category || "Correção Gramatical"}</span>
            <span class="points-badge">+${ex.points || 15} Pontos</span>
          </div>
          <div class="exercise-counter">
            Exercício <strong>${this.currentCorrIndex + 1}</strong> de <strong>${exercises.length}</strong>
          </div>
        </div>

        <div class="prompt-box editor-prompt">
          <div class="prompt-icon">✏️</div>
          <div class="prompt-text">
            <h3>${ex.prompt}</h3>
            <p class="prompt-subtitle">Observe a frase com erro e escolha a versão correta.</p>
          </div>
        </div>

        <div class="faulty-sentence-box">
          <span class="faulty-tag">Frase com Erro:</span>
          <p class="faulty-text">"${ex.faultySentence}"</p>
        </div>

        <div class="quiz-options-list">
          ${ex.options.map((opt, i) => `
            <button class="quiz-option-btn anim-pop" data-opt-idx="${i}">
              <span class="opt-marker">${String.fromCharCode(65 + i)}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join("")}
        </div>

        <div id="correction-feedback-area" class="feedback-container"></div>

        <!-- Barra de Navegação -->
        <div class="exercise-action-buttons">
          <button class="btn btn-secondary" id="btn-prev-corr" title="Correção anterior">
            ⬅ Correção Anterior
          </button>
          <button class="btn btn-outline" id="btn-skip-corr" title="Pular para a próxima correção">
            Próxima Correção ➔
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-prev-corr")?.addEventListener("click", () => {
      if (this.corrAdvanceTimer) clearTimeout(this.corrAdvanceTimer);
      sound.playClick();
      this.currentCorrIndex = (this.currentCorrIndex - 1 + exercises.length) % exercises.length;
      this.renderCorrectionModule(container);
    });

    document.getElementById("btn-skip-corr")?.addEventListener("click", () => {
      if (this.corrAdvanceTimer) clearTimeout(this.corrAdvanceTimer);
      sound.playClick();
      this.currentCorrIndex = (this.currentCorrIndex + 1) % exercises.length;
      this.renderCorrectionModule(container);
    });

    let answered = false;
    container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        container.querySelectorAll(".quiz-option-btn").forEach(b => {
          b.disabled = true;
          b.style.cursor = "default";
        });

        const idx = parseInt(btn.dataset.optIdx, 10);
        const evaluation = GrammarEngine.evaluateQuiz(idx, ex);
        const fbArea = document.getElementById("correction-feedback-area");
        const student = store.getActiveStudent();

        if (evaluation.isCorrect) {
          sound.playSuccess();
          this.triggerConfetti();
          btn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, true, evaluation.score, ex.options[idx], null);

          fbArea.innerHTML = `
            <div class="feedback-card success anim-bounce">
              <div class="fb-icon">🎉</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #047857;">
                  ⏳ Próxima correção em 2 segundos...
                </p>
                <div class="fb-actions">
                  <button class="btn btn-accent btn-large" id="btn-next-corr">Próxima Correção Agora ➔</button>
                </div>
              </div>
            </div>
          `;

          this.corrAdvanceTimer = setTimeout(() => {
            this.currentCorrIndex = (this.currentCorrIndex + 1) % exercises.length;
            this.renderCorrectionModule(container);
          }, 2200);

          document.getElementById("btn-next-corr")?.addEventListener("click", () => {
            if (this.corrAdvanceTimer) clearTimeout(this.corrAdvanceTimer);
            sound.playClick();
            this.currentCorrIndex = (this.currentCorrIndex + 1) % exercises.length;
            this.renderCorrectionModule(container);
          });
        } else {
          sound.playError();
          btn.classList.add("wrong-highlight");

          const correctBtn = container.querySelector(`.quiz-option-btn[data-opt-idx="${ex.correctIndex}"]`);
          if (correctBtn) correctBtn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, false, 0, ex.options[idx], evaluation.mistakeCategory);

          fbArea.innerHTML = `
            <div class="feedback-card error anim-shake">
              <div class="fb-icon">⚠️</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #B91C1C;">
                  ⏳ Avançando para a próxima correção em 3 segundos...
                </p>
                <div class="fb-actions" style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                  <button class="btn btn-primary" id="btn-next-corr">Próxima Correção Agora ➔</button>
                  <button class="btn btn-secondary" id="btn-retry-corr">Tentar Novamente</button>
                </div>
              </div>
            </div>
          `;

          this.corrAdvanceTimer = setTimeout(() => {
            this.currentCorrIndex = (this.currentCorrIndex + 1) % exercises.length;
            this.renderCorrectionModule(container);
          }, 3200);

          document.getElementById("btn-next-corr")?.addEventListener("click", () => {
            if (this.corrAdvanceTimer) clearTimeout(this.corrAdvanceTimer);
            sound.playClick();
            this.currentCorrIndex = (this.currentCorrIndex + 1) % exercises.length;
            this.renderCorrectionModule(container);
          });

          document.getElementById("btn-retry-corr")?.addEventListener("click", () => {
            if (this.corrAdvanceTimer) clearTimeout(this.corrAdvanceTimer);
            sound.playClick();
            this.renderCorrectionModule(container);
          });
        }
      });
    });
  },

  // ==========================================
  // 5. MÓDULO: QUIZ DE ESCOLHA MÚLTIPLA
  // ==========================================
  renderQuizModule(container) {
    if (this.quizAdvanceTimer) {
      clearTimeout(this.quizAdvanceTimer);
      this.quizAdvanceTimer = null;
    }

    const exercises = store.getAllExercises().filter(e => e.type === "quiz");

    if (exercises.length === 0) {
      container.innerHTML = `<div class="empty-state-card"><p>Nenhum quiz disponível.</p></div>`;
      return;
    }

    if (this.currentQuizIndex === undefined || this.currentQuizIndex >= exercises.length) {
      this.currentQuizIndex = 0;
    }

    const ex = exercises[this.currentQuizIndex];

    container.innerHTML = `
      <div class="exercise-card anim-fade-in">
        <div class="exercise-top-bar">
          <div class="level-badges-row">
            <span class="badge-level ${ex.level.toLowerCase()}">${ex.level}</span>
            <span class="category-tag">${ex.category || "Conceito"}</span>
            <span class="points-badge">+${ex.points || 10} Pontos</span>
          </div>
          <div class="exercise-counter">
            Questão <strong>${this.currentQuizIndex + 1}</strong> de <strong>${exercises.length}</strong>
          </div>
        </div>

        <div class="prompt-box quiz-prompt">
          <div class="prompt-icon">❓</div>
          <div class="prompt-text">
            <h3>${ex.prompt}</h3>
          </div>
        </div>

        <div class="quiz-options-list">
          ${ex.options.map((opt, i) => `
            <button class="quiz-option-btn anim-pop" data-opt-idx="${i}">
              <span class="opt-marker">${String.fromCharCode(65 + i)}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join("")}
        </div>

        <div id="quiz-feedback-area" class="feedback-container"></div>

        <!-- Barra de Navegação do Quiz -->
        <div class="exercise-action-buttons">
          <button class="btn btn-secondary" id="btn-prev-quiz" title="Pergunta anterior">
            ⬅ Pergunta Anterior
          </button>
          <button class="btn btn-outline" id="btn-skip-quiz" title="Pular para a próxima pergunta">
            Próxima Pergunta ➔
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-prev-quiz")?.addEventListener("click", () => {
      if (this.quizAdvanceTimer) clearTimeout(this.quizAdvanceTimer);
      sound.playClick();
      this.currentQuizIndex = (this.currentQuizIndex - 1 + exercises.length) % exercises.length;
      this.renderQuizModule(container);
    });

    document.getElementById("btn-skip-quiz")?.addEventListener("click", () => {
      if (this.quizAdvanceTimer) clearTimeout(this.quizAdvanceTimer);
      sound.playClick();
      this.currentQuizIndex = (this.currentQuizIndex + 1) % exercises.length;
      this.renderQuizModule(container);
    });

    let answered = false;
    container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        container.querySelectorAll(".quiz-option-btn").forEach(b => {
          b.disabled = true;
          b.style.cursor = "default";
        });

        const idx = parseInt(btn.dataset.optIdx, 10);
        const evaluation = GrammarEngine.evaluateQuiz(idx, ex);
        const fbArea = document.getElementById("quiz-feedback-area");
        const student = store.getActiveStudent();

        if (evaluation.isCorrect) {
          sound.playSuccess();
          this.triggerConfetti();
          btn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, true, evaluation.score, ex.options[idx], null);

          fbArea.innerHTML = `
            <div class="feedback-card success anim-bounce">
              <div class="fb-icon">🌟</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #047857;">
                  ⏳ Próxima pergunta em 2 segundos...
                </p>
                <div class="fb-actions">
                  <button class="btn btn-accent btn-large" id="btn-next-quiz">Próxima Pergunta Agora ➔</button>
                </div>
              </div>
            </div>
          `;

          this.quizAdvanceTimer = setTimeout(() => {
            this.currentQuizIndex = (this.currentQuizIndex + 1) % exercises.length;
            this.renderQuizModule(container);
          }, 2200);

          document.getElementById("btn-next-quiz")?.addEventListener("click", () => {
            if (this.quizAdvanceTimer) clearTimeout(this.quizAdvanceTimer);
            sound.playClick();
            this.currentQuizIndex = (this.currentQuizIndex + 1) % exercises.length;
            this.renderQuizModule(container);
          });
        } else {
          sound.playError();
          btn.classList.add("wrong-highlight");

          // Destaca a opção correta para o aluno aprender
          const correctBtn = container.querySelector(`.quiz-option-btn[data-opt-idx="${ex.correctIndex}"]`);
          if (correctBtn) correctBtn.classList.add("correct-highlight");

          store.recordAttempt(student.id, ex.id, false, 0, ex.options[idx], evaluation.mistakeCategory);

          fbArea.innerHTML = `
            <div class="feedback-card error anim-shake">
              <div class="fb-icon">⚠️</div>
              <div class="fb-content">
                <h4>${evaluation.title}</h4>
                <p>${evaluation.message}</p>
                <p class="auto-advance-msg" style="margin-top: 0.6rem; font-weight: 600; color: #B91C1C;">
                  ⏳ Avançando para a próxima pergunta em 3 segundos...
                </p>
                <div class="fb-actions" style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                  <button class="btn btn-primary" id="btn-next-quiz">Próxima Pergunta Agora ➔</button>
                  <button class="btn btn-secondary" id="btn-retry-quiz">Tentar Novamente</button>
                </div>
              </div>
            </div>
          `;

          this.quizAdvanceTimer = setTimeout(() => {
            this.currentQuizIndex = (this.currentQuizIndex + 1) % exercises.length;
            this.renderQuizModule(container);
          }, 3200);

          document.getElementById("btn-next-quiz")?.addEventListener("click", () => {
            if (this.quizAdvanceTimer) clearTimeout(this.quizAdvanceTimer);
            sound.playClick();
            this.currentQuizIndex = (this.currentQuizIndex + 1) % exercises.length;
            this.renderQuizModule(container);
          });

          document.getElementById("btn-retry-quiz")?.addEventListener("click", () => {
            if (this.quizAdvanceTimer) clearTimeout(this.quizAdvanceTimer);
            sound.playClick();
            this.renderQuizModule(container);
          });
        }
      });
    });
  },

  // ==========================================
  // 6. MÓDULO: MEU PROGRESSO (DASHBOARD DO ALUNO)
  // ==========================================
  renderProgressModule(container) {
    const student = store.getActiveStudent();
    if (!student) return;

    const totalAttempts = student.attemptsCount || 0;
    const accuracy = totalAttempts > 0 ? Math.round((student.correctCount / totalAttempts) * 100) : 0;

    const badges = [
      { id: "b1", title: "Iniciante Curioso", icon: "🌱", desc: "Completou seu primeiro exercício", unlocked: (student.completedExercises || []).length >= 1 },
      { id: "b2", title: "Mestre da Ordem SVO", icon: "🧩", desc: "Organizou mais de 3 frases corretamente", unlocked: (student.completedExercises || []).length >= 3 },
      { id: "b3", title: "Sentinela da Pontuação", icon: "🛡️", desc: "Alcançou mais de 80 pontos", unlocked: (student.score || 0) >= 80 },
      { id: "b4", title: "Detetive Gramatical Ouro", icon: "👑", desc: "Alcançou mais de 120 pontos", unlocked: (student.score || 0) >= 120 }
    ];

    container.innerHTML = `
      <div class="progress-module-view anim-fade-in">
        <div class="progress-hero-card">
          <div class="hero-avatar">${student.avatar}</div>
          <div class="hero-details">
            <h2>Relatório de Desempenho de ${student.name}</h2>
            <p>Acompanhe sua evolução na organização e construção de frases da Língua Portuguesa.</p>
          </div>
        </div>

        <div class="stats-overview-grid">
          <div class="stat-card">
            <div class="stat-card-icon">🎯</div>
            <div class="stat-card-val">${accuracy}%</div>
            <div class="stat-card-label">Taxa de Acertos</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">📝</div>
            <div class="stat-card-val">${student.completedExercises ? student.completedExercises.length : 0}</div>
            <div class="stat-card-label">Exercícios Concluídos</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">⭐</div>
            <div class="stat-card-val">${student.score || 0}</div>
            <div class="stat-card-label">Pontuação Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">🔥</div>
            <div class="stat-card-val">${student.streak || 1} dias</div>
            <div class="stat-card-label">Sequência Ativa</div>
          </div>
        </div>

        <!-- Medalhas Conquistadas -->
        <div class="badges-section-card">
          <h3>🏅 Medalhas e Conquistas</h3>
          <div class="badges-grid">
            ${badges.map(b => `
              <div class="badge-item ${b.unlocked ? "unlocked" : "locked"}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-name">${b.title}</div>
                <div class="badge-desc">${b.desc}</div>
                <div class="badge-status">${b.unlocked ? "Conquistada! ✨" : "Bloqueada"}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Conteúdos para Praticar Mais -->
        <div class="focus-areas-card">
          <h3>📌 Conteúdos para Você Focar</h3>
          ${student.difficulties && student.difficulties.length > 0 ? `
            <p>O sistema identificou que você pode se beneficiar de mais prática nos seguintes tópicos:</p>
            <div class="difficulties-chips">
              ${student.difficulties.map(d => `<span class="diff-chip">⚠️ ${d}</span>`).join("")}
            </div>
            <div class="recommendation-callout">
              💡 <strong>Recomendação do Professor:</strong> Revise as mini aulas de "Maiúsculas e Pontuação Final" e pratique exercícios do nível Intermédio.
            </div>
          ` : `
            <p class="great-job-text">🎉 Parabéns! Você não possui pontos críticos pendentes. Continue mantendo esse ótimo padrão!</p>
          `}
        </div>

        <!-- Histórico Recente -->
        <div class="history-table-card">
          <h3>🕒 Histórico Recente de Atividades</h3>
          ${student.history && student.history.length > 0 ? `
            <div class="table-responsive">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Resultado</th>
                    <th>Pontos</th>
                    <th>Sua Resposta</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  ${student.history.slice(0, 10).map(h => `
                    <tr>
                      <td>${h.date}</td>
                      <td>
                        <span class="status-pill ${h.correct ? "status-success" : "status-error"}">
                          ${h.correct ? "✅ Acertou" : "❌ Precisa Ajustar"}
                        </span>
                      </td>
                      <td>+${h.scoreEarned}</td>
                      <td class="history-answer-cell"><code>${h.userAnswer || "-"}</code></td>
                      <td>${h.mistake || (h.correct ? "Correto" : "Revisar")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `
            <p>Você ainda não realizou nenhum exercício registrado.</p>
          `}
        </div>
      </div>
    `;
  },

  // Modal para Troca ou Criação de Aluno
  openStudentModal() {
    const students = store.getAllStudents();
    const activeStudent = store.getActiveStudent();
    const modal = document.getElementById("general-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card anim-scale-up">
          <div class="modal-header">
            <h2>🎓 Escolha ou Cadastre seu Perfil de Aluno</h2>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body">
            <p>Selecione um aluno da turma para testar ou crie o seu próprio perfil:</p>
            
            <div class="students-selection-list">
              ${students.map(s => `
                <div class="student-select-card ${s.id === activeStudent.id ? "is-selected" : ""}" data-student-id="${s.id}">
                  <span class="select-avatar">${s.avatar}</span>
                  <div class="select-info">
                    <h4>${s.name}</h4>
                    <span>${s.class} • ${s.score || 0} pts</span>
                  </div>
                  ${s.id === activeStudent.id ? `<span class="current-badge">Ativo</span>` : ""}
                </div>
              `).join("")}
            </div>

            <hr class="modal-divider"/>

            <div class="create-student-form">
              <h4>Novo Aluno</h4>
              <div class="form-row">
                <input type="text" id="new-student-name" placeholder="Nome do aluno (ex: Gabriel Costa)" class="styled-input" />
                <select id="new-student-avatar" class="styled-select avatar-picker">
                  <option value="👦">👦 Menino</option>
                  <option value="👧">👧 Menina</option>
                  <option value="🧑">🧑 Estudante</option>
                  <option value="🦊">🦊 Raposa</option>
                  <option value="🚀">🚀 Foguete</option>
                </select>
                <button class="btn btn-primary" id="btn-create-student">Cadastrar</button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-close-footer">Fechar</button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = "block";

    const closeModal = () => {
      modal.style.display = "none";
      modal.innerHTML = "";
    };

    document.getElementById("modal-close")?.addEventListener("click", closeModal);
    document.getElementById("modal-close-footer")?.addEventListener("click", closeModal);

    modal.querySelectorAll(".student-select-card").forEach(card => {
      card.addEventListener("click", () => {
        sound.playClick();
        store.setActiveStudentId(card.dataset.studentId);
        closeModal();
      });
    });

    document.getElementById("btn-create-student")?.addEventListener("click", () => {
      const nameInput = document.getElementById("new-student-name");
      const avatarSelect = document.getElementById("new-student-avatar");
      const name = nameInput.value.trim();

      if (name) {
        sound.playSuccess();
        store.createNewStudent(name, avatarSelect.value);
        closeModal();
      } else {
        nameInput.focus();
      }
    });
  },

  // Efeito festivo de Confetes via Canvas
  triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#3B82F6", "#8B5CF6"];

    for (let i = 0; i < 70; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.4),
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 4 + 2,
        tilt: Math.random() * 10
      });
    }

    let frames = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.tilt += 0.1;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      frames++;
      if (frames < 75) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  },

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
};
