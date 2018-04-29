# Google-App-Script-GroupMe-Bot
A GroupMe bot written using Google App Script.

Google App Scripts was used for its ability to run as a web app and saving easily accessible data.
Integration with Google Calendar and Google Spreadsheets was used for events and data saving.

Parts of this program was taken from https://github.com/william-reed/GroupMe-Bots-With-Google-Apps-Script. 
However, it has been heavily modified to fit the needs of this project.

## Features of the bot
- Send text, image, or video with a caption using the bot
- Kick mentioned users
- Tracks and updates number of likes received for users in the group
- Sets and displays tag messages for users in the group
- Display events on a group of Google calendars
- Responds to certain key words
- Automatically creates users in the spreadsheet if they (or their corresponding karma or tags) don't exist
- Store basic commands in a spreadsheet for easy modification
- Allow for a main group (for group use) and a test group (for testing)

## Set-up
- Follow the guide at https://github.com/william-reed/GroupMe-Bots-With-Google-Apps-Script/wiki/Deploying-and-Using-a-Google-Apps-Script
- Create a GroupMe bot at https://dev.groupme.com/bots
- Get the Bot ID and name and group ID and place it in Code.gs
- Create a Google Spreadsheet under the same account that the script is going to be run.
- Get the Google Spreadsheet URL and place it in Code.gs
- Add a sheet titled "Commands" and create 6 columns: Command, Type (Text, Image, or Video), Text, Image, Video, Preview Video
- Append rows with your desired commands and repsonses
  - Leave cells blank if not required
- If you want the script to run a function automatically, add a new trigger
  - Edit > Current project's trigger > Add a new trigger
- If desired, modify the calendar links to your needs
- If desired, create a test group and bot and add the required information
- If desired, set up the message and stats logging
  - Add a sheet titled "Messages" and get the last couple of messages from your group using the GroupMe API [here](https://dev.groupme.com/docs/v3#messages_index)
  - Append the message_id, name, sender_id, created_at, text, and favorited_by.length as a new row
  - Add a sheet titled "Stats" get all of the user_ids of the members in the group using the GroupMe API [here](https://dev.groupme.com/docs/v3#members_results)
  - Use Google Sheet functions to query the Messages sheet to find the name and number of likes
  

## Reference information
- [Google Calendar](https://developers.google.com/apps-script/reference/calendar/)
- [Google Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/)
- [GroupMe Bot Tutorial](https://dev.groupme.com/tutorials/bots)
- [Google App Script](https://developers.google.com/apps-script/)
- [Google App Script Triggers](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_manually)
