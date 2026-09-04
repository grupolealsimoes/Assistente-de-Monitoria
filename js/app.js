/**
 * app.js
 * Lógica da página de formulário (index.html).
 */

(function () {
  'use strict';

  const themeGrid = document.getElementById('themeGrid');
  const difficultyGrid = document.getElementById('difficultyGrid');
  const form = document.getElementById('diagnosticoForm');
  const matriculaInput = document.getElementById('matricula');
  const comentarioInput = document.getElementById('comentario');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('successToast');

  const matriculaError = document.getElementById('matriculaError');
  const temasError = document.getElementById('temasError');
  const nivelError = document.getElementById('nivelError');

  // -----------------------------------------------------------------
  // Renderização dos temas (checkboxes estilizados como cards)
  // -----------------------------------------------------------------

  function renderThemes() {
    themeGrid.innerHTML = EEData.THEMES.map((tema) => `
      <label class="theme-card" data-theme-id="${tema.id}">
        <input type="checkbox" name="temas" value="${tema.id}" />
        <div class="theme-card-top">
          <span class="checkbox-visual">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="theme-name">${tema.label}</span>
        </div>
        ${tema.hint ? `<p class="theme-hint">${tema.hint}</p>` : ''}
      </label>
    `).join('');

    themeGrid.querySelectorAll('.theme-card').forEach((card) => {
      const checkbox = card.querySelector('input');
      // O <label> já alterna o checkbox nativamente ao ser clicado; basta
      // escutar "change" para refletir o estado real (evita duplo toggle).
      checkbox.addEventListener('change', () => {
        card.classList.toggle('selected', checkbox.checked);
        clearFieldError('temas');
      });
    });
  }

  // -----------------------------------------------------------------
  // Renderização do nível de dificuldade (radio buttons estilizados)
  // -----------------------------------------------------------------

  function renderDifficulty() {
    difficultyGrid.innerHTML = EEData.DIFFICULTY_LEVELS.map((nivel) => `
      <label class="difficulty-card" data-nivel-id="${nivel.id}" style="--card-color:${nivel.color}1a;">
        <input type="radio" name="nivelDificuldade" value="${nivel.id}" />
        <span class="emoji">${nivel.emoji}</span>
        <span class="label">${nivel.label}</span>
      </label>
    `).join('');

    difficultyGrid.querySelectorAll('.difficulty-card').forEach((card) => {
      const radio = card.querySelector('input');
      card.style.setProperty('--card-color', getComputedColor(card));
      radio.addEventListener('change', () => {
        difficultyGrid.querySelectorAll('.difficulty-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        clearFieldError('nivel');
      });
    });
  }

  function getComputedColor(card) {
    const id = card.getAttribute('data-nivel-id');
    const nivel = EEData.getDifficultyById(id);
    return nivel ? nivel.color : '#3b82c4';
  }

  // -----------------------------------------------------------------
  // Validação
  // -----------------------------------------------------------------

  function clearFieldError(field) {
    if (field === 'matricula') {
      matriculaInput.classList.remove('field-error');
      matriculaError.classList.remove('visible');
    } else if (field === 'temas') {
      temasError.classList.remove('visible');
    } else if (field === 'nivel') {
      nivelError.classList.remove('visible');
    }
  }

  function validate() {
    let valid = true;

    const matricula = matriculaInput.value.trim();
    if (!matricula) {
      matriculaInput.classList.add('field-error');
      matriculaError.classList.add('visible');
      valid = false;
    } else {
      clearFieldError('matricula');
    }

    const temasSelecionados = Array.from(themeGrid.querySelectorAll('input[name="temas"]:checked'));
    if (temasSelecionados.length === 0) {
      temasError.classList.add('visible');
      valid = false;
    } else {
      clearFieldError('temas');
    }

    const nivelSelecionado = difficultyGrid.querySelector('input[name="nivelDificuldade"]:checked');
    if (!nivelSelecionado) {
      nivelError.classList.add('visible');
      valid = false;
    } else {
      clearFieldError('nivel');
    }

    return valid;
  }

  // -----------------------------------------------------------------
  // Envio
  // -----------------------------------------------------------------

  let toastTimeout = null;

  function showSuccessToast() {
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4500);
  }

  function resetForm() {
    form.reset();
    themeGrid.querySelectorAll('.theme-card').forEach((c) => c.classList.remove('selected'));
    difficultyGrid.querySelectorAll('.difficulty-card').forEach((c) => c.classList.remove('selected'));
    matriculaInput.classList.remove('field-error');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    const temas = Array.from(themeGrid.querySelectorAll('input[name="temas"]:checked')).map((el) => el.value);
    const nivelDificuldade = difficultyGrid.querySelector('input[name="nivelDificuldade"]:checked').value;

    submitBtn.disabled = true;

    EEData.addResponse({
      matricula: matriculaInput.value,
      temas,
      nivelDificuldade,
      comentario: comentarioInput.value,
    }).then(() => {
      showSuccessToast();
      resetForm();
      submitBtn.disabled = false;
    }).catch((err) => {
      console.error('Erro ao registrar resposta:', err);
      submitBtn.disabled = false;
    });
  });

  // -----------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------

  renderThemes();
  renderDifficulty();
})();
