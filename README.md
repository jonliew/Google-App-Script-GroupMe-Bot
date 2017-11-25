# Google-App-Script-GroupMe-Bot
A GroupMe bot written using Google App Script.

Google App Scripts was used for its ability to run as a web app and saving easily accessible data.
Integration with Google Calendar and Google Spreadsheets was used for events and data saving.

Parts of this program was taken from https://github.com/william-reed/GroupMe-Bots-With-Google-Apps-Script. 
However, it has been heavily modified to fit the needs of this project.

## Features of the bot
- Tracks, adds, and displays karma for users in the group
- Sets and displays tag messages for users in the group
- Display events on a group of Google calendars
- Responds to certain key words
- Automatically creates users in the spreadsheet if they (or their corresponding karma or tags) don't exist

## Set-up
- Follow the guide at https://github.com/william-reed/GroupMe-Bots-With-Google-Apps-Script/wiki/Deploying-and-Using-a-Google-Apps-Script
- Create a GroupMe bot at https://dev.groupme.com/bots
- Get the Bot ID and place it in Code.gs
- Create a Google Spreadsheet under the same account that the script is going to be run.
- Get the Google Spreadsheet URL and place it in Code.gs
- If you want the script to run a function automatically, add a new trigger
  - Edit > Current project's trigger > Add a new trigger
- Modify the calendar links to your needs

## Reference information
- [Google Calendar](https://developers.google.com/apps-script/reference/calendar/)
- [Google Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/)
- [GroupMe Bot Tutorial](https://dev.groupme.com/tutorials/bots)
- [Google App Script]()
- [Google App Script Triggers](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_manually)
