function listUpcomingEvents() {

  var calendarJSON = {
    "calendar": [
      {"name":"Epsilon Tau Pi","id":"epsilontaupi.osu@gmail.com"},
      {"name":"Brotherhood","id":"e7n7a04uueoh7rqstm8nflf5v8@group.calendar.google.com"},
      {"name":"Candidates","id":"tt9l2kceo8up7ln83emscivbuk@group.calendar.google.com"},
      {"name":"Eagle Mentorship","id":"5udgnlgl9m25je63nfps45t27s@group.calendar.google.com"},
      {"name":"Executive","id":"nhjj7q183l24tb9t8ngf33tmis@group.calendar.google.com"},
      {"name":"Fundraising","id":"g7as04jn1pbicd6bv6v457lqik@group.calendar.google.com"},
      {"name":"Meeting","id":"hfsomsbc4jssb443v1nihg8hk4@group.calendar.google.com"},
      {"name":"Merit Badge College","id":"g3uub00lnob8ljlm1m0it7fucg@group.calendar.google.com"},
      {"name":"Recruitment","id":"r54tumcfjhijjr72hsjcc3328g@group.calendar.google.com"},
      {"name":"Ritual","id":"a1egr43kv8cljl25g361slp42g@group.calendar.google.com"},
      {"name":"Service","id":"smbgp7avnq4oc16hqp9la78fis@group.calendar.google.com"}
    ]
  }
    
  var upcomingEvents = [];
  
  for (i in calendarJSON.calendar) {
    var now = new Date();
    var twoWeeksFromNow = new Date(now.getTime() + (14*24*60*60*1000));
    var calendarId = calendarJSON.calendar[i].id;
    
    var calendar = CalendarApp.getCalendarById(calendarId);
    var unsubscribe = 0;
    if(calendar == null){
      //user may not have access, auto-subscribe them.
      unsubscribe = 1;
      calendar = CalendarApp.subscribeToCalendar(calendarId,{hidden:true,selected:false});
    }
    
    //Logger.log(calendar.getName());
    var events = calendar.getEvents(now, twoWeeksFromNow);

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.getStartTime();
        if (!when) {
          when = event.getAllDayStartDate();
        }
        Logger.log('%s (%s)', event.getTitle(), when);
        upcomingEvents.push({title : event.getTitle(), time: when});
      }
    } else {
      //Logger.log('No upcoming events found.');
    }
    
    if (unsubscribe == 1) {
      calendar.unsubscribeFromCalendar();
    }    
  }
  
  upcomingEvents.sort(function(a,b) {
    return new Date(a.time).getTime() - new Date(b.time).getTime()
  });
  
  for (var x = 0; x < upcomingEvents.length; x++) {
    Logger.log(upcomingEvents[x].title + " - " + upcomingEvents[x].time.toLocaleString());
  }
  
  return upcomingEvents;
}

function createTimeDrivenTriggers() {
  // Trigger every Friday at 14:00.
  ScriptApp.newTrigger('sendWeeklyCalendar')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.FRIDAY)
      .atHour(18)
      .create();
      
//  ScriptApp.newTrigger('sendWeeklyCalendar')
//      .timeBased()
//      .everyMinutes(15)
//      .create();
  Logger.log("Triggers created");
}