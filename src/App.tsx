import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen,
  Building2,
  Search,
  X,
  RefreshCw,
  Download,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  Lock,
  TableProperties,
  Check,
  ChevronDown,
  FilePlus2,
  FileEdit,
  ShieldCheck,
  ExternalLink,
  History,
  Activity,
  Eye,
  EyeOff,
  Users
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

const DEFAULT_TSV = `No	Nama Module	Status	Group SBU/SFU	Link Terbaru	Link File Lama
1	Contoh Module Dummy	Updated	Asset & Charter	https://example.com/new	https://example.com/old`;

// HRBP MAPPING LOGIC
const getHRBP = (sbu: string) => {
  const s = (sbu || '').toLowerCase();
  if (s.includes('asset') || s.includes('charter')) return 'Akbar';
  if (s.includes('bpm') || s.includes('it')) return 'Berhard';
  if (s.includes('corp') || s.includes('fin') || s.includes('acc') || s.includes('ga') || s.includes('hmm') || s.includes('hr') || s.includes('audit') || s.includes('legal') || s.includes('procurement')) return 'Sherly';
  if (s.includes('crewing') || s.includes('msm')) return 'Sentra';
  if (s.includes('commercial') || s.includes('operation') || s.includes('trade') || s.includes('academy')) return 'Andrew';
  if (s.includes('logistic') || s.includes('trucking')) return 'Taufik';
  if (s.includes('mtm') || s.includes('terminal')) return 'Ronny';
  return 'Unassigned';
};

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
    <div className="relative w-full sm:w-48 lg:w-56 flex-shrink-0" ref={ref}>
      <div className="relative flex items-center group">
        <Icon className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-9 pr-8 py-1.5 h-[32px] bg-white border border-slate-300 shadow-sm rounded-lg text-[10px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
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
                className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-slate-50 text-slate-700 font-bold transition-colors border-b last:border-0 border-slate-100 uppercase"
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

// Inline Editable Cell Component
const EditableCell = ({ value, onSave, className, isLink }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white border border-blue-500 rounded px-1.5 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-[10px] text-slate-800 font-medium shadow-sm ${className}`}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-blue-50 hover:border-blue-200 border border-transparent px-1.5 py-1 rounded transition-colors min-h-[24px] flex items-center break-all ${className}`}
      title="Click to edit"
    >
      {value ? (isLink ? <span className="truncate max-w-[150px] inline-block">{value}</span> : value) : <span className="text-slate-300 italic text-[9px]">Empty</span>}
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
  const { value: hrbpFilter, setValue: setHrbpFilter } = useFilterDropdown("");

  // FIREBASE INIT
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err: any) { 
        console.error("Firebase Auth Error:", err); 
        setSyncError("Auth Fail"); 
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
      setSyncError("Sync Fail");
      setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  const parsedData = useMemo(() => {
    if (!rawData || rawData.trim() === '') return []; 
    const lines = rawData.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    return lines.slice(1).reduce((acc: any[], line: string, idx: number) => {
      if (!line || line.trim() === '') return acc;

      const values = line.split('\t');
      const obj: Record<string, any> = {};
      headers.forEach((header: string, i: number) => { obj[header] = values[i] ? values[i].trim() : ''; });
      
      const rawStatus = (obj['Status'] || '').toLowerCase();
      if (rawStatus.includes('diperbarui') || rawStatus.includes('updated')) obj._normStatus = 'Updated';
      else obj._normStatus = 'Unchanged';

      obj._linkNew = obj['Link Terbaru'] || null;
      obj._linkOld = obj['Link File Lama'] || null;
      obj._order = parseInt(obj['No'] || obj['NO']) || 0;
      obj._originalIndex = idx + 1; // Preserve original line index for inline editing
      
      // Auto Assign HRBP
      obj._hrbp = getHRBP(obj['Group SBU/SFU']);

      if (obj['Nama Module']) acc.push(obj);
      return acc;
    }, []); 
  }, [rawData]);

  const suggestions = useMemo(() => ({
    names: [...new Set(parsedData.map((d: any) => d['Nama Module']).filter(Boolean))].sort(),
    sbus: [...new Set(parsedData.map((d: any) => d['Group SBU/SFU']).filter(Boolean))].sort(),
    hrbps: [...new Set(parsedData.map((d: any) => d._hrbp).filter(Boolean))].sort()
  }), [parsedData]);

  const globallyFilteredData = useMemo(() => {
    let data = parsedData;
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      data = data.filter((d: any) => (d['Nama Module'] || '').toLowerCase().includes(lowerSearch));
    }
    if (sbuFilter) data = data.filter((d: any) => (d['Group SBU/SFU'] || '').toLowerCase().includes(sbuFilter.toLowerCase()));
    if (hrbpFilter) data = data.filter((d: any) => (d._hrbp || '').toLowerCase().includes(hrbpFilter.toLowerCase()));
    return data;
  }, [parsedData, searchFilter, sbuFilter, hrbpFilter]);

  const metrics = useMemo(() => {
    const data = globallyFilteredData;
    let updatedCount = 0, unchangedCount = 0;
    const sbuMap: Record<string, any> = {};

    data.forEach((d: any) => {
      const sbu = d['Group SBU/SFU'] || 'Unknown SBU';
      if (!sbuMap[sbu]) sbuMap[sbu] = { name: sbu, total: 0, updated: 0, hrbp: d._hrbp };
      sbuMap[sbu].total += 1;

      if (d._normStatus === 'Updated') {
        updatedCount++;
        sbuMap[sbu].updated += 1;
      } else {
        unchangedCount++;
      }
    });
    
    const sbuSummary = Object.values(sbuMap)
      .map((s: any) => ({
        ...s,
        activityScore: s.updated
      }))
      .sort((a: any, b: any) => b.activityScore - a.activityScore);

    const updateRate = data.length > 0 ? ((updatedCount / data.length) * 100).toFixed(1) : 0;

    return {
      total: data.length, updatedCount, unchangedCount, updateRate, sbuSummary
    };
  }, [globallyFilteredData]);

  const tableData = useMemo(() => {
    let baseData = globallyFilteredData;
    if (moduleView === 'updated') baseData = baseData.filter((d: any) => d._normStatus === 'Updated');

    if (!statusFilters.includes('all')) {
      baseData = baseData.filter((d: any) => {
        if (statusFilters.includes('updated') && d._normStatus === 'Updated') return true;
        if (statusFilters.includes('unchanged') && d._normStatus === 'Unchanged') return true;
        return false;
      });
    }

    if (sortOrder === 'default') baseData = [...baseData].sort((a: any, b: any) => a._order - b._order);
    else if (sortOrder === 'az') baseData = [...baseData].sort((a: any, b: any) => (a['Nama Module'] || '').localeCompare(b['Nama Module'] || ''));
    else if (sortOrder === 'za') baseData = [...baseData].sort((a: any, b: any) => (b['Nama Module'] || '').localeCompare(a['Nama Module'] || ''));
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
      // Keep user on the same tab they were on instead of throwing them to dashboard
    } catch (e: any) { 
      console.error("Save Document Error:", e);
      setSyncError("Save Failed"); 
    }
    finally { setIsSaving(false); }
  };

  const handleExportTable = () => {
    const b = new Blob([rawData], { type: 'text/tsv' }); 
    const u = URL.createObjectURL(b); 
    const a = document.createElement('a'); a.href = u; a.download = 'CCT_Module_Tracker_Raw.tsv'; a.click();
  };

  const handleExportExcel = () => {
    if (tableData.length === 0) return;
    
    const headers = ['No', 'Nama Module', 'Status', 'Group SBU/SFU', 'HRBP', 'Link Terbaru', 'Link File Lama'];
    
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvRows = [headers.join(',')];

    tableData.forEach((row: any) => {
      const rowData = [
        escapeCSV(row['No'] || row['NO']),
        escapeCSV(row['Nama Module']),
        escapeCSV(row._normStatus),
        escapeCSV(row['Group SBU/SFU']),
        escapeCSV(row._hrbp),
        escapeCSV(row._linkNew),
        escapeCSV(row._linkOld)
      ];
      csvRows.push(rowData.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCT_Modules_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => { setSearchFilter(""); setSbuFilter(""); setHrbpFilter(""); };

  const handleCellEdit = (originalIndex: number, headerFallback: string, newValue: string) => {
    const lines = rawData.split(/\r?\n/);
    if (!lines[0]) return;
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    let headerIndex = headers.indexOf(headerFallback);
    if (headerIndex === -1 && headerFallback.toLowerCase() === 'no') {
        headerIndex = headers.findIndex(h => h.toLowerCase() === 'no');
    }
    
    if (headerIndex === -1) return;

    const targetLine = lines[originalIndex];
    if (targetLine === undefined) return;
    
    const values = targetLine.split('\t');
    
    while(values.length <= headerIndex) values.push('');
    
    values[headerIndex] = newValue;
    lines[originalIndex] = values.join('\t');
    
    const newRawData = lines.join('\n');
    setRawData(newRawData);
  };

  const StatusBadge = ({ status }: any) => {
    const styles = status === 'Updated' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border shadow-sm ${styles}`}>
        {status === 'Updated' && <FileEdit size={10} />}
        {status === 'Unchanged' && <CheckCircle2 size={10} />}
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-[48px] bg-white text-slate-800 shadow-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="h-full w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-lg shadow-md">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-[12px] tracking-tight uppercase leading-tight text-slate-800">CCT Modules <span className="text-blue-600">Tracker</span></h1>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{syncError || 'Cloud Sync Active'}</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[ 
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'modules', label: 'Detail View', icon: TableProperties },
              { id: 'source', label: 'Source Data', icon: Upload }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <tab.icon size={11}/> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* FILTER BAR */}
      {(activeTab === 'dashboard' || activeTab === 'modules') && (
        <div className="h-[44px] bg-white border-b border-slate-100 flex-shrink-0 z-40 shadow-sm">
           <div className="h-full w-full px-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 mr-1 shrink-0">
                 <Filter size={12} className="text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">Global Filters:</span>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-none">
                <GlobalSuggestionInput value={hrbpFilter} setValue={setHrbpFilter} placeholder="Filter HRBP..." list={suggestions.hrbps} icon={Users} />
                <GlobalSuggestionInput value={sbuFilter} setValue={setSbuFilter} placeholder="Filter SBU/SFU..." list={suggestions.sbus} icon={Building2} />
                <GlobalSuggestionInput value={searchFilter} setValue={setSearchFilter} placeholder="Search Module Name..." list={suggestions.names} icon={Search} />
              </div>
              {(searchFilter || sbuFilter || hrbpFilter) && (
                <button onClick={clearAllFilters} className="text-[8px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-rose-100 shadow-sm ml-auto transition-colors hover:bg-rose-100 shrink-0">
                  <X size={10} /> Clear
                </button>
              )}
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full overflow-hidden p-3 sm:p-4 bg-[#F8FAFC]">
        {isLoadingData ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400"><RefreshCw className="h-8 w-8 animate-spin mb-3 text-blue-500" /><p className="font-bold text-[10px] tracking-widest uppercase animate-pulse">Synchronizing Data...</p></div>
        ) : activeTab === 'dashboard' ? (
          
          <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Top Stat Cards - Compact View */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
              {[
                { label: 'Total Modules', val: metrics.total, color: 'blue', icon: BookOpen },
                { label: 'Module Updated', val: metrics.updatedCount, color: 'indigo', icon: FileEdit },
                { label: 'Unchanged', val: metrics.unchangedCount, color: 'slate', icon: CheckCircle2 },
                { label: 'Update Rate', val: `${metrics.updateRate}%`, color: 'sky', icon: Activity }
              ].map((card, i) => (
                <div key={i} className={`bg-white p-3 rounded-2xl border-l-4 border-l-${card.color}-500 border-y border-r border-slate-200 shadow-sm flex flex-col justify-between h-[64px] relative overflow-hidden group hover:shadow-md transition-all`}>
                  <div className="flex justify-between items-start z-10">
                    <h3 className={`text-[9px] font-black text-${card.color}-600 uppercase tracking-widest`}>{card.label}</h3>
                    <card.icon size={12} className={`text-${card.color}-500 opacity-60`} />
                  </div>
                  <div className="text-xl font-black text-slate-800 tracking-tighter leading-none z-10 mt-1">{card.val}</div>
                  <div className={`absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform`}><card.icon size={45} /></div>
                </div>
              ))}
            </div>

            {/* SBU Tracking Grid (Full Width, No Scroll Optimised) */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col min-h-0 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-500" size={14} />
                  <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">SBU / SFU Progress Tracking</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> UPDATED</span>
                </div>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {metrics.sbuSummary.map((sbu: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1.5 hover:border-blue-300 hover:shadow-md transition-all">
                      
                      {/* Header: SBU Name */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black text-slate-800 truncate block uppercase leading-tight" title={sbu.name}>{sbu.name}</span>
                        </div>
                      </div>
                      
                      {/* Detail: Total Modules & HRBP */}
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{sbu.total} Total</span>
                         <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Users size={8} /> {sbu.hrbp}</span>
                      </div>
                      
                      {/* Progress Details */}
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                          <span className="text-blue-600">Update: {sbu.updated}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex shadow-inner">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full" style={{ width: `${(sbu.updated / sbu.total) * 100}%` }}></div>
                        </div>
                      </div>

                    </div>
                  ))}
                  {metrics.sbuSummary.length === 0 && (
                    <div className="col-span-full text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">No data matching current filters.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        ) : activeTab === 'modules' ? (
          
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50/50 shrink-0">
                <div className="flex overflow-x-auto no-scrollbar flex-1 p-1">
                  {[
                    { id: 'all', label: 'Library', count: metrics.total, color: 'indigo' },
                    { id: 'updated', label: 'Updated', count: metrics.updatedCount, color: 'blue' }
                  ].map(v => (
                    <button key={v.id} onClick={() => setModuleView(v.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${moduleView === v.id ? `bg-white text-${v.color}-600 shadow-sm border border-slate-200` : 'text-slate-400 hover:text-slate-800'}`}>
                      {v.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full bg-${v.color}-50 text-${v.color}-600 text-[8px]`}>{v.count}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-slate-200 gap-2 shrink-0 bg-white md:bg-transparent">
                  <MultiSelectDropdown label="Status" options={[{id: 'all', label: 'All'},{id: 'updated', label: 'Updated'},{id: 'unchanged', label: 'Unchanged'}]} selectedValues={statusFilters} onToggle={(id: string) => handleToggleFilter(id, statusFilters, setStatusFilters)} />
                  <select value={sortOrder} onChange={(e: any) => setSortOrder(e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-[9px] font-black uppercase rounded-lg px-2 h-[32px] outline-none shadow-sm">
                    <option value="default">Default Sort</option>
                    <option value="az">A-Z Name</option>
                    <option value="za">Z-A Name</option>
                  </select>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 ml-1">
                    <button onClick={handleSaveToCloud} disabled={isSaving || !user} className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70" title="Sync Changes to Cloud">
                      {isSaving ? <RefreshCw size={11} className="animate-spin" /> : <Save size={11}/>} Sync
                    </button>
                    <button onClick={handleExportExcel} className="text-[9px] font-black text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95" title="Export Filtered Data to Excel">
                      <FileSpreadsheet size={12}/> Excel
                    </button>
                    <button onClick={handleExportTable} className="text-[9px] font-black text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-sm transition-all active:scale-95" title="Export Raw Data">
                      <Download size={11}/> TSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-5 py-3 w-12 text-center">NO</th>
                      <th className="px-5 py-3 min-w-[250px]">Nama Module</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Group SBU</th>
                      <th className="px-4 py-3 text-center">HRBP</th>
                      <th className="px-5 py-3 text-center">Akses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableData.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['No'] || row['NO']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, row['NO'] !== undefined ? 'NO' : 'No', val)}
                            className="text-center font-bold text-slate-400 justify-center"
                          />
                        </td>
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['Nama Module']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Nama Module', val)}
                            className="font-black text-slate-800 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5 flex flex-col items-center">
                          <EditableCell 
                            value={row['Status']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Status', val)}
                            className="text-center font-bold text-slate-600 uppercase mb-1 justify-center"
                          />
                          <StatusBadge status={row._normStatus} />
                        </td>
                        <td className="px-4 py-2.5">
                          <EditableCell 
                            value={row['Group SBU/SFU']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Group SBU/SFU', val)}
                            className="font-bold text-slate-500 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-[10px] font-black text-blue-600 uppercase text-center align-middle">
                          {row._hrbp || '-'}
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">NEW:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link Terbaru']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link Terbaru', val)}
                                  className="text-blue-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkNew ? <a href={row._linkNew} target="_blank" rel="noreferrer" className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white shrink-0"><ExternalLink size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><ExternalLink size={10} /></div>}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">OLD:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link File Lama']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link File Lama', val)}
                                  className="text-slate-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkOld ? <a href={row._linkOld} target="_blank" rel="noreferrer" className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-600 hover:text-white shrink-0"><History size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><History size={10} /></div>}
                            </div>
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
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {!isAuthorized ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center bg-slate-50/30 px-6">
                     <div className="bg-white p-5 rounded-2xl mb-4 border border-slate-200 shadow-sm"><Lock size={28} className="text-slate-400" /></div>
                     <h2 className="text-lg font-black text-slate-800 mb-1 tracking-tight">Access Management Locked</h2>
                     <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                     <div className="flex w-full max-w-xs gap-2">
                        <div className="relative flex-1">
                           <input type={showPassword ? 'text' : 'password'} value={passwordInput} onChange={(e: any) => setPasswordInput(e.target.value)} onKeyDown={(e: any) => { if(e.key === 'Enter') { if (passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); } }} placeholder="Enter Password..." className="w-full h-[38px] bg-white border border-slate-300 px-3 rounded-lg text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-8 shadow-inner" />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        </div>
                        <button onClick={() => { if(passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-[38px] rounded-lg text-[10px] font-black uppercase shadow-md transition-all active:scale-95">Unlock</button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-2.5">
                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><FileSpreadsheet size={16} /></div>
                         <div><h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">Global Data Source (TSV)</h2><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Raw Tab-Separated Values Engine</p></div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setIsAuthorized(false)} className="px-3 h-[32px] rounded-lg text-[9px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-colors">Lock</button>
                          <button onClick={handleSaveToCloud} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[32px] rounded-lg text-[9px] font-black uppercase shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95">{isSaving ? <RefreshCw className="animate-spin" size={11} /> : <Save size={11} />} {isSaving ? 'Syncing...' : 'Sync to Cloud'}</button>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-100/50 flex-1 flex min-h-0">
                      <textarea value={rawData} onChange={(e: any) => setRawData(e.target.value)} className="w-full h-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-[10px] leading-relaxed font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none custom-scrollbar whitespace-pre" spellCheck="false" placeholder="Paste your TSV data here..."></textarea>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
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
