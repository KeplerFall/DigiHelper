import { useEffect, useState } from "react";
import BossSelector from "./BossSelector/BossSelector";
import Digitamas from "./Digitamas/Digitamas";
import Credits from "./Credits/Credits";
import UnderConstruction from "./UnderConstruction/UnderConstruction";
import Infos from "./Infos/Infos";
import Daily from "./Daily/Daily";
import Sexp from "./Sexp/Sexp";

const App = () => {
  const [currentState, setCurrentState] = useState(null)
  const [notify, setNotify] = useState(null)

  useEffect(()=>{
    if (notify == null) return;
    const timeout = setTimeout(() => {
      setNotify(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [notify])

  return (
    <main className="main relative">
      {currentState == null ?
      <div className="grid grid-cols-3 min-w-[360px] py-4 px-1 gap-2">
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/535675/swords-crossed.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("bossrush")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Boss Rush</div>
        </div>
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/488177/egg.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("digitamas")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Digitamas</div>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold text-[20px]">S.EXP</p>
          <div onClick={() => setCurrentState("sexp")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Experiência</div>
        </div>
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/513832/info-circle.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("infos")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Informações</div>
        </div>
        {
        /*
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/532244/gear.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("infos")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Configurações</div>
        </div>
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/479915/daily-calendar.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("daily")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm w-full text-center">Diários</div>
        </div>*/
        }
      </div>
      : currentState == "bossrush" ?
      <div>
        <BossSelector notifyState={[notify, setNotify]} backstate={setCurrentState} />
      </div>
      :
      currentState == "digitamas" ? 
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <Digitamas />
      </div>
      :
      currentState == "sexp" ?
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <Sexp />
      </div>
      :
      currentState == "infos" ?
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <Infos />
      </div>

      :
      currentState == "daily" ? 
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <Daily />
      </div>
      :
      null}
      <Credits />
      <div className={`absolute left-[10px] bottom-[45px] px-[15px] py-[5px] bg-white rounded-[8px]  transition-all durantion-300 ${notify ? `!translate-y-[0px] opacity-100 z-50` : `translate-y-[15px] opacity-0 -z-50`}`}>
        {notify}
      </div>
    </main>
  );
};
export default App;