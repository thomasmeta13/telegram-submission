export interface Agent {
    _id: string;
    agentId: string;
    name: string;
    agentImage: string;
    level: number;
    assignTo: string | null;
    passiveIncome: number;
    owner: string;
    energyConsumption: number;
    currentPassiveIncome: number;
    agentType: string;
    baseCost: number;
    basePassiveIncome: number;
    baseEnergyConsumption: number;
    capabilities: string[];
}

export interface User {
    userId: number;
    userName: string;
    avatar: string;
    coins: number;
    energy: number;
    power: number;
    data: number;
    gpus: number;
    passiveIncome: number;
    level: number;
    levelRate: number;
    referralCode: string;
    rank?: number;
    invites?: number;
    completedTasks: string[];
}

export type InnerElement = string | string[];
export type MiddleArray = InnerElement[];

export interface AnnotationTaskDetail{  
    prompt: string;
    response: string;
    code: string;  
    questions: MiddleArray[];
}

export interface  LabelTaskDetail{  
    images: string[];
    labels: string[];
}

export interface CodingTaskDetail {  
    problem: string[];
    answer: string[];
}

export interface OtherTaskDetail {

}

export interface Task {
    _id: string;
    task_name: string;
    category: string;
    type: string;
    taskID: string;
    description: string;
    reward: number[];
    provider: string;
    images: string[];
    correct_labels: string[];
    labels: string[];
    created_at: string;
    updated_at: string;
    detail: {
        images?: string[];
        labels?: string[];
        correct_labels?: string[];
      };
    logo?: string;
    questions?: { question: string; options: string[]; answer: number }[];
    completed?: boolean;
    purpose?: string;
    criteria?: string[];
    instructionGif?: string;
    platform?: string;  // Add this line
}

export interface Job{
    requiredLevel:number;
    requiredEnergy: number;
    passiveIncome: number;
    title: string;
    description:string;
    employer:string;
    assignTo:string;
    requireTime:number;
    logo:string;
    _id:string;
}

export interface Project {
    _id: string;
    project_name: string;
    logo: string;
    description: string;
    rewards: number;
}
