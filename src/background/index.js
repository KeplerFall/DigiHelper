chrome.runtime.onInstalled.addListener(() => {

}); 


chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    const message = JSON.parse(request);
    switch(message.message){
      case 'bossAlert':
        chrome.alarms.create(JSON.stringify(message), {
          when: Date.now() + (Number(message.content.cooldown) * 60 * 1000)
        })
      break;
    }
});

////


chrome.alarms.onAlarm.addListener((alarm)=>{
  const message = JSON.parse(alarm.name)
  chrome.storage.local.get(["bossAlert"], ({bossAlert}) => {
      if(bossAlert && bossAlert.includes(message.content.stage)){
        chrome.notifications.create(
          alarm.name,
          {
            type: "basic",
            iconUrl: message.content.bossUrl,
            title: "Boss Rush",
            message: `O cooldown de ${message.content.bossName} acabou de expirar!`,
          },
          function () {}
        );
      }
  });
})