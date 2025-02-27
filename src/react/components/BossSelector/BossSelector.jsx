import { useEffect, useState } from "react";
import bossInfo from "../../../utils/bossInfo.json";

export default function BossSelector() {
    const [bossList, setBossList] = useState([]);
    const [countdownTimers, setCountdownTimers] = useState({});

    useEffect(() => {
        chrome.storage.local.get(["bossCooldown"], (data) => {
            setBossList(data?.bossCooldown || []);
        });
    }, []);

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
        }, 1000);

        return () => clearInterval(interval);
    }, [bossList]);

    const goToBoss = (arg) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { url: `https://digipets.net/batalha?estagio=${arg}#DP` });
            }
        });
    };

    return (
        <div className="grid grid-cols-4 min-w-[600px] max-h-[280px] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {bossInfo.map((item) => {
                const boss = bossList.find((itm) => itm.stage === item.stage);
                return (
                    <div key={item.stage} style={{backgroundPositionY: `-60px`}} className="min-w-[80px] min-h-[200px] flex flex-col justify-end items-center bg-[url('https://digipets.net/recursos/img/etc/caixadigimon.png')] bg-[length:326px] bg-top bg-[position-y:-60px] rounded-[12px] m-[5px]">
                        <img src={item?.bossUrl} width={80} alt="Boss" />
                        <div className="flex flex-col items-center">
                            <p className="pixel-font text-center ">{item.bossName}</p>
                            <div className="text-[20px] pt-[0px] pl-[50px] bg-center bg-contain bg-no-repeat w-[144px] h-[33px] bg-[url('https://digipets.net/recursos/img/etc/battlepower.png')] pixel-font text-[#ff8c00]">{item.bp}</div>
                            {!boss || countdownTimers[boss.stage] == "disponivel" ? <div onClick={() => goToBoss(item.stage)} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm"> Começar!</div>:
                            <div className="my-[10px]">
                                <p className="cursor-not-allowed bg-[#d9534f] text-white font-bold py-2 px-4 rounded-sm">{countdownTimers[boss.stage] || "Carregando..."}</p>
                            </div>
                            }
                        </div>
                    </div>  
                );
            })}
        </div>
    )
}