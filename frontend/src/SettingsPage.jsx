import React, { useState } from 'react';
import { 
  ArrowLeft, Bell, Database, ShieldCheck, 
  Loader2, CheckCircle, Download, Lock, 
  Mail, AlertTriangle, HelpCircle, ChevronRight,
  ChevronDown, Phone, X, AlertCircle, Plus,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM TOGGLE COMPONENT ---
const ToggleSwitch = ({ isOn }) => (
  <div style={{
    width: '50px',
    height: '28px',
    backgroundColor: isOn ? '#0d6efd' : '#e9ecef',
    borderRadius: '50px',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isOn ? 'flex-end' : 'flex-start',
    cursor: 'pointer',
    border: isOn ? '1px solid #0d6efd' : '1px solid #dee2e6',
    transition: 'background-color 0.3s ease',
    flexShrink: 0 
  }}>
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    />
  </div>
);

const SettingsPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('team'); 
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);
  
  // MODAL STATES
  const [openFaq, setOpenFaq] = useState(null); 
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // --- TEAM STATE ---
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@minicrm.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Sales', email: 'sarah@minicrm.com', role: 'Sales', status: 'Active' },
    { id: 3, name: 'Mike Viewer', email: 'mike@minicrm.com', role: 'Viewer', status: 'Inactive' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');

  // --- HANDLERS ---
  const toggleUserStatus = (id) => {
    setTeamMembers(teamMembers.map(user => 
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const handleInvite = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setTeamMembers([...teamMembers, { id: Date.now(), name: 'Pending User', email: inviteEmail, role: 'Sales', status: 'Pending' }]);
      setInviteEmail('');
      setLoading(false);
      setShowInviteModal(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  // EXISTING TOGGLES (Removed slack/google as they were part of System)
  const [toggles, setToggles] = useState({ email: true, push: false, twoFactor: false });
  const handleToggle = (key) => { setToggles(prev => ({ ...prev, [key]: !prev[key] })); };
  const toggleFaq = (index) => { setOpenFaq(openFaq === index ? null : index); };

  const handleSave = (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      let leadsData = [{ id: 1, name: "Demo User", email: "demo@example.com", status: "New", source: "Website" }];
      const headers = ['ID,Name,Email,Phone,Status,Source,Date'];
      const rows = leadsData.map(lead => `${lead.id},"${lead.name}","${lead.email}","","${lead.status}","${lead.source}",""`);
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', `crm_export.csv`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (error) { alert("Failed to export data."); } finally { setLoading(false); }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false); setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('crm_user'); localStorage.removeItem('crm-theme');
      setLoading(false); setDeleteToast(true);
      setTimeout(() => { window.location.reload(); }, 2000);
    }, 1500);
  };

  const faqData = [
    { question: "How do I add a new lead?", answer: "Navigate to the 'Leads' page from the dashboard. Click the '+ New Lead' button in the top right corner. Fill in the lead's name, email, and status, then click 'Save'." },
    { question: "Can I export my data?", answer: "Yes! Go to the 'Data' tab in Settings (this page). Under 'Export Your Data', click the 'Download CSV' button to get a full report of your leads." },
    { question: "How do I reset my password?", answer: "Go to the 'Security' tab in Settings. Enter your current password, then type your new password twice. Click 'Update Security' to save changes." },
    { question: "Is my data secure?", answer: "Absolutely. We use industry-standard encryption for all data storage. You can also enable Two-Factor Authentication in the Security tab for extra protection."}
  ];

  return (
    <div className="container py-3 py-md-5" style={{ maxWidth: '1000px' }}>
      
      {/* --- SUPPORT MODAL --- */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setShowSupportModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="card border-0 shadow-lg rounded-4 p-0 overflow-hidden w-100" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
              <div className="bg-primary p-4 text-white text-center position-relative">
                <button onClick={() => setShowSupportModal(false)} className="btn btn-link text-white position-absolute top-0 end-0 p-3"><X size={24}/></button>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 d-inline-flex mb-3"><HelpCircle size={32}/></div>
                <h4 className="fw-bold m-0">Contact Support</h4>
              </div>
              <div className="p-4 bg-white">
                <div className="d-flex align-items-center gap-3 mb-4"><div className="bg-light p-2 rounded-circle text-primary"><Mail size={20}/></div><div className="text-truncate"><small className="text-muted fw-bold d-block" style={{fontSize: '0.7rem'}}>EMAIL US</small><span className="fw-bold text-dark">support@minicrm.com</span></div></div>
                <div className="d-flex align-items-center gap-3 mb-4"><div className="bg-light p-2 rounded-circle text-success"><Phone size={20}/></div><div><small className="text-muted fw-bold d-block" style={{fontSize: '0.7rem'}}>CALL US</small><span className="fw-bold text-dark">+1 (555) 123-4567</span></div></div>
                <button onClick={() => setShowSupportModal(false)} className="btn btn-dark w-100 rounded-pill py-2 fw-bold">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INVITE MODAL --- */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setShowInviteModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="card border-0 shadow-lg rounded-4 p-4 bg-white w-100" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
              <h5 className="fw-bold mb-4">Invite New User</h5>
              <form onSubmit={handleInvite}>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-1">EMAIL ADDRESS</label>
                  <input type="email" className="form-control bg-light border-0 py-2" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-1">ROLE</label>
                  <select className="form-select bg-light border-0 py-2">
                    <option>Sales Representative</option>
                    <option>Manager</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div className="d-flex gap-2">
                    <button type="button" onClick={() => setShowInviteModal(false)} className="btn btn-light rounded-pill w-50 fw-bold">Cancel</button>
                    <button type="submit" className="btn btn-primary rounded-pill w-50 fw-bold" disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin"/> : "Send Invite"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE MODAL --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }} onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-center p-4 w-100" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-center mb-3"><div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger"><AlertTriangle size={40} strokeWidth={1.5} /></div></div>
              <h4 className="fw-bold text-dark mb-2">Delete Account?</h4>
              <p className="text-muted small mb-4">This action is <strong>permanent</strong>.</p>
              <div className="d-flex gap-2"><button className="btn btn-light rounded-pill w-100 fw-bold" onClick={() => setShowDeleteModal(false)}>Cancel</button><button className="btn btn-danger rounded-pill w-100 fw-bold" onClick={confirmDeleteAccount}>Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BACK BUTTON --- */}
      <button onClick={onBack} className="btn btn-link text-decoration-none text-muted mb-4 p-0 d-flex align-items-center gap-2"><ArrowLeft size={18}/> <span className="d-none d-sm-inline">Back to Dashboard</span><span className="d-sm-none">Back</span></button>

      <div className="row g-4">
        
        {/* --- RESPONSIVE SIDEBAR --- */}
        <div className="col-lg-3 col-md-4 col-12">
          <h4 className="fw-bold mb-4 px-2 d-none d-md-block">Settings</h4>
          {/* Desktop/Tablet List Group */}
          <div className="list-group list-group-flush rounded-4 shadow-sm border-0 overflow-hidden bg-white d-none d-md-block">
            <button onClick={() => setActiveTab('team')} className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-2 ${activeTab === 'team' ? 'bg-primary text-white' : 'text-dark'}`}><Users size={18}/> <span className="fw-medium">Team & Roles</span></button>
            <button onClick={() => setActiveTab('security')} className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-2 ${activeTab === 'security' ? 'bg-primary text-white' : 'text-dark'}`}><ShieldCheck size={18}/> <span className="fw-medium">Security</span></button>
            <button onClick={() => setActiveTab('notifications')} className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-2 ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-dark'}`}><Bell size={18}/> <span className="fw-medium">Notifications</span></button>
            <button onClick={() => setActiveTab('data')} className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-2 ${activeTab === 'data' ? 'bg-primary text-white' : 'text-dark'}`}><Database size={18}/> <span className="fw-medium">Data</span></button>
            <button onClick={() => setActiveTab('help')} className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-2 ${activeTab === 'help' ? 'bg-primary text-white' : 'text-dark'}`}><HelpCircle size={18}/> <span className="fw-medium">Support</span></button>
          </div>

          {/* Mobile Horizontal Scroll Menu */}
          <div className="d-md-none d-flex gap-2 overflow-auto pb-2 mb-2 no-scrollbar" style={{ whiteSpace: 'nowrap' }}>
            <button onClick={() => setActiveTab('team')} className={`btn rounded-pill px-3 border ${activeTab === 'team' ? 'btn-primary' : 'bg-white text-dark'}`}>Team</button>
            <button onClick={() => setActiveTab('security')} className={`btn rounded-pill px-3 border ${activeTab === 'security' ? 'btn-primary' : 'bg-white text-dark'}`}>Security</button>
            <button onClick={() => setActiveTab('notifications')} className={`btn rounded-pill px-3 border ${activeTab === 'notifications' ? 'btn-primary' : 'bg-white text-dark'}`}>Notifications</button>
            <button onClick={() => setActiveTab('data')} className={`btn rounded-pill px-3 border ${activeTab === 'data' ? 'btn-primary' : 'bg-white text-dark'}`}>Data</button>
            <button onClick={() => setActiveTab('help')} className={`btn rounded-pill px-3 border ${activeTab === 'help' ? 'btn-primary' : 'bg-white text-dark'}`}>Support</button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="col-lg-9 col-md-8 col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-50 position-relative">
            {saved && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-success d-flex align-items-center gap-2 border-0 mb-4 rounded-3 shadow-sm py-2"><CheckCircle size={18}/> Changes saved!</motion.div>}
            {deleteToast && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-danger d-flex align-items-center gap-2 border-0 mb-4 rounded-3 shadow-sm py-3"><AlertCircle size={20}/> <strong>Account deleted.</strong> Redirecting...</motion.div>}

            {/* --- TEAM TAB --- */}
            {activeTab === 'team' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                   <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><Users className="text-primary" size={20}/> Team Management</h5>
                   <button onClick={() => setShowInviteModal(true)} className="btn btn-primary rounded-pill px-3 fw-bold btn-sm d-flex align-items-center gap-2"><Plus size={16}/> Invite User</button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle" style={{ minWidth: '600px' }}>
                    <thead className="bg-light"><tr><th className="border-0 small fw-bold text-muted ps-3 rounded-start">USER</th><th className="border-0 small fw-bold text-muted">ROLE</th><th className="border-0 small fw-bold text-muted">STATUS</th><th className="border-0 small fw-bold text-muted rounded-end text-end pe-3">ACTION</th></tr></thead>
                    <tbody>
                      {teamMembers.map(user => (
                        <tr key={user.id}>
                          <td className="ps-3"><div className="fw-bold text-dark">{user.name}</div><div className="small text-muted">{user.email}</div></td>
                          <td><span className={`badge rounded-pill ${user.role === 'Admin' ? 'bg-primary' : 'bg-secondary'} bg-opacity-10 text-${user.role === 'Admin' ? 'primary' : 'secondary'} border`}>{user.role}</span></td>
                          <td><span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${user.status === 'Active' ? 'success' : 'dark'} border`}>{user.status}</span></td>
                          <td className="text-end pe-3">
                             <button onClick={() => toggleUserStatus(user.id)} className={`btn btn-sm rounded-pill px-3 fw-bold ${user.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}>
                               {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'security' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Lock className="text-primary" size={20}/> Security</h5>
                <form onSubmit={handleSave}>
                  <div className="mb-4"><label className="small fw-bold text-muted mb-2">CHANGE PASSWORD</label><input type="password" class="form-control bg-light border-0 mb-2 py-2" placeholder="Current Password"/><div className="row g-2"><div className="col-12 col-md-6 mb-2"><input type="password" class="form-control bg-light border-0 py-2" placeholder="New Password"/></div><div className="col-12 col-md-6"><input type="password" class="form-control bg-light border-0 py-2" placeholder="Confirm"/></div></div></div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center p-3 border rounded-3 mb-4 bg-white gap-3" onClick={() => handleToggle('twoFactor')}><div><p className="fw-bold mb-0 text-dark">Two-Factor Authentication</p><small className="text-muted">Secure your account.</small></div><ToggleSwitch isOn={toggles.twoFactor}/></div>
                  <div className="d-flex justify-content-end"><button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={loading}>{loading ? <Loader2 size={18} className="animate-spin"/> : "Update Security"}</button></div>
                </form>
              </motion.div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === 'notifications' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Bell className="text-primary" size={20}/> Notifications</h5>
                <div className="d-flex flex-column gap-3">
                   <div className="d-flex flex-wrap justify-content-between align-items-center p-3 border rounded-3 bg-white gap-3" onClick={() => handleToggle('email')}><div><p className="fw-bold mb-0 text-dark">Email Alerts</p><small className="text-muted">Get updates via email.</small></div><ToggleSwitch isOn={toggles.email} /></div>
                   <div className="d-flex flex-wrap justify-content-between align-items-center p-3 border rounded-3 bg-white gap-3" onClick={() => handleToggle('push')}><div><p className="fw-bold mb-0 text-dark">Browser Push</p><small className="text-muted">Real-time popup alerts.</small></div><ToggleSwitch isOn={toggles.push} /></div>
                </div>
                <div className="mt-4 text-end"><button onClick={handleSave} className="btn btn-primary rounded-pill px-4 fw-bold">Save Preferences</button></div>
              </motion.div>
            )}

            {/* --- DATA TAB --- */}
            {activeTab === 'data' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Database className="text-primary" size={20}/> Data Management</h5>
                <div className="mb-4 p-4 bg-light rounded-4 border border-dashed text-center"><Download size={24} className="text-muted mb-2"/><h6 className="fw-bold text-dark">Export Your Data</h6><p className="small text-muted mb-3">Download CSV of leads.</p><button onClick={handleExport} className="btn btn-outline-dark btn-sm rounded-pill fw-bold px-4" disabled={loading}>{loading ? "Generating..." : "Download CSV"}</button></div>
                <div className="p-3 border border-danger border-opacity-25 bg-danger bg-opacity-10 rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"><div><p className="fw-bold mb-0 text-danger">Delete Account</p><small className="text-danger opacity-75">Permanently remove data.</small></div><button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm rounded-pill px-4 py-2 fw-bold w-100 w-md-auto" disabled={loading || deleteToast}>Delete My Account</button></div>
              </motion.div>
            )}

            {/* --- SUPPORT TAB (RESPONSIVE) --- */}
            {activeTab === 'help' && (
               <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><HelpCircle className="text-primary" size={20}/> Help & Support</h5>
                 <div className="accordion mb-4">
                   {faqData.map((faq, index) => (
                     <div key={index} className="card border mb-2 rounded-3 overflow-hidden shadow-sm">
                       <div className="card-header bg-white border-0 p-3 fw-bold d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleFaq(index)}>
                         <span className="text-dark">{faq.question}</span>
                         {openFaq === index ? <ChevronDown size={16} className="text-primary"/> : <ChevronRight size={16} className="text-muted"/>}
                       </div>
                       <AnimatePresence>
                         {openFaq === index && (
                           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-light border-top">
                             <div className="p-3 text-muted small lh-base">{faq.answer}</div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   ))}
                 </div>
                 <div className="bg-light p-4 rounded-4 text-center">
                   <h6 className="fw-bold text-dark mb-3">Still need help?</h6>
                   <button onClick={() => setShowSupportModal(true)} className="btn btn-dark rounded-pill px-5 py-2 fw-bold">Contact Support</button>
                 </div>
               </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;