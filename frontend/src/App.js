import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

// Imports
import PixelBlast from './PixelBlast';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import LeadsPage from './LeadsPage'; 
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';

function App() {
  // 1. STATE MANAGEMENT
  const [view, setView] = useState('landing'); 
  const [user, setUser] = useState(null); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [globalSearch, setGlobalSearch] = useState(''); 
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🚀 System: Welcome to your new CRM!" },
    { id: 2, text: "✅ Tip: Try adding your first lead." }
  ]);

  const clearNotifications = () => {
    setNotifications([]); 
  };

  // 2. THEME & SESSION PERSISTENCE
  useEffect(() => {
    // B. Check for Saved User Session
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setView('dashboard'); 
      } catch (error) {
        localStorage.removeItem('crm_user');
      }
    }
  }, []); 

  // 3. HANDLERS
  const addNotification = (text) => {
    const newNote = { id: Date.now(), text };
    setNotifications(prev => [newNote, ...prev]);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('crm_user', JSON.stringify(userData)); 
    setUser(userData);
    setShowAuthModal(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_user'); 
    setUser(null);
    setView('landing');
  };

  return (
    /* The dynamic class here (landing-view, dashboard-view, etc.) is the key to protecting the landing page background */
    <div className={`min-vh-100 w-100 position-relative ${view}-view`}>
      
      {/* Background Animation - zIndex 0 ensures it's at the very back. 
          CSS will hide this container automatically on all views except landing-view */}
      <div className="position-absolute top-0 start-0 w-100 h-100 pixel-blast-container" style={{ zIndex: 0 }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <motion.div 
            key="landing"
            className="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center justify-content-center"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ zIndex: 1 }}
          >
            <div className="container">
               <div className="row justify-content-center">
                 <div className="col-md-8 col-lg-5">
                    <motion.div 
                      className="card border-0 shadow-lg p-5 text-center"
                      style={{ borderRadius: '32px', backdropFilter: 'blur(30px)', background: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="mb-4 text-primary d-inline-block">
                        <Rocket size={64} strokeWidth={1.5} />
                      </motion.div>
                      <h1 className="display-5 fw-bold mb-3 text-black">Mini <span className="text-primary">CRM</span></h1>
                      <p className="mb-5 fs-5 fw-bold text-muted">The ultimate workspace to manage your leads.</p>
                      
                      <div className="d-flex justify-content-center mb-5">
                        <button 
                          onClick={() => setShowAuthModal(true)} 
                          className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold d-flex align-items-center gap-2"
                          style={{ background: 'linear-gradient(45deg, #007bff, #6610f2)' }}
                        >
                          Get Started <ArrowRight size={20} />
                        </button>
                      </div>

                      <div className="d-flex justify-content-center gap-4 border-top pt-4">
                        <div className="d-flex align-items-center gap-2 fw-bold text-dark small"><ShieldCheck size={18} className="text-success" /> Secure MySQL</div>
                        <div className="d-flex align-items-center gap-2 fw-bold text-dark small"><Zap size={18} className="text-warning" /> Real-time Data</div>
                      </div>
                    </motion.div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* AUTH MODAL */}
        {showAuthModal && (
           <motion.div 
            key="auth-modal"
            className="w-100 h-100 position-fixed top-0 start-0 d-flex align-items-center justify-content-center"
            style={{ zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <AuthForm 
              onClose={() => setShowAuthModal(false)} 
              onLoginSuccess={handleLoginSuccess} 
            />
          </motion.div>
        )}

        {/* VIEW 2: DASHBOARD */}
        {view === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 1 }}>
            <Dashboard 
                user={user} 
                notifications={notifications} 
                onLogout={handleLogout} 
                onNavigateToLeads={() => setView('leads')}
                onNavigateToProfile={() => setView('profile')}
                onNavigateToSettings={() => setView('settings')}
                onNavigateToHelp={() => setView('help')} // Added nav handler for Help
                onSearch={(term) => { setGlobalSearch(term); setView('leads'); }} 
                onClearNotifications={clearNotifications} 
            />
          </motion.div>
        )}

        {/* VIEW 3: LEADS PAGE */}
        {view === 'leads' && (
          <motion.div key="leads" className="w-100 h-100 position-absolute top-0 start-0 overflow-auto" style={{ zIndex: 30 }}>
            <LeadsPage 
              onBack={() => setView('dashboard')} 
              initialSearch={globalSearch}      
              addNotification={addNotification} 
              user={user} 
            />
          </motion.div>
        )}

        {/* VIEW 4: PROFILE PAGE */}
        {view === 'profile' && (
          <motion.div key="profile" className="w-100 h-100 position-absolute top-0 start-0" style={{ zIndex: 30 }}>
            <ProfilePage 
                user={user} 
                onBack={() => setView('dashboard')} 
                onLogout={handleLogout}
            />
          </motion.div>
        )}

        {/* VIEW 5: SETTINGS PAGE */}
        {view === 'settings' && (
          <motion.div key="settings" className="w-100 h-100 position-absolute top-0 start-0" style={{ zIndex: 30 }}>
            <SettingsPage 
                user={user} 
                onBack={() => setView('dashboard')} 
            />
          </motion.div>
        )}

        {/* VIEW 6: HELP PAGE */}
        {view === 'help' && (
          <motion.div key="help" className="w-100 h-100 position-absolute top-0 start-0 overflow-auto" style={{ zIndex: 30 }}>
            <HelpPage 
               onBack={() => setView('dashboard')} 
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;