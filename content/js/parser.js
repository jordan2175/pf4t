// Copyright 2026 Bret Jordan, All rights reserved.
//
// Use of this source code is governed by an Apache 2.0 license that can be
// found in the LICENSE file in the root of the source tree.
//
// Pro Filters for Trello (pf4t)
// https://github.com/jordan2175/pf4t


/*
--------------------------------------------------
TrelloCardTitleParser()
This funciton is called is called from:
  - processCard()
--------------------------------------------------
*/
const TrelloCardTitleParser = {
  patterns: {
    regexCategory:      /(^.*?)\s*\|\s*/,     // Matches "Something |" at the start
    regexSquareLabels:  /\[([^\]]+)\]/g,      // Matches [this]
    regexCurlyLabels:   /\{([^\}]+)\}/g,      // Matches {that}
    regexBarLabels:     /\|([^\|]+)\|/g,      // Matches |other|
    regexHashTags:      /(#[^\s!@#$%^&*()=+;:",\.\\<>]+)/g, // Matches #this
    regexPriorityLevel: /(!+)/g               // Matches !!!
  },

  parseTitle: function(fullTitle) {
    let title = fullTitle;

    // Create a structure to hold all of the various elements and data that 
    // we parse from the card title. 
    const parsedCardTitleData = {
      sOriginal: fullTitle,
      sCategory: "Uncategorized",
      aSquareLabels: [],
      aCurlyLabels: [],
      aBarLabels: [],
      aHashTags: [],
      iPriorityLevel: 0,
      sCleanTitle: ""
    };

    // Extract the category field (The part before the first |)
    const catMatch = title.match(this.patterns.regexCategory);
    if (catMatch) {
      parsedCardTitleData.sCategory = catMatch[1].trim();
      title = title.replace(catMatch[0], "");
    }

    // Extract the various label types
    parsedCardTitleData.aSquareLabels = [...title.matchAll(this.patterns.regexSquareLabels)].map(m => m[1]);
    parsedCardTitleData.aCurlyLabels  = [...title.matchAll(this.patterns.regexCurlyLabels)].map(m => m[1]);
    parsedCardTitleData.aBarLabels    = [...title.matchAll(this.patterns.regexBarLabels)].map(m => m[1]);


    // Extract any hashtags
    parsedCardTitleData.aHashTags = [...title.matchAll(this.patterns.regexHashTags)].map(m => m[1]);

    // Extract the priority level
    const prioMatch = title.match(this.patterns.regexPriorityLevel);

    if (prioMatch) {
      if (prioMatch[0].length === 2) {
        parsedCardTitleData.iPriorityLevel = prioMatch[0].length;
      } 
    }



    // Create a clean title that can be used to display on the cards
    parsedCardTitleData.sCleanTitle = title
      .replace(this.patterns.regexSquareLabels, "")
      .replace(this.patterns.regexCurlyLabels, "")
      .replace(this.patterns.regexBarLabels, "")
      .replace(this.patterns.regexHashTags, "")
      .replace(this.patterns.regexPriorityLevel, "")
      .trim();

    return parsedCardTitleData;
  }
};
