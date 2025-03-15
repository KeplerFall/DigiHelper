import { useEffect, useState } from "react"

const configs = [
    {
        id: "mattOmni",
        label: "Utilizando Matt Omnimon? (Redução no cooldown das batalhas)",
        image: 'https://digipets.net/recursos/img/fashion/matt_omnimon.gif',
        notifyName: 'Avatar Matt Omnimon'
    }
]

export default function Configuration({notifyState}){
    const [notify, setNotify] = notifyState;
    const [currentConfigs, setCurrentConfigs] = useState('...')
    useEffect(()=>{
        chrome.storage.local.get(["configs"],({configs})=>{
            setCurrentConfigs(configs || new Array())
        })
    },[])
 
    const toggleConfig = (arg)=>{
        chrome.storage.local.get(["configs"], ({configs})=>{
            if(!configs){
                chrome.storage.local.set({configs: [arg]});
                return;
            }
            chrome.storage.local.set({configs: configs.includes(arg) ? configs.filter(item=> item != arg) : [...configs, arg]})
            
        })
    }

    const toggleLocal = (arg)=>{
        setCurrentConfigs(currentConfigs.includes(arg) ? currentConfigs.filter(item => item != arg) : [...currentConfigs, arg])
    }

    return(
        <div className="min-w-[600px] max-h-[280px] overflow-y-scroll">
                {
                    currentConfigs != '...' ? 
                    <table className="w-full">
                        {configs.map((item, index)=>{
                            return(
                                <tr className={`${index % 2 ? `bg-gray-200` : `bg-white`} border border-gray-300`} index={index}>
                                    <td> <img src={item.image} alt="" /></td>
                                    <td> <p>{item.label}</p></td>
                                    <td className="cursor-pointer" onClick={()=>{toggleConfig(item.id); toggleLocal(item.id)}}>
                                        <div className={`w-[60px] h-[30px] p-[2px] rounded-full flex ${currentConfigs.includes(item.id) ? `bg-green-400` : `bg-red-400`} transition-all duration-300`}>
                                            <div className={`transition-all duration-300 aspect-square h-full bg-white rounded-full ml-[${currentConfigs.includes(item.id) ? `54%` : ``}]`}>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </table> : `carregando...`
                }
        </div>
    )
}