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
  listSettings: {},
  labelColors: {
    squareLabels: '#E0E0E0',
    curlyLabels: '#FFF4CE',
    barLabels: '#C9E6FF'
  }
};

const observer = new MutationObserver((mutations) => {
    // Collect unique cards to process (avoid duplicates)
    const cardsToProcess = new Set();
    
    mutations.forEach(mutation => {
        const target = mutation.target.nodeType === Node.TEXT_NODE 
            ? mutation.target.parentElement 
            : mutation.target;
        
        if (target) {
            const cardName = target.closest('[data-testid="card-name"]');
            if (cardName && !cardName.querySelector('.pf4t-parsed-title')) {
                cardsToProcess.add(cardName);
            }
        }
    });
    
    // Temporarily disconnect to prevent infinite loops
    observer.disconnect();
    
    // Process unique cards only
    cardsToProcess.forEach(card => {
        card.removeAttribute('data-pf4t-processed');
        processCard(card);
    });
    
    // Catch any new cards
    document.querySelectorAll('[data-testid="card-name"]').forEach(card => processCard(card));
    
    // Reconnect the observer
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        characterData: true
    });
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    characterData: true
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
}, 5000); // Checks every 5 seconds
