
import React, { useState, useMemo, useEffect } from 'react';
import { VIDEO_DATA, MONTHS, CATEGORIES, TYPES } from './constants';
import { VideoMaterial } from './types';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import LoginPage from './components/LoginPage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  useEffect(() => {
    const auth = localStorage.getItem('is_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('is_authenticated');
    setIsAuthenticated(false);
  };
  const [filters, setFilters] = useState({
    month: '全部',
    category: '全部',
    type: '全部',
    search: ''
  });
  const [selectedVideo, setSelectedVideo] = useState<VideoMaterial | null>(null);

  const filteredVideos = useMemo(() => {
    const result = VIDEO_DATA.filter(v => {
      const monthMatch = filters.month === '全部' || v.month === filters.month;
      const categoryMatch = filters.category === '全部' || v.category === filters.category;
      const typeMatch = filters.type === '全部' || v.type === filters.type;
      const searchMatch = !filters.search || 
        v.sellingPoints.some(p => p.toLowerCase().includes(filters.search.toLowerCase())) ||
        v.hookAnalysis.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.category.toLowerCase().includes(filters.search.toLowerCase());
      
      return monthMatch && categoryMatch && typeMatch && searchMatch;
    });

    // Sort by Month (3月, 4月) then Category
    return result.sort((a, b) => {
      if (a.month !== b.month) {
        return a.month.localeCompare(b.month);
      }
      return a.category.localeCompare(b.category);
    });
  }, [filters]);

  const stats = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    VIDEO_DATA.forEach(v => {
      monthCounts[v.month] = (monthCounts[v.month] || 0) + 1;
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      typeCounts[v.type] = (typeCounts[v.type] || 0) + 1;
    });

    return {
      month: Object.entries(monthCounts).map(([name, value]) => ({ name, value })),
      category: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })),
      type: Object.entries(typeCounts).map(([name, value]) => ({ name, value })),
    };
  }, []);

  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 022 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight tracking-tight">视频号男女装爆品素材库（春夏精选版）</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Video Channels Insights Pro</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              素材中心
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              趋势洞察
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-500 font-mono">UPDATED: 2026.02</span>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="退出登录"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' ? (
          <>
            {/* Advanced Filtering Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mb-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">关键字搜索</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="搜索卖点、类目或解读..."
                      value={filters.search}
                      onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full md:w-40">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">投放月份</label>
                  <select 
                    value={filters.month}
                    onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">素材类型</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">商品类目</label>
                  <select 
                    value={filters.category}
                    onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <p className="text-xs text-slate-500">
                    共找到 <span className="font-bold text-indigo-600">{filteredVideos.length}</span> 条高转化素材（已按月份和类目排序）
                  </p>
                </div>
                {(filters.month !== '全部' || filters.category !== '全部' || filters.type !== '全部' || filters.search !== '') && (
                  <button 
                    onClick={() => setFilters({ month: '全部', category: '全部', type: '全部', search: '' })}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 group transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    清除所有筛选
                  </button>
                )}
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map(video => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} />
              ))}
              {filteredVideos.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-lg font-bold text-slate-400">未找到符合条件的素材</p>
                  <p className="text-sm mt-1">建议尝试更宽泊的搜索词或重置筛选</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Expert Insight Card - MOVED TO TOP */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              </div>
              
              <div className="max-w-3xl relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Expert Insight</span>
                <h2 className="text-4xl font-black mb-4 tracking-tight">爆款公式：前5秒是转化的生命线</h2>
                <p className="text-indigo-100 mb-10 text-lg leading-relaxed font-medium">深度拆解视频号高热素材，核心逻辑在于：<span className="text-white underline decoration-white/30 underline-offset-4 font-bold">视觉先行，利益点断后。</span></p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "动效展示", desc: "模特走位、快速切镜", icon: "🎬" },
                    { title: "价值锚点", desc: "醒目红标价格、买一赠一", icon: "💰" },
                    { title: "痛点重击", desc: "肚大腿粗等尴尬瞬间", icon: "⚠️" },
                    { title: "权威背书", desc: "检验证书、品牌溯源", icon: "✅" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                      <div className="text-xl mb-2">{item.icon}</div>
                      <h4 className="font-bold text-base mb-1">{item.title}</h4>
                      <p className="text-xs text-indigo-100/80 leading-tight">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "素材总量", value: VIDEO_DATA.length, unit: "条", color: "bg-indigo-50 text-indigo-600" },
                 { label: "涵盖类目", value: CATEGORIES.length - 1, unit: "个", color: "bg-blue-50 text-blue-600" },
                 { label: "平均文案数", value: 3, unit: "条/素材", color: "bg-emerald-50 text-emerald-600" },
                 { label: "核心策略", value: 4, unit: "大类", color: "bg-amber-50 text-amber-600" }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">{item.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">{item.value}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{item.unit}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Distribution Chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                    爆品类目分布
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">HOT CATEGORIES</span>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.category} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={80} 
                        fontSize={12} 
                        fontWeight={600}
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Type Distribution Pie Chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                    营销链路分布
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">STRATEGY SHARE</span>
                </div>
                <div className="h-72 flex flex-col md:flex-row items-center">
                  <div className="flex-1 w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.type}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {stats.type.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex md:flex-col justify-center gap-6 mt-4 md:mt-0 md:pl-6">
                    {stats.type.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.name}</p>
                          <p className="text-sm font-bold text-slate-700">{Math.round((item.value / VIDEO_DATA.length) * 100)}% 占比</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      {/* Modern Floating Bottom Nav for Mobile */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl px-2 py-2 rounded-3xl flex items-center gap-1 shadow-2xl border border-white/10">
           <button 
             onClick={() => setActiveTab('list')}
             className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
             <span className="text-xs font-bold uppercase">素材</span>
           </button>
           <button 
             onClick={() => setActiveTab('stats')}
             className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             <span className="text-xs font-bold uppercase">趋势</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;
