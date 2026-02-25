// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t



state.listSettings = state.listSettings || {};

// -----------------------------
// Load / Save list settings
// -----------------------------
function saveListSettings() {
    localStorage.setItem('pf4t_listColors', JSON.stringify(state.listSettings));
}
function loadListSettings() {
    const data = localStorage.getItem('pf4t_listColors');
    if (data) state.listSettings = JSON.parse(data);
}
loadListSettings();

// ----------------------------------------
// Apply width/color to a list by list name
// ----------------------------------------
function applyListSettingsByName(listName, settings) {
    if (!listName || !settings) return;
    document.querySelectorAll('[data-testid="list"]').forEach(listEl => {
        const nameEl = listEl.querySelector('[data-testid="list-name"]');
        if (!nameEl) return;
        if (nameEl.innerText.trim() === listName) {
            listEl.style.width = settings.width ? `${settings.width}px` : '';
            listEl.style.backgroundColor = settings.color || '';
        }
    });
}

// ----------------------------------------
// Apply all saved settings
// ----------------------------------------
function applyAllListSettings() {
    Object.keys(state.listSettings).forEach(listName => {
        applyListSettingsByName(listName, state.listSettings[listName]);
    });
}


function makeDraggable(popup, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = popup.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        popup.style.left = `${startLeft + dx}px`;
        popup.style.top = `${startTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

// ----------------------------------------
// Show List Settings Popup
// ----------------------------------------
function showListSettingsPopup() {
    const existing = document.querySelector('.pf4t-settings-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'pf4t-settings-popup';

    // Title
    const title = document.createElement('strong');
    title.innerText = 'Settings';
    title.className = 'pf4t-settings-label';
    popup.appendChild(title);

    popup.style.left = '50%';
    popup.style.top = '100px';
    makeDraggable(popup, title);

    // Tab buttons
    const tabBar = document.createElement('div');
    tabBar.className = 'pf4t-tab-bar';
    
    const listTab = document.createElement('button');
    listTab.textContent = 'Lists';
    listTab.className = 'pf4t-tab-btn pf4t-tab-active';
    
    const labelTab = document.createElement('button');
    labelTab.textContent = 'Labels';
    labelTab.className = 'pf4t-tab-btn';
    
    tabBar.appendChild(listTab);
    tabBar.appendChild(labelTab);
    popup.appendChild(tabBar);

    // Content containers
    const listContent = document.createElement('div');
    listContent.className = 'pf4t-tab-content pf4t-tab-active';
    
    const labelContent = document.createElement('div');
    labelContent.className = 'pf4t-tab-content';

    // === LIST SETTINGS TAB ===
    const listSelect = document.createElement('select');
    listSelect.className = 'pf4t-settings-fields';
    listContent.appendChild(listSelect);

    const widthInput = document.createElement('input');
    widthInput.className = 'pf4t-settings-txtfields';
    widthInput.type = 'number';
    widthInput.placeholder = 'Width px';
    listContent.appendChild(widthInput);

    const colors = ['#ffffff','#ff9999','#99ff99','#9999ff','#ffff99','#ff99ff','#99ffff','#cccccc'];
    const colorContainer = document.createElement('div');
    colorContainer.className = 'pf4t-settings-fields';
    colorContainer.style.display = 'flex';
    colorContainer.style.flexWrap = 'wrap';
    colors.forEach(c => {
        const btn = document.createElement('div');
        btn.style.background = c;
        btn.style.width = '20px';
        btn.style.height = '20px';
        btn.style.margin = '2px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #888';
        btn.onclick = () => {
            colorInput.value = c;
            rgbInput.value = '';
        };
        colorContainer.appendChild(btn);
    });
    listContent.appendChild(colorContainer);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'pf4t-settings-fields';
    listContent.appendChild(colorInput);

    const rgbInput = document.createElement('input');
    rgbInput.className = 'pf4t-settings-txtfields';
    rgbInput.type = 'text';
    rgbInput.placeholder = '255,0,0 or #ff0000';
    listContent.appendChild(rgbInput);

    // === LABEL COLORS TAB ===
    const labelTypes = [
        { key: 'squareLabels', label: 'Square Labels [text]' },
        { key: 'curlyLabels', label: 'Curly Labels {text}' },
        { key: 'barLabels', label: 'Bar Labels |text|' }
    ];

    const labelColorInputs = {};
    const labelManualInputs = {};

    labelTypes.forEach(({ key, label }) => {
        const row = document.createElement('div');
        row.style.marginBottom = '15px';

        // Label title
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.display = 'block';
        labelEl.style.color = '#fff';
        labelEl.style.fontSize = '12px';
        labelEl.style.marginBottom = '5px';
        labelEl.style.fontWeight = 'bold';
        row.appendChild(labelEl);

        // Color palette
        const colorContainer = document.createElement('div');
        colorContainer.style.display = 'flex';
        colorContainer.style.flexWrap = 'wrap';
        colorContainer.style.marginBottom = '5px';
        
        colors.forEach(c => {
            const btn = document.createElement('div');
            btn.style.background = c;
            btn.style.width = '20px';
            btn.style.height = '20px';
            btn.style.margin = '2px';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #888';
            btn.onclick = () => {
                labelColorInputs[key].value = c;
                labelManualInputs[key].value = c;
            };
            colorContainer.appendChild(btn);
        });
        row.appendChild(colorContainer);

        // Color picker
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = state.labelColors[key];
        colorPicker.className = 'pf4t-settings-fields';
        colorPicker.style.marginBottom = '5px';
        colorPicker.onchange = () => {
            labelManualInputs[key].value = colorPicker.value;
        };
        labelColorInputs[key] = colorPicker;
        row.appendChild(colorPicker);

        // Manual RGB/Hex input
        const manualInput = document.createElement('input');
        manualInput.className = 'pf4t-settings-txtfields';
        manualInput.type = 'text';
        manualInput.placeholder = '#ff0000';
        manualInput.value = state.labelColors[key];
        manualInput.oninput = () => {
            // Update color picker if valid hex
            if (/^#[0-9A-F]{6}$/i.test(manualInput.value)) {
                labelColorInputs[key].value = manualInput.value;
            }
        };
        labelManualInputs[key] = manualInput;
        row.appendChild(manualInput);

        labelContent.appendChild(row);
    });

    popup.appendChild(listContent);
    popup.appendChild(labelContent);

    // Tab switching
    listTab.onclick = () => {
        listTab.classList.add('pf4t-tab-active');
        labelTab.classList.remove('pf4t-tab-active');
        listContent.classList.add('pf4t-tab-active');
        labelContent.classList.remove('pf4t-tab-active');
    };

    labelTab.onclick = () => {
        labelTab.classList.add('pf4t-tab-active');
        listTab.classList.remove('pf4t-tab-active');
        labelContent.classList.add('pf4t-tab-active');
        listContent.classList.remove('pf4t-tab-active');
    };

    // -----------------------------
    // Apply button
    // -----------------------------
    const applyBtn = document.createElement('button');
    applyBtn.innerText = 'Apply';
    applyBtn.className = 'pf4t-settings-apply-btn';
    applyBtn.onclick = () => {
        // Apply list settings
        const listName = listSelect.value;
        if (listName) {
            let color = rgbInput.value || colorInput.value || null;
            const width = widthInput.value ? parseInt(widthInput.value) : null;
            state.listSettings[listName] = { width, color };
            saveListSettings();
            applyListSettingsByName(listName, state.listSettings[listName]);
            fillFields(listName);
            populateDropdown();
        }

        // Apply label colors
        Object.keys(labelColorInputs).forEach(key => {
            // Use manual input if provided, otherwise use color picker
            const color = labelManualInputs[key].value || labelColorInputs[key].value;
            state.labelColors[key] = color;
        });
        saveLabelColors();
        applyLabelColors();
    };

    // -----------------------------
    // Reset button
    // -----------------------------
    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset';
    resetBtn.className = 'pf4t-settings-reset-btn';
    resetBtn.onclick = () => {
        // Check which tab is active
        if (listContent.classList.contains('pf4t-tab-active')) {
            // Reset list settings
            const listName = listSelect.value;
            if (!listName) return;
            delete state.listSettings[listName];
            saveListSettings();
            applyListSettingsByName(listName, {});
            fillFields(listName);
            populateDropdown();
        } else {
            // Reset label colors to defaults
            state.labelColors = {
                squareLabels: '#E0E0E0',
                curlyLabels: '#E5FFCC',
                barLabels: '#CCFFFF'
            };
            saveLabelColors();
            applyLabelColors();
            // Update inputs
            Object.keys(labelColorInputs).forEach(key => {
                labelColorInputs[key].value = state.labelColors[key];
                labelManualInputs[key].value = state.labelColors[key];
            });
        }
    };


    // -----------------------------
    // Close Button
    // -----------------------------
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.className = 'pf4t-settings-close-btn';
    closeBtn.onclick = () => popup.remove();

    // -----------------------------
    // Button Bar
    // -----------------------------
    const buttonRow = document.createElement('div');
    buttonRow.className = 'pf4t-settings-button-bar';

    applyBtn.style.flex = '1';
    resetBtn.style.flex = '1';
    closeBtn.style.flex = '1';

    buttonRow.appendChild(applyBtn);
    buttonRow.appendChild(resetBtn);
    buttonRow.appendChild(closeBtn);
    popup.appendChild(buttonRow);

    // -----------------------------
    // Fill width/color fields for selected list
    // -----------------------------
    function fillFields(listName) {
        const settings = state.listSettings[listName] || {};
        widthInput.value = settings.width || '';
        if (settings.color) {
            colorInput.value = settings.color;
            rgbInput.value = settings.color;
        } else {
            colorInput.value = '#ffffff';
            rgbInput.value = '';
        }
    }

    // -----------------------------
    // Populate dropdown
    // -----------------------------
    function populateDropdown() {
        const names = new Set();
        document.querySelectorAll('[data-testid="list"]').forEach(listEl => {
            const nameEl = listEl.querySelector('[data-testid="list-name"]');
            if (!nameEl) return;
            names.add(nameEl.innerText.trim());
        });
        const prevValue = listSelect.value;
        const currentOptions = Array.from(listSelect.options).map(o => o.value);
        const newNames = Array.from(names);
        if (currentOptions.join(',') === newNames.join(',')) return;
        listSelect.innerHTML = '';
        newNames.forEach(n => {
            const opt = document.createElement('option');
            opt.value = n;
            opt.textContent = state.listSettings[n] ? `${n} (configured)` : n;
            listSelect.appendChild(opt);
        });
        if (prevValue && names.has(prevValue)) {
            listSelect.value = prevValue;
        } else if (listSelect.options.length > 0) {
            listSelect.selectedIndex = 0;
        }
        fillFields(listSelect.value);
    }

    listSelect.onchange = () => {
        fillFields(listSelect.value);
    };

    populateDropdown();
    setInterval(populateDropdown, 3000);
    document.body.appendChild(popup);

    // Close popup window when clicking outside
    function handleClickOutside(e) {
        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    }

    // Add a small delay to prevent immediate close
    requestAnimationFrame(() => {
        document.addEventListener('click', handleClickOutside);
    });
}


// -----------------------------
// Apply saved settings periodically
// -----------------------------
setInterval(applyAllListSettings, 3000);
