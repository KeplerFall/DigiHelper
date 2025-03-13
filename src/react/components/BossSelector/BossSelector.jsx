import { useEffect, useState, useDeferredValue  } from "react";
import bossInfo from "../../../utils/bossInfo.json";

export default function BossSelector({backstate, notifyState}) {
    const [bossList, setBossList] = useState([]);
    const [countdownTimers, setCountdownTimers] = useState({});
    const [cooldownAlert, setCooldownAlert] = useState([])
    const [ignoredBoss, setIgnoredBoss] = useState([])
    const [notify, setNotify] = notifyState;
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    const searchRegex = new RegExp(`.*${deferredQuery.toLocaleLowerCase()}.*`);

    useEffect(() => {
        chrome.storage.local.get(["bossCooldown", "bossAlert", "ignoredBoss"], (data) => {
            setCooldownAlert(data?.bossAlert || []);
            setBossList(data?.bossCooldown || []);
            setIgnoredBoss(data?.ignoredBoss || []);
        });
    },[]);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimers = {};
            bossList.forEach((boss) => {
                const cdDate = new Date(boss.cooldown);
                const timeLeft = cdDate - Date.now();

                if (timeLeft > 0) {
                    const minutes = Math.floor(timeLeft / 60000);
                    const seconds = Math.floor((timeLeft % 60000) / 1000);
                    updatedTimers[boss.stage] = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
                } else {
                    updatedTimers[boss.stage] = "disponivel";
                }
            });
            setCountdownTimers(updatedTimers);
        }, 2000);

        return () => clearInterval(interval);
    }, [bossList]);

    const goToBoss = (arg) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { url: `https://digipets.net/batalha?estagio=${arg}#DP` });
            }
        });
    };

    const toggleAlarmList = (arg) =>{
        chrome.storage.local.get(["bossAlert"], ({bossAlert}) => {
            if(!bossAlert){
                chrome.storage.local.set({bossAlert: [arg]});
            }else if(bossAlert.includes(arg)){
                chrome.storage.local.set({bossAlert: bossAlert.filter(item => item != arg)})
            }else{
                chrome.storage.local.set({bossAlert: [...bossAlert, arg]})
            }
        });
    }

    const toggleIgnoreBoss = (arg) =>{
        chrome.storage.local.get(["ignoredBoss"], ({ignoredBoss}) => {
            if(!ignoredBoss){
                chrome.storage.local.set({ignoredBoss: [arg]});
            }else if(ignoredBoss.includes(arg)){
                chrome.storage.local.set({ignoredBoss: ignoredBoss.filter(item => item != arg)})
            }else{
                chrome.storage.local.set({ignoredBoss: [...ignoredBoss, arg]})
            }
        });
    }

    const searchNextBoss = ()=>{ 
        chrome.storage.local.get(["bossCooldown", "ignoredBoss"], ({bossCooldown, ignoredBoss})=>{
            for(let i = 0; i < bossInfo.length; i++){
                if(ignoredBoss.includes(bossInfo[i].stage)) continue; 
                let cooldownReference = bossCooldown.find(item => item.stage == bossInfo[i].stage);
                if(!cooldownReference){
                    goToBoss(bossInfo[i].stage)
                    break;
                }
                let cooldownDate = new Date(cooldownReference.cooldown);
                if(cooldownDate < Date.now()){
                    goToBoss(bossInfo[i].stage)
                    break;
                }
            }
        })
    }

    return (
       <>
       <div className="flex py-2 justify-between mx-[5px]">
            <button className="cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> backstate(null)}>voltar</button>
            <div className="border border-gray-200 bg-gray-100 rounded-sm flex">
                <input className="!outline-none px-[30px] h-full border-none focus:border-transparent focus:ring-0" type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Procurar boss..."/>
                <p onClick={()=> setQuery('')} className={`${deferredQuery ? `` : `hidden`} h-fit rotate-45 w-fit text-[20px] text-gray-400 cursor-pointer`}>+</p>
            </div>
            <button onClick={()=> searchNextBoss()} className="cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm">Continuar Boss Rush</button>
       </div>
         <div className="grid grid-cols-4 min-w-[600px] max-h-[280px] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {bossInfo.map((item) => {
                const boss = bossList.find((itm) => itm.stage === item.stage);
                if((deferredQuery != "") && !searchRegex.test(item.bossName.toLocaleLowerCase())) return;
                return (
                    <div key={item.stage} style={{backgroundPositionY: `-60px`}} className="relative min-w-[80px] min-h-[200px] flex flex-col justify-end items-center bg-[url('https://digipets.net/recursos/img/etc/caixadigimon.png')] bg-[length:326px] bg-top bg-[position-y:-60px] rounded-[12px] m-[5px]">
                        <img src={item?.bossUrl} width={80} alt="Boss" />
                        <div className="flex flex-col items-center">
                            <p className="pixel-font text-center ">{item.bossName}</p>
                            <div className="text-[20px] pt-[0px] pl-[50px] bg-center bg-contain bg-no-repeat w-[144px] h-[33px] bg-[url('https://digipets.net/recursos/img/etc/battlepower.png')] pixel-font text-[#ff8c00]">{item.bp}</div>
                            <div className="flex gap-1 items-center">
                                {!boss || countdownTimers[boss.stage] == "disponivel" ? <div onClick={() => goToBoss(item.stage)} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm"> Começar!</div>:
                                <div className="my-[10px]">
                                    <p className="cursor-not-allowed bg-[#d9534f] text-white font-bold py-2 px-4 rounded-sm">{countdownTimers[boss.stage] || "..."}</p>
                                </div>
                                }
                                <button className={`relative group cursor-pointer h-[34px] w-[34px] flex items-center justify-center rounded-sm ${cooldownAlert.includes(item.stage) ? 'bg-[green]' : 'bg-[#d9534f]'}`} onClick={()=>{setNotify(`${item.bossName} ${!cooldownAlert.includes(item.stage) ? `adicionado` : `removido`} dos alarmes.`) ;toggleAlarmList(item.stage); setCooldownAlert(cooldownAlert.includes(item.stage) ? cooldownAlert.filter(itm => itm != item.stage) : [...cooldownAlert, item.stage])}}>
                                    <img src="https://www.svgrepo.com/show/532090/alarm-exclamation.svg" className="w-[25px] w-[25px] text-white invert" alt="" />
                                </button>
                            </div>
                            <div className="absolute right-[10px] top-[10px] text-red cursor-default" onClick={()=> {setNotify(`${item.bossName} ${ignoredBoss.includes(item.stage) ? `removido` : `adicionado`} a lista de ignorados.`);toggleIgnoreBoss(item.stage); setIgnoredBoss(ignoredBoss.includes(item.stage) ? ignoredBoss.filter(itm => itm != item.stage) : [...ignoredBoss, item.stage])}}>
                                <div className="relative">
                                    <div className={`w-[25px] h-[25px] rounded-[8px] flex items-center justify-center text-white ${ignoredBoss.includes(item.stage) ? `bg-[#d9534f]` : `bg-gray-400`} font-bold`}>
                                        ✓
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                );
            })}
        </div>
       </> 
    )
}