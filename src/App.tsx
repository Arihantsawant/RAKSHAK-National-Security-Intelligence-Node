import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Map as MapIcon, 
  AlertTriangle, 
  BarChart3, 
  Activity, 
  Settings, 
  Users,
  Search,
  Bell,
  Cpu,
  Navigation,
  CheckCircle2,
  Lock,
  ChevronRight,
  Info,
  UserPlus,
  Trash2,
  Check,
  Video,
  Plus,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';

import SurveillanceMap from './components/SurveillanceMap';
import { POLICE_RANKS, INDIAN_STATES, RankInfo, STATE_DISTRICTS, COMMON_POLICE_STATIONS } from './constants';

// --- Types ---
interface RakshakNotification {
  id: string;
  type: 'THREAT' | 'INTERCEPTION' | 'SYSTEM' | 'ACCESS';
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
}

interface User {
  email: string;
  role: 'SUPER_ADMIN' | 'OFFICER';
  name: string;
  jurisdiction: string;
  rank?: string;
  state?: string;
  district?: string;
  village?: string;
  id?: string;
}

interface Detection {
  id: string;
  vehicle_number: string;
  confidence: number;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
  image?: string;
  jurisdiction?: string;
  threatLevel?: 'Green' | 'Yellow' | 'Orange' | 'Red';
  crime?: string;
  score?: number;
  isIntercepted?: boolean;
}

// --- Mock Components ---

