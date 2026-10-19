// app.js - Ponto de Entrada Principal e Orquestrador do Sistema Educacional

import { store } from "./state.js";
import { sound } from "./sound.js";
import { StudentView } from "./student-view.js";
import { TeacherView } from "./teacher-view.js";

class App {
  constructor() {
    this.currentRole = store.getCurrentRole();
  }

  init() {
    this.bindGlobalControls();
    this.renderTopBar();
    this.switchRole(this.currentRole, false);

    // Registra listener para reagir a mudanças de papel ou aluno
    store.subscribe((event, payload) => {
      if (event === "role_changed") {
        this.currentRole = payload;
        this.renderTopBar();
        this.renderCurrentView();
      } else if (event === "student_changed") {
        this.renderTopBar();
      }
    });

    console.log("🌟 Gramática Interativa — Sistema Educacional Inicializado com Sucesso!");
  }

  bindGlobalControls() {
    // Alternância de Papel (Aluno / Professor)
    const btnRoleStudent = document.getElementById("nav-role-student");
    const btnRoleTeacher = document.getElementById("nav-role-teacher");

    btnRoleStudent?.addEventListener("click", () => {
      sound.playClick();
      this.switchRole("aluno");
    });

    btnRoleTeacher?.addEventListener("click", () => {
      sound.playClick();
      this.switchRole("professor");
    });

    // Controle de Som Mute/Unmute
    const btnToggleSound = document.getElementById("btn-toggle-sound");
    btnToggleSound?.addEventListener("click", () => {
      const isMuted = sound.toggleMute();
      btnToggleSound.innerHTML = isMuted ? "🔇 Som Desativado" : "🔊 Som Ativado";
      btnToggleSound.classList.toggle("is-muted", isMuted);
    });

    // Botão de Ajuda / Sobre o Sistema
    const btnAbout = document.getElementById("btn-about-system");
    btnAbout?.addEventListener("click", () => {
      this.openAboutModal();
    });
  }

  switchRole(role, notify = true) {
    this.currentRole = role;
    if (notify) {
      store.setCurrentRole(role);
    }

    const studentContainer = document.getElementById("student-app-view");
    const teacherContainer = document.getElementById("teacher-app-view");
    const btnRoleStudent = document.getElementById("nav-role-student");
    const btnRoleTeacher = document.getElementById("nav-role-teacher");

    if (role === "aluno") {
      studentContainer.style.display = "block";
      teacherContainer.style.display = "none";
      btnRoleStudent?.classList.add("active");
      btnRoleTeacher?.classList.remove("active");
      StudentView.init();
    } else {
      studentContainer.style.display = "none";
      teacherContainer.style.display = "block";
      btnRoleStudent?.classList.remove("active");
      btnRoleTeacher?.classList.add("active");
      TeacherView.init();
    }
  }

  renderTopBar() {
    const student = store.getActiveStudent();
    const studentChip = document.getElementById("nav-active-student-chip");
    if (studentChip && student) {
      studentChip.innerHTML = `
        <span class="chip-avatar">${student.avatar}</span>
        <span class="chip-name">${student.name}</span>
        <span class="chip-score">${student.score || 0} pts</span>
      `;
      studentChip.style.display = this.currentRole === "aluno" ? "inline-flex" : "none";
      studentChip.onclick = () => StudentView.openStudentModal();
    }
  }

  renderCurrentView() {
    if (this.currentRole === "aluno") {
      StudentView.init();
    } else {
      TeacherView.init();
    }
  }

  openAboutModal() {
    const modal = document.getElementById("general-modal");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card anim-scale-up">
          <div class="modal-header">
            <div class="modal-title-with-icon">
              <span class="modal-icon">📘</span>
              <div>
                <h2>Gramática Interativa — Organização de Frases</h2>
                <span>Mini Sistema Educacional da Língua Portuguesa</span>
              </div>
            </div>
            <button class="modal-close-btn" id="modal-close">×</button>
          </div>

          <div class="modal-body about-body">
            <h4>🎯 Finalidade Pedagógica</h4>
            <p>Este sistema foi desenvolvido como uma ferramenta pedagógica completa para apoiar o professor no ensino da estrutura frásica e proporcionar aos alunos uma experiência lúdica, prática e interativa de aprendizagem.</p>

            <h4>✨ Principais Recursos Disponíveis:</h4>
            <ul class="styled-list">
              <li><strong>Organização Interativa:</strong> Palavras embaralhadas com clique dinâmico e suporte a variações sintáticas aceitáveis.</li>
              <li><strong>Diagnóstico Inteligente:</strong> O sistema explica detalhadamente erros de ordenação, pontuação final e falta de maiúsculas.</li>
              <li><strong>Detetive Gramatical:</strong> Identificação de Sujeito, Verbo, Predicado e Complementos.</li>
              <li><strong>Painel do Professor:</strong> Cadastro completo de atividades (CRUD), métricas de turma, acompanhamento individual e feedback pedagógico customizado.</li>
              <li><strong>Acessibilidade & Áudio:</strong> Sintetizador de voz em Português e efeitos sonoros via Web Audio API.</li>
            </ul>

            <div class="recommendation-callout">
              💡 <strong>Dica de Uso:</strong> Alterne entre a <em>Área do Aluno</em> e a <em>Área do Professor</em> no menu superior a qualquer momento para experimentar os dois pontos de vista pedagógicos!
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-primary" id="modal-close-footer">Entendido!</button>
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
  }
}

// Inicializa a aplicação ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
