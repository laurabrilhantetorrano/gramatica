// teacher-view.js - Painel de Controle e Gestão Pedagógica do Professor

import { store } from "./state.js";
import { sound } from "./sound.js";

export const TeacherView = {
  activeTab: "turma", // turma | atividades | conteudos | relatorios
  exerciseSearchTerm: "",
  exerciseTypeFilter: "todos",

  init() {
    this.bindEvents();
    this.renderTabsNav();
    this.renderActiveTab();
  },

  bindEvents() {
    store.subscribe((event) => {
      if (["students_updated", "exercises_updated", "lessons_updated", "rules_updated", "data_reset"].includes(event)) {
        this.renderActiveTab();
      }
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    this.renderTabsNav();
    this.renderActiveTab();
  },

  renderTabsNav() {
    const navItems = [
      { id: "turma", label: "📊 Desempenho da Turma", icon: "📈" },
      { id: "atividades", label: "📝 Gestão de Atividades", icon: "✏️" },
      { id: "conteudos", label: "📚 Regras e Conteúdos", icon: "📖" },
      { id: "relatorios", label: "📋 Relatório de Exportação", icon: "🖨️" }
    ];

    const navContainer = document.getElementById("teacher-subtabs");
    if (!navContainer) return;

    navContainer.innerHTML = navItems
      .map(
        item => `
        <button class="teacher-tab-btn ${this.activeTab === item.id ? "active" : ""}" data-tab="${item.id}">
          <span>${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `
      )
      .join("");

    navContainer.querySelectorAll(".teacher-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        this.switchTab(btn.dataset.tab);
      });
    });
  },

  renderActiveTab() {
    const container = document.getElementById("teacher-content-area");
    if (!container) return;

    switch (this.activeTab) {
      case "turma":
        this.renderClassroomOverview(container);
        break;
      case "atividades":
        this.renderActivitiesManagement(container);
        break;
      case "conteudos":
        this.renderContentManagement(container);
        break;
      case "relatorios":
        this.renderExportReport(container);
        break;
      default:
        this.renderClassroomOverview(container);
    }
  },

  // ==========================================
  // 1. DESEMPENHO DA TURMA E ACOMPANHAMENTO
  // ==========================================
  renderClassroomOverview(container) {
    const analytics = store.getClassAnalytics();

    container.innerHTML = `
      <div class="teacher-dashboard anim-fade-in">
        <div class="teacher-welcome-card">
          <div class="welcome-text">
            <h2>Painel Pedagógico da Turma — 5º Ano</h2>
            <p>Monitore acertos, identifique as principais dúvidas de sintaxe e envie orientações personalizadas aos alunos.</p>
          </div>
          <div class="quick-teacher-actions">
            <button class="btn btn-outline-white" id="btn-quick-new-activity">
              + Nova Atividade
            </button>
            <button class="btn btn-outline-white" id="btn-reset-demo-data" title="Restaura os dados originais para teste">
              🔄 Restaurar Dados Demo
            </button>
          </div>
        </div>

        <!-- Indicadores Chave (KPIs) -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon blue">👥</div>
            <div class="kpi-value">${analytics.totalStudents}</div>
            <div class="kpi-label">Alunos Matriculados</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon green">🎯</div>
            <div class="kpi-value">${analytics.accuracyRate}%</div>
            <div class="kpi-label">Aproveitamento Médio</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon purple">📝</div>
            <div class="kpi-value">${analytics.totalAttempts}</div>
            <div class="kpi-label">Exercícios Realizados</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon yellow">⭐</div>
            <div class="kpi-value">${analytics.averageScore} pts</div>
            <div class="kpi-label">Média da Turma</div>
          </div>
        </div>

        <!-- Alerta de Dificuldades Frequentes -->
        <div class="difficulties-analysis-card">
          <div class="card-title-row">
            <h3>⚠️ Dificuldades Gramaticais Mais Frequentes na Turma</h3>
            <span class="badge-tag red">${analytics.topDifficulties.length} pontos de atenção</span>
          </div>
          <p>O motor de correção identificou padrões de erro recorrentes entre os estudantes:</p>
          <div class="difficulties-list">
            ${analytics.topDifficulties.length > 0 ? analytics.topDifficulties.map(d => `
              <div class="difficulty-alert-pill">
                <span class="diff-title">${d.name}</span>
                <span class="diff-count">${d.count} alunos afetados</span>
              </div>
            `).join("") : `<p class="text-muted">Nenhuma dificuldade crítica acumulada no momento.</p>`}
          </div>
        </div>

        <!-- Tabela de Alunos da Turma -->
        <div class="students-table-card">
          <div class="card-title-row">
            <h3>Lista de Alunos e Desempenho Individual</h3>
            <span class="text-muted">Clique em um aluno para ver histórico completo ou emitir feedback</span>
          </div>
          <div class="table-responsive">
            <table class="styled-table teacher-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Turma</th>
                  <th>Pontuação</th>
                  <th>Concluídos</th>
                  <th>Taxa de Acertos</th>
                  <th>Principais Desafios</th>
                  <th>Ações Pedagógicas</th>
                </tr>
              </thead>
              <tbody>
                ${analytics.studentsList.map(s => {
                  const studentTotal = s.attemptsCount || 0;
                  const studentAcc = studentTotal > 0 ? Math.round((s.correctCount / studentTotal) * 100) : 0;
                  return `
                    <tr>
                      <td>
                        <div class="table-student-name">
                          <span class="student-avatar-mini">${s.avatar}</span>
                          <strong>${s.name}</strong>
                        </div>
                      </td>
                      <td>${s.class}</td>
                      <td><span class="badge-tag purple">${s.score} pts</span></td>
                      <td>${(s.completedExercises || []).length} / ${analytics.totalExercisesAvailable}</td>
                      <td>
                        <div class="acc-meter-cell">
                          <span class="acc-val">${studentAcc}%</span>
                          <div class="mini-bar">
                            <div class="mini-bar-fill" style="width: ${studentAcc}%"></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        ${s.difficulties && s.difficulties.length > 0 
                          ? `<span class="diff-pill-cell" title="${s.difficulties.join(", ")}">${s.difficulties[0]}</span>` 
                          : `<span class="badge-tag green">Nenhum</span>`}
                      </td>
                      <td>
                        <div class="action-buttons-group">
                          <button class="btn btn-sm btn-outline btn-view-student" data-student-id="${s.id}">
                            🔍 Detalhes
                          </button>
                          <button class="btn btn-sm btn-primary btn-give-feedback" data-student-id="${s.id}">
                            💬 Feedback
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Conectar eventos do dashboard
    document.getElementById("btn-quick-new-activity")?.addEventListener("click", () => {
      this.openActivityModal();
    });

    document.getElementById("btn-reset-demo-data")?.addEventListener("click", () => {
      if (confirm("Deseja restaurar as atividades, lições e desempenhos iniciais de demonstração?")) {
        store.resetToDefaults();
        sound.playSuccess();
        alert("Dados restaurados com sucesso!");
      }
    });

    container.querySelectorAll(".btn-view-student").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.studentId;
        this.openStudentDetailModal(id);
      });
    });

    container.querySelectorAll(".btn-give-feedback").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.studentId;
        this.openFeedbackModal(id);
      });
    });
  },

  // Modal com Detalhes do Aluno e Respostas
  openStudentDetailModal(studentId) {
    const student = store.getAllStudents().find(s => s.id === studentId);
    if (!student) return;

    const modal = document.getElementById("general-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card modal-large anim-scale-up">
          <div class="modal-header">
            <div class="modal-title-with-icon">
              <span class="modal-icon">${student.avatar}</span>
              <div>
                <h2>Desempenho Detalhado: ${student.name}</h2>
                <span>${student.class} • ${student.score} Pontos Conquistados</span>
              </div>
            </div>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body">
            <div class="student-detail-summary">
              <div class="summary-box">
                <span class="s-label">Exercícios Tentados</span>
                <span class="s-num">${student.attemptsCount || 0}</span>
              </div>
              <div class="summary-box">
                <span class="s-label">Acertos</span>
                <span class="s-num text-success">${student.correctCount || 0}</span>
              </div>
              <div class="summary-box">
                <span class="s-label">Ajustes Necessários</span>
                <span class="s-num text-danger">${student.incorrectCount || 0}</span>
              </div>
            </div>

            <h4>Histórico de Respostas Dadas pelo Aluno</h4>
            <div class="table-responsive">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Status</th>
                    <th>Frase / Resposta do Aluno</th>
                    <th>Diagnóstico Pedagógico</th>
                  </tr>
                </thead>
                <tbody>
                  ${(student.history || []).map(h => `
                    <tr>
                      <td>${h.date}</td>
                      <td>
                        <span class="status-pill ${h.correct ? "status-success" : "status-error"}">
                          ${h.correct ? "Acertou" : "Errou"}
                        </span>
                      </td>
                      <td><code>${h.userAnswer || "-"}</code></td>
                      <td>${h.mistake || "Sem erros apontados"}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <div class="student-current-feedback-preview">
              <strong>Feedback Pedagógico Vigente:</strong>
              <p><em>"${student.teacherFeedback || "Nenhum recado cadastrado ainda."}"</em></p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-close-btn">Fechar</button>
            <button class="btn btn-primary" id="btn-edit-feedback-from-detail">Editar Feedback do Aluno</button>
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
    document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);
    document.getElementById("btn-edit-feedback-from-detail")?.addEventListener("click", () => {
      closeModal();
      this.openFeedbackModal(studentId);
    });
  },

  // Modal para Enviar / Editar Feedback Pedagógico
  openFeedbackModal(studentId) {
    const student = store.getAllStudents().find(s => s.id === studentId);
    if (!student) return;

    const modal = document.getElementById("general-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card anim-scale-up">
          <div class="modal-header">
            <h2>💬 Feedback Pedagógico para ${student.name}</h2>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body">
            <p>Escreva orientações de estudo, encorajamento ou dicas sobre as dificuldades mais recentes deste aluno. O recado aparecerá na página principal dele.</p>

            <div class="form-group">
              <label for="teacher-note-input"><strong>Mensagem do Professor:</strong></label>
              <textarea id="teacher-note-input" rows="4" class="styled-textarea" placeholder="Ex: Parabéns pelo progresso! Lembre-se de sempre colocar ponto final nas frases afirmativas...">${student.teacherFeedback || ""}</textarea>
            </div>

            <div class="quick-suggestions-row">
              <span class="sugg-label">Sugestões rápidas:</span>
              <button class="btn-chip-sugg" data-sugg="Excelente dedicação! Continue revisando a ordem SVO.">Ótimo trabalho!</button>
              <button class="btn-chip-sugg" data-sugg="Atenção especial à letra maiúscula no início e pontuação final.">Atenção à pontuação</button>
              <button class="btn-chip-sugg" data-sugg="Lembre-se de fazer a pergunta mágica 'Quem?' para encontrar o sujeito.">Dica do Sujeito</button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-close-btn">Cancelar</button>
            <button class="btn btn-primary" id="btn-save-feedback">Salvar Feedback</button>
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
    document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);

    modal.querySelectorAll(".btn-chip-sugg").forEach(btn => {
      btn.addEventListener("click", () => {
        const textarea = document.getElementById("teacher-note-input");
        if (textarea) textarea.value = btn.dataset.sugg;
      });
    });

    document.getElementById("btn-save-feedback")?.addEventListener("click", () => {
      const text = document.getElementById("teacher-note-input").value.trim();
      store.saveTeacherFeedback(studentId, text);
      sound.playSuccess();
      closeModal();
      this.renderActiveTab();
    });
  },

  // ==========================================
  // 2. GESTÃO DE ATIVIDADES (CRUD COMPLETO)
  // ==========================================
  renderActivitiesManagement(container) {
    let exercises = store.getAllExercises();

    if (this.exerciseTypeFilter !== "todos") {
      exercises = exercises.filter(e => e.type === this.exerciseTypeFilter);
    }

    if (this.exerciseSearchTerm) {
      const term = this.exerciseSearchTerm.toLowerCase();
      exercises = exercises.filter(e => 
        (e.prompt || "").toLowerCase().includes(term) ||
        (e.expected || "").toLowerCase().includes(term) ||
        (e.category || "").toLowerCase().includes(term)
      );
    }

    container.innerHTML = `
      <div class="activities-manager-view anim-fade-in">
        <div class="manager-header-bar">
          <div>
            <h2>📝 Gestão de Atividades e Exercícios</h2>
            <p>Crie novos desafios, edite frases existentes e configure critérios de aceitação flexíveis.</p>
          </div>
          <button class="btn btn-primary btn-large" id="btn-create-activity">
            + Cadastrar Nova Atividade
          </button>
        </div>

        <!-- Filtros e Busca -->
        <div class="filters-search-bar">
          <div class="search-input-group">
            <span class="search-icon">🔍</span>
            <input type="text" id="exercise-search-input" placeholder="Pesquisar por enunciado, categoria ou frase..." value="${this.exerciseSearchTerm}" class="styled-input" />
          </div>

          <div class="type-filter-group">
            <label for="filter-type">Tipo de Atividade:</label>
            <select id="filter-type" class="styled-select">
              <option value="todos" ${this.exerciseTypeFilter === "todos" ? "selected" : ""}>Todos os Tipos (${store.getAllExercises().length})</option>
              <option value="ordenacao" ${this.exerciseTypeFilter === "ordenacao" ? "selected" : ""}>🧩 Ordenação de Palavras</option>
              <option value="identificacao" ${this.exerciseTypeFilter === "identificacao" ? "selected" : ""}>🔍 Identificação de Elementos</option>
              <option value="correcao" ${this.exerciseTypeFilter === "correcao" ? "selected" : ""}>✏️ Correção de Frases</option>
              <option value="quiz" ${this.exerciseTypeFilter === "quiz" ? "selected" : ""}>❓ Quiz de Múltipla Escolha</option>
            </select>
          </div>
        </div>

        <!-- Tabela de Exercícios -->
        <div class="activities-table-card">
          <div class="table-responsive">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Dificuldade</th>
                  <th>Enunciado / Pergunta</th>
                  <th>Resposta Esperada / Gabarito</th>
                  <th>Pontos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${exercises.map(ex => `
                  <tr>
                    <td>
                      <span class="badge-tag type-${ex.type}">${this.getTypeLabel(ex.type)}</span>
                    </td>
                    <td>
                      <span class="badge-level ${(ex.level || "fácil").toLowerCase()}">${ex.level || "Fácil"}</span>
                    </td>
                    <td>
                      <strong>${ex.prompt}</strong>
                      <br><small class="text-muted">${ex.category || ""}</small>
                    </td>
                    <td>
                      <code>${ex.expected || ex.correctOption || (ex.options ? ex.options[ex.correctIndex] : "-")}</code>
                      ${ex.validAlternatives && ex.validAlternatives.length > 0 ? `
                        <br><small class="text-muted" title="${ex.validAlternatives.join(" | ")}">+${ex.validAlternatives.length} variações aceitas</small>
                      ` : ""}
                    </td>
                    <td>${ex.points || 10}</td>
                    <td>
                      <div class="action-buttons-group">
                        <button class="btn btn-sm btn-outline btn-edit-exercise" data-ex-id="${ex.id}" title="Editar">
                          ✏️ Editar
                        </button>
                        <button class="btn btn-sm btn-danger btn-delete-exercise" data-ex-id="${ex.id}" title="Excluir">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Conectar eventos
    document.getElementById("btn-create-activity")?.addEventListener("click", () => {
      this.openActivityModal();
    });

    document.getElementById("filter-type")?.addEventListener("change", (e) => {
      this.exerciseTypeFilter = e.target.value;
      this.renderActivitiesManagement(container);
    });

    document.getElementById("exercise-search-input")?.addEventListener("input", (e) => {
      this.exerciseSearchTerm = e.target.value;
      this.renderActivitiesManagement(container);
    });

    container.querySelectorAll(".btn-edit-exercise").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.exId;
        const ex = store.getExerciseById(id);
        if (ex) this.openActivityModal(ex);
      });
    });

    container.querySelectorAll(".btn-delete-exercise").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.exId;
        if (confirm("Tem certeza que deseja excluir esta atividade?")) {
          store.deleteExercise(id);
          sound.playUndo();
          this.renderActivitiesManagement(container);
        }
      });
    });
  },

  getTypeLabel(type) {
    switch (type) {
      case "ordenacao": return "🧩 Ordenação";
      case "identificacao": return "🔍 Identificação";
      case "correcao": return "✏️ Correção";
      case "quiz": return "❓ Quiz";
      default: return type;
    }
  },

  // Modal para Criar / Editar Atividade
  openActivityModal(existingExercise = null) {
    const isEdit = !!existingExercise;
    const modal = document.getElementById("general-modal");
    if (!modal) return;

    const currentType = existingExercise ? existingExercise.type : "ordenacao";

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card modal-large anim-scale-up">
          <div class="modal-header">
            <h2>${isEdit ? "✏️ Editar Atividade de Gramática" : "➕ Nova Atividade de Gramática"}</h2>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body form-body">
            <div class="form-grid-2">
              <div class="form-group">
                <label>Tipo de Atividade:</label>
                <select id="form-type" class="styled-select">
                  <option value="ordenacao" ${currentType === "ordenacao" ? "selected" : ""}>🧩 Ordenação de Palavras</option>
                  <option value="identificacao" ${currentType === "identificacao" ? "selected" : ""}>🔍 Identificação de Elementos</option>
                  <option value="correcao" ${currentType === "correcao" ? "selected" : ""}>✏️ Correção de Frases</option>
                  <option value="quiz" ${currentType === "quiz" ? "selected" : ""}>❓ Quiz de Múltipla Escolha</option>
                </select>
              </div>

              <div class="form-group">
                <label>Nível de Dificuldade:</label>
                <select id="form-level" class="styled-select">
                  <option value="Fácil" ${existingExercise?.level === "Fácil" ? "selected" : ""}>Fácil</option>
                  <option value="Intermédio" ${existingExercise?.level === "Intermédio" ? "selected" : ""}>Intermédio</option>
                  <option value="Avançado" ${existingExercise?.level === "Avançado" ? "selected" : ""}>Avançado</option>
                </select>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label>Categoria Gramatical:</label>
                <input type="text" id="form-category" class="styled-input" placeholder="Ex: Concordância Verbal, Ordem SVO, Tipos de Frases" value="${existingExercise?.category || "Estrutura de Frases"}" />
              </div>
              <div class="form-group">
                <label>Pontuação Atribuída:</label>
                <input type="number" id="form-points" class="styled-input" value="${existingExercise?.points || 10}" />
              </div>
            </div>

            <div class="form-group">
              <label>Enunciado / Instrução:</label>
              <textarea id="form-prompt" class="styled-textarea" rows="2" placeholder="Ex: Organize as palavras para formar uma frase correta.">${existingExercise?.prompt || ""}</textarea>
            </div>

            <!-- Campos específicos para Ordenação -->
            <div id="fields-ordenacao" class="type-specific-fields">
              <div class="form-group">
                <label>Palavras Embaralhadas (separadas por vírgula):</label>
                <input type="text" id="form-words" class="styled-input" placeholder="Ex: estuda, Maria, todos, os dias" value="${existingExercise?.words ? existingExercise.words.join(", ") : ""}" />
                <small class="field-hint">O sistema irá embaralhar as peças para o aluno organizar.</small>
              </div>

              <div class="form-group">
                <label>Resposta Esperada Principal:</label>
                <input type="text" id="form-expected" class="styled-input" placeholder="Ex: Maria estuda todos os dias." value="${existingExercise?.expected || ""}" />
              </div>

              <div class="form-group">
                <label>Outras Variações Sintáticas Aceitáveis (separadas por ponto e vírgula):</label>
                <input type="text" id="form-alternatives" class="styled-input" placeholder="Ex: Todos os dias Maria estuda.; Todos os dias, Maria estuda." value="${existingExercise?.validAlternatives ? existingExercise.validAlternatives.join("; ") : ""}" />
                <small class="field-hint">Permite aceitar adjuntos adverbiais em posições diferentes.</small>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label>Dica Pedagógica (quando o aluno tiver dúvida):</label>
                <input type="text" id="form-hint" class="styled-input" placeholder="Ex: Identifique primeiro quem realiza a ação..." value="${existingExercise?.hint || ""}" />
              </div>
              <div class="form-group">
                <label>Explicação Detalhada do Acerto:</label>
                <input type="text" id="form-explanation" class="styled-input" placeholder="Ex: Muito bem! A frase tem ordem SVO e pontuação correta." value="${existingExercise?.explanation || ""}" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-close-btn">Cancelar</button>
            <button class="btn btn-primary" id="btn-save-exercise">Salvar Atividade</button>
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
    document.getElementById("modal-close-btn")?.addEventListener("click", closeModal);

    document.getElementById("btn-save-exercise")?.addEventListener("click", () => {
      const type = document.getElementById("form-type").value;
      const level = document.getElementById("form-level").value;
      const category = document.getElementById("form-category").value.trim();
      const points = parseInt(document.getElementById("form-points").value, 10) || 10;
      const prompt = document.getElementById("form-prompt").value.trim();
      const hint = document.getElementById("form-hint").value.trim();
      const explanation = document.getElementById("form-explanation").value.trim();

      if (!prompt) {
        alert("Preencha o enunciado da atividade.");
        return;
      }

      let newExerciseData = {
        ...(existingExercise || {}),
        type,
        level,
        category,
        points,
        prompt,
        hint,
        explanation
      };

      if (type === "ordenacao") {
        const wordsStr = document.getElementById("form-words").value.trim();
        const expected = document.getElementById("form-expected").value.trim();
        const altStr = document.getElementById("form-alternatives").value.trim();

        if (!wordsStr || !expected) {
          alert("Preencha as palavras e a resposta esperada para o exercício de ordenação.");
          return;
        }

        newExerciseData.words = wordsStr.split(",").map(w => w.trim()).filter(Boolean);
        newExerciseData.expected = expected;
        newExerciseData.validAlternatives = altStr
          ? altStr.split(";").map(a => a.trim()).filter(Boolean)
          : [];
      } else {
        // Fallback genérico para outros tipos se preenchidos
        if (!newExerciseData.expected && !newExerciseData.correctOption && !newExerciseData.options) {
          newExerciseData.options = ["Opção A", "Opção B", "Opção C"];
          newExerciseData.correctIndex = 0;
        }
      }

      store.saveExercise(newExerciseData);
      sound.playSuccess();
      closeModal();
      this.renderActiveTab();
    });
  },

  // ==========================================
  // 3. GESTÃO DE CONTEÚDOS E REGRAS PEDAGÓGICAS
  // ==========================================
  renderContentManagement(container) {
    const rules = store.getTeacherRules();
    const lessons = store.getAllLessons();

    container.innerHTML = `
      <div class="content-manager-view anim-fade-in">
        <div class="manager-header-bar">
          <div>
            <h2>📚 Conteúdos e Critérios Pedagógicos</h2>
            <p>Gerencie as regras gramaticais e as mini aulas explicativas apresentadas aos alunos.</p>
          </div>
          <button class="btn btn-outline" id="btn-add-rule">+ Nova Regra Pedagógica</button>
        </div>

        <div class="content-sections-grid">
          <!-- Regras e Critérios do Professor -->
          <div class="rules-card">
            <h3>⚖️ Critérios de Correção da Disciplina</h3>
            <div class="rules-list">
              ${rules.map(r => `
                <div class="rule-box">
                  <h4>${r.title}</h4>
                  <p>${r.description}</p>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Lista de Mini Aulas Ativas -->
          <div class="lessons-manager-card">
            <h3>📖 Mini Aulas Disponíveis para a Turma</h3>
            <div class="lessons-admin-list">
              ${lessons.map(l => `
                <div class="lesson-admin-item">
                  <span class="l-icon">${l.icon || "📚"}</span>
                  <div class="l-info">
                    <strong>${l.title}</strong>
                    <p>${l.summary}</p>
                  </div>
                  <span class="badge-level ${l.level.toLowerCase()}">${l.level}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-add-rule")?.addEventListener("click", () => {
      const title = prompt("Título da nova regra/critério pedagógico:");
      if (!title) return;
      const desc = prompt("Descrição detalhada da regra:");
      if (!desc) return;

      store.saveTeacherRule({ title, description: desc });
      sound.playSuccess();
      this.renderContentManagement(container);
    });
  },

  // ==========================================
  // 4. EXPORTAÇÃO DE RELATÓRIO DA TURMA
  // ==========================================
  renderExportReport(container) {
    const analytics = store.getClassAnalytics();
    const dateStr = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    container.innerHTML = `
      <div class="report-view anim-fade-in">
        <div class="report-header-controls">
          <button class="btn btn-primary" id="btn-print-report">
            🖨️ Imprimir / Salvar em PDF
          </button>
          <button class="btn btn-secondary" id="btn-download-json">
            💾 Baixar Dados em JSON
          </button>
        </div>

        <div class="printable-report-sheet" id="report-sheet">
          <div class="report-sheet-header">
            <div class="school-header">
              <h1>ESCOLA MODELO — DISCIPLINA DE LÍNGUA PORTUGUESA</h1>
              <h2>Relatório Consolidado de Desempenho: Organização de Frases</h2>
              <p class="report-meta">Data de Emissão: ${dateStr} • Turma: 5º Ano A • Professor(a) Responsável</p>
            </div>
          </div>

          <div class="report-metrics-summary">
            <div class="rep-box">
              <span>Total de Alunos</span>
              <strong>${analytics.totalStudents}</strong>
            </div>
            <div class="rep-box">
              <span>Exercícios Praticados</span>
              <strong>${analytics.totalAttempts}</strong>
            </div>
            <div class="rep-box">
              <span>Taxa Geral de Acertos</span>
              <strong>${analytics.accuracyRate}%</strong>
            </div>
            <div class="rep-box">
              <span>Média de Pontos</span>
              <strong>${analytics.averageScore} pts</strong>
            </div>
          </div>

          <div class="report-section">
            <h3>1. Diagnóstico Geral de Dificuldades da Turma</h3>
            <p>Com base nos registros automáticos de erro do sistema, os pontos que necessitam de intervenção pedagógica prioritária são:</p>
            <ul>
              ${analytics.topDifficulties.map(d => `
                <li><strong>${d.name}:</strong> Registrado em ${d.count} ocorrências de exercícios.</li>
              `).join("")}
            </ul>
          </div>

          <div class="report-section">
            <h3>2. Tabela de Desempenho Individual dos Alunos</h3>
            <table class="styled-table print-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Nome do Aluno</th>
                  <th>Pontuação</th>
                  <th>Exercícios Concluídos</th>
                  <th>Aproveitamento (%)</th>
                  <th>Feedback Registrado pelo Professor</th>
                </tr>
              </thead>
              <tbody>
                ${analytics.studentsList.map((s, idx) => {
                  const total = s.attemptsCount || 0;
                  const acc = total > 0 ? Math.round((s.correctCount / total) * 100) : 0;
                  return `
                    <tr>
                      <td>${idx + 1}</td>
                      <td><strong>${s.name}</strong></td>
                      <td>${s.score} pts</td>
                      <td>${(s.completedExercises || []).length}</td>
                      <td>${acc}%</td>
                      <td><em>"${s.teacherFeedback || "Sem observações específicas."}"</em></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>

          <div class="report-footer-signatures">
            <div class="signature-line">
              <span>Assinatura do(a) Professor(a)</span>
            </div>
            <div class="signature-line">
              <span>Coordenação Pedagógica</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-print-report")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btn-download-json")?.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analytics, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `relatorio_gramatica_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
};
