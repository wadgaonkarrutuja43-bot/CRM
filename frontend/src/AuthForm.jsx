import React, { useState } from 'react';
import { Mail, Lock, User, X, ArrowRight, Loader2, Phone } from 'lucide-react';

const AuthForm = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to Login mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for form fields
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'Staff' });

  // --- REAL SERVER CONNECTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const res = await fetch(`http://localhost:8081${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data !== "Fail" && data !== "Error") {
        if (isLogin) {
            onLoginSuccess(data); 
        } else {
            alert("Account created successfully! Now please Log In.");
            setIsLogin(true); // Automatically switch to login screen
            setLoading(false);
        }
      } else {
        if (isLogin) {
            setError("Incorrect Password or Email not found."); 
        } else {
            // Smart Error: If email exists, suggest logging in
            setError("Email already exists! Please switch to Login.");
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-lg p-0 overflow-hidden animate-pop-in" style={{ width: '400px', borderRadius: '24px', zIndex: 1050 }}>
      
      {/* HEADER WITH TOGGLE */}
      <div className="p-4 text-center text-white position-relative" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <button onClick={onClose} className="btn btn-sm btn-white-opacity position-absolute top-0 end-0 m-3 text-white"><X size={20}/></button>
        
        <h4 className="fw-bold m-0 mb-3">Mini CRM Access</h4>
        
        {/* BIG TOGGLE BUTTONS */}
        <div className="d-flex justify-content-center bg-white bg-opacity-25 p-1 rounded-pill mx-auto" style={{maxWidth: '250px'}}>
            <button 
                onClick={() => { setIsLogin(true); setError(''); }} 
                className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
            >
                Login
            </button>
            <button 
                onClick={() => { setIsLogin(false); setError(''); }} 
                className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-white'}`}
            >
                Sign Up
            </button>
        </div>
      </div>

      {/* FORM */}
      <div className="p-4 bg-white">
        {error && <div className="alert alert-danger py-2 small text-center rounded-pill mb-3">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* NAME INPUT */}
              <div className="mb-3 position-relative">
                <User size={18} className="text-muted position-absolute" style={{ top: '12px', left: '15px' }}/>
                <input type="text" className="form-control rounded-pill ps-5 bg-light border-0 py-2" placeholder="Full Name" required
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              {/* PHONE INPUT */}
              <div className="mb-3 position-relative">
                <Phone size={18} className="text-muted position-absolute" style={{ top: '12px', left: '15px' }}/>
                <input type="tel" className="form-control rounded-pill ps-5 bg-light border-0 py-2" placeholder="Phone Number" required
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              {/* ROLE DROPDOWN */}
              <div className="mb-3 position-relative">
                <label className="form-label small fw-bold text-muted ms-3">Select Role</label>
                <select 
                  className="form-select rounded-pill ps-4 bg-light border-0 py-2" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Staff">Staff (Read Only)</option>
                  <option value="Sales">Sales (Update Status)</option>
                  <option value="Admin">Admin (Full Control)</option>
                </select>
              </div>
            </>
          )}
          
          <div className="mb-3 position-relative">
            <Mail size={18} className="text-muted position-absolute" style={{ top: '12px', left: '15px' }}/>
            <input type="email" className="form-control rounded-pill ps-5 bg-light border-0 py-2" placeholder="Email Address" required
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="mb-4 position-relative">
            <Lock size={18} className="text-muted position-absolute" style={{ top: '12px', left: '15px' }}/>
            <input type="password" className="form-control rounded-pill ps-5 bg-light border-0 py-2" placeholder="Password" required
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20}/> : (isLogin ? 'Login' : 'Create Account')} 
            {!loading && <ArrowRight size={18}/>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;