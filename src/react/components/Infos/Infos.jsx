export default function Infos(){
    return(
        <section className="min-w-[330px] py-3 px-4">
            <p className="text-[16px]"><strong>Versão autal</strong>: v1.0.3</p>
            <p className="text-[16px]">Repositório do código: <strong className="cursor-pointer underline" onClick={()=> chrome.tabs.create({ url: "https://github.com/KeplerFall/DigiHelper" })}>GitHub</strong></p>
            <p className="text-[16px]">Dúvidas ou sugestões? Discord: <strong>keplerfall</strong></p>
        </section>
    )    
}