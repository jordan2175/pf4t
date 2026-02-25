// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t


// --------------------------------------------------
// Constants
// --------------------------------------------------
const PRIORITY_LABELS = {
  1: 'Low',
  2: 'Med',
  3: 'High'
};

// --------------------------------------------------
// Active filter state
// Each key maps to ONE selected value or null
// --------------------------------------------------
state.activeFilters = {
  categories: null,
  squareLabels: null,
  curlyLabels: null,
  barLabels: null,
  hashTags: null,
  priorityLevels: null
};

// --------------------------------------------------
// Utility: increment count map
// --------------------------------------------------
function increment(map, key) {
  if (!key) return;
  map[key] = (map[key] || 0) + 1;
}

// --------------------------------------------------
// applyFilters()
// Core filtering logic
// Called whenever a dropdown changes
// --------------------------------------------------
function applyFilters() {
  const cards = document.querySelectorAll('[data-testid="list-card"]');
  
  // Use DocumentFragment for batch DOM updates (if needed)
  cards.forEach(card => {
    let visible = true;
    
    // Cache dataset reads
    const cardData = {
      category: card.dataset.pf4tCategory || '',
      squareLabels: (card.dataset.pf4tSquareLabels || '').split(',').filter(Boolean),
      curlyLabels: (card.dataset.pf4tCurlyLabels || '').split(',').filter(Boolean),
      barLabels: (card.dataset.pf4tBarLabels || '').split(',').filter(Boolean),
      hashTags: (card.dataset.pf4tHashTags || '').split(',').filter(Boolean),
      priority: card.dataset.pf4tPriorityLevel || ''
    };
    
    // Early exit pattern - faster than checking all
    if (state.activeFilters.categories && cardData.category !== state.activeFilters.categories) {
      card.style.display = 'none';
      return;
    }
    if (state.activeFilters.squareLabels && !cardData.squareLabels.includes(state.activeFilters.squareLabels)) {
      card.style.display = 'none';
      return;
    }
    if (state.activeFilters.curlyLabels && !cardData.curlyLabels.includes(state.activeFilters.curlyLabels)) {
      card.style.display = 'none';
      return;
    }
    if (state.activeFilters.barLabels && !cardData.barLabels.includes(state.activeFilters.barLabels)) {
      card.style.display = 'none';
      return;
    }
    if (state.activeFilters.hashTags && !cardData.hashTags.includes(state.activeFilters.hashTags)) {
      card.style.display = 'none';
      return;
    }
    if (state.activeFilters.priorityLevels && cardData.priority !== state.activeFilters.priorityLevels) {
      card.style.display = 'none';
      return;
    }
    
    card.style.display = '';
  });
  
  // Debounce the filter bar rebuild
  clearTimeout(applyFilters.rebuildTimeout);
  applyFilters.rebuildTimeout = setTimeout(() => {
    updateFilterBar();
  }, 150);
}

// --------------------------------------------------
// clearAllFilters()
// Resets all filters and shows all cards
// --------------------------------------------------
function clearAllFilters() {
  Object.keys(state.activeFilters).forEach(k => {
    state.activeFilters[k] = null;
  });

  document
    .querySelectorAll('.pf4t-select')
    .forEach(select => select.value = '');

  applyFilters();
}

