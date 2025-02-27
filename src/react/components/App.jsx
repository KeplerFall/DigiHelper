import { useState } from "react";
import BossSelector from "./BossSelector/BossSelector";
import Digitamas from "./Digitamas/Digitamas";
import Credits from "./Credits/Credits";
import UnderConstruction from "./UnderConstruction/UnderConstruction";

const App = () => {
  const [currentState, setCurrentState] = useState(null)
  return (
    <main className="main">
      {currentState == null ?
      <div className="grid grid-cols-3 min-w-[325px] py-4">
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/535675/swords-crossed.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("bossrush")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm">Boss Rush</div>
        </div>
        <div className="flex flex-col items-center">
          <img src={`https://www.svgrepo.com/show/488177/egg.svg`} width={30} alt="" />
          <div onClick={() => setCurrentState("digitamas")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm">Digitamas</div>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold text-[20px]">S.EXP</p>
          <div onClick={() => setCurrentState("sexp")} style={{margin: '10px 0'}} className=" cursor-pointer bg-[#337ab7] text-white font-bold py-2 px-4 rounded-sm">Experiência</div>
        </div>
      </div>
      : currentState == "bossrush" ?
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <BossSelector />
      </div>
      :
      currentState == "digitamas" ? 
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <UnderConstruction />
      </div>
      :
      currentState == "sexp" ?
      <div>
        <div className="p-2">
          <button className=" cursor-pointer bg-red-600 text-white font-bold py-2 px-4 rounded-sm" onClick={()=> setCurrentState(null)}>voltar</button>
        </div>
        <UnderConstruction />
      </div>
      :
      null}
      <Credits />
    </main>
  );
};
export default App;