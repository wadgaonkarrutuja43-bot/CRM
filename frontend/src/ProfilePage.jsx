import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Camera, 
  Save, Loader2, CheckCircle, User, Clock, Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize state with user data or defaults
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@minicrm.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    location: 'Pune, India',
    timezone: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    bio: 'Senior Sales Manager focused on enterprise leads and conversion optimization.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setIsEditing(false); // Exit edit mode
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={onBack} className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-2">
          <ArrowLeft size={18}/> Back to Dashboard
        </button>
        <button onClick={onLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold">
          Log Out
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: PROFILE CARD */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <button className="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 border border-white" title="Change Photo">
                <Camera size={16}/>
              </button>
            </div>
            <h4 className="fw-bold text-dark mb-1">{formData.name}</h4>
            <p className="text-muted small mb-3">{formData.role}</p>
            
            <div className="d-flex justify-content-center gap-2 mb-4">
              <span className="badge bg-light text-dark border"><MapPin size={12} className="me-1"/> {formData.location}</span>
            </div>

            <hr className="opacity-10 my-3"/>
            
            <div className="text-start small text-muted">
              <div className="mb-2 d-flex align-items-center gap-2"><Mail size={14}/> {formData.email}</div>
              <div className="mb-2 d-flex align-items-center gap-2"><Phone size={14}/> {formData.phone}</div>
              <div className="d-flex align-items-center gap-2"><Calendar size={14}/> Joined Jan 2026</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT FORM */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <User className="text-primary"/> Edit Profile
              </h5>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn btn-light btn-sm rounded-pill px-3 fw-bold text-primary">
                  Edit Details
                </button>
              )}
            </div>

            {saved && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-success d-flex align-items-center gap-2 border-0 mb-4 rounded-3 shadow-sm">
                <CheckCircle size={18}/> Profile updated successfully!
              </motion.div>
            )}

            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">FULL NAME</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">JOB TITLE</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    className="form-control bg-light border-0 py-2" 
                    value={formData.email} 
                    disabled // Emails usually shouldn't be editable easily
                    title="Contact admin to change email"
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1">PHONE</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-12">
                   <label className="small fw-bold text-muted mb-1">TIME ZONE</label>
                   <div className="input-group">
                      <span className="input-group-text border-0 bg-light"><Clock size={16}/></span>
                      <select 
                        className="form-select border-0 bg-light" 
                        value={formData.timezone} 
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        disabled={!isEditing}
                      >
                        <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                        <option>(GMT+09:00) Tokyo</option>
                      </select>
                   </div>
                </div>

                <div className="col-12">
                  <label className="small fw-bold text-muted mb-1">BIO / ABOUT</label>
                  <textarea 
                    className="form-control bg-light border-0" 
                    rows="3" 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                   <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light rounded-pill px-4 fw-bold">Cancel</button>
                   <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" disabled={loading}>
                     {loading ? <Loader2 size={18} className="animate-spin"/> : <><Save size={18}/> Save Changes</>}
                   </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;