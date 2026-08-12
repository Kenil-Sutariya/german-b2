import LearningApp from "@/components/learning-app";
export default async function Page({params}:{params:Promise<{weekId:string}>}){const {weekId}=await params;return <LearningApp view="week" id={weekId}/>}
