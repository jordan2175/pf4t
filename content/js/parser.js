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
  // Move patterns outside so they're compiled once
  regexCategory: /(^.*?)\s*\|\s*/,
  regexSquareLabels: /\[([^\]]+)\]/g,
  regexCurlyLabels: /\{([^\}]+)\}/g,
  regexBarLabels: /\|([^\|]+)\|/g,
  regexHashTags: /(#[^\s!@#$%^&*()=+;:",\.\\<>]+)/g,
  regexPriorityLevel: /(!+)/g,
  
  parseTitle: function(fullTitle) {
    let title = fullTitle;
    
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
    
    // Extract category
    const catMatch = title.match(this.regexCategory);
    if (catMatch) {
      parsedCardTitleData.sCategory = catMatch[1].trim();
      title = title.replace(catMatch[0], "");
    }
    
    // Extract labels - use Array.from instead of spread for slight perf boost
    parsedCardTitleData.aSquareLabels = Array.from(title.matchAll(this.regexSquareLabels), m => m[1]);
    parsedCardTitleData.aCurlyLabels = Array.from(title.matchAll(this.regexCurlyLabels), m => m[1]);
    parsedCardTitleData.aBarLabels = Array.from(title.matchAll(this.regexBarLabels), m => m[1]);
    parsedCardTitleData.aHashTags = Array.from(title.matchAll(this.regexHashTags), m => m[1]);
    
    // Priority
    const prioMatch = title.match(this.regexPriorityLevel);
    if (prioMatch && prioMatch[0].length === 2) {
      parsedCardTitleData.iPriorityLevel = prioMatch[0].length;
    }
    
    // Clean title - chain replaces more efficiently
    parsedCardTitleData.sCleanTitle = title
      .replace(this.regexSquareLabels, "")
      .replace(this.regexCurlyLabels, "")
      .replace(this.regexBarLabels, "")
      .replace(this.regexHashTags, "")
      .replace(this.regexPriorityLevel, "")
      .trim();
    
    return parsedCardTitleData;
  }
};

