/**
 * dashboard.js
 * Lógica da página do dashboard (dashboard.html).
 */

(function () {
  'use strict';

  // -----------------------------------------------------------------
  // Configuração de negócio (fácil de ajustar)
  // -----------------------------------------------------------------

  // Percentual mínimo de respostas (sobre o total filtrado) para um tema
  // ser considerado de alta ou média prioridade. Abaixo do segundo valor,
  // o tema é considerado baixa prioridade.
  const PRIORITY_THRESHOLDS = { alta: 40, media: 20 };

  const PRIORITY_COLORS = {
    alta: getVar('--color-red'),
    media: getVar('--color-yellow'),
    baixa: getVar('--color-green'),
  };

  function getVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#3b82c4';
  }

  // -----------------------------------------------------------------
  // Elementos
  // -----------------------------------------------------------------

  const el = {
    dashboardContent: document.getElementById('dashboardContent'),
    emptyState: document.getElementById('emptyState'),
    demoBanner: document.getElementById('demoBanner'),

    filterTema: document.getElementById('filterTema'),
    filterNivel: document.getElementById('filterNivel'),
    filterDataInicio: document.getElementById('filterDataInicio'),
    filterDataFim: document.getElementById('filterDataFim'),
    btnClearFilters: document.getElementById('btnClearFilters'),

    kpiTotal: document.getElementById('kpiTotal'),
    kpiAlunos: document.getElementById('kpiAlunos'),
    kpiTemaTop: document.getElementById('kpiTemaTop'),
    kpiTemaTopSub: document.getElementById('kpiTemaTopSub'),
    kpiNivelTop: document.getElementById('kpiNivelTop'),
    kpiNivelTopSub: document.getElementById('kpiNivelTopSub'),

    rankingBody: document.getElementById('rankingBody'),
    priorityAlta: document.getElementById('priorityAlta'),
    priorityMedia: document.getElementById('priorityMedia'),
    priorityBaixa: document.getElementById('priorityBaixa'),
    commentsGrid: document.getElementById('commentsGrid'),

    btnLoadDemo: document.getElementById('btnLoadDemo'),
    btnLoadDemoEmpty: document.getElementById('btnLoadDemoEmpty'),
    btnRemoveDemo: document.getElementById('btnRemoveDemo'),
    btnExport: document.getElementById('btnExport'),
    btnClear: document.getElementById('btnClear'),

    confirmModal: document.getElementById('confirmModal'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmOk: document.getElementById('confirmOk'),
    confirmCancel: document.getElementById('confirmCancel'),
  };

  let allResponses = [];
  let chartTemas = null;
  let chartNiveis = null;

  // -----------------------------------------------------------------
  // Filtros: popular selects
  // -----------------------------------------------------------------

  function populateFilterOptions() {
    EEData.THEMES.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      el.filterTema.appendChild(opt);
    });
    EEData.DIFFICULTY_LEVELS.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.emoji} ${d.label}`;
      el.filterNivel.appendChild(opt);
    });
  }

  function getFilteredResponses() {
    const tema = el.filterTema.value;
    const nivel = el.filterNivel.value;
    const dataInicio = el.filterDataInicio.value ? new Date(el.filterDataInicio.value + 'T00:00:00') : null;
    const dataFim = el.filterDataFim.value ? new Date(el.filterDataFim.value + 'T23:59:59') : null;

    return allResponses.filter((r) => {
      if (tema && !r.temas.includes(tema)) return false;
      if (nivel && r.nivelDificuldade !== nivel) return false;
      const dataResposta = new Date(r.data);
      if (dataInicio && dataResposta < dataInicio) return false;
      if (dataFim && dataResposta > dataFim) return false;
      return true;
    });
  }

  // -----------------------------------------------------------------
  // Cálculo de estatísticas
  // -----------------------------------------------------------------

  function computeStats(responses) {
    const total = responses.length;
    const uniqueAlunos = new Set(responses.map((r) => r.matricula)).size;

    const themeCounts = {};
    EEData.THEMES.forEach((t) => (themeCounts[t.id] = 0));
    responses.forEach((r) => {
      r.temas.forEach((temaId) => {
        if (themeCounts[temaId] !== undefined) themeCounts[temaId]++;
      });
    });

    const nivelCounts = {};
    EEData.DIFFICULTY_LEVELS.forEach((d) => (nivelCounts[d.id] = 0));
    responses.forEach((r) => {
      if (r.nivelDificuldade && nivelCounts[r.nivelDificuldade] !== undefined) {
        nivelCounts[r.nivelDificuldade]++;
      }
    });

    const themeRanking = EEData.THEMES
      .map((t) => ({
        id: t.id,
        label: t.label,
        count: themeCounts[t.id],
        pct: total > 0 ? (themeCounts[t.id] / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const topTheme = themeRanking.find((t) => t.count > 0) || null;

    let topNivelId = null;
    let topNivelCount = -1;
    EEData.DIFFICULTY_LEVELS.forEach((d) => {
      if (nivelCounts[d.id] > topNivelCount) {
        topNivelCount = nivelCounts[d.id];
        topNivelId = d.id;
      }
    });
    const topNivel = topNivelCount > 0 ? EEData.getDifficultyById(topNivelId) : null;

    return { total, uniqueAlunos, themeCounts, nivelCounts, themeRanking, topTheme, topNivel, topNivelCount };
  }

  function priorityOf(pct) {
    if (pct >= PRIORITY_THRESHOLDS.alta) return 'alta';
    if (pct >= PRIORITY_THRESHOLDS.media) return 'media';
    return 'baixa';
  }

  // -----------------------------------------------------------------
  // Renderização: KPIs
  // -----------------------------------------------------------------

  function renderKPIs(stats) {
    el.kpiTotal.textContent = stats.total;
    el.kpiAlunos.textContent = stats.uniqueAlunos;

    if (stats.topTheme) {
      el.kpiTemaTop.textContent = stats.topTheme.label;
      el.kpiTemaTopSub.textContent = `${stats.topTheme.count} aluno(s) · ${stats.topTheme.pct.toFixed(0)}%`;
    } else {
      el.kpiTemaTop.textContent = '—';
      el.kpiTemaTopSub.textContent = 'Sem dados suficientes';
    }

    if (stats.topNivel) {
      el.kpiNivelTop.textContent = `${stats.topNivel.emoji} ${stats.topNivel.label}`;
      const pct = stats.total > 0 ? ((stats.topNivelCount / stats.total) * 100).toFixed(0) : 0;
      el.kpiNivelTopSub.textContent = `${stats.topNivelCount} resposta(s) · ${pct}%`;
    } else {
      el.kpiNivelTop.textContent = '—';
      el.kpiNivelTopSub.textContent = 'Sem dados suficientes';
    }
  }

  // -----------------------------------------------------------------
  // Renderização: gráficos
  // -----------------------------------------------------------------

  function renderCharts(stats) {
    const ranking = stats.themeRanking.filter((t) => t.count > 0);
    const labels = ranking.length ? ranking.map((t) => t.label) : stats.themeRanking.map((t) => t.label);
    const dataCounts = ranking.length ? ranking.map((t) => t.count) : stats.themeRanking.map((t) => t.count);
    const barColors = (ranking.length ? ranking : stats.themeRanking).map((t) => PRIORITY_COLORS[priorityOf(t.pct)]);
    const percents = (ranking.length ? ranking : stats.themeRanking).map((t) => t.pct);

    const ctxTemas = document.getElementById('chartTemas').getContext('2d');
    if (chartTemas) chartTemas.destroy();
    chartTemas = new Chart(ctxTemas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Alunos com dificuldade',
          data: dataCounts,
          backgroundColor: barColors,
          borderRadius: 6,
          maxBarThickness: 34,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = percents[ctx.dataIndex] || 0;
                return `${ctx.parsed.x} aluno(s) · ${pct.toFixed(0)}% da turma`;
              },
            },
          },
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#eef1f6' } },
          y: { grid: { display: false } },
        },
      },
    });

    const nivelLabels = EEData.DIFFICULTY_LEVELS.map((d) => `${d.emoji} ${d.label}`);
    const nivelData = EEData.DIFFICULTY_LEVELS.map((d) => stats.nivelCounts[d.id]);
    const nivelColors = EEData.DIFFICULTY_LEVELS.map((d) => d.color);

    const ctxNiveis = document.getElementById('chartNiveis').getContext('2d');
    if (chartNiveis) chartNiveis.destroy();
    chartNiveis = new Chart(ctxNiveis, {
      type: 'doughnut',
      data: {
        labels: nivelLabels,
        datasets: [{ data: nivelData, backgroundColor: nivelColors, borderWidth: 2, borderColor: '#fff' }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 11 } } },
        },
      },
    });
  }

  // -----------------------------------------------------------------
  // Renderização: ranking
  // -----------------------------------------------------------------

  function renderRanking(stats) {
    const ranking = stats.themeRanking;
    const maxCount = ranking.length ? ranking[0].count : 0;

    el.rankingBody.innerHTML = ranking.map((t, idx) => `
      <tr>
        <td><span class="rank-badge">${idx + 1}º</span></td>
        <td class="theme-cell">${t.label}</td>
        <td>${t.count}</td>
        <td>${t.pct.toFixed(0)}%</td>
        <td>
          <div class="mini-bar-track">
            <div class="mini-bar-fill" style="width:${maxCount > 0 ? (t.count / maxCount) * 100 : 0}%; background:${PRIORITY_COLORS[priorityOf(t.pct)]};"></div>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // -----------------------------------------------------------------
  // Renderização: prioridades
  // -----------------------------------------------------------------

  function renderPriorities(stats) {
    const withData = stats.themeRanking.filter((t) => t.count > 0);
    const groups = { alta: [], media: [], baixa: [] };
    withData.forEach((t) => groups[priorityOf(t.pct)].push(t));

    function renderGroup(container, items, emptyMsg) {
      if (items.length === 0) {
        container.innerHTML = `<p class="priority-empty">${emptyMsg}</p>`;
        return;
      }
      container.innerHTML = items.map((t) => `
        <div class="priority-item">
          <span class="theme-name">${t.label}</span>
          <span class="theme-pct">${t.pct.toFixed(0)}%</span>
        </div>
      `).join('');
    }

    renderGroup(el.priorityAlta, groups.alta, 'Nenhum tema em alta prioridade no momento.');
    renderGroup(el.priorityMedia, groups.media, 'Nenhum tema em média prioridade no momento.');
    renderGroup(el.priorityBaixa, groups.baixa, 'Nenhum tema em baixa prioridade no momento.');
  }

  // -----------------------------------------------------------------
  // Renderização: comentários
  // -----------------------------------------------------------------

  function maskMatricula(matricula) {
    const m = String(matricula || '');
    if (m.length <= 4) return m.replace(/./g, '*');
    if (m.length <= 7) return m[0] + '*'.repeat(m.length - 2) + m.slice(-1);
    return m.slice(0, 4) + '*'.repeat(Math.max(2, m.length - 6)) + m.slice(-2);
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return iso;
    }
  }

  function renderComments(responses) {
    const withComments = responses
      .filter((r) => r.comentario && r.comentario.trim())
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    if (withComments.length === 0) {
      el.commentsGrid.innerHTML = '<p class="text-muted" style="font-size:0.88rem;">Nenhum comentário registrado ainda.</p>';
      return;
    }

    el.commentsGrid.innerHTML = withComments.map((r) => {
      const nivel = EEData.getDifficultyById(r.nivelDificuldade);
      return `
        <div class="comment-card">
          <p>"${escapeHtml(r.comentario)}"</p>
          <div class="comment-meta">
            <span>Matrícula ${maskMatricula(r.matricula)}</span>
            <span class="flex gap-8">
              ${nivel ? `<span class="badge badge-${nivel.id}">${nivel.emoji} ${nivel.label}</span>` : ''}
              ${r.demo ? '<span class="badge badge-demo">demo</span>' : ''}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // -----------------------------------------------------------------
  // Orquestração de renderização
  // -----------------------------------------------------------------

  function render() {
    const filtered = getFilteredResponses();

    if (allResponses.length === 0) {
      el.dashboardContent.style.display = 'none';
      el.emptyState.style.display = 'block';
      return;
    }
    el.dashboardContent.style.display = '';
    el.emptyState.style.display = 'none';

    const stats = computeStats(filtered);
    renderKPIs(stats);
    renderCharts(stats);
    renderRanking(stats);
    renderPriorities(stats);
    renderComments(filtered);

    const hasDemo = allResponses.some((r) => r.demo);
    el.demoBanner.classList.toggle('visible', hasDemo);
    el.btnRemoveDemo.style.display = hasDemo ? '' : 'none';
  }

  function refreshData() {
    return EEData.getResponses().then((responses) => {
      allResponses = responses;
      render();
    });
  }

  // -----------------------------------------------------------------
  // Filtros: eventos
  // -----------------------------------------------------------------

  [el.filterTema, el.filterNivel, el.filterDataInicio, el.filterDataFim].forEach((input) => {
    input.addEventListener('change', render);
  });

  el.btnClearFilters.addEventListener('click', () => {
    el.filterTema.value = '';
    el.filterNivel.value = '';
    el.filterDataInicio.value = '';
    el.filterDataFim.value = '';
    render();
  });

  // -----------------------------------------------------------------
  // Dados de demonstração
  // -----------------------------------------------------------------

  function loadDemo() {
    EEData.loadDemoData().then(() => refreshData());
  }

  el.btnLoadDemo.addEventListener('click', loadDemo);
  el.btnLoadDemoEmpty.addEventListener('click', loadDemo);

  el.btnRemoveDemo.addEventListener('click', () => {
    EEData.removeDemoData().then(() => refreshData());
  });

  // -----------------------------------------------------------------
  // Exportação CSV
  // -----------------------------------------------------------------

  function csvEscape(value) {
    const str = String(value == null ? '' : value);
    if (/[";\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function exportCsv() {
    const responses = getFilteredResponses();
    const header = ['Matricula', 'Temas selecionados', 'Nivel de dificuldade', 'Comentario', 'Data da resposta'];
    const rows = responses.map((r) => {
      const temasLabel = r.temas.map((id) => (EEData.getThemeById(id) || {}).label || id).join(' | ');
      const nivelLabel = (EEData.getDifficultyById(r.nivelDificuldade) || {}).label || r.nivelDificuldade || '';
      return [r.matricula, temasLabel, nivelLabel, r.comentario || '', formatDate(r.data)];
    });

    const csvLines = [header, ...rows].map((row) => row.map(csvEscape).join(';'));
    const csvContent = '﻿' + csvLines.join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-engenharia-economica-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  el.btnExport.addEventListener('click', exportCsv);

  // -----------------------------------------------------------------
  // Limpar dados (com confirmação)
  // -----------------------------------------------------------------

  function openConfirm(title, message, onConfirm) {
    el.confirmTitle.textContent = title;
    el.confirmMessage.textContent = message;
    el.confirmModal.classList.add('visible');

    function cleanup() {
      el.confirmModal.classList.remove('visible');
      el.confirmOk.removeEventListener('click', onOk);
      el.confirmCancel.removeEventListener('click', onCancel);
    }
    function onOk() {
      cleanup();
      onConfirm();
    }
    function onCancel() {
      cleanup();
    }
    el.confirmOk.addEventListener('click', onOk);
    el.confirmCancel.addEventListener('click', onCancel);
  }

  el.btnClear.addEventListener('click', () => {
    openConfirm(
      'Limpar todos os dados?',
      'Esta ação apagará permanentemente todas as respostas (reais e de demonstração) armazenadas neste navegador. Essa ação não pode ser desfeita.',
      () => {
        EEData.clearAll().then(() => refreshData());
      }
    );
  });

  // -----------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------

  populateFilterOptions();
  refreshData();
})();
