// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)


// Object to track the current state of filters
let state = {
  activeFilters: {
    type: null,
    val: null
  },
  listSettings: {}
};

const observer = new MutationObserver((mutations) => {
    document.querySelectorAll('[data-testid="card-name"]').forEach(card => processCard(card));
});

observer.observe(document.body, { childList: true, subtree: true });


// Initial run for cards already on screen
setTimeout(() => {
    document.querySelectorAll('[data-testid="card-name"]').forEach(processCard);
}, 2000);


// Heartbeat to ensure filter bar exists
setInterval(() => {
    if (!document.getElementById('pf4t-filter-bar')) {
        console.log("Re-injecting Filter Bar...");
        updateFilterBar();
    }
}, 3000); // Checks every 3 seconds
