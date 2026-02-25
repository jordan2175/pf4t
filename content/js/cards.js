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
        cardContainer.dataset.pf4tCategory      = parsedTitle.sCategory.toUpperCase();
        cardContainer.dataset.pf4tTime          = parsedTitle.aTime.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tCosts         = parsedTitle.aCosts.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tPoints        = parsedTitle.aPoints.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tSquareLabels  = parsedTitle.aSquareLabels.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tCurlyLabels   = parsedTitle.aCurlyLabels.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tBarLabels     = parsedTitle.aBarLabels.map(v => v.toUpperCase()).join(",");
        cardContainer.dataset.pf4tHashTags      = parsedTitle.aHashTags.map(v => v.toUpperCase()).join(",");
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
    html += `<span class="pf4t-parsed-title" style="color: #172b4d;">${parsedTitleData.sCleanTitle}</span> `;

    
    // Hashtags #hash
    parsedTitleData.aHashTags.forEach(hash => {
        html += `<span class="pf4t-style-hash">${hash}</span> `;
    });

    // Square Labels [something]
    parsedTitleData.aSquareLabels.forEach(square => {
        html += `<span><i class="fa fa-tag pf4t-style-slabel"> ${square}</i></span>`;
    });

    // Curly Labels {something}
    parsedTitleData.aCurlyLabels.forEach(curly => {
        html += `<span><i class="fa fa-tag pf4t-style-clabel"> ${curly}</i></span>`;
    });

    // Bar Labels {something}
    parsedTitleData.aBarLabels.forEach(bar => {
        html += `<span><i class="fa fa-tag pf4t-style-blabel"> ${bar}</i></span>`;
    });

    html += `<div>`;

    // Add Priority Icons
    if (parsedTitleData.iPriorityLevel == 1 ) {
        html += `<span><i class="fa fa-exclamation-triangle pf4t-style-priority-low"></i></span>`;
    }

    if (parsedTitleData.iPriorityLevel == 2 ) {
        html += `<span><i class="fa fa-exclamation-triangle pf4t-style-priority-med"></i></span>`;
    }

    if (parsedTitleData.iPriorityLevel >= 3 ) {
        html += `<span><i class="fa fa-exclamation-triangle pf4t-style-priority-high"></i></span>`;
    }

    // Time [&5.00]
    parsedTitleData.aTime.forEach(timeneeded => {
        html += `<span><i class="fa fa-hourglass-end pf4t-style-time"> ${timeneeded}</i></span>`;
    });

    // Costs {$5.00}
    parsedTitleData.aCosts.forEach(costexpected => {
        html += `<span><i class="fa fa-money pf4t-style-costs"> ${costexpected}</i></span>`;
    });

    // Points |&4|
    parsedTitleData.aPoints.forEach(pointsexpected => {
        html += `<span><i class="fa fa-star pf4t-style-points"> ${pointsexpected}</i></span>`;
    });

    html += `</div>`;

    // Apply the HTML to the card title element
    fullTrelloCard.innerHTML = html;
}
