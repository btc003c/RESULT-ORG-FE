"use client";

import { motion } from "framer-motion";
import { 
  Database, FileText, Activity, Users, HardDrive, 
  TrendingUp, Search, CheckCircle2, ChevronDown, 
  MoreVertical, RefreshCw, AlertCircle, Plus, Upload, UploadCloud, PieChart
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { api } from "@/lib/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const { activeWorkspace } = useWorkspace();
  
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [topDatasets, setTopDatasets] = useState<any[]>([]);
  const [recentImports, setRecentImports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const u = await api.auth.me();
        if (active) setUser(u);

        if (activeWorkspace?.id) {
          const dashboardData = await api.analytics.getDashboard(activeWorkspace.id);
          if (active) setAnalytics(dashboardData);

          const datasetsRes = await api.datasets.getByWorkspace(activeWorkspace.id, 0, 5);
          if (active) setTopDatasets(datasetsRes.content || []);

          const importsRes = await api.imports.getWorkspaceImports(activeWorkspace.id, 0, 5);
          if (active) setRecentImports(importsRes.content || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [activeWorkspace]);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto w-full pb-20 p-8 text-center text-zinc-500 font-medium">
        <div className="w-10 h-10 border-4 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading dashboard metrics...
      </div>
    );
  }

  if (!activeWorkspace) {
    return (
      <div className="max-w-[1600px] mx-auto w-full pb-20 p-8 text-center bg-zinc-50 border border-zinc-200 rounded-2xl mt-8">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No Workspace Selected</h2>
        <p className="text-zinc-500 text-sm">Please select or create a workspace to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-20">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
        
        {/* HERO HEADER */}
        <motion.div variants={item} className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10 pt-2 pb-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-zinc-900 tracking-tight mb-1 flex items-center gap-2">
              Good morning, {user?.name || 'User'}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              Here's what's happening with {activeWorkspace?.name || 'your organization'} today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
             <Link href={`/dashboard/${sessionId}/imports`} className="flex items-center gap-2 text-sm font-bold text-zinc-700 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all">
               <Upload size={16} /> Upload CSV
             </Link>
             <Link href={`/dashboard/${sessionId}/datasets/new`} className="flex items-center gap-2 text-sm font-bold text-zinc-700 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all">
               <FileText size={16} /> Create Dataset
             </Link>
             <Link href={`/dashboard/${sessionId}/workspaces`} className="flex items-center gap-2 text-sm font-bold text-white bg-[#635BFF] hover:bg-[#5249E5] px-5 py-2.5 rounded-xl shadow-sm shadow-[#635BFF]/20 hover:shadow-md transition-all">
               <Plus size={16} /> Create Workspace
             </Link>
          </div>
        </motion.div>

        {/* KPI CARDS */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { label: "Total Datasets", value: analytics?.totalDatasets || "0", trend: "+0%", trendLabel: "Active datasets", icon: Database, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
            { label: "Total Records", value: analytics?.totalRecords || "0", trend: "+0%", trendLabel: "Total ingested", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Published Datasets", value: analytics?.publishedDatasets || "0", trend: "+0%", trendLabel: "Live publicly", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Draft Datasets", value: analytics?.draftDatasets || "0", trend: "+0%", trendLabel: "In progress", icon: UploadCloud, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Archived", value: analytics?.archivedDatasets || "0", trend: "0%", trendLabel: "Stored away", icon: Users, color: "text-pink-500", bg: "bg-pink-50" }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200/80 p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                   <stat.icon size={24} />
                 </div>
               </div>
               <div>
                 <div className="text-xs font-bold text-zinc-500 mb-1">{stat.label}</div>
                 <div className="flex items-end gap-3 mb-2">
                   <div className="text-[28px] font-black text-zinc-900 leading-none">{stat.value}</div>
                   <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                     <TrendingUp size={12}/> {stat.trend}
                   </div>
                 </div>
                 <div className="text-[11px] font-semibold text-zinc-400">{stat.trendLabel}</div>
               </div>
            </div>
          ))}
        </motion.div>

        {/* MIDDLE ROW: Analytics & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ANALYTICS CHART */}
          <motion.div variants={item} className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-[24px] p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Analytics Overview</h3>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#635BFF]"></div> Views
                    </div>
                    <div className="text-xl font-black text-zinc-900">1.24M</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Downloads
                    </div>
                    <div className="text-xl font-black text-zinc-900">48.6K</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Searches
                    </div>
                    <div className="text-xl font-black text-zinc-900">23.8K</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-600 cursor-pointer hover:bg-zinc-50">
                Last 30 Days <ChevronDown size={14} />
              </div>
            </div>
            
            {/* Fake Line Chart */}
            <div className="flex-1 min-h-[240px] relative mt-4">
              {/* Y Axis Grid */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-zinc-400">
                <div className="flex items-center gap-2"><span className="w-8">100K</span><div className="flex-1 border-t border-dashed border-zinc-200"></div></div>
                <div className="flex items-center gap-2"><span className="w-8">75K</span><div className="flex-1 border-t border-dashed border-zinc-200"></div></div>
                <div className="flex items-center gap-2"><span className="w-8">50K</span><div className="flex-1 border-t border-dashed border-zinc-200"></div></div>
                <div className="flex items-center gap-2"><span className="w-8">25K</span><div className="flex-1 border-t border-dashed border-zinc-200"></div></div>
                <div className="flex items-center gap-2"><span className="w-8">0</span><div className="flex-1 border-t border-dashed border-zinc-200"></div></div>
              </div>
              
              {/* SVG Lines - Approximating the mockup */}
              <div className="absolute inset-0 left-10 overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,40 L10,45 L20,38 L30,42 L40,30 L50,35 L60,25 L70,38 L80,32 L90,20 L100,28" fill="none" stroke="#635BFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0,60 L10,55 L20,58 L30,52 L40,60 L50,48 L60,55 L70,45 L80,52 L90,48 L100,40" fill="none" stroke="#3B82F6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0,80 L10,75 L20,78 L30,82 L40,79 L50,85 L60,82 L70,78 L80,85 L90,82 L100,75" fill="none" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {/* X Axis */}
              <div className="absolute -bottom-6 left-10 right-0 flex justify-between text-[10px] font-bold text-zinc-400">
                <span>May 01</span>
                <span>May 07</span>
                <span>May 13</span>
                <span>May 19</span>
                <span>May 25</span>
                <span>May 31</span>
              </div>
            </div>
          </motion.div>

          {/* RECENT ACTIVITY */}
          <motion.div variants={item} className="bg-white border border-zinc-200/80 rounded-[24px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Recent Activity</h3>
              <button className="text-xs font-bold text-zinc-600 border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-50">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { title: "Last Import", desc: analytics?.lastImportDate ? new Date(analytics.lastImportDate).toLocaleString() : "No imports yet", time: "System", icon: HardDrive, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 truncate">{activity.title}</h4>
                    <p className="text-xs font-medium text-zinc-500 truncate">{activity.desc}</p>
                  </div>
                  <div className="text-[11px] font-bold text-zinc-400 shrink-0 mt-0.5">{activity.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ROW: Top Datasets, Imports, Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* TOP DATASETS */}
          <motion.div variants={item} className="bg-white border border-zinc-200/80 rounded-[24px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Recent Datasets</h3>
              <Link href={`/dashboard/${sessionId}/datasets`} className="text-xs font-bold text-zinc-600 border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-50">View All</Link>
            </div>
            <div className="space-y-4">
              {topDatasets.length === 0 ? (
                <div className="text-sm text-zinc-500 text-center py-4">No datasets created yet.</div>
              ) : topDatasets.map((ds: any, i: number) => (
                <Link href={`/dashboard/${sessionId}/datasets/${ds.id || ds._id}/records`} key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group cursor-pointer border border-transparent hover:border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#635BFF]/5 text-[#635BFF] flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 truncate max-w-[150px]">{ds.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ds.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                  }`}>{ds.status}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* RECENT IMPORTS */}
          <motion.div variants={item} className="bg-white border border-zinc-200/80 rounded-[24px] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Recent Imports</h3>
              <Link href={`/dashboard/${sessionId}/imports`} className="text-xs font-bold text-zinc-600 border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-50">View All</Link>
            </div>
            <div className="space-y-4">
              {recentImports.length === 0 ? (
                <div className="text-sm text-zinc-500 text-center py-4">No imports found.</div>
              ) : recentImports.map((imp: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <HardDrive size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 leading-tight truncate max-w-[120px]">{imp.filename}</h4>
                      <p className="text-[11px] font-semibold text-zinc-400">{imp.datasetName}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                    imp.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' : 'text-zinc-600 bg-zinc-50'
                  }`}>
                    {imp.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* STORAGE USAGE */}
          <motion.div variants={item} className="bg-white border border-zinc-200/80 rounded-[24px] p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Storage Usage</h3>
              <button className="text-xs font-bold text-zinc-600 border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-50">View Details</button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative mb-4">
               {/* Very basic CSS donut chart representation */}
               <div className="w-40 h-40 rounded-full border-[12px] border-[#635BFF] flex items-center justify-center relative shadow-sm">
                 <div className="absolute top-0 right-0 w-1/2 h-full border-[12px] border-emerald-400 rounded-r-full border-l-0 translate-x-3 -translate-y-3 opacity-80 mix-blend-multiply"></div>
                 <div className="absolute bottom-0 left-0 w-full h-1/3 border-[12px] border-amber-400 rounded-b-full border-t-0 translate-y-3 opacity-80 mix-blend-multiply"></div>
                 <div className="text-center bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center z-10 shadow-sm">
                   <div className="text-3xl font-black text-zinc-900 leading-none">62%</div>
                 </div>
               </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-sm font-bold text-zinc-900">31.2 GB / 50 GB</div>
              <div className="text-xs font-semibold text-zinc-500">Used</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 px-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#635BFF]"></span> Datasets</span>
                <span>18.4 GB</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Imports</span>
                <span>8.7 GB</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Media</span>
                <span>3.2 GB</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Others</span>
                <span>0.9 GB</span>
              </div>
            </div>

            <div className="mt-auto bg-[#635BFF]/5 text-[#635BFF] px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-center border border-[#635BFF]/10">
              <Database size={14} /> You have 18.8 GB remaining of 50 GB
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
