// Initialize Google Spreadsheet with data, commands, messages, and stats
var spreadsheetURL = '<insert spreadsheet URL here>';
var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetURL);

// Main group info
var mainBotName = "<Insert main group bot name here>";
var mainGroupID = <Insert main group ID here>;
var mainBotID = "<Insert main group bot ID here>";

// Test group info
var testBotName = "<Insert test group bot name here>";
var testGroupID = <Insert test group ID here>;
var testBotID = "<Insert test group bot ID here>"

// User token access key required to retrieve more powerful APIs from GroupMe
var tokenID = "<Insert user access token provided by GroupMe here>";

// Initialize variables
var botId = mainBotID;
var botName = mainBotName;

// Initialize each sheet in workbook
var database = new getData();
var commandList = new getCommands();
var messageList = new getMessages();
var messageStats = new getMessageStats();
var shameStats = new getShameStats();

function sendText(text){
  if (text.length > 999) {
    text = text.substring(0,995) + "...";
  }
  
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

function sendImage(caption, url) {
  var payload = {
    "bot_id" : botId,
    "text" : caption,
    "attachments" : [
      {
        "type" : "image",
        "url" : url
      }
    ]
  };
  var options = {
    "method" : "post",
    "payload" : JSON.stringify(payload)
  };

  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", options);
}

function sendVideo(text, url, previewUrl) {
  var payload = {
    "bot_id" : botId,
    "text" : text,
    "attachments" : [
      {
        "type" : "video",
        "preview_url" : previewUrl,
        "url" : url
      }
    ]
  };
  var options = {
    "method" : "post",
    "payload" : JSON.stringify(payload),
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
  var group_id = post.group_id;
  var attachments = post.attachments;
  
  var mentionedUserIDs = [];
  for (i in attachments) {
    if (attachments[i].type == "mentions") {
        mentionedUserIDs = attachments[i].user_ids;
    }
  }
  
  // Change which bot replies depending on the group where the message was sent
  if (group_id == mainGroupID) {
    botId = mainBotID;
    botName = mainBotName;
  } 
  if (group_id == testGroupID) {
    botId = testBotID;
    botName = testBotName;
  }
  
  //Logger.log(text + '-' + name + '-'  + id + '-'  + sender_id + '-'  + user_id);
    
  if(text.toLowerCase().substring(0, 3) == "!hi"){
    sendText("Hello, " + name);
  }
  
  if (text.toLowerCase().indexOf(" added ") != -1 && name == "GroupMe") {
    var names = text.substring(text.toLowerCase().indexOf("added") +6, text.toLowerCase().indexOf("to the group") - 1);
    sendText("Welcome " + names + "!");
  }
  
  if (text.toLowerCase().indexOf("!help") == 0) {
    var msg = 'Commands:\n';
    msg += '!karma - Display karma of caller\n';
    msg += '!karma all [ratio]- Display karma of all in database\n';
    msg += '!shame [@mention users] - Shame on someone\n';
    msg += '!shame wall - Display the Wall of Shame\n';
    msg += '!tag - Display tag of caller\n';
    msg += '!tagset [message] - Sets the tag of the caller with the message\n';
    msg += '!tag all - Display tag of all in database\n';
    msg += '!cal - Display calendar events for 2 weeks\n';
    msg += '!bylaws - Display link to Chapter Bylaws\n';
    msg += '!constitution - Display link to Chapter Constitution\n';
    msg += '!counselordoc - Display link to MBC counselor documentation\n';
    msg += '!translate [text] - Translate text to English\n';
    msg += '!spanish [text] - Translate text to Spanish\n';
    msg += '!define [term] - Define the term from Urban Dictionary\n';
    msg += '!photos - Display a link to our photo albums\n';
    msg += '!kick [@mention users] - Kick mentioned users\n';
    msg += '!help - Displays this message\n';
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!karma all") == 0) {
    var karmaArray = [];
    for (var x = 1; x < messageStats.size; x++) {
      if (messageStats.values[x][0].toString().match(/^[0-9]+$/) != null) {
        karmaArray.push({name: messageStats.values[x][1], karma: messageStats.values[x][4], ratio: messageStats.values[x][5].toPrecision(3)});
      }
    }
    
    if (text.toLowerCase().indexOf("ratio") != -1) {
      karmaArray.sort(function(a,b) {
        return b.ratio - a.ratio
      });
    } else if (text.toLowerCase().indexOf("low") != -1) {
      karmaArray.sort(function(a,b) {
        return a.ratio - b.ratio
      });
    } else {
      karmaArray.sort(function(a,b) {
        return b.karma - a.karma
      });
    }
        
    var msg = "Name: Likes (Ratio)\n";
    for (var x = 0; x < karmaArray.length; x++) {
      msg += karmaArray[x].name + ": " + karmaArray[x].karma + " (" + karmaArray[x].ratio + ")"+ "\n";
    }
    sendText(msg);
  } else  if (text.indexOf("!karma") == 0) {
    var karma = getKarma(user_id);
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
    
  if (text.toLowerCase().indexOf("!cal") == 0) {
    var events = listUpcomingEvents();
    var msg = "Events in the next 2 weeks:\n";
    for (var x = 0; x < events.length; x++) {
      msg += events[x].title + " - " + events[x].time.toLocaleString() + "\n";
    }
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!swipe") == 0) {
    var msg = name + " is a poor college student and wants to be swiped into Scott!";
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!translate") == 0) {
    var msg = translateToEnglish(text.substring(11));
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!spanish") == 0) {
    var msg = translateToSpanish(text.substring(9));
    sendText(msg);
  }
  
  if (text.toLowerCase().indexOf("!define") == 0){
    var result = getDefinition(text.substring(8));
    var msg = result.definition + "\n" + result.link;
    sendText(msg);
  }
  
  if (text.indexOf("//") == 0 && name.indexOf(botName) != 0) {
    sendText("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }
  
  if (text.toLowerCase().indexOf("!add") == 0 && name == "<Insert your user name here>") {
    var addCommand = text.substring(5);
    commandList.sheet.appendRow(addCommand.split(','));
  }
  
  if (text.toLowerCase().indexOf("!kick") == 0 && name == "<Insert your user name here>") {
  
    // Get the list of members in the group and their ids (not user ids) using access token
    var url = "https://api.groupme.com/v3/groups/" + group_id + "?token=" + tokenID;
    var result = UrlFetchApp.fetch(url);
    var data = JSON.parse(result.getContentText());
    var members = data.response.members;
    
    // Loop through all of the mentioned users and kick them
    for (i in mentionedUserIDs) {
      
      var memberID = null;
      for (j in members) {
        if (members[j].user_id == mentionedUserIDs[i]) {
          memberID = members[j].id;
          break;
        }
      }
      var url = "https://api.groupme.com/v3/groups/" + group_id + "/members/" + memberID + "/remove?token=" + tokenID;
      var options = {
        "method" : "post",
      };
      var result = UrlFetchApp.fetch(url, options);
    }
   
  }

  if (text.toLowerCase().indexOf("!shame wall") == 0) {
    var msg = getWallOfShame();

    sendText(msg);
  } else if (text.toLowerCase().indexOf("!shame") == 0) {
    var msg = "";
    if (mentionedUserIDs.length == 0) {
      msg += "Must mention (@) a user worthy of our shame";
    // shame each mentioned user
    } else {
      // msg += mentionedUserIDs.forEach(setShame);
      //mentionedUserIDs.forEach(function(user_id) {
      //  msg += setShame(user_id);
      //});
      msg += setShame(mentionedUserIDs[0]);
    }

    sendText(msg);
  }
  
  // Loop through the command list searching for a match  
  for (var x = 0; x < commandList.size; x++) {
    // If matched with command and the bot did not send the message, reply according to message format (Text, Image, or Video)
    if (text.toLowerCase().indexOf(commandList.values[x][0]) != -1 && name.indexOf(botName) != 0) {
      if (commandList.values[x][1].indexOf("Text") == 0) {
        sendText(commandList.values[x][2].toString());
      }
      else if (commandList.values[x][1].indexOf("Image") == 0) {
        sendImage(commandList.values[x][2].toString(),commandList.values[x][3].toString());
      }
      else if (commandList.values[x][1].indexOf("Video") == 0) {
        sendVideo(commandList.values[x][2].toString(),commandList.values[x][4].toString(),commandList.values[x][5].toString());
      }
      
    }
  }
  
  // If message sent by anyone other than the bot (prevents over calling API), update the list of messages
  if (name.indexOf(botName) != 0) {
    updateMessages();
  }
}

function updateMessages() {

  var groupID = mainGroupID;
  var limit = 20;
  
  var url = "https://api.groupme.com/v3/groups/" + groupID + "/messages?token=" + tokenID + "&limit=" + limit;
  var result = UrlFetchApp.fetch(url);
  var data = JSON.parse(result.getContentText());
  
  var messages = data.response.messages;
  
  if (messages === undefined) {
    var tempBotID = botID;
    botID = testBotID;
    sendText("Help! Something's wrong with me!");
    sendText(JSON.stringify(data));
    botId = tempBotID;    
  }
  //var messageList = new getMessages();
  for (i = messages.length - 1; i >= 0; i--) {
    for (j = messageList.size - limit; j < messageList.size; j++) {

      // If message exists
      if (messages[i].id == messageList.values[j][0]) {
        // If the number of likes needs to be updated, update cell
        if (messages[i].favorited_by.length != messageList.values[j][5]) {
          messageList.sheet.getRange(j+1,6).setValue(messages[i].favorited_by.length)
        }
        break;
      }
      // If message is not found, append to sheet
      if (j == messageList.size - 1) {
        messageList.sheet.appendRow([messages[i].id, messages[i].name, messages[i].sender_id, messages[i].created_at, messages[i].text, messages[i].favorited_by.length]);
      }
    }    
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
  for (var x = 0; x < database.size; x++) {
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
  for (var x = 0; x < database.size; x++) {
    if((database.values[x][0] == name)){
      return database.values[x][2];
    }
  }
  return "Tag not found";
}

function getKarma(user_id) {
  for (var x = 0; x < messageStats.size; x++) {
    if((messageStats.values[x][0] == user_id)){
      return "Likes Recieved/Messages Sent\n" + messageStats.values[x][4] + "/" + messageStats.values[x][2] + "=" + messageStats.values[x][5].toFixed(3);
    }
  }
  return "Not Found";
}

function createPerson(name, karma, tag) {
  database.sheet.appendRow([name, karma, tag]);
}

function translateToSpanish(text) {
  var msg = LanguageApp.translate(text, '', 'es');
  return msg;
}

function translateToEnglish(text) {
  var msg = LanguageApp.translate(text, '', 'en');
  return msg;
}

function getDefinition(term) {
  var definition = "No definition found.";
  var link = "";
  //term = term.replace(/\s/,"+");
  var url = "http://api.urbandictionary.com/v0/define?term=" + term;
  //Logger.log(url);
  var response = UrlFetchApp.fetch(url);
  //Logger.log(response.getContentText());
  var jsonResponse = JSON.parse(response);
  if (jsonResponse.result_type !== "no_results") {
    definition = jsonResponse.list[0].definition;
    link = jsonResponse.list[0].permalink;
  }
  //Logger.log(definition);
  //Logger.log(link);
  return {definition : definition, link : link};
}

// Returns a message containing the shame counts of all users, in descending order
function getWallOfShame() {
  var shameArray = [];
  var msg = "";

  if (shameStats.size <= 0) {
    return "Currently no one on Wall of Shame"
  }


  for (var x = 0; x < shameStats.size; x++) {
    if (shameStats.values[x][0].toString().match(/^[0-9]+$/) != null) {
      shameArray.push({name: shameStats.values[x][1], shame: shameStats.values[x][2]});
    }
  }

  // sort array
  // shameArray.sort( (a,b) => b.shame - a.shame );
  shameArray.sort(function(a, b) {
    return b.shame - a.shame;
  });


  msg += "WALL OF SHAME\n\n";
  shameArray.forEach(function(element) {
    msg += element.name + ": " + element.shame + "\n";
  });

  return msg;
}

// Incrememnts the shame count for the user given by user_id
// returns new shame count of user
function setShame(user_id) {
  var found = false;
  var x;
  // TODO: probably a better way to check this
  // find current shame count
  for (x = 0; x < shameStats.size; x++) {
    if((shameStats.values[x][0] == user_id)) {
      found = true;
      break;
    }
  }
  // find name, from the Stats sheet
  var idx;
  var name = null;
  for (idx = 0; idx < messageStats.size; idx++) {
    if(messageStats.values[idx][0] == user_id) {
      name = messageStats.values[idx][1];
      break;
    }
  }
  // fallback to default
  if (name == null) {
    name = "User";
  }


  // if shamee is not yet on sheet, add them to it, with a single shame
  if (!found) {
    shameStats.sheet.appendRow([user_id, name, 1]);
    return name + " has been shamed. Total shame count: " + 1 + "\n";
  // increment shame count otherwise
  } else {
    var shameCount = shameStats.values[x][2] + 1;
    var shameCell = shameStats.sheet.getRange(x + 1, 3);
    shameCell.setValue(shameCount);

    var nameCell = shameStats.sheet.getRange(x + 1, 2);
    nameCell.setValue(name);

    return name + " has been shamed. Total shame count: " + shameCount + "\n";
  }
}

function getData(){
  this.sheet = spreadsheet.getSheetByName("Data");
  this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), 3);
  this.values = this.range.getValues();
  this.size = this.sheet.getLastRow();
}

function getCommands() {
  this.sheet = spreadsheet.getSheetByName("Commands");
  this.range = this.sheet.getRange(2, 1, this.sheet.getMaxRows(), 6);
  this.values = this.range.getValues();
  this.size = this.sheet.getLastRow();
}

function getMessages() {
  this.sheet = spreadsheet.getSheetByName("Messages");
  this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), 6);
  this.values = this.range.getValues();
  this.size = this.sheet.getLastRow(); 
}

function getMessageStats() {
  this.sheet = spreadsheet.getSheetByName("Stats");
  this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), 6);
  this.values = this.range.getValues();
  this.size = this.sheet.getLastRow();
}


// Shame sheet has two  columns, with headers: shamee id and shame count, in that order
function getShameStats() {
  this.sheet = spreadsheet.getSheetByName("Shame");
  this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), 3);
  this.values = this.range.getValues();
  this.size = this.sheet.getLastRow();
}


function doGet() {}
