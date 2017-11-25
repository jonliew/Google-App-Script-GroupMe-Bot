function DataMap(url){
  this.spreadsheet = SpreadsheetApp.openByUrl(url);
  this.sheet = this.spreadsheet.getSheets()[0];
  this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), 3);
  this.values = this.range.getValues();
  this.url = url;
};