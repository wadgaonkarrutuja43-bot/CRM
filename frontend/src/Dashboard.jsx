import React, { useState, useEffect } from 'react';
import { 
  Search, LogOut, User, Shield, Loader2, 
  ArrowRight, BarChart2, Activity, Settings, HelpCircle // Added HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const Dashboard = ({ 
  onLogout, 
  onNavigateToLeads, 
  onSearch, 
  user, 
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToHelp // Added this prop
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState(''); 
  const [stats, setStats] = useState({ total: 0, newLeads: 0, converted: 0 });
  const [logs, setLogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const savedImg = localStorage.getItem(`profile_img_${user?.email}`);
    if (savedImg) setProfileImg(savedImg);
  }, [user?.email]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://127.0.0.1:8081/dashboard-stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        const logsRes = await fetch('http://127.0.0.1:8081/activity-logs');
        const logsData = await logsRes.json();
        setLogs(logsData);
        
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Total', value: stats.total, color: '#6366f1' },
    { name: 'New', value: stats.newLeads, color: '#eab308' },
    { name: 'Converted', value: stats.converted, color: '#22c55e' }
  ];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchInput.trim() !== "") onSearch(searchInput); 
  };

  return (
    <div className="container p-4" style={{ maxWidth: '1200px' }}>
      
      {/* HEADER SECTION */}
      <div className="card border-0 shadow-sm p-3 mb-5 rounded-4 bg-white position-relative" style={{ zIndex: 100 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          
          <div className="d-flex align-items-center gap-3 p-2 rounded hover-effect cursor-pointer" onClick={onNavigateToProfile}>
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm overflow-hidden" 
                 style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
              {profileImg ? (
                <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'G'
              )}
            </div>
            <div>
              <h6 className="m-0 fw-bold text-dark">{user?.name || "Guest User"}</h6>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>View Profile</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 position-relative ms-auto">
            {/* SEARCH BOX */}
            <div className={`d-flex align-items-center border rounded-pill px-2 py-1 bg-light transition-all ${showSearch ? 'shadow-sm' : ''}`} style={{ transition: 'all 0.3s ease', width: showSearch ? '220px' : '45px', overflow: 'hidden' }}>
                <button onClick={() => setShowSearch(!showSearch)} className="btn btn-sm text-muted p-1"><Search size={20} /></button>
                {showSearch && <input type="text" placeholder="Type & Enter..." autoFocus className="border-0 bg-transparent ms-2 small" style={{ outline: 'none', width: '100%' }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchSubmit} />}
            </div>

            {/* HELP BUTTON (NEW) */}
            <button onClick={onNavigateToHelp} className="btn btn-light rounded-circle p-2 text-muted hover-shadow" title="Help & About">
                <HelpCircle size={20} />
            </button>

            {/* SETTINGS BUTTON */}
            <button onClick={onNavigateToSettings} className="btn btn-light rounded-circle p-2 text-muted hover-shadow" title="Settings">
                <Settings size={20} />
            </button>

            <button onClick={() => setShowLogoutConfirm(true)} className="btn btn-danger rounded-pill px-3 d-flex align-items-center gap-2 fw-bold small shadow-sm">
              <LogOut size={16} /> <span className="d-none d-md-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
         <h1 className="fw-bold display-5 mb-2" style={{ color: '#1e293b' }}>Dashboard Overview</h1>
         <p className="fs-5" style={{ color: '#64748b' }}>Welcome back, <span className="fw-bold text-primary">{user?.name}</span>.</p>
      </div>

      {/* --- STATS & ANALYTICS SECTION --- */}
      <div className="row mb-5 g-4">
        <div className="col-lg-4 d-flex flex-column gap-3">
            <motion.div whileHover={{ scale: 1.02 }} className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-center gap-4 bg-white">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><User size={28}/></div>
                <div><h6 className="text-muted fw-bold mb-1">TOTAL LEADS</h6><h2 className="fw-bold m-0 text-dark">{loading ? "..." : stats.total}</h2></div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-center gap-4 bg-white">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning"><Shield size={28}/></div>
                <div><h6 className="text-muted fw-bold mb-1">NEW LEADS</h6><h2 className="fw-bold m-0 text-dark">{loading ? "..." : stats.newLeads}</h2></div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="card border-0 shadow-sm p-4 rounded-4 d-flex flex-row align-items-center gap-4 bg-white">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><Activity size={28}/></div>
                <div><h6 className="text-muted fw-bold mb-1">CONVERTED</h6><h2 className="fw-bold m-0 text-dark">{loading ? "..." : stats.converted}</h2></div>
            </motion.div>
        </div>

        <div className="col-lg-8">
            <div className="row g-4 h-100">
                <div className="col-md-7">
                      <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><BarChart2 size={20} className="text-primary"/> Performance Analytics</h5>
                        </div>
                        <div style={{ width: '100%', height: '250px' }}>
                            {loading ? <div className="h-100 d-flex align-items-center justify-content-center"><Loader2 className="animate-spin text-primary"/></div> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10}/>
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}}/>
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}/>
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                                            {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY SECTION */}
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm p-3 rounded-4 h-100 bg-white overflow-hidden">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-muted px-2"><Activity size={16}/> Recent Activity</h6>
                        <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '300px' }}>
                            {logs.length === 0 ? <div className="text-center text-muted small py-4">No recent activity found.</div> : (
                                logs.map((log) => (
                                    <div key={log.id} className="d-flex gap-3 align-items-start p-2 rounded hover-bg">
                                        <div className="mt-1">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small ${log.action === 'Created' || log.action === 'New User' ? 'bg-success' : log.action === 'Updated' ? 'bg-primary' : 'bg-danger'}`} style={{width: '24px', height: '24px', fontSize: '0.7rem'}}>
                                                {log.action.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="m-0 small fw-bold text-dark">{log.details}</p>
                                            <div className="d-flex align-items-center gap-2">
                                                <small className="text-muted" style={{fontSize: '0.7rem'}}>{log.user_name}</small>
                                                <small className="text-muted" style={{fontSize: '0.6rem'}}>• {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* MANAGE LEADS CTA */}
      <div className="card border-0 shadow rounded-5 p-4 text-center bg-white position-relative overflow-hidden">
        <div className="row align-items-center">
            <div className="col-md-8 text-md-start">
                <h3 className="fw-bold mb-2">Manage your pipeline</h3>
                <p className="text-muted mb-0">Access the full table to update statuses, add notes, and move leads through your funnel.</p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button onClick={onNavigateToLeads} className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow hover-shadow transition-all">Go to Leads Management <ArrowRight size={18} className="ms-2"/></button>
            </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000 }}>
            <div className="card p-4 text-center rounded-4 shadow-lg animate-pop-in" style={{ width: '300px' }}>
                <h5 className="fw-bold mb-2">Log Out?</h5>
                <p className="text-muted small mb-4">Are you sure you want to exit the system?</p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                    <button onClick={() => setShowLogoutConfirm(false)} className="btn btn-light rounded-pill px-4 fw-bold">Cancel</button>
                    <button onClick={onLogout} className="btn btn-danger rounded-pill px-4 fw-bold">Logout</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;