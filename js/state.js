// state.js - Gerenciamento de Estado Reativo e Persistência Local com Suporte a API Futura

import { INITIAL_LESSONS, INITIAL_EXERCISES, INITIAL_STUDENTS, INITIAL_TEACHER_RULES } from "./seed-data.js";

const STORAGE_KEYS = {
  EXERCISES: "gramatica_exercises_v1",
  LESSONS: "gramatica_lessons_v1",
  STUDENTS: "gramatica_students_v1",
  RULES: "gramatica_rules_v1",
  ACTIVE_STUDENT: "gramatica_active_student_id_v1",
  CURRENT_ROLE: "gramatica_current_role_v1"
};

class Store {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    // Carrega ou inicializa com dados de semente
    const storedExercises = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!storedExercises) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
    } else {
      try {
        const parsed = JSON.parse(storedExercises);
        let updated = false;
        INITIAL_EXERCISES.forEach(seedEx => {
          if (!parsed.some(e => e.id === seedEx.id)) {
            parsed.push(seedEx);
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(parsed));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RULES)) {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(INITIAL_TEACHER_RULES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, "aluno-1"); // Maria Silva por padrão
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, "aluno");
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(cb => cb(event, payload));
  }

  // --- Papéis e Aluno Ativo ---
  getCurrentRole() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || "aluno";
  }

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    this.notify("role_changed", role);
  }

  getActiveStudentId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || "aluno-1";
  }

  setActiveStudentId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, id);
    this.notify("student_changed", this.getActiveStudent());
  }

  getActiveStudent() {
    const students = this.getAllStudents();
    const id = this.getActiveStudentId();
    return students.find(s => s.id === id) || students[0] || null;
  }

  // --- Alunos ---
  getAllStudents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  saveStudent(student) {
    const students = this.getAllStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify("students_updated", students);
  }

  createNewStudent(name, avatar = "🎓", className = "5º Ano A") {
    const newStudent = {
      id: "aluno-" + Date.now(),
      name: name.trim(),
      avatar: avatar,
      class: className,
      score: 0,
      stars: 0,
      streak: 1,
      completedExercises: [],
      attemptsCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      difficulties: [],
      history: [],
      teacherFeedback: "Bem-vindo(a) ao sistema de Gramática! Comece explorando as mini aulas e organizando as frases."
    };
    this.saveStudent(newStudent);
    this.setActiveStudentId(newStudent.id);
    return newStudent;
  }

  saveTeacherFeedback(studentId, feedbackText) {
    const students = this.getAllStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.teacherFeedback = feedbackText;
      this.saveStudent(student);
    }
  }

  recordAttempt(studentId, exerciseId, isCorrect, scoreEarned, userAnswer, mistakeCategory = null) {
    const students = this.getAllStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    student.attemptsCount = (student.attemptsCount || 0) + 1;
    if (isCorrect) {
      student.correctCount = (student.correctCount || 0) + 1;
      student.score = (student.score || 0) + scoreEarned;
      student.stars = Math.floor(student.score / 10);
      if (!student.completedExercises.includes(exerciseId)) {
        student.completedExercises.push(exerciseId);
      }
    } else {
      student.incorrectCount = (student.incorrectCount || 0) + 1;
      if (mistakeCategory && !student.difficulties.includes(mistakeCategory)) {
        student.difficulties.push(mistakeCategory);
      }
    }

    const entry = {
      exerciseId,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      correct: isCorrect,
      scoreEarned: scoreEarned || 0,
      userAnswer: userAnswer || "",
      mistake: mistakeCategory
    };

    student.history = student.history || [];
    student.history.unshift(entry);
    if (student.history.length > 50) student.history.pop();

    this.saveStudent(student);
    this.notify("attempt_recorded", { student, entry });
  }

  // --- Exercícios ---
  getAllExercises() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISES)) || [];
    } catch {
      return INITIAL_EXERCISES;
    }
  }

  getExerciseById(id) {
    return this.getAllExercises().find(e => e.id === id);
  }

  saveExercise(exerciseData) {
    const exercises = this.getAllExercises();
    if (!exerciseData.id) {
      exerciseData.id = "ex-" + Date.now();
    }
    const idx = exercises.findIndex(e => e.id === exerciseData.id);
    if (idx >= 0) {
      exercises[idx] = exerciseData;
    } else {
      exercises.push(exerciseData);
    }
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    this.notify("exercises_updated", exercises);
    return exerciseData;
  }

  deleteExercise(id) {
    let exercises = this.getAllExercises();
    exercises = exercises.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    this.notify("exercises_updated", exercises);
  }

  // --- Aulas / Conteúdos ---
  getAllLessons() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS)) || [];
    } catch {
      return INITIAL_LESSONS;
    }
  }

  getLessonById(id) {
    return this.getAllLessons().find(l => l.id === id);
  }

  saveLesson(lessonData) {
    const lessons = this.getAllLessons();
    if (!lessonData.id) {
      lessonData.id = "aula-" + Date.now();
    }
    const idx = lessons.findIndex(l => l.id === lessonData.id);
    if (idx >= 0) {
      lessons[idx] = lessonData;
    } else {
      lessons.push(lessonData);
    }
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    this.notify("lessons_updated", lessons);
    return lessonData;
  }

  deleteLesson(id) {
    let lessons = this.getAllLessons();
    lessons = lessons.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    this.notify("lessons_updated", lessons);
  }

  // --- Regras do Professor ---
  getTeacherRules() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RULES)) || [];
    } catch {
      return INITIAL_TEACHER_RULES;
    }
  }

  saveTeacherRule(rule) {
    const rules = this.getTeacherRules();
    if (!rule.id) rule.id = "regra-" + Date.now();
    const idx = rules.findIndex(r => r.id === rule.id);
    if (idx >= 0) {
      rules[idx] = rule;
    } else {
      rules.push(rule);
    }
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
    this.notify("rules_updated", rules);
  }

  // --- Analytics da Turma para o Professor ---
  getClassAnalytics() {
    const students = this.getAllStudents();
    const exercises = this.getAllExercises();

    const totalStudents = students.length;
    const totalExercisesAvailable = exercises.length;

    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalScoreSum = 0;

    const difficultyFrequency = {};

    students.forEach(s => {
      totalAttempts += (s.attemptsCount || 0);
      totalCorrect += (s.correctCount || 0);
      totalIncorrect += (s.incorrectCount || 0);
      totalScoreSum += (s.score || 0);

      (s.difficulties || []).forEach(diff => {
        difficultyFrequency[diff] = (difficultyFrequency[diff] || 0) + 1;
      });
    });

    const averageScore = totalStudents > 0 ? Math.round(totalScoreSum / totalStudents) : 0;
    const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // Converte frequências de erros em lista ordenada
    const topDifficulties = Object.entries(difficultyFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalStudents,
      totalExercisesAvailable,
      totalAttempts,
      totalCorrect,
      totalIncorrect,
      averageScore,
      accuracyRate,
      topDifficulties,
      studentsList: students.sort((a, b) => b.score - a.score)
    };
  }

  // Restaurar dados originais para demonstração
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(INITIAL_TEACHER_RULES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, "aluno-1");
    this.notify("data_reset", null);
  }
}

export const store = new Store();
