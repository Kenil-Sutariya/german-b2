import LearningApp from "@/components/learning-app";
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <LearningApp view="grammar-detail" id={slug}/>}