// --------------------------------------------------
// updateFilterBar()
// Rebuilds the entire filter bar UI
// Counts ONLY visible cards
// --------------------------------------------------
function updateFilterBar() {
  const boardHeader = document.querySelector('.board-header');
  if (!boardHeader) return;

  let bar = document.getElementById('pf4t-filter-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'pf4t-filter-bar';
    boardHeader.parentNode.insertBefore(bar, boardHeader.nextSibling);
  }

  bar.innerHTML = '';

  // List Settings Button
  const listSettingsBtn = document.createElement('button');
  listSettingsBtn.textContent='List Settings';
  listSettingsBtn.className = 'pf4t-settings-btn';
  listSettingsBtn.onclick=()=>{
      showListSettingsPopup();
  };
  bar.appendChild(listSettingsBtn);


  // Clear All Button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'pf4t-clear-btn';
  clearBtn.textContent = '✕ Clear All';
  clearBtn.onclick=()=>{
    clearAllFilters();
  }
  bar.appendChild(clearBtn);

  // Count values from visible cards only
  const counts = {
    categories: {},
    squareLabels: {},
    curlyLabels: {},
    barLabels: {},
    hashTags: {},
    priorityLevels: {}
  };

  document.querySelectorAll('[data-testid="list-card"]').forEach(card => {
    if (card.style.display === 'none') return;

    increment(counts.categories, card.dataset.pf4tCategory);

    (card.dataset.pf4tSquareLabels || '')
      .split(',')
      .filter(Boolean)
      .forEach(v => increment(counts.squareLabels, v));

    (card.dataset.pf4tCurlyLabels || '')
      .split(',')
      .filter(Boolean)
      .forEach(v => increment(counts.curlyLabels, v));

    (card.dataset.pf4tBarLabels || '')
      .split(',')
      .filter(Boolean)
      .forEach(v => increment(counts.barLabels, v));

    (card.dataset.pf4tHashTags || '')
      .split(',')
      .filter(Boolean)
      .forEach(v => increment(counts.hashTags, v));

    increment(counts.priorityLevels, card.dataset.pf4tPriorityLevel);
  });

  // Render dropdowns
  renderPriorityDropdown(bar, counts.priorityLevels);
  renderDropdown(bar, 'Categories', 'categories', counts.categories);
  renderDropdown(bar, 'Square Labels', 'squareLabels', counts.squareLabels);
  renderDropdown(bar, 'Curly Labels', 'curlyLabels', counts.curlyLabels);
  renderDropdown(bar, 'Bar Labels', 'barLabels', counts.barLabels);
  renderDropdown(bar, 'Hashtags', 'hashTags', counts.hashTags);
}

// --------------------------------------------------
// renderDropdown()
// Generic dropdown renderer
// --------------------------------------------------
function renderDropdown(bar, label, type, values) {
  const keys = Object.keys(values).sort();

  const container = document.createElement('div');
  container.className = 'pf4t-dropdown-container';

  // const labelEl = document.createElement('span');
  // labelEl.className = 'pf4t-dropdown-label';
  // labelEl.textContent = label;
  // container.appendChild(labelEl);

  const select = document.createElement('select');
  select.className = 'pf4t-select';

  const anyOpt = document.createElement('option');
  anyOpt.value = '';
  anyOpt.textContent = `Any ${label}`;
  select.appendChild(anyOpt);

  if (!keys.length) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No values found';
    opt.disabled = true;
    select.appendChild(opt);
  } else {
    keys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = `${k} (${values[k]})`;
      if (state.activeFilters[type] === k) opt.selected = true;
      select.appendChild(opt);
    });
  }

  select.onchange = () => {
    state.activeFilters[type] = select.value || null;
    applyFilters();
  };

  container.appendChild(select);
  bar.appendChild(container);
}

// --------------------------------------------------
// renderPriorityDropdown()
// Special case for priority labels
// --------------------------------------------------
function renderPriorityDropdown(bar, values) {
  const keys = Object.keys(values).sort((a, b) => Number(a) - Number(b));

  const container = document.createElement('div');
  container.className = 'pf4t-dropdown-container';

  // const labelEl = document.createElement('span');
  // labelEl.className = 'pf4t-dropdown-label';
  // labelEl.textContent = 'Priority';
  // container.appendChild(labelEl);

  const select = document.createElement('select');
  select.className = 'pf4t-select';

  const anyOpt = document.createElement('option');
  anyOpt.value = '';
  anyOpt.textContent = 'Any Priority';
  select.appendChild(anyOpt);

  if (!keys.length) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No priorities found';
    opt.disabled = true;
    select.appendChild(opt);
  } else {
    keys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = `${PRIORITY_LABELS[k]} (${values[k]})`;
      if (state.activeFilters.priorityLevels === k) opt.selected = true;
      select.appendChild(opt);
    });
  }

  select.onchange = () => {
    state.activeFilters.priorityLevels = select.value || null;
    applyFilters();
  };

  container.appendChild(select);
  bar.appendChild(container);
}
