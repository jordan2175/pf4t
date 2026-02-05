// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t


// Object to track the current state of filters
let state = {
  activeFilters: {
    type: null,
    val: null
  },
  listSettings: {}
};

const observer = new MutationObserver((mutations) => {
    // Temporarily disconnect to prevent infinite loops
    observer.disconnect();
    
    mutations.forEach(mutation => {
        // Get the element (text nodes don't have .closest)
        const target = mutation.target.nodeType === Node.TEXT_NODE 
            ? mutation.target.parentElement 
            : mutation.target;
        
        if (target) {
            const cardName = target.closest('[data-testid="card-name"]');
            if (cardName) {
                // Only re-process if this is NOT already our processed content
                if (!cardName.querySelector('.pf4t-parsed-title')) {
                    cardName.removeAttribute('data-pf4t-processed');
                    processCard(cardName);
                }
            }
        }
    });
    
    // Also catch any new cards
    document.querySelectorAll('[data-testid="card-name"]').forEach(card => processCard(card));
    
    // Reconnect the observer
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        characterData: true,
        characterDataOldValue: true
    });
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    characterData: true,  // watches for text changes
    characterDataOldValue: true  // helpful for debugging
});


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
