import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  Search,
  X,
  RefreshCw,
  Download,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Filter,
  BarChart3,
  Lock,
  TableProperties,
  Check,
  ChevronDown,
  FilePlus2,
  FileEdit,
  ShieldCheck,
  ExternalLink,
  History,
  Star,
  Award
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION (PRODUCTION)
 */
const firebaseConfig = {
  apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
  authDomain: "meratus-frd-lms-10276.firebaseapp.com",
  projectId: "meratus-frd-lms-10276",
  storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
  messagingSenderId: "845694770386",
  appId: "1:845694770386:web:f103c31b21d082c8fd610b",
  measurementId: "G-KEV4HZQ53M"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app); 
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_TSV = `No	Nama Module	Status	Group SBU/SFU	Skor CCT	Link Terbaru	Link File Lama
1	Contoh Module Dummy	New	Asset & Charter	8.5	https://example.com/new	https://example.com/old`;

// Reusable Components
const MultiSelectDropdown = ({ label, options, selectedValues, onToggle }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} style={{ zIndex: isOpen ? 100 : 50 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-slate-300 text-slate-600 text-[10px] font-bold uppercase rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:bg-slate-100 h-[34px]"
      >
        <span className="opacity-60">{label}:</span> 
        <span className="text-slate-800">
          {selectedValues.length === 0 || selectedValues.includes('all') ? 'All' : `${selectedValues.length} Active`}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 mb-1 border-b border-slate-100">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Filters</span>
          </div>
          {options.map((opt: any) => (
            <label key={opt.id} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
              <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${selectedValues.includes(opt.id) ? 'bg-blue-600 border-blue-600 shadow-sm' : 'border-slate-300 group-hover:border-blue-500'}`}>
                {selectedValues.includes(opt.id) && <Check size={10} className="text-white stroke-[4px]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={selectedValues.includes(opt.id)}
                onChange={() => onToggle(opt.id)}
              />
              <span className={`ml-3 text-[10px] font-bold uppercase tracking-wider ${selectedValues.includes(opt.id) ? 'text-blue-600' : 'text-slate-600'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

function useFilterDropdown(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  return { value, setValue };
}

const GlobalSuggestionInput = ({ value, setValue, placeholder, list, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full sm:w-56 flex-shrink-0" ref={ref}>
      <div className="relative flex items-center group">
        <Icon className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-10 pr-8 py-1.5 h-[34px] bg-white border border-slate-300 shadow-sm rounded-lg text-[11px] font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
          value={value}
          onChange={(e: any) => { setValue(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
        />
        {value && (
          <button type="button" onClick={() => setValue("")} className="absolute right-2 p-1 hover:bg-slate-100 rounded-full transition-colors z-10">
            <X size={12} className="text-slate-400" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
          {list
            .filter((i: string) => i.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 30)
            .map((item: string, i: number) => (
              <button 
                key={i} 
                type="button"
                className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-slate-50 text-slate-700 font-medium transition-colors border-b last:border-0 border-slate-100"
                onClick={(e: any) => { 
                  e.preventDefault(); 
                  setValue(item); 
                  setIsOpen(false); 
                }}
              >
                {item}
              </button>
            ))
          }
          {list.filter((i: string) => i.toLowerCase().includes(value.toLowerCase())).length === 0 && (
             <div className="px-4 py-3 text-xs text-slate-500 font-medium italic text-center">No match found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [moduleView, setModuleView] = useState('all'); 

  const [statusFilters, setStatusFilters] = useState<string[]>(['all']); 
  const [sortOrder, setSortOrder] = useState('default'); 
  
  const [rawData, setRawData] = useState(DEFAULT_TSV);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const { value: searchFilter, setValue: setSearchFilter } = useFilterDropdown("");
  const { value: sbuFilter, setValue: setSbuFilter } = useFilterDropdown("");

  // FIREBASE INIT
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err: any) { 
        console.error("Firebase Auth Error:", err); 
        setSyncError("Auth Fail. Enable Anonymous Auth in Firebase."); 
        setIsLoadingData(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      if (!u) setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
    const unsubscribe = onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (typeof data.tsvData === 'string') {
          setRawData(data.tsvData);
        }
      }
      setIsLoadingData(false);
      setSyncError(null);
    }, (err: any) => {
      console.error("Firestore Sync Error:", err); 
      setSyncError("Sync Fail. Check Firestore Rules.");
      setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  const parsedData = useMemo(() => {
    if (!rawData || rawData.trim() === '') return []; 
    const lines = rawData.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    return lines.slice(1).reduce((acc: any[], line: string) => {
      if (!line || line.trim() === '') return acc;

      const values = line.split('\t');
      const obj: Record<string, any> = {};
      headers.forEach((header: string, i: number) => { obj[header] = values[i] ? values[i].trim() : ''; });
      
      const rawStatus = (obj['Status'] || '').toLowerCase();
      if (rawStatus.includes('baru') || rawStatus.includes('new')) obj._normStatus = 'New';
      else if (rawStatus.includes('diperbarui') || rawStatus.includes('updated')) obj._normStatus = 'Updated';
      else obj._normStatus = 'Unchanged';

      const parsedScore = parseFloat(obj['Skor CCT']);
      obj._score = isNaN(parsedScore) ? null : parsedScore;
      obj._linkNew = obj['Link Terbaru'] || null;
      obj._linkOld = obj['Link File Lama'] || null;
      obj._order = parseInt(obj['No'] || obj['NO']) || 0;

      if (obj['Nama Module']) acc.push(obj);
      return acc;
    }, []); 
  }, [rawData]);

  const suggestions = useMemo(() => ({
    names: [...new Set(parsedData.map((d: any) => d['Nama Module']).filter(Boolean))].sort(),
    sbus: [...new Set(parsedData.map((d: any) => d['Group SBU/SFU']).filter(Boolean))].sort()
  }), [parsedData]);

  const globallyFilteredData = useMemo(() => {
    let data = parsedData;
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      data = data.filter((d: any) => (d['Nama Module'] || '').toLowerCase().includes(lowerSearch));
    }
    if (sbuFilter) data = data.filter((d: any) => (d['Group SBU/SFU'] || '').toLowerCase().includes(sbuFilter.toLowerCase()));
    return data;
  }, [parsedData, searchFilter, sbuFilter]);

  const metrics = useMemo(() => {
    const data = globallyFilteredData;
    let newCount = 0, updatedCount = 0, unchangedCount = 0;
    const sbuMap: Record<string, any> = {};
    let totalScore = 0;
    let scoreCount = 0;
    let topScoredModules: any[] = [];

    data.forEach((d: any) => {
      const sbu = d['Group SBU/SFU'] || 'Unknown SBU';
      if (!sbuMap[sbu]) sbuMap[sbu] = { name: sbu, total: 0, new: 0, updated: 0, scoreSum: 0, scoreCount: 0 };
      sbuMap[sbu].total += 1;

      if (d._normStatus === 'New') {
        newCount++;
        sbuMap[sbu].new += 1;
      } else if (d._normStatus === 'Updated') {
        updatedCount++;
        sbuMap[sbu].updated += 1;
      } else {
        unchangedCount++;
      }

      if (d._score !== null) {
        totalScore += d._score;
        scoreCount++;
        sbuMap[sbu].scoreSum += d._score;
        sbuMap[sbu].scoreCount += 1;
        topScoredModules.push(d);
      }
    });
    
    const sbuSummary = Object.values(sbuMap)
      .map((s: any) => ({
        ...s,
        activityScore: s.new * 2 + s.updated,
        avgScore: s.scoreCount > 0 ? (s.scoreSum / s.scoreCount).toFixed(1) : '-'
      }))
      .sort((a: any, b: any) => b.activityScore - a.activityScore);

    const updateRate = data.length > 0 ? (((newCount + updatedCount) / data.length) * 100).toFixed(1) : 0;
    const avgGlobalScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : 0;
    topScoredModules.sort((a: any, b: any) => b._score - a._score);

    return {
      total: data.length, newCount, updatedCount, unchangedCount, updateRate, avgGlobalScore,
      sbuSummary, topScoredModules: topScoredModules.slice(0, 10)
    };
  }, [globallyFilteredData]);

  const tableData = useMemo(() => {
    let baseData = globallyFilteredData;
    if (moduleView === 'new') baseData = baseData.filter((d: any) => d._normStatus === 'New');
    else if (moduleView === 'updated') baseData = baseData.filter((d: any) => d._normStatus === 'Updated');

    if (!statusFilters.includes('all')) {
      baseData = baseData.filter((d: any) => {
        if (statusFilters.includes('new') && d._normStatus === 'New') return true;
        if (statusFilters.includes('updated') && d._normStatus === 'Updated') return true;
        if (statusFilters.includes('unchanged') && d._normStatus === 'Unchanged') return true;
        return false;
      });
    }

    if (sortOrder === 'default') baseData = [...baseData].sort((a: any, b: any) => a._order - b._order);
    else if (sortOrder === 'az') baseData = [...baseData].sort((a: any, b: any) => (a['Nama Module'] || '').localeCompare(b['Nama Module'] || ''));
    else if (sortOrder === 'za') baseData = [...baseData].sort((a: any, b: any) => (b['Nama Module'] || '').localeCompare(a['Nama Module'] || ''));
    else if (sortOrder === 'score_high') baseData = [...baseData].sort((a: any, b: any) => (b._score || 0) - (a._score || 0));
    else if (sortOrder === 'score_low') baseData = [...baseData].sort((a: any, b: any) => (a._score || 100) - (b._score || 100));
    return baseData;
  }, [globallyFilteredData, moduleView, statusFilters, sortOrder]);

  const handleToggleFilter = (id: string, current: string[], setter: any) => {
    if (id === 'all') setter(['all']);
    else {
      let next = current.filter(item => item !== 'all');
      if (next.includes(id)) {
        next = next.filter(item => item !== id);
        if (next.length === 0) next = ['all'];
      } else next.push(id);
      setter(next);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
      await setDoc(docRef, { tsvData: rawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      setActiveTab('dashboard');
    } catch (e: any) { 
      console.error("Save Document Error:", e);
      setSyncError("Save Failed. Check Firestore Rules."); 
    }
    finally { setIsSaving(false); }
  };

  const handleExportTable = () => {
    const b = new Blob([rawData], { type: 'text/tsv' }); 
    const u = URL.createObjectURL(b); 
    const a = document.createElement('a'); a.href = u; a.download = 'CCT_Module_Tracker_Export.tsv'; a.click();
  };

  const clearAllFilters = () => { setSearchFilter(""); setSbuFilter(""); };

  const StatusBadge = ({ status }: any) => {
    const styles = status === 'New' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : status === 'Updated' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border shadow-sm ${styles}`}>
        {status === 'New' && <FilePlus2 size={10} />}
        {status === 'Updated' && <FileEdit size={10} />}
        {status === 'Unchanged' && <CheckCircle2 size={10} />}
        {status.toUpperCase()}
      </span>
    );
  };

  const ScoreBadge = ({ score }: any) => {
    if (score === null) return <span className="text-slate-400 font-bold">-</span>;
    const isPass = score >= 8.0;
    return (
      <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-black min-w-[36px] border ${isPass ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
        {score.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-[56px] bg-white text-slate-800 shadow-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="h-full w-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1.5 rounded-lg shadow-md shadow-blue-200">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[12px] tracking-wide uppercase leading-tight text-slate-800">CCT Modules: Update Tracker</h1>
              <div className="flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full ${syncError ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{syncError || 'Cloud Sync Active'}</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[ 
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'modules', label: 'Module List', icon: TableProperties },
              { id: 'source', label: 'Source Data', icon: Upload }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                <tab.icon size={11}/> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* FILTER BAR */}
      {(activeTab === 'dashboard' || activeTab === 'modules') && (
        <div className="h-[48px] bg-white border-b border-slate-200 flex-shrink-0 z-40">
           <div className="h-full w-full px-4 sm:px-6 flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2 hidden sm:flex shrink-0">
                 <Filter size={12} className="text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Filters:</span>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-none">
                <GlobalSuggestionInput value={searchFilter} setValue={setSearchFilter} placeholder="Module Name..." list={suggestions.names} icon={Search} />
                <GlobalSuggestionInput value={sbuFilter} setValue={setSbuFilter} placeholder="SBU/SFU..." list={suggestions.sbus} icon={Building2} />
              </div>
              {(searchFilter || sbuFilter) && (
                <button onClick={clearAllFilters} className="text-[9px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-rose-200 shadow-sm ml-auto transition-colors hover:bg-rose-100">
                  <X size={10} /> Clear
                </button>
              )}
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full overflow-hidden p-3 sm:p-4 bg-slate-50">
        {isLoadingData ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400"><RefreshCw className="h-8 w-8 animate-spin mb-3 text-blue-500" /><p className="font-bold text-[10px] tracking-widest uppercase animate-pulse">Loading Tracker Data...</p></div>
        ) : activeTab === 'dashboard' ? (
          
          <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Stat Cards - Tampilan Lebih Slim */}
            <div className="grid grid-cols-5 gap-3 shrink-0">
              {[
                { label: 'Total Modules', val: metrics.total, color: 'slate', icon: BookOpen },
                { label: 'New Modules', val: metrics.newCount, color: 'emerald', icon: FilePlus2 },
                { label: 'Updated', val: metrics.updatedCount, color: 'blue', icon: FileEdit },
                { label: 'Update Rate', val: `${metrics.updateRate}%`, color: 'indigo', icon: BarChart3 },
                { label: 'Avg CCT Score', val: metrics.avgGlobalScore, color: 'amber', icon: Star }
              ].map((card, i) => (
                <div key={i} className={`bg-white p-3 rounded-xl border border-${card.color}-200 shadow-sm flex flex-col justify-between h-[75px]`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`text-[8px] font-black text-${card.color}-600 uppercase tracking-widest`}>{card.label}</h3>
                    <card.icon size={12} className={`text-${card.color}-500 opacity-70`} />
                  </div>
                  <div className={`text-2xl font-black text-slate-800 tracking-tighter leading-none`}>{card.val}</div>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 min-h-0">
              
              {/* SBU Leaderboard - Dibuat 3 kolom di layar besar agar semua terlihat */}
              <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col min-h-0 shadow-sm">
                <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-2 bg-slate-50 shrink-0 rounded-t-xl">
                  <Building2 className="text-slate-500" size={13} />
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">SBU / SFU Summary</h2>
                </div>
                <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                    {metrics.sbuSummary.map((sbu: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 pb-1.5 last:border-0">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-800 truncate pr-2 uppercase" title={sbu.name}>{sbu.name}</span>
                          <div className="flex items-center gap-1.5 text-[8px] font-black tracking-tighter shrink-0">
                            <span className="text-amber-600">★ {sbu.avgScore}</span>
                            <span className="text-emerald-600">N:{sbu.new}</span>
                            <span className="text-blue-600">U:{sbu.updated}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${(sbu.new / sbu.total) * 100}%` }}></div>
                          <div className="bg-blue-500 h-full" style={{ width: `${(sbu.updated / sbu.total) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Scored - Lebih compact */}
              <div className="bg-white rounded-xl border border-slate-200 flex flex-col min-h-0 shadow-sm">
                <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-2 bg-slate-50 shrink-0 rounded-t-xl">
                  <Award className="text-amber-500" size={13} />
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Top Scores</h2>
                </div>
                <div className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="divide-y divide-slate-100">
                    {metrics.topScoredModules.map((mod: any, idx: number) => (
                      <div key={idx} className="px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2">
                        <span className="font-black text-amber-600 text-[10px] w-5 text-center shrink-0">{mod._score}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[9px] font-bold text-slate-800 leading-tight truncate uppercase" title={mod['Nama Module']}>{mod['Nama Module']}</h4>
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter truncate">{mod['Group SBU/SFU']}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        ) : activeTab === 'modules' ? (
          
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50 shrink-0">
                <div className="flex overflow-x-auto no-scrollbar flex-1">
                  {[
                    { id: 'all', label: 'All', count: metrics.total, color: 'indigo' },
                    { id: 'new', label: 'New', count: metrics.newCount, color: 'emerald', icon: FilePlus2 },
                    { id: 'updated', label: 'Updated', count: metrics.updatedCount, color: 'blue', icon: FileEdit }
                  ].map(v => (
                    <button key={v.id} onClick={() => setModuleView(v.id)} className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${moduleView === v.id ? `border-${v.color}-500 text-${v.color}-600 bg-white` : 'border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-800'}`}>
                      {v.icon && <v.icon size={11} />} {v.label} ({v.count})
                    </button>
                  ))}
                </div>
                <div className="flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-slate-200 gap-2 shrink-0">
                  <MultiSelectDropdown label="Status" options={[{id: 'all', label: 'All Status'},{id: 'new', label: 'New'},{id: 'updated', label: 'Updated'},{id: 'unchanged', label: 'Unchanged'}]} selectedValues={statusFilters} onToggle={(id: string) => handleToggleFilter(id, statusFilters, setStatusFilters)} />
                  <select value={sortOrder} onChange={(e: any) => setSortOrder(e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-[9px] font-black uppercase rounded-lg px-2 h-[32px] outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="default">Sort: Default</option>
                    <option value="score_high">Sort: Highest Score</option>
                    <option value="score_low">Sort: Lowest Score</option>
                    <option value="az">Sort: A-Z</option>
                  </select>
                  <button onClick={handleExportTable} className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-sm transition-all"><Download size={11}/> Export</button>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-5 py-3 w-12 text-center">NO</th>
                      <th className="px-5 py-3 min-w-[250px]">Nama Module</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Group SBU</th>
                      <th className="px-4 py-3 text-center">Skor CCT</th>
                      <th className="px-5 py-3 text-center">Akses Dokumen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableData.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-2.5 text-[10px] font-bold text-slate-400 text-center">{row['No'] || row['NO'] || '-'}</td>
                        <td className="px-5 py-2.5"><div className="text-[10px] font-bold text-slate-800 line-clamp-2 uppercase" title={row['Nama Module']}>{row['Nama Module'] || '-'}</div></td>
                        <td className="px-4 py-2.5 text-center"><StatusBadge status={row._normStatus} /></td>
                        <td className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">{row['Group SBU/SFU'] || '-'}</td>
                        <td className="px-4 py-2.5 text-center"><ScoreBadge score={row._score} /></td>
                        <td className="px-5 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {row._linkNew ? <a href={row._linkNew} target="_blank" rel="noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 transition-colors hover:bg-blue-600 hover:text-white"><ExternalLink size={12} /></a> : <div className="p-1.5 bg-slate-50 text-slate-300 rounded-md border border-slate-100 cursor-not-allowed"><ExternalLink size={12} /></div>}
                            {row._linkOld ? <a href={row._linkOld} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-50 text-slate-500 rounded-md border border-slate-200 transition-colors hover:bg-slate-600 hover:text-white"><History size={12} /></a> : <div className="p-1.5 bg-slate-50 text-slate-300 rounded-md border border-slate-100 cursor-not-allowed"><History size={12} /></div>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        ) : (
          
          <div className="h-full max-w-4xl mx-auto w-full animate-in fade-in duration-300">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {!isAuthorized ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center bg-slate-50 px-6">
                     <div className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm"><Lock size={24} className="text-slate-400" /></div>
                     <h2 className="text-lg font-black text-slate-800 mb-1">Access Locked</h2>
                     <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest">Administrator Credentials Required</p>
                     <div className="flex w-full max-w-xs gap-2">
                        <div className="relative flex-1">
                           <input type={showPassword ? 'text' : 'password'} value={passwordInput} onChange={(e: any) => setPasswordInput(e.target.value)} onKeyDown={(e: any) => { if(e.key === 'Enter') { if (passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); } }} placeholder="Enter Password..." className="w-full h-[38px] bg-white border border-slate-300 px-3 rounded-lg text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-8" />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">{showPassword ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                        </div>
                        <button onClick={() => { if(passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-[38px] rounded-lg text-[10px] font-black uppercase shadow-md transition-all active:scale-95">Unlock</button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-2.5">
                         <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><FileSpreadsheet size={14} /></div>
                         <div><h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Data Source (TSV)</h2><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">TSV Format required</p></div>
                       </div>
                       <button onClick={handleSaveToCloud} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[32px] rounded-lg text-[9px] font-black uppercase shadow-md transition-all flex items-center gap-1.5 disabled:opacity-70 active:scale-95">{isSaving ? <RefreshCw className="animate-spin" size={11} /> : <Save size={11} />} {isSaving ? 'Saving...' : 'Save Data'}</button>
                    </div>
                    <div className="p-3 bg-slate-50 flex-1 flex min-h-0">
                      <textarea value={rawData} onChange={(e: any) => setRawData(e.target.value)} className="w-full h-full bg-white border border-slate-300 shadow-inner rounded-lg p-3 text-[9px] leading-relaxed font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none custom-scrollbar whitespace-pre" spellCheck="false"></textarea>
                    </div>
                  </>
                )}
             </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
           @page { size: A4 landscape; margin: 10mm; }
           body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; color: black !important; }
        }
      `}} />
    </div>
  );
}