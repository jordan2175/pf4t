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
  regexCategory:      /(^.*?)\s*\|\s*/,
  regexHashTags:      /(#[^\s!@#$%^&*()=+;:",\.\\<>]+)/g,
  regexSquareLabels:  /\[(?!~)([^\]]+)\]/g,      // Match [...] but NOT [~...]
  regexCurlyLabels:   /\{(?!\$)([^\}]+)\}/g,     // Match {...} but NOT {$...}
  regexBarLabels:     /\|(?!&)([^\|]+)\|/g,      // Match |...| but NOT |&...|
  regexPriorityLevel: /(!+)/g,
  regexTime:          /\[~([^\]]+)\]/g,           // Match [~...] 
  regexCosts:         /\{\$([^\}]+)\}/g,          // Match {$...}
  regexPoints:        /\|&([^\|]+)\|/g,           // Match |&...|
  
  parseTitle: function(fullTitle) {
    let title = fullTitle;
    
    const parsedCardTitleData = {
      sOriginal: fullTitle,
      sCategory: "Uncategorized",
      aTime: [],
      aCosts:[],
      aPoints:[],
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
    
    // IMPORTANT: Extract and REMOVE special patterns first
    parsedCardTitleData.aTime = Array.from(title.matchAll(this.regexTime), m => m[1]);
    this.regexTime.lastIndex = 0;
    title = title.replace(this.regexTime, ""); // Remove [~...] from string
    
    parsedCardTitleData.aCosts = Array.from(title.matchAll(this.regexCosts), m => m[1]);
    this.regexCosts.lastIndex = 0;
    title = title.replace(this.regexCosts, ""); // Remove {$...} from string
    
    parsedCardTitleData.aPoints = Array.from(title.matchAll(this.regexPoints), m => m[1]);
    this.regexPoints.lastIndex = 0;
    title = title.replace(this.regexPoints, ""); // Remove |&...| from string
    
    // NOW extract the regular labels (after special ones are removed)
    parsedCardTitleData.aSquareLabels = Array.from(title.matchAll(this.regexSquareLabels), m => m[1]);
    parsedCardTitleData.aCurlyLabels  = Array.from(title.matchAll(this.regexCurlyLabels), m => m[1]);
    parsedCardTitleData.aBarLabels    = Array.from(title.matchAll(this.regexBarLabels), m => m[1]);
    parsedCardTitleData.aHashTags     = Array.from(title.matchAll(this.regexHashTags), m => m[1]);
    
    // Priority
    const prioMatch = title.match(this.regexPriorityLevel);
    if (prioMatch) {
      parsedCardTitleData.iPriorityLevel = prioMatch[0].length;
    }
    
    // Reset lastIndex for all global regexes before clean title operations
    this.regexSquareLabels.lastIndex = 0;
    this.regexCurlyLabels.lastIndex = 0;
    this.regexBarLabels.lastIndex = 0;
    this.regexHashTags.lastIndex = 0;
    this.regexPriorityLevel.lastIndex = 0;
    
    // Clean title - remove all patterns
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

