var botId = "insert bot id here";
var database = new DataMap('insert spreadsheet link here');

function sendText(text){
  var payload = {
    "bot_id" : botId,
    "text" : text
  };  
  var options = {
    "method" : "post",
    "payload" : payload
  };
  
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", options);
}

//respond to messages sent to the group. Recieved as POST
//this method is automatically called whenever the Web App's (to be) URL is called
function doPost(e){
  var post = JSON.parse(e.postData.getDataAsString());
  var text = post.text;
  var name = post.name;
  var id = post.id;
  var sender_id = post.sender_id;
  var user_id = post.user_id;
  Logger.log(text + '-' + name + '-'  + id + '-'  + sender_id + '-'  + user_id);
  //sendText(text + '-' + name + '-'  + id + '-'  + sender_id + '-'  + user_id);
  
  if(text.toLowerCase().substring(0, 3) == "!hi"){
    sendText("Hello, " + name);
  }
  
  if (text.toLowerCase().indexOf("!help") == 0) {
    var msg = 'Commands:\n';
    msg+= '!karma - Display karma of caller\n';
    msg += '[Person]++ - Gives [Person] karma\n';
    msg += '!karma all - Display karma of all in database\n';
    msg += '!tag - Display tag of caller\n';
    msg += '!tagset [message] - Sets the tag of the caller with the message\n';
    msg += '!tag all - Display tag of all in database\n';
    msg += '!cal - Display calendar events for 2 weeks\n';
    msg += '!bylaws - Display link to Chapter Bylaws\n';
    msg += '!constitution - Display link to Chapter Constitution\n';
    msg += '!help - Displays this message\n';
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!karma all") == 0) {
    var karmaArray = [];
    for (var x = 0; x < databaseGetSize(); x++) {
      karmaArray.push({name: database.values[x][0], karma: database.values[x][1]});
    }
    
    karmaArray.sort(function(a,b) {
      return b.karma - a.karma
    });
    
    var msg = "";
    for (var x = 0; x < karmaArray.length; x++) {
      msg += karmaArray[x].name + ": " + karmaArray[x].karma + "\n";
    }
    sendText(msg);
  } else  if (text.indexOf("!karma") == 0) {
    var karma = getKarma(name);
    sendText(name + ": " + karma);
  }
  
  if (text.toLowerCase().indexOf("!tagset") == 0) {
    var tagMessage = text.substring(8);
    setTag(name, tagMessage);
  } else if (text.toLowerCase().indexOf("!tag all") == 0) {
    var msg = "";
    for (var x = 0; x < databaseGetSize(); x++) {
      msg += database.values[x][0] + ": " + database.values[x][2] + "\n";
    }
    sendText(msg);
  } else if (text.toLowerCase().indexOf("!tag") == 0) {
    var msg = getTag(name);
    sendText(name + ": " + msg);
  }
  
  if (text.indexOf("++") != -1 && text.indexOf("++") < 30) {
    var karmaRecipient = text.substring(0, text.indexOf("++"));
    addKarma(karmaRecipient);
  }
  
  if (text.toLowerCase().indexOf("!cal") == 0) {
    var events = listUpcomingEvents();
    var msg = "Events in the next 2 weeks:\n";
    for (var x = 0; x < events.length; x++) {
      msg += events[x].title + " - " + events[x].time.toLocaleString() + "\n";
    }
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!bylaws") == 0) {
    sendText("insert link here");
  }
  
  if (text.toLowerCase().indexOf("!constitution") == 0) {
    sendText("insert link here");
  }
  
  if (text.indexOf("oversight") != -1) {
    sendText("Cole oversees Chris in MBC but Chris oversees Cole in Eagle Mentors. So, who is in charge?");
  }
  
  if (text.toLowerCase().indexOf("mein") != -1) {
    sendText("kampf");
  }
  
  if (text.indexOf("!delete") == 0) {
    sendText("Are you trying to delete me? Delete yourself!");
  }
  
}

function sendWeeklyCalendar() {
  var events = listUpcomingEvents();
  var msg = "Events in the next 2 weeks:\n";
  for (var x = 0; x < events.length; x++) {
    msg += events[x].title + " - " + events[x].time.toLocaleString() + "\n";
  }
  sendText(msg);
}

function setTag(name, tag) {
  var tagAdded = 0;
  for (var x = 0; x < databaseGetSize(); x++) {
    if((database.values[x][0] == name)){
      database.sheet.getRange(x+1, 3).setValue(tag);
      tagAdded = 1;
    }
  }
  if (tagAdded == 0) {
    createPerson(name, 0, tag);
  }
}

function getTag(name) {
  for (var x = 0; x < databaseGetSize(); x++) {
    if((database.values[x][0] == name)){
      return database.values[x][2];
    }
  }
  return "Tag not found";
}

function getKarma(name) {
  for (var x = 0; x < databaseGetSize(); x++) {
    if((database.values[x][0] == name)){
      return database.values[x][1];
    }
  }
  return 0;
}

function addKarma(name) {
  var karmaAdded = 0;
  for (var x = 0; x < databaseGetSize(); x++) {
    if((database.values[x][0] == name)){
      currentKarma = database.values[x][1];
      database.sheet.getRange(x+1, 2).setValue(currentKarma + 1);
      karmaAdded = 1;
    }
  }
  if (karmaAdded == 0) {
    createPerson(name, 1, "No tag set");
  }
}

function createPerson(name, karma, tag) {
  database.sheet.appendRow([name, karma, tag]);
}

function databaseGetSize() {
  for(i = 1; i < database.sheet.getMaxRows(); i++){
      if(database.sheet.getRange(i, 1).getValue() == "" && database.sheet.getRange(i, 2).getValue() == "")
      {
        return i - 1;
      }
  }
}

function doGet() {}