const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'RECOVERY'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPin, setRecoveryPin] = useState('');
  const [name, setName] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>(POLICE_RANKS[0].rank);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [customVillage, setCustomVillage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset selections when rank level changes
    setDistrict('');
    setVillage('');
    setCustomVillage('');
  }, [selectedRank]);

  const getRankLevel = (rank: string) => {
    return POLICE_RANKS.find(r => r.rank === rank)?.level || 'STATION';
  };

  const rankLevel = getRankLevel(selectedRank);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'RECOVERY') {
        if (!email || !recoveryPin || !password) throw new Error("Email, PIN, and New Password are required.");
        
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            recoveryPin, 
            newPassword: password 
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMode('LOGIN');
        setPassword('');
        setRecoveryPin('');
        setError(data.message);
        return;
      }

        const finalVillage = village === 'CUSTOM' ? customVillage : village;
        const jurisdictionData = mode === 'REGISTER' 
          ? (rankLevel === 'STATE' ? selectedState : rankLevel === 'DISTRICT' ? district : (finalVillage ? `${finalVillage}, ${district}` : district || selectedState))
          : undefined;

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password,
            recoveryPin: mode === 'REGISTER' ? recoveryPin : undefined,
            isRegistering: mode === 'REGISTER', 
            name: mode === 'REGISTER' ? name : undefined,
            jurisdiction: jurisdictionData,
            rank: mode === 'REGISTER' ? selectedRank : undefined,
            state: mode === 'REGISTER' ? selectedState : undefined,
            district: mode === 'REGISTER' ? district : undefined,
            village: mode === 'REGISTER' ? finalVillage : undefined,
            jurisdictionLevel: mode === 'REGISTER' ? rankLevel : undefined
          })
        });
      
      const contentType = res.headers.get("content-type");
      let data: any;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response received:", text);
        throw new Error(`AUTHENTICATION SERVICE ERROR (${res.status}): The secure gateway returned an unexpected response. Please try again in a few moments.`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Identity Verification Failed');
      }
      
      if (mode === 'REGISTER') {
        setMode('LOGIN');
        setPassword('');
        setRecoveryPin('');
        setError(data.message || "REGISTRATION REQUEST TRANSMITTED.");
        return;
      }

      onLogin(data);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('SECURE GATEWAY OFFLINE: The encryption server is initializing or unreachable. Please wait 5 seconds and retry.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-rakshak-ink items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-6 h-full w-full">
           {[...Array(36)].map((_, i) => <div key={i} className="border border-white/20" />)}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white p-8 shadow-2xl relative overflow-hidden">
          {/* Official Seal / Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none translate-x-12 -translate-y-12">
            <Shield size={128} />
          </div>

          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rakshak-ink">
                <Shield size={32} className="text-rakshak-accent" />
                <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">RAKSHAK</h1>
              </div>
              <p className="text-[10px] font-mono font-bold text-rakshak-ink/50 uppercase tracking-[0.3em]">Surveillance Division Core</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-12" />
          </div>

          {/* Tab Selection */}
          <div className="flex border-2 border-rakshak-line mb-8 bg-rakshak-bg p-1">
             {(['LOGIN', 'REGISTER', 'RECOVERY'] as const).map(m => (
               <button
                 key={m}
                 type="button"
                 id={`tab-${m.toLowerCase()}`}
                 onClick={() => { setMode(m); setError(''); setPassword(''); setRecoveryPin(''); }}
                 className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${mode === m ? 'bg-rakshak-ink text-white' : 'text-rakshak-ink/40 hover:text-rakshak-ink'}`}
               >
                 {m === 'RECOVERY' ? 'Reset Account' : m}
               </button>
             ))}
          </div>

          <div className="space-y-2 border-l-4 border-rakshak-accent pl-4 mb-8">
             <h2 className="text-sm font-bold uppercase tracking-tight text-rakshak-ink">
               {mode === 'LOGIN' && 'AUTHORIZED PERSONNEL ACCESS'}
               {mode === 'REGISTER' && 'SERVICE RECRUITMENT PROTOCOL'}
               {mode === 'RECOVERY' && 'IDENTITY RESTORATION (FORGOT PASSWORD)'}
             </h2>
             <p className="text-[9px] font-mono text-rakshak-ink/60 uppercase">
               {mode === 'LOGIN' && 'System entry requires multi-factor clearance validation.'}
               {mode === 'REGISTER' && 'Submission of official credentials for HQ background scrub.'}
               {mode === 'RECOVERY' && 'Identity restoration using 4-digit security PIN.'}
             </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Operational ID Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@police.gov.in"
                    required
                    className="w-full bg-rakshak-bg border-b-2 border-rakshak-line p-4 pr-12 font-mono text-sm outline-none focus:border-rakshak-ink transition-all font-semibold"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-rakshak-ink/20" size={18} />
                </div>
              </div>

              {(mode === 'REGISTER' || mode === 'RECOVERY') && (
                <div className="space-y-1.5 slide-in">
                  <label className="text-[9px] font-bold uppercase font-mono text-rakshak-accent">Pre-Shared 4-Digit Security PIN</label>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={recoveryPin}
                    onChange={(e) => setRecoveryPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="E.G. 1234"
                    required
                    className="w-full bg-rakshak-bg border-b-2 border-rakshak-accent/30 p-4 font-mono text-sm outline-none focus:border-rakshak-accent transition-all font-semibold"
                  />
                  <p className="text-[8px] font-mono text-rakshak-ink/40 uppercase">Essential for future identify restoration.</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">
                  {mode === 'RECOVERY' ? 'Establish New Access Key' : 'Secret Access Key'}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-rakshak-bg border-b-2 border-rakshak-line p-4 font-mono text-sm outline-none focus:border-rakshak-ink transition-all font-semibold"
                />
                {mode === 'LOGIN' && (
                  <div className="flex justify-end mt-1">
                    <button 
                      type="button"
                      onClick={() => setMode('RECOVERY')}
                      className="text-[9px] font-bold uppercase text-rakshak-ink/40 hover:text-rakshak-accent transition-colors"
                    >
                      Forgot access key?
                    </button>
                  </div>
                )}
              </div>
            </div>

            {mode === 'REGISTER' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-rakshak-ink/[0.02] p-5 border border-rakshak-line">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Assigned Rank / Designation</label>
                  <select 
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="w-full bg-white border-b-2 border-rakshak-line p-3 font-mono text-xs outline-none focus:border-rakshak-ink transition-all font-bold appearance-none cursor-pointer"
                  >
                    {POLICE_RANKS.map(r => <option key={r.rank} value={r.rank}>{r.rank}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Deployment State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setDistrict('');
                      setVillage('');
                      setCustomVillage('');
                    }}
                    className="w-full bg-white border-b-2 border-rakshak-line p-3 font-mono text-xs outline-none focus:border-rakshak-ink transition-all font-bold appearance-none cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                {['DISTRICT', 'SUBDIVISION', 'CIRCLE', 'STATION'].includes(rankLevel) && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Assigned District</label>
                    <select 
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setVillage(''); // Reset village when district changes
                      }}
                      required
                      className="w-full bg-white border-b-2 border-rakshak-line p-3 font-mono text-xs outline-none focus:border-rakshak-ink transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="">Select District</option>
                      {(STATE_DISTRICTS[selectedState] || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                {['CIRCLE', 'STATION'].includes(rankLevel) && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Station Area / Village</label>
                    <div className="relative">
                      <div className="space-y-2">
                        <select 
                          value={village}
                          onChange={(e) => {
                            setVillage(e.target.value);
                            if (e.target.value !== 'CUSTOM') setCustomVillage('');
                          }}
                          required
                          className="w-full bg-white border-b-2 border-rakshak-line p-3 font-mono text-xs outline-none focus:border-rakshak-ink transition-all font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Select Station Area</option>
                          {(COMMON_POLICE_STATIONS[district] || []).map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                          <option value="CUSTOM">-- Manual Entry / Other --</option>
                        </select>
                        {village === 'CUSTOM' && (
                          <input 
                            type="text" 
                            autoFocus
                            value={customVillage}
                            placeholder="Enter manual station/village name"
                            onChange={(e) => setCustomVillage(e.target.value.toUpperCase())}
                            className="w-full bg-rakshak-bg border-b-2 border-rakshak-accent p-3 font-mono text-xs outline-none font-bold placeholder:opacity-30"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink opacity-50">Official Identity (Full Name)</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Full Name"
                    required
                    className="w-full bg-white border-b-2 border-rakshak-line p-3 font-mono text-xs outline-none focus:border-rakshak-ink transition-all"
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <div className={`p-4 text-[9px] font-bold uppercase tracking-wider leading-relaxed border flex items-center gap-3 ${error.includes('REQUEST') || error.includes('SUCCESSFUL') ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-rakshak-ink text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-rakshak-accent transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'INITIALIZING PROTOCOL...' : (
                <>
                  {mode === 'LOGIN' && 'Authorize Link'}
                  {mode === 'REGISTER' && 'Deploy Request'}
                  {mode === 'RECOVERY' && 'Apply Overwrite'}
                </>
              )}
            </button>
          </form>
           
          <div className="mt-8 pt-6 border-t border-rakshak-line text-center">
            {mode === 'LOGIN' && (
              <div className="mb-4 p-3 bg-rakshak-bg border border-rakshak-line text-left">
                <p className="text-[10px] font-bold text-rakshak-ink/60 uppercase mb-1">Official Gate Access:</p>
                <code className="text-[9px] block font-mono text-rakshak-accent">ID: hq.admin@police.gov.in</code>
                <code className="text-[9px] block font-mono text-rakshak-accent">Key: rakshak_HQ_2024!</code>
                <code className="text-[9px] block font-mono text-rakshak-accent mt-1">Recovery: 9988</code>
              </div>
            )}
            <p className="text-[8px] font-mono font-bold uppercase tracking-widest text-rakshak-ink/30">
              Digital India Initiative • Secure Asset Network • v4.4.0-SECURITY-PATCH
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NodeManagement = ({ user }: { user: any }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', type: 'RTSP' });

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const r = await fetch('/api/nodes');
        const data = await r.json();
        setNodes(data);
      } catch (err) {
        console.error("VMS Sync Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchNodes();
  }, []);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/nodes/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, jurisdiction: user.jurisdiction })
    });
    if (res.ok) {
      const { node } = await res.json();
      setNodes([...nodes, node]);
      setShowAdd(false);
      setFormData({ name: '', url: '', type: 'RTSP' });
    }
  };

  const removeNode = async (id: string) => {
    await fetch('/api/nodes/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId: id })
    });
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-rakshak-ink">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">Video Management System</h2>
          <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Operational Integration Hub for Regional Surveillance Nodes</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-rakshak-ink text-white px-4 py-3 text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-rakshak-accent transition-colors shadow-lg"
        >
          <Plus size={14} /> Link Hardware Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div 
            key={node.id} 
            onClick={() => setSelectedNode(node)}
            className="bg-white border-b-2 border-rakshak-ink/10 p-5 shadow-sm group cursor-pointer hover:border-rakshak-accent transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-rakshak-accent/5 -rotate-45 translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 tracking-wider">LIVE / {node.type}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }} 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 p-1 hover:bg-red-50 rounded z-10"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <h3 className="text-sm font-bold truncate uppercase text-rakshak-ink">{node.name}</h3>
            <p className="text-[10px] font-mono opacity-50 truncate mt-1">{node.url}</p>
            <div className="mt-8 pt-4 border-t border-rakshak-line flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold uppercase opacity-40">{node.id}</span>
              <div className="flex items-center gap-2">
                 <Camera size={12} className="text-rakshak-ink/40" />
                 <span className="text-[9px] font-bold uppercase text-rakshak-ink/40">Hardware Link Verified</span>
              </div>
            </div>
          </div>
        ))}
        {nodes.length === 0 && !loading && (
          <div className="col-span-full border-2 border-dashed border-rakshak-line p-16 text-center bg-white/50">
            <Video size={48} className="mx-auto opacity-10 mb-4" />
            <p className="text-xs font-bold uppercase text-rakshak-ink/40 tracking-widest">No Intelligence Nodes Synced</p>
            <p className="text-[10px] font-mono opacity-40 mt-2 max-w-xs mx-auto leading-relaxed">Connect IP Cameras or NVR Hubs to start real-time interception and scan protocol across this sector.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-rakshak-ink/90 z-[3000] flex items-center justify-center p-6 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-rakshak-accent pl-4">
              <Shield size={24} className="text-rakshak-accent" />
              <div>
                <h3 className="text-lg font-bold uppercase text-rakshak-ink">Hardware Registration</h3>
                <p className="text-[10px] font-mono opacity-50 uppercase mt-0.5">Authorize official surveillance stream</p>
              </div>
            </div>
            
            <form onSubmit={handleAddNode} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink/60">Operational Node Name</label>
                <input 
                  required
                  placeholder="e.g. NH-48 Entry Point Mumbai"
                  className="w-full bg-rakshak-bg border-b-2 border-rakshak-line p-4 font-mono text-xs outline-none focus:border-rakshak-ink font-semibold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase font-mono text-rakshak-ink/60">Network Protocol / Stream Path</label>
                <input 
                  required
                  placeholder="rtsp://admin:password@10.0.1.25:554"
                  className="w-full bg-rakshak-bg border-b-2 border-rakshak-line p-4 font-mono text-xs outline-none focus:border-rakshak-ink font-semibold"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)} 
                  className="flex-1 border-2 border-rakshak-line py-4 text-[10px] font-bold uppercase hover:bg-rakshak-line transition-colors"
                >
                  Terminate
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-rakshak-ink text-white py-4 text-[10px] font-bold uppercase hover:bg-rakshak-accent transition-all shadow-lg active:scale-95"
                >
                  Authorize Link
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {selectedNode && (
        <div className="fixed inset-0 bg-rakshak-ink/95 z-[3005] flex items-center justify-center p-6 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black max-w-5xl w-full aspect-video shadow-2xl relative border-2 border-rakshak-line/30 group"
          >
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                 <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                 <div>
                   <h3 className="text-white font-bold uppercase tracking-widest text-sm">{selectedNode.name}</h3>
                   <p className="text-[10px] text-white/40 font-mono mt-0.5">ENCRYPTED FEED // {selectedNode.url}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center bg-zinc-900 overflow-hidden">
               <ReactPlayer
                 // @ts-ignore
                 url={selectedNode.url.startsWith('rtsp') ? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' : selectedNode.url}
                 playing
                 controls
                 width="100%"
                 height="100%"
                 style={{ objectFit: 'cover' }}
                 onError={() => {
                   console.log("Stream failed, showing backup feed");
                 }}
               />
               
               {/* Overlaying surveillance metadata */}
               <div className="absolute inset-0 pointer-events-none border border-rakshak-accent/20">
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-8 opacity-40">
                     <div className="w-1 h-32 bg-white/20 flex flex-col justify-end"><div className="h-2/3 bg-rakshak-accent animate-pulse"></div></div>
                     <div className="w-1 h-32 bg-white/20 flex flex-col justify-end"><div className="h-1/3 bg-rakshak-accent animate-pulse delay-75"></div></div>
                  </div>
                  <div className="absolute top-10 right-10 text-rakshak-accent/60 font-mono text-[10px] text-right space-y-1">
                    <p>SCAN_RECOGNITION: ACTIVE</p>
                    <p>LATENCY: 42MS</p>
                    <p>DECODER: REALTIME_V2</p>
                  </div>
               </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex gap-8 text-white/60 font-mono text-[9px] uppercase">
                 <div className="flex flex-col">
                   <span className="opacity-40">Grid Ref</span>
                   <span className="font-bold">19.0760° N, 72.8777° E</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="opacity-40">Operational Status</span>
                   <span className="font-bold text-emerald-400">NOMINAL_LINK</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-rakshak-accent/20 border border-rakshak-accent/50">
                 <span className="text-[9px] font-bold text-rakshak-accent uppercase tracking-[0.2em]">Live Intercept Relay</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ModuleDetail = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="bg-white border border-rakshak-line p-6">
    <h3 className="text-rakshak-ink font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter text-sm">
      <ChevronRight size={14} />
      {title}
    </h3>
    <div className="text-[12px] text-rakshak-ink/80 space-y-3 leading-snug">
      {content}
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    id={`sidebar-item-${label.toLowerCase()}`}
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 ${
      active 
        ? 'bg-rakshak-ink text-white shadow-lg z-10' 
        : 'text-rakshak-ink/60 hover:bg-rakshak-ink/5 hover:text-rakshak-ink'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={16} />
      <span className="font-semibold text-xs tracking-wide uppercase">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
  </button>
);

const GovHeader = ({ user, onShowProfile }: { user?: User | null, onShowProfile?: () => void }) => (
  <div className="bg-white border-b border-rakshak-line">
    <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="p-2 bg-rakshak-ink rounded shadow-inner">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-rakshak-ink uppercase leading-none">RAKSHAK Protocol V4.2</h1>
          <p className="text-[10px] font-mono text-rakshak-ink/40 uppercase mt-1 tracking-widest font-semibold">National Security & Intelligence Network • Govt. of India</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {user && (
          <button 
            onClick={() => onShowProfile?.()}
            className="hidden md:flex flex-col items-end border-r border-rakshak-line pr-8 group"
          >
            <span className="text-[10px] font-mono font-bold text-rakshak-ink/40 uppercase group-hover:text-rakshak-accent transition-colors">Logged as {user.rank || 'Personnel'}</span>
            <span className="text-xs font-bold text-rakshak-ink uppercase group-hover:text-rakshak-accent transition-colors">{user.name === 'Admin' ? 'HQ ADMIN' : user.name}</span>
          </button>
        )}
        <div className="hidden lg:flex flex-col items-end border-r border-rakshak-line pr-8">
          <span className="text-[10px] font-mono font-bold text-rakshak-ink/40 uppercase">Global Node Status</span>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 leading-none mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            ACTIVE / SYNCED
          </span>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-10 opacity-90" />
      </div>
    </div>
  </div>
);

const MetricCard = ({ label, value, icon: Icon, trend, color }: { label: string, value: string, icon: any, trend?: string, color: string }) => (
  <div id={`metric-${label.toLowerCase().replace(' ', '-')}`} className="bg-white border-b-2 border-rakshak-ink/10 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="text-[10px] uppercase font-bold text-rakshak-ink/40 tracking-widest mb-2">{label}</div>
    <div className="text-3xl font-bold text-rakshak-ink font-mono tracking-tighter mb-4">{value}</div>
    <div className="flex justify-between items-center relative z-10">
      <div className={`p-1.5 bg-rakshak-ink text-white rounded-sm`}>
        <Icon size={14} />
      </div>
      {trend && <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
    </div>
  </div>
);

const ThreatBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    Red: 'text-rakshak-accent border-rakshak-accent',
    Orange: 'text-[#E65100] border-[#E65100]',
    Yellow: 'text-[#EAB308] border-[#EAB308]',
    Green: 'text-emerald-700 border-emerald-700 opacity-30',
  };
  return (
    <span className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-tighter ${styles[level] || styles.Green}`}>
      {level}
    </span>
  );
};

const DatabaseView = ({ admin }: { admin: User }) => {
  const [db, setDb] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ plate: '', crime: '', severity: '50', jurisdiction: admin.jurisdiction });

  const fetchDb = async () => {
    const res = await fetch('/api/criminal-db');
    setDb(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchDb(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/criminal-db/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    if (res.ok) {
      fetchDb();
      setShowAdd(false);
      setNewEntry({ plate: '', crime: '', severity: '50', jurisdiction: admin.jurisdiction });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif italic font-bold">Watchlist Registry</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-rakshak-ink text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-rakshak-accent transition-all"
        >
          {showAdd ? 'Close Entry' : 'Add New Target'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white border-2 border-rakshak-line p-6 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-50">Vehicle Plate</label>
            <input 
              value={newEntry.plate}
              onChange={e => setNewEntry({...newEntry, plate: e.target.value.toUpperCase()})}
              placeholder="MH12AB..."
              required
              className="w-full bg-rakshak-panel border border-rakshak-line p-2 font-mono text-xs uppercase"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-50">Crime / Warrant</label>
            <input 
              value={newEntry.crime}
              onChange={e => setNewEntry({...newEntry, crime: e.target.value})}
              placeholder="e.g. Stolen Vehicle"
              required
              className="w-full bg-rakshak-panel border border-rakshak-line p-2 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-50">Severity (1-100)</label>
            <input 
              type="number"
              value={newEntry.severity}
              onChange={e => setNewEntry({...newEntry, severity: e.target.value})}
              min="1" max="100"
              required
              className="w-full bg-rakshak-panel border border-rakshak-line p-2 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase opacity-50">Jurisdiction</label>
            <input 
              value={newEntry.jurisdiction}
              onChange={e => setNewEntry({...newEntry, jurisdiction: e.target.value})}
              required
              className="w-full bg-rakshak-panel border border-rakshak-line p-2 font-mono text-xs"
            />
          </div>
          <button type="submit" className="col-span-2 bg-rakshak-ink text-white py-3 text-[11px] font-bold uppercase tracking-[0.2em]">Commit to Secure Database</button>
        </form>
      )}

      <div className="bg-white border border-rakshak-line overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_120px_100px_100px] bg-rakshak-ink/5 p-3 font-mono text-[10px] uppercase font-bold opacity-50 border-b border-rakshak-line">
          <div>Plate ID</div>
          <div>Associated Warrant</div>
          <div>Jurisdiction</div>
          <div>Severity</div>
          <div>Status</div>
        </div>
        <div className="divide-y divide-rakshak-line">
          {db.map(r => (
            <div key={r.plate} className="grid grid-cols-[120px_1fr_120px_100px_100px] p-3 font-mono text-[11px] items-center">
              <div className="font-bold">{r.plate}</div>
              <div className="uppercase opacity-70 truncate pr-4">{r.crime}</div>
              <div className="uppercase opacity-70 italic font-serif text-[10px]">{r.jurisdiction}</div>
              <div className="font-bold text-rakshak-accent">{r.severity}</div>
              <div><ThreatBadge level={r.severity > 80 ? 'Red' : r.severity > 50 ? 'Orange' : 'Yellow'} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PersonnelView = ({ admin }: { admin: User }) => {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/personnel/pending');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setPending(data);
      } else {
        setPending([]);
      }
    } catch (err) {
      console.error(err);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (targetEmail: string, action: 'APPROVE' | 'REJECT') => {
    let reason = '';
    if (action === 'REJECT') {
      const input = window.prompt("Enter rejection reason (required):", "Verification of official records failed.");
      if (input === null) return; // Cancelled
      reason = input;
    }

    try {
      const res = await fetch('/api/personnel/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail, action, reason })
      });
      if (res.ok) {
        setPending(prev => prev.filter(p => p.email !== targetEmail));
      }
    } catch (err) {
      alert("Action failed.");
    }
  };

  return (
    <div className="bg-white border border-rakshak-line overflow-hidden">
      <div className="p-4 border-b border-rakshak-line flex justify-between items-center bg-rakshak-panel">
        <h2 className="text-xs font-bold uppercase font-mono tracking-widest flex items-center gap-2">
          <UserPlus size={14} /> Personnel Verification Queue
        </h2>
        <span className="text-[10px] font-mono opacity-50 uppercase">Scope: {admin.jurisdiction} HQ</span>
      </div>
      <div className="divide-y divide-rakshak-line">
        <div className="grid grid-cols-[1fr_200px_150px_120px] p-3 bg-rakshak-ink/5 font-mono text-[10px] uppercase font-bold opacity-50">
          <div>Personnel Name & ID</div>
          <div>Official Email</div>
          <div>Jurisdiction</div>
          <div>Actions</div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-[11px] font-mono opacity-50 italic">Retrieving secure records...</div>
        ) : pending.length === 0 ? (
          <div className="p-10 text-center text-[11px] font-mono opacity-50 uppercase tracking-widest italic">No pending applications in this zone</div>
        ) : pending.map((p) => (
          <div key={p.email} className="grid grid-cols-[1fr_200px_150px_120px] p-4 items-center font-mono text-[11px]">
            <div>
              <div className="font-bold">{p.name}</div>
              <div className="opacity-50 text-[10px]">{p.id}</div>
            </div>
            <div className="opacity-70">{p.email}</div>
            <div className="uppercase opacity-70 italic font-serif">{p.jurisdiction}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(p.email, 'APPROVE')}
                className="bg-emerald-600 text-white p-2 hover:bg-emerald-700 transition-colors"
                title="Approve Personnel"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => handleAction(p.email, 'REJECT')}
                className="bg-rakshak-accent text-white p-2 hover:bg-rakshak-accent/80 transition-colors"
                title="Reject Personnel"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileModal = ({ user, onClose, onLogout }: { user: User, onClose: () => void, onLogout: () => void }) => (
  <div className="fixed inset-0 bg-rakshak-ink/90 z-[5000] flex items-center justify-center p-6 backdrop-blur-md">
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white max-w-md w-full shadow-2xl relative overflow-hidden">
      <div className="bg-rakshak-ink p-8 text-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none translate-x-12 -translate-y-12">
          <Shield size={128} />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Users size={32} />
          </div>
          <div>
                  <h2 className="text-xl font-bold uppercase tracking-tight">{user.name === 'Admin' ? 'HQ Administrator' : user.name}</h2>
                  <p className="text-[10px] font-mono opacity-50 uppercase tracking-[0.2em]">{user.rank || user.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase opacity-40">Personnel ID</p>
                  <p className="text-[11px] font-mono">{user.id || 'GATEWAY-AUTH'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase opacity-40">Assigned Area</p>
                  <p className="text-[11px] font-mono">{user.jurisdiction}</p>
                </div>
              </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="border-b border-rakshak-line pb-4">
            <h3 className="text-[10px] font-bold uppercase text-rakshak-ink/60 mb-2">Personnel Metadata</h3>
            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-[11px]">
                <span className="opacity-50 uppercase">Email</span>
                <span className="font-bold">{user.email}</span>
              </div>
              {user.rank && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-50 uppercase">Rank</span>
                  <span className="font-bold">{user.rank}</span>
                </div>
              )}
              {user.state && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-50 uppercase">Current State</span>
                  <span className="font-bold">{user.state}</span>
                </div>
              )}
              {user.district && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-50 uppercase">Posting District</span>
                  <span className="font-bold">{user.district}</span>
                </div>
              )}
              {user.village && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-50 uppercase">Beat Area</span>
                  <span className="font-bold">{user.village}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 border-2 border-rakshak-line py-4 text-[10px] font-bold uppercase hover:bg-rakshak-line transition-colors"
          >
            Return
          </button>
          <button 
            onClick={onLogout}
            className="flex-1 bg-rakshak-accent text-white py-4 text-[10px] font-bold uppercase hover:opacity-90 transition-all font-mono"
          >
            Log Out
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const NotificationHub = ({ notifications, onDismiss }: { notifications: RakshakNotification[], onDismiss: (id: string) => void }) => (
  <div className="fixed top-8 right-8 z-[6000] flex flex-col gap-3 w-80 pointer-events-none">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className={`pointer-events-auto border-l-4 p-4 shadow-2xl relative overflow-hidden bg-white ${
            n.severity === 'CRITICAL' ? 'border-rakshak-accent' : 
            n.severity === 'WARNING' ? 'border-amber-500' : 'border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <h4 className={`text-[10px] font-bold uppercase tracking-widest ${
              n.severity === 'CRITICAL' ? 'text-rakshak-accent' : 'text-rakshak-ink'
            }`}>
              {n.title}
            </h4>
            <button onClick={() => onDismiss(n.id)} className="opacity-20 hover:opacity-100">
              <Plus size={14} className="rotate-45" />
            </button>
          </div>
          <p className="text-[11px] font-mono leading-tight text-rakshak-ink opacity-80">{n.message}</p>
          <div className="mt-2 flex justify-between items-center opacity-40">
            <span className="text-[8px] font-mono uppercase">{n.type} PROTOCOL</span>
            <span className="text-[8px] font-mono uppercase">{n.timestamp}</span>
          </div>
          {n.severity === 'CRITICAL' && (
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-rakshak-accent"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [historyOffset, setHistoryOffset] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState<any>({ 
    total_scanned: 0, 
    alerts_issued: 0, 
    interceptions: 0, 
    active_threats: 0,
    active_nodes: 0,
    node_latency: 'Inactive'
  });
  const [loading, setLoading] = useState(true);
  const [rakshakNotifications, setRakshakNotifications] = useState<RakshakNotification[]>([]);
  const notifiedThreats = useRef<Set<string>>(new Set());

  // Session Recovery
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401 || res.status === 403) {
          console.warn("Session reference rejected by secure gateway.");
          setUser(null);
        }
      } catch (err) {
        console.log("No active session found.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    recoverSession();
  }, []);

  const addRakshakNotification = (title: string, message: string, severity: 'CRITICAL' | 'WARNING' | 'INFO', type: 'THREAT' | 'INTERCEPTION' | 'SYSTEM' | 'ACCESS' = 'SYSTEM') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif: RakshakNotification = {
      id,
      type,
      title,
      message,
      severity,
      timestamp: new Date().toLocaleTimeString([], { hour12: false })
    };
    setRakshakNotifications(prev => [newNotif, ...prev].slice(0, 5));
    
    setTimeout(() => {
      setRakshakNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [statsRes, detectionsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch(`/api/live-stream?minutesAgo=${historyOffset}`)
        ]);
        
        if (!statsRes.ok || !detectionsRes.ok) {
          if (statsRes.status === 401 || detectionsRes.status === 401) {
            console.warn("Session expired or invalid. Redirecting to login.");
            setUser(null);
            return;
          }
          throw new Error("SECURE GATEWAY DISCONNECTED");
        }

        const statsData = await statsRes.json();
        const detectionsData = await detectionsRes.json();
        
        if (!Array.isArray(detectionsData)) {
          console.error("Detections stream received malformed data:", detectionsData);
          return;
        }

        // Refine filtering: Backend handles most, but we ensure frontend matches policy strictly
        const filtered = (user.role === 'SUPER_ADMIN' || user.jurisdiction === 'National') 
          ? detectionsData 
          : detectionsData.filter((d: any) => d.jurisdiction === user.jurisdiction);

        setStats(statsData);

        const enriched = await Promise.all(filtered.map(async (d: Detection) => {
          const threatRes = await fetch('/api/assess-threat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plate: d.vehicle_number, confidence: d.confidence })
          });
          const threatData = await threatRes.json();
          const enrichedDetection = { ...d, threatLevel: threatData.level, crime: threatData.crime, score: threatData.score, isIntercepted: threatData.isIntercepted };
          
          // Real-time notification for high severity threats
          if (enrichedDetection.threatLevel === 'Red' && !notifiedThreats.current.has(enrichedDetection.id)) {
            addRakshakNotification(
              "PRIORITY 1 THREAT DETECTED",
              `${enrichedDetection.vehicle_number} matched watchlist: ${enrichedDetection.crime}. Location: ${enrichedDetection.location}`,
              "CRITICAL",
              "THREAT"
            );
            notifiedThreats.current.add(enrichedDetection.id);
          }

          return enrichedDetection;
        }));
        
        setDetections(enriched);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [user, historyOffset]);

  const deployInterception = async (plate: string, detectionId: string) => {
    try {
      const res = await fetch('/api/interception/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate, detectionId })
      });
      
      if (res.ok) {
        addRakshakNotification(
          "INTERCEPTION AUTHORIZED",
          `Tactical deployment for vehicle ${plate} initiated in sector ${user.jurisdiction}.`,
          "WARNING",
          "INTERCEPTION"
        );
        // Refresh data
        const statsRes = await fetch('/api/stats');
        setStats(await statsRes.json());
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Deployment failed. Check connection.");
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setShowProfile(false);
  };

  if (loading && !user) {
    return (
      <div className="h-screen bg-rakshak-ink flex items-center justify-center font-mono">
        <div className="space-y-4 text-center">
          <Shield className="text-white mx-auto animate-pulse" size={48} />
          <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Establishing Secure Link...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div className="flex h-screen bg-rakshak-bg text-rakshak-ink font-sans selection:bg-rakshak-accent/30 overflow-hidden">
      <NotificationHub notifications={rakshakNotifications} onDismiss={(id) => setRakshakNotifications(prev => prev.filter(n => n.id !== id))} />
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}
      {/* Sidebar - Compact and Professional */}
      <aside className="w-64 border-r border-rakshak-line flex flex-col bg-white shrink-0 shadow-sm z-20">
        <div className="p-6 border-b border-rakshak-line bg-rakshak-panel/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rakshak-accent animate-ping"></div>
            <span className="text-[10px] font-bold font-mono text-rakshak-accent">LIVE FEED ACTIVE</span>
          </div>
          <h2 className="text-xl font-bold tracking-tighter text-rakshak-ink">CONTROL_HQ</h2>
        </div>

        <nav className="flex-1 py-4">
          <SidebarItem icon={Activity} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <SidebarItem icon={Video} label="VMS Nodes" active={activeTab === 'Nodes'} onClick={() => setActiveTab('Nodes')} />
          <SidebarItem icon={MapIcon} label="GIS Surveillance" active={activeTab === 'Map'} onClick={() => { setActiveTab('Map'); setHistoryOffset(0); }} />
          <SidebarItem icon={AlertTriangle} label="High-Risk Targets" active={activeTab === 'Threats'} onClick={() => setActiveTab('Threats')} />
          <SidebarItem icon={BarChart3} label="Network Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <SidebarItem icon={Shield} label="Criminal Registry" active={activeTab === 'Database'} onClick={() => setActiveTab('Database')} />
          {(user.role === 'SUPER_ADMIN' || user.jurisdiction !== 'National') && (
            <SidebarItem icon={Users} label="Personnel Registry" active={activeTab === 'Personnel'} onClick={() => setActiveTab('Personnel')} />
          )}
        </nav>

        <div className="p-6 bg-rakshak-panel/50 border-t border-rakshak-line mt-auto">
          <button 
            onClick={() => setShowProfile(true)}
            className="w-full text-left mb-4 group"
          >
            <p className="text-[10px] font-mono text-rakshak-ink/40 font-bold uppercase mb-1 group-hover:text-rakshak-accent transition-colors">Operator Profile</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-rakshak-ink text-white flex items-center justify-center text-[10px] font-bold group-hover:bg-rakshak-accent transition-colors">
                {user.name === 'Admin' ? 'HQ' : user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate uppercase group-hover:text-rakshak-accent transition-colors">{user.name === 'Admin' ? 'HQ Administrator' : user.name}</p>
                <p className="text-[9px] font-mono text-rakshak-ink/60 uppercase italic leading-none">{user.id}</p>
              </div>
            </div>
          </button>
          <button 
            id="secure-exit-btn"
            onClick={handleLogout}
            className="w-full bg-rakshak-ink/5 border border-rakshak-line py-2 text-[10px] font-bold uppercase hover:bg-rakshak-accent hover:text-white hover:border-rakshak-accent transition-all flex items-center justify-center gap-2"
          >
            <Lock size={12} /> Secure Exit
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <GovHeader user={user} onShowProfile={() => setShowProfile(true)} />
        
        {/* Sub-header / Status Bar */}
        <div className="bg-white px-8 py-2 border-b border-rakshak-line flex items-center justify-between text-[10px] font-bold font-mono uppercase tracking-widest text-rakshak-ink/50">
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <Activity size={12} className="text-emerald-600" />
              Intelligence Throughput: <span className="text-rakshak-ink">Optimal</span>
            </span>
            <span className="flex items-center gap-2">
              <Cpu size={12} className="text-blue-600" />
              Node Latency: <span className="text-rakshak-ink">14ms (Primary Gateway)</span>
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="animate-pulse">●</span> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString()}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8 technical-grid custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard label="Intelligence Throughput" value={stats.total_scanned.toLocaleString()} icon={Activity} color="blue" trend="+2.4% / Sec" />
                  <MetricCard label="Validated Threats" value={stats.active_threats.toString().padStart(2, '0')} icon={Shield} color="orange" />
                  <MetricCard label="Active VMS Nodes" value={stats.active_nodes?.toString() || "0"} icon={Video} color="emerald" />
                  <MetricCard label="Network Latency" value={stats.node_latency || "Inactive"} icon={Cpu} color="purple" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column: Recent Alerts */}
                  <div className="xl:col-span-2">
                    <div className="bg-white border border-rakshak-line overflow-hidden">
                      <div className="p-3 bg-rakshak-ink text-white flex items-center justify-between font-serif italic text-xs">
                        <span>Real-Time Intelligence Feed</span>
                        <span className="font-mono text-[10px] non-italic">SYNCED 100%</span>
                      </div>
                      <div className="divide-y divide-rakshak-line">
                        <div className="grid grid-cols-[80px_140px_100px_1fr] bg-rakshak-ink/5 p-2 font-mono text-[10px] uppercase font-bold opacity-50">
                          <div>Time</div>
                          <div>Plate ID</div>
                          <div>Severity</div>
                          <div>Location / Details</div>
                        </div>
                        {detections.length === 0 ? (
                           <div className="p-10 text-center text-[11px] font-mono opacity-50 uppercase tracking-widest">Awaiting Live Feed Signal...</div>
                        ) : detections.map((d) => (
                          <div key={d.id} className="grid grid-cols-[80px_140px_100px_1fr] p-3 hover:bg-rakshak-ink hover:text-white transition-all cursor-pointer font-mono text-[11px] group">
                            <div>{new Date(d.timestamp).toLocaleTimeString([], { hour12: false })}</div>
                            <div className="font-bold flex items-center gap-2">
                               {d.vehicle_number}
                               {d.isIntercepted && <span className="w-1.5 h-1.5 bg-rakshak-accent rounded-full animate-pulse" />}
                            </div>
                            <div>
                              <ThreatBadge level={d.threatLevel || 'Green'} />
                            </div>
                            <div className="truncate uppercase opacity-70 group-hover:opacity-100">{d.location} / {d.crime || 'LOGGED'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Stats */}
                  <div className="space-y-6">
                    <div className="bg-white border border-rakshak-line p-5">
                      <div className="col-header font-serif italic text-[11px] opacity-60 uppercase mb-4">Target Analysis</div>
                      <div className="space-y-4">
                        {detections.filter(d => d.threatLevel === 'Red' && !d.isIntercepted).slice(0, 1).length === 0 ? (
                           <div className="p-8 text-center bg-rakshak-bg border border-dashed border-rakshak-line/30 rounded">
                              <p className="text-[10px] uppercase opacity-40 font-mono">No Active Priority Targets In View</p>
                           </div>
                        ) : detections.filter(d => d.threatLevel === 'Red' && !d.isIntercepted).slice(0, 1).map(d => (
                          <div key={d.id} className="space-y-4">
                            {d.image && (
                              <div className="w-full h-32 border border-rakshak-line overflow-hidden mb-2">
                                <img src={d.image} alt="Target Capture" className="w-full h-full object-cover grayscale font-mono text-[9px]" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <div>
                               <div className="text-[10px] uppercase opacity-50">Plate Detected (OCR)</div>
                               <div className="font-mono font-bold text-lg">{d.vehicle_number}</div>
                            </div>
                            <div>
                               <div className="text-[10px] uppercase opacity-50">Associated Crime</div>
                               <div className="font-mono font-bold text-rakshak-accent">{d.crime}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] uppercase opacity-50">Confidence</div>
                                <div className="font-mono font-bold text-sm">{(d.confidence * 100).toFixed(2)}%</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase opacity-50">Threat Level</div>
                                <div className="font-mono font-bold text-rakshak-accent text-sm">RED</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase opacity-50">Threat Score</div>
                              <div className="h-8 border border-rakshak-line bg-rakshak-bg relative mt-1">
                                <div 
                                  className="h-full bg-rakshak-accent transition-all duration-500" 
                                  style={{ width: `${d.score}%` }} 
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono font-bold text-[11px] text-rakshak-ink">{d.score}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => !d.isIntercepted && deployInterception(d.vehicle_number, d.id)}
                              disabled={d.isIntercepted}
                              className={`w-full py-3 font-bold uppercase tracking-widest text-[11px] transition-colors flex items-center justify-center gap-2 ${
                                d.isIntercepted 
                                  ? 'bg-emerald-600 text-white cursor-default' 
                                  : 'bg-rakshak-ink text-white hover:bg-rakshak-accent'
                              }`}
                            >
                              {d.isIntercepted ? (
                                <><CheckCircle2 size={14} /> Protocol Active</>
                              ) : (
                                <><Navigation size={14} /> Deploy Interception</>
                              )}
                            </button>
                          </div>
                        ))}

                        {/* If Super Admin, show Edit privilege simulation */}
                        {user.role === 'SUPER_ADMIN' && (
                           <div className="pt-4 border-t border-rakshak-line/10">
                              <button className="w-full border border-rakshak-line py-2 text-[10px] font-bold uppercase hover:bg-rakshak-ink/10 transition-all flex items-center justify-center gap-2">
                                <Settings size={12} /> Elevated DB Override
                              </button>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Database' && (
              <motion.div key="db-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DatabaseView admin={user} />
              </motion.div>
            )}

            {activeTab === 'Threats' && (
              <motion.div key="threats-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-rakshak-accent text-white p-6 border-2 border-rakshak-line flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-serif italic font-bold">High-Priority Monitor</h2>
                    <p className="text-[10px] uppercase font-mono opacity-80 mt-1">Live Extraction Protocol • Phase {stats.active_threats > 0 ? 'ACTIVE' : 'STANDBY'}</p>
                  </div>
                  <div className="text-4xl font-mono font-bold">{stats.active_threats.toString().padStart(2, '0')}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {detections.filter(d => d.threatLevel === 'Red' || d.threatLevel === 'Orange').length === 0 ? (
                    <div className="col-span-full p-20 text-center border-2 border-dashed border-rakshak-line/30 rounded-lg">
                      <Shield size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm font-mono uppercase opacity-40">No Signal in High-Priority Band</p>
                    </div>
                  ) : detections.filter(d => d.threatLevel === 'Red' || d.threatLevel === 'Orange').map(d => (
                    <div key={d.id} className="bg-white border-2 border-rakshak-line overflow-hidden group hover:scale-[1.02] transition-transform">
                      <div className="relative h-48 bg-rakshak-ink overflow-hidden border-b border-rakshak-line">
                        {d.image && <img src={d.image} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700" alt="Capture" referrerPolicy="no-referrer" />}
                        <div className="absolute top-0 right-0 bg-rakshak-accent text-white px-3 py-1 font-mono text-[10px] font-bold uppercase">
                          MATCH {(d.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[10px] uppercase opacity-50 font-bold">Vehicle Unit</div>
                            <div className="font-mono text-lg font-bold">{d.vehicle_number}</div>
                          </div>
                          <ThreatBadge level={d.threatLevel || 'Yellow'} />
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-50 font-bold">Primary Offense</div>
                          <div className="font-mono text-xs font-bold text-rakshak-ink uppercase truncate">{d.crime}</div>
                        </div>
                        <div className="pt-4 border-t border-rakshak-line">
                          <button 
                            onClick={() => deployInterception(d.vehicle_number, d.id)}
                            className="w-full bg-rakshak-ink text-white py-2 font-bold uppercase text-[10px] tracking-widest hover:bg-rakshak-accent transition-colors"
                          >
                            Initiate Protocol 04
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white border border-rakshak-line p-6 min-h-[400px]">
                    <h3 className="text-xs font-bold uppercase font-mono mb-6 opacity-50">Spatial Density Pattern</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={[
                        { t: '00h', v: 0 }, { t: '04h', v: 0 }, { t: '08h', v: 0 },
                        { t: '12h', v: 0 }, { t: '16h', v: 0 }, { t: '20h', v: 0 },
                        { t: '24h', v: stats.total_scanned }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="t" className="text-[10px] font-mono" />
                        <YAxis className="text-[10px] font-mono" />
                        <Tooltip contentStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                        <Area type="stepAfter" dataKey="v" stroke="#141414" fill="#141414" fillOpacity={0.05} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-rakshak-ink text-white p-6 flex flex-col justify-between">
                    <div>
                      <Activity size={24} className="mb-4 text-rakshak-accent" />
                      <h3 className="text-lg font-serif italic mb-2">Network Health</h3>
                      <p className="text-[11px] opacity-60 leading-relaxed uppercase font-mono italic">Operational status of edge-nodes. Integrity verified.</p>
                    </div>
                    <div className="space-y-4 font-mono">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-[9px] opacity-50 uppercase">Nodes Peer-Linked</span>
                        <span className="text-xs">ESTABLISHED</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-[9px] opacity-50 uppercase">Gateway Latency</span>
                        <span className="text-xs">Optimal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] opacity-50 uppercase">Protocol Band</span>
                        <span className="text-xs">SECURE-X</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Nodes' && (
              <motion.div 
                key="nodes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <NodeManagement user={user} />
              </motion.div>
            )}

            {activeTab === 'Map' && (
              <motion.div 
                key="map-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[calc(100vh-150px)]"
              >
                <SurveillanceMap 
                  detections={detections} 
                  historyOffset={historyOffset}
                  onHistoryChange={setHistoryOffset}
                  user={user}
                />
              </motion.div>
            )}

            {activeTab === 'Personnel' && (
              <motion.div 
                key="personnel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <PersonnelView admin={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Right Intelligence Panel */}
      <aside className="w-72 border-l border-rakshak-line bg-rakshak-panel p-5 hidden 2xl:flex flex-col gap-6 shrink-0 overflow-y-auto">
        <div>
          <div className="col-header font-serif italic text-[11px] opacity-60 uppercase mb-4">Interception Active</div>
          <div className="space-y-4">
            {stats.active_threats === 0 ? (
               <div className="p-4 border border-dashed border-rakshak-line/30 text-center">
                  <p className="text-[10px] uppercase opacity-40 font-mono tracking-tighter">No Active Protocols</p>
               </div>
            ) : detections.filter(d => d.isIntercepted).map(d => (
              <div key={d.id} className="flex gap-3 items-start p-3 bg-white border border-rakshak-line">
                <div className="w-1 h-full bg-emerald-600 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase">{d.vehicle_number}</p>
                  <p className="text-[10px] opacity-50 truncate">{d.location}</p>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">PATROL UNITS ASSIGNED</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-rakshak-line p-4 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} />
            <h4 className="text-[10px] font-bold uppercase">System Integrity</h4>
          </div>
          <div className="space-y-2 font-mono text-[9px] uppercase">
            <div className="flex justify-between">
              <span className="opacity-50">OCR CONFIDENCE</span>
              <span className="font-bold">99.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-50">API LATENCY</span>
              <span className="font-bold">142ms</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-50">NODE SYNC</span>
              <span className="font-bold">TOTAL</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
