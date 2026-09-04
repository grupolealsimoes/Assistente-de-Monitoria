/**
 * data.js
 * Camada de dados da aplicação.
 *
 * Toda a leitura/escrita de respostas passa por `EEData`. Hoje a implementação
 * usa localStorage, mas a API é assíncrona (retorna Promises) de propósito:
 * no futuro, basta trocar o corpo de cada método por uma chamada `fetch(...)`
 * a uma API/backend real, sem precisar alterar app.js ou dashboard.js.
 */

(function (global) {
  'use strict';

  // ---------------------------------------------------------------------
  // Constantes de domínio (compartilhadas entre formulário e dashboard)
  // ---------------------------------------------------------------------

  const THEMES = [
    { id: 'introducao-capitalizacao', label: 'Introdução à Capitalização' },
    { id: 'juros-simples', label: 'Juros Simples' },
    { id: 'aula-excel', label: 'Aula de Excel' },
    {
      id: 'desconto',
      label: 'Desconto',
      hint: 'Desconto por dentro, desconto por fora e desconto bancário',
    },
    { id: 'juros-compostos', label: 'Juros Compostos' },
    { id: 'taxas', label: 'Taxas' },
    { id: 'equivalencia-capitais', label: 'Equivalência de Capitais' },
    { id: 'anuidades', label: 'Modelos Genéricos de Anuidades' },
    { id: 'amortizacao-emprestimos', label: 'Amortização em Empréstimos' },
    { id: 'analise-investimentos', label: 'Análise de Investimentos' },
    { id: 'eva', label: 'EVA (Economic Value Added)' },
  ];

  const DIFFICULTY_LEVELS = [
    { id: 'pouca', label: 'Tenho pouca dificuldade', emoji: '🟢', weight: 1, color: '#16a34a' },
    { id: 'moderada', label: 'Tenho dificuldade moderada', emoji: '🟡', weight: 2, color: '#eab308' },
    { id: 'bastante', label: 'Tenho bastante dificuldade', emoji: '🟠', weight: 3, color: '#f97316' },
    { id: 'muita', label: 'Tenho muita dificuldade', emoji: '🔴', weight: 4, color: '#dc2626' },
  ];

  function getThemeById(id) {
    return THEMES.find((t) => t.id === id) || null;
  }

  function getDifficultyById(id) {
    return DIFFICULTY_LEVELS.find((d) => d.id === id) || null;
  }

  // ---------------------------------------------------------------------
  // Repositório de respostas (implementação atual: localStorage)
  // ---------------------------------------------------------------------

  const STORAGE_KEY = 'ee_diagnostico_respostas_v1';

  function readRaw() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Falha ao ler respostas do localStorage:', err);
      return [];
    }
  }

  function writeRaw(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.error('Falha ao salvar respostas no localStorage:', err);
      return false;
    }
  }

  function generateId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return 'resp-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  const EEData = {
    THEMES,
    DIFFICULTY_LEVELS,
    getThemeById,
    getDifficultyById,

    /**
     * Retorna todas as respostas registradas (reais + demonstração).
     * @returns {Promise<Array>}
     */
    getResponses() {
      return Promise.resolve(readRaw());
    },

    /**
     * Registra uma nova resposta de aluno.
     * @param {{matricula: string, temas: string[], nivelDificuldade: string, comentario: string}} payload
     * @returns {Promise<Object>} a resposta salva, com id e data preenchidos
     */
    addResponse(payload) {
      const list = readRaw();
      const response = {
        id: generateId(),
        matricula: String(payload.matricula || '').trim(),
        temas: Array.isArray(payload.temas) ? payload.temas.slice() : [],
        nivelDificuldade: payload.nivelDificuldade || null,
        comentario: (payload.comentario || '').trim(),
        data: new Date().toISOString(),
        demo: false,
      };
      list.push(response);
      writeRaw(list);
      return Promise.resolve(response);
    },

    /**
     * Remove TODAS as respostas (reais e de demonstração).
     * @returns {Promise<void>}
     */
    clearAll() {
      writeRaw([]);
      return Promise.resolve();
    },

    /**
     * Remove apenas as respostas marcadas como demonstração (demo: true).
     * @returns {Promise<void>}
     */
    removeDemoData() {
      const list = readRaw().filter((r) => !r.demo);
      writeRaw(list);
      return Promise.resolve();
    },

    /**
     * @returns {Promise<boolean>} verdadeiro se existem dados de demonstração carregados
     */
    hasDemoData() {
      return Promise.resolve(readRaw().some((r) => r.demo));
    },

    /**
     * Gera e insere um conjunto de respostas fictícias para facilitar a
     * visualização do dashboard. Não afeta respostas reais já existentes.
     * @returns {Promise<number>} quantidade de respostas de demonstração inseridas
     */
    loadDemoData() {
      const demo = generateDemoResponses();
      const list = readRaw().concat(demo);
      writeRaw(list);
      return Promise.resolve(demo.length);
    },
  };

  // ---------------------------------------------------------------------
  // Geração de dados fictícios (distribuição realista entre os temas)
  // ---------------------------------------------------------------------

  const SAMPLE_COMMENTS = [
    'Tenho dificuldade para identificar qual fórmula utilizar em juros compostos.',
    'Gostaria de mais exercícios de equivalência de capitais.',
    'Tenho dificuldade com desconto por dentro e por fora.',
    'Não entendi bem a diferença entre taxa nominal e taxa efetiva.',
    'Poderia ter uma aula extra de Excel com exemplos práticos?',
    'Confundo os modelos de anuidade antecipada e postecipada.',
    'Gostaria de mais exercícios resolvidos passo a passo de amortização (SAC e Price).',
    'Tenho dificuldade em montar o fluxo de caixa dos exercícios de análise de investimentos.',
    'Não ficou claro como calcular o EVA na prática.',
    'Poderia revisar os conceitos básicos de capitalização simples antes da prova?',
    '',
    '',
    'Gostaria de uma lista de exercícios extras sobre taxas equivalentes.',
    'Tenho dificuldade para interpretar o enunciado dos problemas de investimento.',
    '',
  ];

  // Pesos relativos por tema para simular turmas reais (temas mais "pesados"
  // do curso costumam concentrar mais dificuldade).
  const THEME_WEIGHTS = {
    'introducao-capitalizacao': 3,
    'juros-simples': 4,
    'aula-excel': 3,
    desconto: 6,
    'juros-compostos': 10,
    taxas: 9,
    'equivalencia-capitais': 8,
    anuidades: 7,
    'amortizacao-emprestimos': 6,
    'analise-investimentos': 7,
    eva: 5,
  };

  function weightedThemeSample(count) {
    const pool = [];
    THEMES.forEach((t) => {
      const w = THEME_WEIGHTS[t.id] || 1;
      for (let i = 0; i < w; i++) pool.push(t.id);
    });
    const picked = new Set();
    let attempts = 0;
    while (picked.size < count && attempts < 50) {
      picked.add(pool[Math.floor(Math.random() * pool.length)]);
      attempts++;
    }
    return Array.from(picked);
  }

  function randomPastDate(maxDaysAgo) {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  }

  function generateDemoResponses() {
    const total = 35 + Math.floor(Math.random() * 16); // 35 a 50 respostas
    const responses = [];
    for (let i = 0; i < total; i++) {
      const matricula = '2024' + String(10000 + Math.floor(Math.random() * 89999)).slice(0, 5);
      const numTemas = 1 + Math.floor(Math.random() * 3); // 1 a 3 temas
      const temas = weightedThemeSample(numTemas);
      const nivel = DIFFICULTY_LEVELS[Math.floor(Math.random() * DIFFICULTY_LEVELS.length)].id;
      const comentario = SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)];
      responses.push({
        id: generateId(),
        matricula,
        temas,
        nivelDificuldade: nivel,
        comentario,
        data: randomPastDate(30),
        demo: true,
      });
    }
    return responses;
  }

  global.EEData = EEData;
})(window);
