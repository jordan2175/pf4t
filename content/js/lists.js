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

// -----------------------------
// Apply width/color to a list by list name
// -----------------------------
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

// Apply all saved settings
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

// -----------------------------
// Show List Settings Popup
// -----------------------------
function showListSettingsPopup() {
    // Remove existing popup
    const existing = document.querySelector('.pf4t-list-settings-popup');
    if (existing) existing.remove();

    // -----------------------------
    // Create popup container
    // -----------------------------
    const popup = document.createElement('div');
    popup.className = 'pf4t-list-settings-popup';
    // popup.style.position = 'fixed';
    // popup.style.transform = 'translateX(-50%)';
    // popup.style.background = '#fff';
    // popup.style.border = '1px solid #ccc';
    // popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    // popup.style.zIndex = 10000;
    // popup.style.minWidth = '300px';

    // Title
    const title = document.createElement('strong');
    title.innerText = 'List Settings';
    title.className = 'pf4t-list-settings-label'
    popup.appendChild(title);

    popup.style.left = '50%';
    popup.style.top = '100px';
    makeDraggable(popup, title);

    // -----------------------------
    // Dropdown for list names
    // -----------------------------
    const listSelect = document.createElement('select');
    listSelect.className = 'pf4t-list-settings-fields';
    popup.appendChild(listSelect);

    // -----------------------------
    // Width input
    // -----------------------------
    const widthInput = document.createElement('input');
    widthInput.className = 'pf4t-list-settings-txtfields';
    widthInput.type = 'number';
    widthInput.placeholder = 'Width px';
    popup.appendChild(widthInput);

    // -----------------------------
    // Standard 8-color palette
    // -----------------------------
    const colors = ['#ffffff','#ff9999','#99ff99','#9999ff','#ffff99','#ff99ff','#99ffff','#cccccc'];
    const colorContainer = document.createElement('div');
    colorContainer.className = 'pf4t-list-settings-fields';
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
    popup.appendChild(colorContainer);

    // -----------------------------
    // Color picker
    // -----------------------------
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'pf4t-list-settings-fields';
    popup.appendChild(colorInput);

    // -----------------------------
    // RGB manual input
    // -----------------------------
    const rgbInput = document.createElement('input');
    rgbInput.className = 'pf4t-list-settings-txtfields';
    rgbInput.type = 'text';
    rgbInput.placeholder = '255,0,0 or #ff0000';
    popup.appendChild(rgbInput);

    // -----------------------------
    // Apply button
    // -----------------------------
    const applyBtn = document.createElement('button');
    applyBtn.innerText = 'Apply';
    applyBtn.className = 'pf4t-list-settings-apply-btn';
    applyBtn.onclick = () => {
        const listName = listSelect.value;
        if (!listName) return;

        let color = rgbInput.value || colorInput.value || null;
        const width = widthInput.value ? parseInt(widthInput.value) : null;

        state.listSettings[listName] = { width, color };
        saveListSettings();
        applyListSettingsByName(listName, state.listSettings[listName]);
        fillFields(listName);
        populateDropdown(); // update option text (show configured)
    };

    // -----------------------------
    // Reset button
    // -----------------------------
    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset';
    resetBtn.className = 'pf4t-list-settings-reset-btn';
    resetBtn.onclick = () => {
        const listName = listSelect.value;
        if (!listName) return;
        delete state.listSettings[listName];
        saveListSettings();
        applyListSettingsByName(listName, {}); // reset style
        fillFields(listName);
        populateDropdown();
    };


    // -----------------------------
    // Close Button
    // -----------------------------
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.className = 'pf4t-list-settings-close-btn';
    closeBtn.onclick = () => popup.remove();


    // -----------------------------
    // Button Bar
    // -----------------------------
    const buttonRow = document.createElement('div');
    buttonRow.className = 'pf4t-list-settings-button-bar';
    //buttonRow.style.display = 'flex';
    //buttonRow.style.gap = '15px';
    //buttonRow.style.marginTop = '10px';

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

        // Only rebuild if changed
        const currentOptions = Array.from(listSelect.options).map(o => o.value);
        const newNames = Array.from(names);
        if (currentOptions.join(',') === newNames.join(',')) return; // no change

        listSelect.innerHTML = '';
        newNames.forEach(n => {
            const opt = document.createElement('option');
            opt.value = n;
            opt.textContent = state.listSettings[n] ? `${n} (configured)` : n;
            listSelect.appendChild(opt);
        });

        // Restore previous selection or first list
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
    setInterval(populateDropdown, 3000); // update if new lists appear

    document.body.appendChild(popup);

    // Close popup when clicking outside
    function handleClickOutside(e) {
        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    }

    // Small delay to prevent immediate close
    requestAnimationFrame(() => {
        document.addEventListener('click', handleClickOutside);
    });
}

// -----------------------------
// Apply saved settings periodically
// -----------------------------
setInterval(applyAllListSettings, 3000);
