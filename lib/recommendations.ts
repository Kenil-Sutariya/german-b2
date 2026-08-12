import type { ProgressState } from "@/types/learning";
import { grammarTopics } from "@/data/curriculum";
export function weakTopics(p: ProgressState) { return grammarTopics.filter(t=>p.confidence[t.slug]==="unsicher" || (p.testScores[t.slug]??100)<60).slice(0,4); }
export function recommendation(p: ProgressState) { const weak=weakTopics(p); if(weak.length) return {title:`Review ${weak[0].title}`,body:"Your confidence suggests one short review before today’s core lesson.",minutes:12}; if(p.completedTasks.length<3) return {title:"Try the light session",body:"Keep momentum with vocabulary, one exercise and 5 minutes of speaking.",minutes:20}; return {title:"Add a speaking round",body:"Grammar is moving faster than active output. Speak for 90 seconds today.",minutes:10}; }
