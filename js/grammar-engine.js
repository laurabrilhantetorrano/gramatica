// grammar-engine.js - Motor Inteligente de Gramática, Correção e Diagnóstico Pedagógico

export const GrammarEngine = {
  /**
   * Normaliza uma frase para comparação flexível
   */
  normalizeText(str) {
    if (!str) return "";
    return str
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "");
  },

  /**
   * Remove pontuação final para checagem estrutural de palavras
   */
  stripTrailingPunctuation(str) {
    return str.replace(/[.,!?;:]+$/, "").trim();
  },

  /**
   * Avalia a ordenação de palavras de um exercício
   * @param {string[]} studentWordsArr - Lista de palavras na ordem montada pelo aluno
   * @param {object} exercise - O objeto do exercício com expected, validAlternatives, hint, explanation
   * @returns {object} { isCorrect: boolean, score: number, diagnostic: string, feedbackType: 'success'|'warning'|'error', details: string }
   */
  evaluateOrdering(studentWordsArr, exercise) {
    if (!studentWordsArr || studentWordsArr.length === 0) {
      return {
        isCorrect: false,
        score: 0,
        feedbackType: "warning",
        title: "Frase Vazia",
        message: "Você ainda não organizou nenhuma palavra. Clique nas palavras para montar a frase!",
        mistakeCategory: "Incompleta"
      };
    }

    // Monta a string do aluno respeitando pontuações coladas ou isoladas
    let assembled = "";
    studentWordsArr.forEach((w, idx) => {
      const cleanW = w.trim();
      if (idx === 0) {
        assembled += cleanW;
      } else if (cleanW === "?" || cleanW === "!" || cleanW === "." || cleanW === "," || cleanW === ";") {
        assembled += cleanW; // gruda a pontuação na palavra anterior
      } else {
        assembled += " " + cleanW;
      }
    });

    assembled = this.normalizeText(assembled);

    const expected = this.normalizeText(exercise.expected);
    const alternatives = (exercise.validAlternatives || []).map(a => this.normalizeText(a));
    const allValidForms = [expected, ...alternatives];

    // Verifica se as palavras fornecidas contêm pontuação explícita (?, !, .)
    const wordsHaveTerminalPunct = (exercise.words || []).some(w => /[.?!]$/.test(w.trim()));

    // Função auxiliar para remover pontuação terminal na checagem estrutural
    const stripEndPunct = (str) => str.replace(/[.,!?;:]+$/, "").trim();

    const assembledClean = stripEndPunct(assembled);

    // 1. Checagem contra cada forma válida aceitável
    for (const valid of allValidForms) {
      const validClean = stripEndPunct(valid);

      // Compara a ordem das palavras desconsiderando maiúsculas temporariamente para diagnóstico
      if (assembledClean.toLowerCase() === validClean.toLowerCase()) {
        const capitalOk = assembled.charAt(0) === assembled.charAt(0).toUpperCase();

        // Se o exercício tem pontuação explícita nas palavras, verifica se o aluno a colocou
        if (wordsHaveTerminalPunct && /[.?!]$/.test(valid) && !/[.?!]$/.test(assembled)) {
          return {
            isCorrect: false,
            score: Math.round((exercise.points || 10) * 0.7),
            feedbackType: "warning",
            title: "Falta a Pontuação Final!",
            message: `A ordem das palavras está ótima! Lembre-se de adicionar a pontuação correta no final da oração (${valid.slice(-1)}).`,
            userSentence: assembled,
            mistakeCategory: "Pontuação Final"
          };
        }

        // Verifica se começou com maiúscula
        if (!capitalOk) {
          return {
            isCorrect: false,
            score: Math.round((exercise.points || 10) * 0.5),
            feedbackType: "warning",
            title: "Atenção à Letra Maiúscula!",
            message: `A ordem das palavras está correta, mas toda frase deve começar com letra MAIÚSCULA: '${assembled.charAt(0).toUpperCase() + assembled.slice(1)}'`,
            userSentence: assembled,
            mistakeCategory: "Maiúscula Inicial"
          };
        }

        // Frase totalmente correta!
        return {
          isCorrect: true,
          score: exercise.points || 10,
          feedbackType: "success",
          title: "Excelente! Frase Perfeita!",
          message: exercise.explanation || "Muito bem! A frase está organizada corretamente e com sentido completo.",
          userSentence: assembled,
          mistakeCategory: null
        };
      }
    }

    // 2. Análise diagnóstica de erro para auxílio pedagógico
    const totalWordsExpected = (exercise.words || []).length;
    if (studentWordsArr.length < totalWordsExpected) {
      return {
        isCorrect: false,
        score: 0,
        feedbackType: "warning",
        title: "Frase Incompleta",
        message: `Você usou ${studentWordsArr.length} de ${totalWordsExpected} elementos. Lembre-se de usar todas as palavras disponíveis para formar o sentido completo.`,
        userSentence: assembled,
        mistakeCategory: "Palavras Faltando"
      };
    }

    // Diagnóstico sintático inteligente de ordem
    let pedagogicalHelp = exercise.hint || "Tente novamente! Identifique primeiro quem pratica a ação e depois organize as restantes palavras.";

    const firstWord = studentWordsArr[0].toLowerCase();
    const expectedFirstWord = stripEndPunct(expected).split(" ")[0].toLowerCase();

    if (firstWord !== expectedFirstWord) {
      pedagogicalHelp = `Dica: Quem está praticando a ação nesta frase? Procure começar com o Sujeito da ação ou uma palavra iniciada com maiúscula.`;
    }

    return {
      isCorrect: false,
      score: 0,
      feedbackType: "error",
      title: "Vamos Ajustar a Ordem!",
      message: pedagogicalHelp,
      expectedPreview: exercise.expected,
      userSentence: assembled,
      mistakeCategory: "Ordem das Palavras"
    };
  },

  /**
   * Avalia a identificação de elementos (Sujeito, Predicado, Verbo, Complemento)
   */
  evaluateIdentification(selectedAnswer, exercise) {
    const isCorrect = selectedAnswer === exercise.correctOption;
    if (isCorrect) {
      return {
        isCorrect: true,
        score: exercise.points || 10,
        feedbackType: "success",
        title: "Identificação Correta! 🎯",
        message: exercise.explanation,
        details: exercise.elementsDetail
      };
    } else {
      return {
        isCorrect: false,
        score: 0,
        feedbackType: "error",
        title: "Não é bem essa parte...",
        message: `${exercise.hint} A resposta correta era: "${exercise.correctOption}".`,
        details: exercise.elementsDetail,
        mistakeCategory: `Identificação de ${exercise.targetRole || "Elemento"}`
      };
    }
  },

  /**
   * Avalia quiz de escolha múltipla ou correção
   */
  evaluateQuiz(selectedIndex, exercise) {
    const isCorrect = selectedIndex === exercise.correctIndex;
    if (isCorrect) {
      return {
        isCorrect: true,
        score: exercise.points || 10,
        feedbackType: "success",
        title: "Resposta Certa! 🌟",
        message: exercise.explanation
      };
    } else {
      const correctText = exercise.options[exercise.correctIndex];
      return {
        isCorrect: false,
        score: 0,
        feedbackType: "error",
        title: "Resposta Incorreta",
        message: `${exercise.hint || "Revise os conceitos desta oração."} Resposta correta: "${correctText}". ${exercise.explanation}`,
        mistakeCategory: exercise.category || "Conceito Gramatical"
      };
    }
  },

  /**
   * Síntese de Voz (Pronúncia e Leitura de Frase em Português)
   */
  speakText(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR"; // ou pt-PT
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  }
};
