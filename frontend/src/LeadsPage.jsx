import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, Edit2, Phone, Mail, User, ArrowLeft, X, Save, 
  AlertTriangle, CheckCircle, Loader2, WifiOff, Filter, ArrowUpDown, Building2,
  ChevronLeft, ChevronRight, CheckSquare, Square, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeadsPage = ({ onBack, initialSearch = '', addNotification, user }) => {
  
  // --- 1. STATE MANAGEMENT ---
  const [leads, setLeads] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter, Sort, Selection
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [selectedLeads, setSelectedLeads] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals & Notifications
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Custom Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores ID or 'bulk'
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [notification, setNotification] = useState(null); // Local toast
  
  // Form Data
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', company: '', 
    status: 'New', source: 'Website', priority: 'Warm', assignedTo: 'Admin' 
  });

  // --- 2. PERMISSION LOGIC ---
  const role = user?.role || 'Staff'; 
  const canEdit = role === 'Admin' || role === 'Sales'; 
  const canDelete = role === 'Admin'; 

  // --- 3. API & DATA HANDLERS ---

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchLeads = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8081/leads')
      .then(res => {
        if (!res.ok) throw new Error("Failed to connect");
        return res.json();
      })
      .then(data => {
        setLeads(data);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Could not connect to Backend. Is it running?");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Bulk Selection Logic
  const toggleSelectAll = () => {
    if (selectedLeads.length === processedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(processedLeads.map(l => l.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(l => l !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  // Save (Add/Edit)
  const handleSave = async (e) => {
      e.preventDefault();
      const url = isEditing ? `http://127.0.0.1:8081/leads/${currentLeadId}` : 'http://127.0.0.1:8081/leads';
      const method = isEditing ? 'PUT' : 'POST';

      try {
          await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });
          setShowModal(false);
          fetchLeads();
          
          const msg = isEditing ? "Lead updated successfully!" : "New lead added successfully!";
          showToast(msg, "success");
          if (addNotification) addNotification(isEditing ? `📝 Updated: ${formData.name}` : `👤 New lead: ${formData.name}`);
      } catch (err) {
          showToast("Failed to save.", "error");
      }
  };

  // --- DELETE HANDLERS (UPDATED) ---
  
  // 1. Trigger the Modal
  const initiateDelete = (target) => {
      setDeleteTarget(target); // target is either an ID or 'bulk'
      setShowDeleteConfirm(true);
  };

  // 2. Confirm Action
  const confirmDelete = async () => {
      setShowDeleteConfirm(false);

      try {
        if (deleteTarget === 'bulk') {
            // Bulk Delete
            await Promise.all(selectedLeads.map(id => 
                fetch(`http://127.0.0.1:8081/leads/${id}`, { method: 'DELETE' })
            ));
            setSelectedLeads([]);
            showToast(`Deleted ${selectedLeads.length} leads.`, "error");
        } else {
            // Single Delete
            await fetch(`http://127.0.0.1:8081/leads/${deleteTarget}`, { method: 'DELETE' });
            showToast("Lead deleted.", "error");
        }
        fetchLeads();
        if (addNotification) addNotification("🗑️ Lead(s) deleted");
      } catch (err) {
        showToast("Delete failed.", "error");
      }
  };

  // Modal Openers
  const openAddModal = () => {
      setFormData({ name: '', email: '', phone: '', company: '', status: 'New', source: 'Website', priority: 'Warm', assignedTo: 'Admin' });
      setIsEditing(false);
      setShowModal(true);
  };
  
  const openEditModal = (lead) => {
      setFormData({ 
          name: lead.name, 
          email: lead.email, 
          phone: lead.phone || '', 
          company: lead.company || '', 
          status: lead.status || 'New',
          source: lead.source || 'Website',
          priority: lead.priority || 'Warm',
          assignedTo: lead.assignedTo || 'Admin'
      });
      setCurrentLeadId(lead.id);
      setIsEditing(true);
      setShowModal(true);
  };

  // --- 4. DATA PROCESSING ---
  const processedLeads = leads
    .filter(lead => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
            lead.name.toLowerCase().includes(lowerTerm) ||
            lead.email.toLowerCase().includes(lowerTerm) ||
            (lead.company && lead.company.toLowerCase().includes(lowerTerm))
        ) && (filterStatus === 'All' || lead.status === filterStatus);
    })
    .sort((a, b) => {
        const dateA = new Date(a.created_at || 0); 
        const dateB = new Date(b.created_at || 0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(processedLeads.length / itemsPerPage);
  const currentItems = processedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- 5. UI HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-primary';
      case 'Contacted': return 'bg-info';
      case 'Qualified': return 'bg-warning';
      case 'Converted': return 'bg-success';
      case 'Lost': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'Hot': return 'text-danger bg-danger bg-opacity-10';
      case 'Warm': return 'text-warning bg-warning bg-opacity-10';
      case 'Cold': return 'text-info bg-info bg-opacity-10';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="container-fluid p-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* LOCAL TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -20, opacity: 0}} className={`position-fixed top-0 start-50 translate-middle-x mt-4 p-3 rounded-pill shadow-lg d-flex align-items-center gap-2`} style={{ zIndex: 9999, background: 'white', borderLeft: `5px solid ${notification.type === 'success' ? '#28a745' : '#dc3545'}` }}>
            {notification.type === 'success' ? <CheckCircle size={20} className="text-success"/> : <AlertTriangle size={20} className="text-danger"/>}
            <span className="fw-bold text-dark">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
           <button onClick={onBack} className="btn btn-link text-decoration-none text-muted mb-2 p-0 d-flex align-items-center gap-2"><ArrowLeft size={18}/> Back to Dashboard</button>
           <h2 className="fw-bold text-dark m-0">Lead Management</h2>
           <div className="d-flex align-items-center gap-2 mt-1">
             <span className={`badge ${role === 'Admin' ? 'bg-danger' : 'bg-secondary'}`}>{role} View</span>
             {!canEdit && <small className="text-muted"><Lock size={12}/> Read Only</small>}
           </div>
        </div>
        {canEdit && (
            <button onClick={openAddModal} className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm fw-bold">
            <Plus size={18} /> Add Lead
            </button>
        )}
      </div>

      {/* TOOLBAR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
            
            {/* Search */}
            <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                <input 
                  type="text" 
                  className="form-control border-0 bg-light rounded-pill ps-5" 
                  placeholder="Search leads..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Filter, Sort & Bulk Actions */}
            <div className="d-flex align-items-center gap-2">
                 {/* Bulk Delete */}
                 {selectedLeads.length > 0 && canDelete && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        onClick={() => initiateDelete('bulk')}
                        className="btn btn-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
                    >
                        <Trash2 size={16}/> Delete ({selectedLeads.length})
                    </motion.button>
                 )}

                 {/* Status Filter */}
                 <div className="d-flex align-items-center gap-2 px-2 bg-light rounded-pill">
                    <Filter size={16} className="text-muted ms-2"/>
                    <select className="form-select border-0 bg-transparent shadow-none fw-bold text-muted small py-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{cursor: 'pointer', width: 'auto'}}>
                        <option value="All">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Converted">Converted</option>
                    </select>
                 </div>

                 {/* Sort Option (RESTORED) */}
                 <div className="d-flex align-items-center gap-2 px-2 bg-light rounded-pill">
                    <ArrowUpDown size={16} className="text-muted ms-2"/>
                    <select className="form-select border-0 bg-transparent shadow-none fw-bold text-muted small py-1" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{cursor: 'pointer', width: 'auto'}}>
                        <option value="newest">Newest</option><option value="oldest">Oldest</option>
                    </select>
                 </div>
            </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4" style={{ minHeight: '400px' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover">
            <thead className="bg-light">
              <tr>
                <th className="ps-4" style={{width: '50px'}}>
                   {canEdit && <div className="cursor-pointer" onClick={toggleSelectAll}>
                       {selectedLeads.length > 0 && selectedLeads.length === processedLeads.length ? <CheckSquare size={18} className="text-primary"/> : <Square size={18} className="text-muted"/>}
                   </div>}
                </th>
                <th className="text-muted small fw-bold text-uppercase py-3">Name</th>
                <th className="text-muted small fw-bold text-uppercase py-3">Status</th>
                <th className="text-muted small fw-bold text-uppercase py-3">Priority</th>
                <th className="text-muted small fw-bold text-uppercase py-3">Assigned</th>
                <th className="text-muted small fw-bold text-uppercase py-3 d-none d-md-table-cell">Contact</th>
                <th className="text-muted small fw-bold text-uppercase py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" className="text-center py-5"><Loader2 size={40} className="animate-spin text-primary"/></td></tr>}
              {!loading && error && <tr><td colSpan="7" className="text-center py-5 text-danger"><WifiOff size={40} className="mb-2"/><br/>{error}</td></tr>}
              {!loading && !error && currentItems.length === 0 && <tr><td colSpan="7" className="text-center py-5 text-muted">No leads found.</td></tr>}

              {!loading && !error && currentItems.map((lead) => (
                <tr key={lead.id}>
                  <td className="ps-4">
                     {canEdit && <div className="cursor-pointer" onClick={() => toggleSelectOne(lead.id)}>
                        {selectedLeads.includes(lead.id) ? <CheckSquare size={18} className="text-primary"/> : <Square size={18} className="text-muted"/>}
                     </div>}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{width: '40px', height: '40px'}}>
                            {lead.name.charAt(0)}
                        </div>
                        <div>
                            <h6 className="m-0 fw-bold text-dark">{lead.name}</h6>
                            {lead.company && <small className="text-muted d-flex align-items-center gap-1"><Building2 size={10}/> {lead.company}</small>}
                        </div>
                    </div>
                  </td>
                  <td><span className={`badge rounded-pill ${getStatusColor(lead.status)} bg-opacity-75 fw-normal px-3`}>{lead.status}</span></td>
                  <td>
                    <span className={`badge rounded-pill ${getPriorityColor(lead.priority || 'Warm')} border fw-bold px-3`}>{lead.priority || 'Warm'}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '10px'}}>
                            {(lead.assignedTo || 'Admin').charAt(0)}
                        </div>
                        <span className="small text-muted">{lead.assignedTo || 'Admin'}</span>
                    </div>
                  </td>
                  <td className="d-none d-md-table-cell">
                      <div className="d-flex flex-column small">
                         <span className="text-muted">{lead.email}</span>
                         {lead.phone && <span className="text-muted opacity-75">{lead.phone}</span>}
                      </div>
                  </td>
                  <td className="text-end pe-4">
                    {canEdit ? (
                        <>
                            <button onClick={() => openEditModal(lead)} className="btn btn-light btn-sm rounded-circle me-2 text-primary hover-shadow"><Edit2 size={16}/></button>
                            {canDelete && <button onClick={() => initiateDelete(lead.id)} className="btn btn-light btn-sm rounded-circle text-danger hover-shadow"><Trash2 size={16}/></button>}
                        </>
                    ) : <span className="text-muted small fst-italic">Read Only</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && !error && processedLeads.length > itemsPerPage && (
            <div className="d-flex justify-content-between align-items-center p-3 bg-light border-top">
                <span className="small text-muted">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, processedLeads.length)} of {processedLeads.length}</span>
                <div className="d-flex gap-2">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="btn btn-white border btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}><ChevronLeft size={16}/></button>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-white border btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}><ChevronRight size={16}/></button>
                </div>
            </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="card border-0 shadow-lg rounded-4 p-4 bg-white w-100" style={{ maxWidth: '600px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h5 className="fw-bold m-0">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h5>
                        <button onClick={() => setShowModal(false)} className="btn-close"></button>
                    </div>
                    <form onSubmit={handleSave}>
                        <div className="row g-3">
                            <div className="col-md-6"><label className="small fw-bold text-muted mb-1">FULL NAME</label><input required type="text" className="form-control bg-light border-0 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/></div>
                            <div className="col-md-6"><label className="small fw-bold text-muted mb-1">EMAIL</label><input required type="email" className="form-control bg-light border-0 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/></div>
                            <div className="col-md-6"><label className="small fw-bold text-muted mb-1">PHONE</label><input type="tel" className="form-control bg-light border-0 py-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/></div>
                            <div className="col-md-6"><label className="small fw-bold text-muted mb-1">COMPANY</label><input type="text" className="form-control bg-light border-0 py-2" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}/></div>
                            <div className="col-12"><hr className="my-2"/></div>
                            <div className="col-md-4">
                                <label className="small fw-bold text-muted mb-1">STATUS</label>
                                <select className="form-select bg-light border-0 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Converted">Converted</option><option value="Lost">Lost</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="small fw-bold text-muted mb-1">PRIORITY</label>
                                <select className="form-select bg-light border-0 py-2" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                    <option>Hot</option><option>Warm</option><option>Cold</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="small fw-bold text-muted mb-1">ASSIGNED TO</label>
                                <select className="form-select bg-light border-0 py-2" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                                    <option>Admin</option><option>Sarah</option><option>Mike</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                            <button type="button" onClick={() => setShowModal(false)} className="btn btn-light rounded-pill px-4 fw-bold">Cancel</button>
                            <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold"><Save size={18} className="me-2"/>{isEditing ? 'Save Changes' : 'Create Lead'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL (RESTORED) --- */}
      {showDeleteConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-4 text-center" style={{ width: '350px' }}>
                <div className="mx-auto bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <AlertTriangle size={30}/>
                </div>
                <h5 className="fw-bold mb-2">Delete Lead?</h5>
                <p className="text-muted small mb-4">
                    {deleteTarget === 'bulk' ? `Permanently delete ${selectedLeads.length} leads?` : "Permanently delete this lead?"}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-light rounded-pill px-4 fw-bold">Cancel</button>
                    <button onClick={confirmDelete} className="btn btn-danger rounded-pill px-4 fw-bold">Yes, Delete</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default LeadsPage;