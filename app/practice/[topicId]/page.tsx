import LearningApp from "@/components/learning-app";
export default async function Page({params,searchParams}:{params:Promise<{topicId:string}>;searchParams:Promise<{mode?:string}>}){const [{topicId},{mode}]=await Promise.all([params,searchParams]);return <LearningApp view="practice-entry" id={topicId} mode={mode??"quick"}/>}
