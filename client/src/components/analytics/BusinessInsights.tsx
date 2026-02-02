import React from "react";
import type { BusinessInsightsProps } from "../../types/props/BusinessInsightsProps";


export const BusinessInsights: React.FC<BusinessInsightsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-blue-400 font-bold tracking-wider">AI ANALYZING BUSINESS DATA...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-white/40 italic">No AI insights generated for this period.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      
      {data.key_metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Health Score" 
            value={`${data.key_metrics.overall_health_score?.toFixed(0) ?? 0}%`} 
            colorClass="text-indigo-400" 
          />
          <MetricCard 
            title="Projects at Risk" 
            value={data.key_metrics.projects_at_risk ?? 0} 
            colorClass="text-red-400" 
          />
          <MetricCard 
            title="Budget Utilization" 
            value={`${data.key_metrics.budget_utilization_percentage?.toFixed(1) ?? 0}%`} 
            colorClass="text-orange-400" 
          />
          <MetricCard 
            title="Total Analyzed" 
            value={data.key_metrics.total_projects_analyzed ?? 0} 
            colorClass="text-blue-400" 
          />
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 border-l-4 border-l-blue-500 shadow-xl">
        <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-3">AI Executive Summary</h3>
        <p className="text-white/90 italic text-lg leading-relaxed font-light">
          "{data.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-4">
          <h3 className="font-bold text-white text-xl px-2 flex items-center gap-2">
            <span className="text-blue-500">✦</span> Strategic Recommendations
          </h3>
          {data.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-blue-300">{rec.title}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-tighter ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-white/70 mb-4 leading-snug">{rec.description}</p>
              
              {rec.action_items && rec.action_items.length > 0 && (
                <div className="grid gap-2">
                  {rec.action_items.map((item, i) => (
                    <div key={i} className="text-[11px] text-blue-200/80 flex items-center gap-3 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                      <span className="text-blue-500 font-bold">→</span> {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-white text-xl px-2 flex items-center gap-2">
            <span className="text-red-500"></span> Critical Issues
          </h3>
          {data.issues.map((issue, idx) => (
            <div key={idx} className="bg-red-500/5 p-5 rounded-2xl border border-red-500/20 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${issue.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <h4 className="font-bold text-red-400">{issue.title}</h4>
              </div>
              <p className="text-sm text-white/70 mb-3">{issue.description}</p>
              {issue.affected_projects && (
                <div className="flex flex-wrap gap-2">
                  {issue.affected_projects.map((p, i) => (
                    <span key={i} className="text-[9px] bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/20">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, colorClass }: { title: string; value: any; colorClass: string }) => (
  <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-lg">
    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-2xl font-black ${colorClass}`}>{value}</p>
  </div>
);