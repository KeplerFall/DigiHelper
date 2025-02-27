const addBossCooldown = (arg, callback)=>{
    chrome.storage.local.get(["bossCooldown"], (data)=>{
        if(!Object.keys(data).includes("bossCooldown")){
            chrome.storage.local.set({bossCooldown: [{stage: arg.stage, cooldown: (new Date(Date.now() + Number(arg.cooldown) * 60 * 1000)).toString()}]})
        } else if(data.bossCooldown?.find(item=> item.stage == arg.stage) == undefined){
            chrome.storage.local.set({bossCooldown: [...data.bossCooldown, {stage: arg.stage, cooldown:(new Date(Date.now() + Number(arg.cooldown) * 60 * 1000)).toString()}]})
            if(callback) callback()
        }else{
            chrome.storage.local.set({bossCooldown: data.bossCooldown.map(item=>{
                return item.stage == arg.stage ? {
                    stage: arg.stage,
                    cooldown: (new Date(Date.now() + Number(arg.cooldown) * 60 * 1000)).toString()
                } : item
            })})
            if(callback) callback()
        }
    })
}


const watchForBattleFinish = (arg)=>{
    const observer = new MutationObserver((mutationList, observerInstance)=>{
        const msgContainer = document.querySelector("#MSG");
        if(msgContainer.childNodes.length){
            addBossCooldown(arg);
            return;
        }
        const repeat_button = document.querySelector("#RepetirEstagio").checkVisibility();
        if(!repeat_button) return;
        if(repeat_button.checkVisibility() && !repeat_button.disabled){
        addBossCooldown(arg, observerInstance.disconnect);

        chrome.storage.local.get(["bossCooldown"], ({bossCooldown})=>{
            let searchParams = new URLSearchParams(window.location.search)
            let currentStage = String(searchParams.get("estagio"))
            for(let i = 0; i < bossInfo.length; i++){
                if(bossInfo[i].stage == currentStage) continue;
                let cooldownReference = bossCooldown.find(item => item.stage == bossInfo[i].stage);
                if(!cooldownReference){
                    appendBossButton(bossInfo[i].stage)
                    break;
                }
                let cooldownDate = new Date(cooldownReference.cooldown);
                if(cooldownDate < Date.now()){
                    appendBossButton(bossInfo[i].stage)
                    break;
                }
            }
        })
    }
});

  observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true 
      });
}

const appendBossButton = (href) =>{
    if(document.querySelector("#kf-goToNextBoss")) return;
    const nextBossButton = document.createElement('a')
        nextBossButton.href = `/batalha\?estagio=${href}#DP`
        nextBossButton.innerHTML = `
        <button id="kf-goToNextBoss" class="btn btn-primary btn-flat">
            Ir para o próximo Boss
        </button>
    `
    const bsContainer = document.querySelector("#BatalhaEstagios")
    bsContainer.append(nextBossButton);
    bsContainer.style.marginLeft = "122px"
}

const appendHealButton = () =>{
    const healPartyButton = document.createElement('button')
    healPartyButton.classList = "btn btn-primary btn-flat"
    healPartyButton.innerHTML = "Curar Party!"
    healPartyButton.style.position = "absolute"
    healPartyButton.style.top = "-28px";
    healPartyButton.style.left = "50%";
    healPartyButton.style.transform = "translateX(-50%)"
    healPartyButton.style.backgroundColor = "green"

    healPartyButton.addEventListener("click", ()=>{
        if(healPartyButton.innerHTML != "Curar Party!") return;;
        fetch('/ajax/dp-locais-hospital.php', {
            method: "POST",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "pt-BR,pt;q=0.7",
                "Cookie": document.cookie,
                "Origin": "https://digipets.net",
                "Referer": "https://digipets.net/hospital",
                "Sec-CH-UA": `"Not(A:Brand";v="99", "Brave";v="133", "Chromium";v="133"`,
                "Sec-CH-UA-Mobile": "?0",
                "Sec-CH-UA-Platform": `"Windows"`,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(res=>{
            if(!res){
                throw new Error(`Erro no http`, res.status)
            }
            return res.json();
        }).then((res)=>{
            if(res?.partybox){
                healPartyButton.innerHTML = `Curas restante: ${res.chances}`
                document.querySelector("#BoxTeamDigimons").innerHTML = res.partybox
            }else{
                healPartyButton.innerHTML = "Seus digimons não precisam de cura!"
            }
            
        }).catch(err=>{
        })
    })

    const bsContainer = document.querySelector("#BatalhaEstagios")
    bsContainer.style.paddingTop = "12px"
    bsContainer.append(healPartyButton);
    const repeat_button = document.querySelector("#RepetirEstagio").checkVisibility();
    repeat_button.disabled = false;
}


function battleFinishObserver( functions ){
    const finishBattleObserver = new MutationObserver((mutationList, observerInstance)=>{
        if(document.querySelector("#RepetirEstagio").checkVisibility()){
            for(let fn of functions){
                fn();
            }
            observerInstance.disconnect();
        }
    })

    finishBattleObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true 
    });

}



switch(window.location.pathname){
    case '/batalha':
        const battleParams = new URLSearchParams(window.location.search);
        const bossBattle = bossInfo.find(item=> item.stage == battleParams.get("estagio"))
        const bossCooldown = document.querySelector("#MSG").childNodes.length;
        if(!bossCooldown){
            addBossCooldown()
        }
        if(bossBattle){
            watchForBattleFinish(bossBattle);
        }

        battleFinishObserver([appendHealButton]);
    break;
}