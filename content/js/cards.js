// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t


function processCard(fullTrelloCard) {
    if (fullTrelloCard.getAttribute('data-pf4t-processed') === 'true') return;

    const rawTitle = fullTrelloCard.innerText;
    const parsedTitle = TrelloCardTitleParser.parseTitle(rawTitle);

  
    // Target the Trello card wrapper used by filters
    const cardContainer = fullTrelloCard.closest('[data-testid="list-card"]');


    // Add elements from the parsed title to the DOM so that it can be looked up
    // and used later when we are doing the filtering.
    if (cardContainer) {
        cardContainer.dataset.pf4tCategory      = parsedTitle.sCategory.toLowerCase();
        cardContainer.dataset.pf4tSquareLabels  = parsedTitle.aSquareLabels.map(v => v.toLowerCase()).join(",");
        cardContainer.dataset.pf4tCurlyLabels   = parsedTitle.aCurlyLabels.map(v => v.toLowerCase()).join(",");
        cardContainer.dataset.pf4tBarLabels     = parsedTitle.aBarLabels.map(v => v.toLowerCase()).join(",");
        cardContainer.dataset.pf4tHashTags      = parsedTitle.aHashTags.map(v => v.toLowerCase()).join(",");
        cardContainer.dataset.pf4tPriorityLevel =
          parsedTitle.iPriorityLevel ? parsedTitle.iPriorityLevel.toString() : "";
    }

    updateCardUI(fullTrelloCard, parsedTitle);
    fullTrelloCard.setAttribute('data-pf4t-processed', 'true');
}


// Updates the visual presentation of a Trello card.
// Handles Priority markers, Categories, Titles, and Token Badges.
function updateCardUI(fullTrelloCard, parsedTitleData) {
    let html = "";


    // Handle Category (The part before the '|')
    if (parsedTitleData.sCategory !== "Uncategorized") {
        html += `<strong class="pf4t-style-category">${parsedTitleData.sCategory} </strong>`;
    }

    // Main Title
    // 2. The Main Card Title
    html += `<span class="pf4t-parsed-title" style="color: #172b4d;">${parsedTitleData.sCleanTitle}</span> `;

    
    // Hashtags #hash
    parsedTitleData.aHashTags.forEach(hash => {
        html += `<span class="pf4t-style-hash">${hash}</span> `;
    });
 
    // Square Labels [something]
    parsedTitleData.aSquareLabels.forEach(slabel => {
        html += `<span><i class="fa fa-tag pf4t-style-label"> ${slabel}</i></span>`;
    });

    // Curly Labels {something}
    parsedTitleData.aCurlyLabels.forEach(clabel => {
        html += `<span class="pf4t-style-time">${clabel}</span>`;
    });

    // Bar Labels {something}
    parsedTitleData.aBarLabels.forEach(blabel => {
        html += `<span class="pf4t-style-time">${blabel}</span>`;
    });

    // Add Priority Icon
    if (parsedTitleData.iPriorityLevel == 1 ) {
        html += `<div><span><i class="fa fa-exclamation-triangle pf4t-style-priority-low"></i></span></div> `;
    }

    if (parsedTitleData.iPriorityLevel == 2 ) {
        html += `<div><span><i class="fa fa-exclamation-triangle pf4t-style-priority-med"></i></span></div> `;
    }

    if (parsedTitleData.iPriorityLevel >= 3 ) {
        html += `<div><span><i class="fa fa-exclamation-triangle pf4t-style-priority-high"></i></span></div> `;
    }

    // Apply the HTML to the card title element
    fullTrelloCard.innerHTML = html;


}
