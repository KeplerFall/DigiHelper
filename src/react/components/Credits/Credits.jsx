export default function Credits(){
    const goToEmperor = (arg) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { url: `https://digipets.net/usuario_perfil?domador=118` });
            }
        });
    };
    return(
        <section onClick={()=> goToEmperor()} className="flex bg-[url('https://digipets.net/recursos/layout/images/bg.jpg')] justify-between px-4 cursor-pointer">
            <div>
                <p className="text-white">Desenvolvido por: </p><p className="text-white font-semibold" href="https://digipets.net/usuario_perfil?domador=118">Imperador Digimon</p>
            </div>
            <img src="https://digipets.net/recursos/img/fashion/ken_2.gif" alt="" width={25} height={35} />
        </section>
    )
}