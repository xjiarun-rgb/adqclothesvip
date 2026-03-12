
import React, { useState } from 'react';
import { VideoMaterial } from '../types';

interface VideoModalProps {
  video: VideoMaterial | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!video) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        {/* Left Side: Video Player */}
        <div className="w-full md:w-[45%] bg-black flex items-center justify-center relative group">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 z-10 p-2.5 bg-white/20 hover:bg-white/40 rounded-full text-white md:hidden transition-all backdrop-blur-md"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">Preview Mode</span>
          </div>

          <video 
            src={video.videoUrl} 
            controls 
            autoPlay
            preload="auto"
            className="max-h-[50vh] md:max-h-full w-full h-full object-contain"
          />
        </div>

        {/* Right Side: Analysis & Scripts */}
        <div className="w-full md:w-[55%] overflow-y-auto p-8 md:p-12 bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all hidden md:block"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-100">{video.month}份爆款</span>
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest border border-slate-100">{video.id}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4">{video.category}投放素材分析</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200">{video.type}</span>
              {/* Show ALL selling points here for full visibility */}
              {video.sellingPoints.map((p, i) => (
                <span key={i} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100">#{p}</span>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {/* Hook Analysis Section */}
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-3">
                吸睛前5秒解读
                <span className="flex-1 h-px bg-slate-100"></span>
              </h3>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative p-6 bg-white border border-indigo-100 rounded-2xl">
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">
                    {video.hookAnalysis}
                  </p>
                </div>
              </div>
            </section>

            {/* Scripts Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  衍生文案参考
                </h3>
                <a 
                  href="https://admuse.qq.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter hover:bg-emerald-100 transition-colors flex items-center gap-1"
                >
                  去妙思制作爆款素材
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="space-y-4">
                {video.scripts.map((script, idx) => (
                  <div key={idx} className="group relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {script}
                        </p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(script, idx)}
                        className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${copiedIndex === idx ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 shadow-sm'}`}
                        title="复制脚本"
                      >
                        {copiedIndex === idx ? (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            <span className="text-[10px] font-bold">已复制</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            <span className="text-[10px] font-bold">复制</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-end">
               <p className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">© 2026 Video Channels Creative Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
