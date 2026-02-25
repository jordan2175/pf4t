// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t


function saveLabelColors() {
  localStorage.setItem('pf4t_labelColors', JSON.stringify(state.labelColors));
}

function loadLabelColors() {
  const data = localStorage.getItem('pf4t_labelColors');
  if (data) {
    state.labelColors = JSON.parse(data);
  }
  applyLabelColors();
}

function applyLabelColors() {
  // Create or update dynamic style tag
  let styleTag = document.getElementById('pf4t-dynamic-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'pf4t-dynamic-styles';
    document.head.appendChild(styleTag);
  }
  
  styleTag.textContent = `
    .pf4t-style-slabel {
      background: ${state.labelColors.squareLabels} !important;
    }
    .pf4t-style-clabel {
      background: ${state.labelColors.curlyLabels} !important;
    }
    .pf4t-style-blabel {
      background: ${state.labelColors.barLabels} !important;
    }
  `;
}

// Load on startup
loadLabelColors();
