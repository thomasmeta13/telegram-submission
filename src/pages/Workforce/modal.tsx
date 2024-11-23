import { Job,Agent } from "../../routes/types";
import { useState, useContext } from "react";
import { MiniAppContext } from "../../routes/MiniAppContextProvider";
import axiosInstance from "../../api";

interface TaskModalProps {
    isOpen: boolean;  
    onClose: () => void;
    agentId: string;
}

interface AgentModalProps {
    isOpen: boolean;  
    onClose: () => void;
    jobId: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({isOpen, onClose,agentId})=>{
  const [jobId,setJobId] = useState<string>("");
  const {jobs,agents,setJobs,setAgents,setPassiveIncome}= useContext(MiniAppContext);
  const agent = agents.filter((item: Agent)=>item.agentId === agentId)[0];
  const handleFinish = ()=>{
    axiosInstance.post('/workforce/assignjob',{jobId,agentId})
    .then(response=>{
      if(response.status === 200){
        onClose();
        setJobs((prevJobs:Job[])=>
          prevJobs.map((item:Job)=> item._id===jobId ? {...item,assignTo:agentId}:item)
        )
        const job = jobs.filter((item: Job)=>item._id === jobId)[0];
        setAgents((prevAgents:Agent[])=>
          prevAgents.map((item:Agent)=>item.agentId === agentId ? {...item, assignTo: jobId,passiveIncome: job.passiveIncome,task: job.title}: item)
        )
        setPassiveIncome((prevPassiveIncome:number)=>{ return prevPassiveIncome+job.passiveIncome});
      }})
    .catch(error=>{
      console.log(error);
    })
    
  }
  if(!isOpen) return null;

  return(
    <div className="fixed overflow-hidden top-0 w-full h-full bg-[#010101df] z-20">
      <div className=" relative mt-36 flex flex-col justify-center items-center bg-gradient-to-b from-[#000424] to-[#0f1f3d] border-[1px] border-[#ffffff29] rounded-xl w-[345px] h-[360px] mx-auto my-auto">
        <div className="absolute top-4 right-4 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        <div className=" text-white font-bold flex justify-center text-[20px] font-gilroy"> Select Task</div>
        <div className="grid grid-cols-2 font-semibold text-white gap-2 mt-3 mx-auto h-[220px] overflow-auto">
          {jobs.filter((job:Job)=> agent.level >= job.requiredLevel && (job.assignTo === "" || !job.assignTo)).map((item:Job,idx: number)=>(
            <div className="flex flex-col justify-center items-center relative bg-gradient-to-t from-[#ffffff36] from-10% via-[#ffffff20] to-[#ffffff10] w-[152px] h-[100px] rounded-xl font-inter text-[12px] font-medium" key={idx} onClick={()=>setJobId(item._id)}>
              <div className="absolute top-1 right-1 text-[12px] font-medium text-[#ffffff4f]">{item.requireTime}h</div>
              <div className="flex justify-center items-center w-[36px] h-[36px] bg-center bg-no-repeat" style={{backgroundImage:`url('${item.logo}')`}}></div>
              <div className="flex justify-center items-center">{item.title}</div>
              <div className="flex justify-center items-center text-whit text-[10px] font-bold gap-[1px] text-[#ffffffb3]">
                <div>{item.passiveIncome}</div>
                <div className="bg-[url('/images/coin_1.png')] bg-cover bg-no-repeat bg-center w-2 h-2 rounded-full"></div>
                <div>/sec</div>
              </div>
              {item._id === jobId ? (<div className="absolute -bottom-1 bg-[url('/images/done_.png')] w-4 h-4 overflow-auto"></div>):(<div></div>)}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-xl w-72 h-[50px] flex flex-col justify-center items-center mt-4" onClick={handleFinish}>Start Task</div>
      </div>
    </div>
  )
}

export const AgentModal: React.FC<AgentModalProps> = ({isOpen, onClose, jobId})=>{
  const [agentId,setAgentId] = useState<string>("");
  const {jobs,agents,setAgents, setJobs,setPassiveIncome}= useContext(MiniAppContext);
  const job = jobs.filter((item: Job)=>item._id === jobId)[0];
  const handleFinish = ()=>{
    onClose();
    setAgents((prevAgents:Agent[])=>
      prevAgents.map((item:Agent)=>item.agentId === agentId ? {...item, assignTo: jobId, passiveIncome: job.passiveIncome,task: job.title}: item)
    )
    setJobs((prevJobs:Job[])=>
      prevJobs.map((item:Job)=> item._id===jobId ? {...item,assignTo:agentId}:item)
    )
    setPassiveIncome((prevPassiveIncome:number)=>{ return prevPassiveIncome+job.passiveIncome});
  }

  if(!isOpen) return null;
  return(
    <div className="fixed top-0 w-full h-full bg-[#010101df] z-20">
      <div className="relative flex flex-col justify-center mt-36 items-center bg-gradient-to-b from-[#000424] to-[#0f1f3d] border-[1px] border-[#ffffff29] rounded-xl w-[345px] h-[510px] mx-auto">
        <div className="absolute top-4 right-4 bg-[url('/images/_close.png')] bg-cover w-8 h-8" onClick={onClose}></div>
        <div className="flex justify-center items-center text-white font-bold text-[20px] font-gilroy"> Select Agent</div>
        <div className="flex flex-col items-center font-semibold text-white mt-2 h-[360px] overflow-auto">
          {agents.filter((agent:Agent)=> agent.level >= job.requiredLevel && (agent.assignTo === "" || !agent.assignTo)).map((item: Agent,idx: number)=>(
            <div className="relative flex justify-between mb-2 w-[313px] h-[97px] px-4 items-center bg-gradient-to-t from-[#ffffff36] from-10% via-[#ffffff20] to-[#ffffff10] rounded-xl font-inter text-[12px] font-medium" key={idx} onClick={()=>setAgentId(item.agentId)}>
                <div className="absolute top-2 left-2 text-[10px] font-medium flex justify-center bg-gradient-to-b from-[#d864f7] to-[#ba43f6] rounded-full font-inter w-[36px] h-[15px]">lvl: {item.level}</div>
                <div className="flex justify-center items-center w-[94px] h-[84px] mt-2 rounded-2xl bg-top bg-no-repeat" style={{backgroundImage:`url('${item.agentImage}')`}}></div>
                <div className="flex justify-center items-center text-[18px] font-bold font-roboto gap-1">{item.name}</div>
                {item.agentId === agentId ? (<div className="flex justify-center items-center bg-[url('/images/done__.png')] bg-center bg-no-repeat bg-cover w-4 h-4"></div>):(<div className="flex justify-center items-center bg-[url('/images/__done.png')] bg-center bg-no-repeat bg-cover w-4 h-4"></div>)}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-[#03cea4] to-[#8e37fe] text-white font-bold rounded-xl w-72 h-[50px] flex flex-col justify-center items-center mt-4" onClick={handleFinish}>Assign</div>
      </div>
    </div>
  )
}