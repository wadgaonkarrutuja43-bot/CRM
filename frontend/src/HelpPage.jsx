import React from 'react';
import { 
  ArrowLeft, BookOpen, Info, Shield, Layers, 
  Heart, Code, GitBranch, CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const HelpPage = ({ onBack }) => {
  
  const features = [
    { icon: <Layers size={20} className="text-primary"/>, title: "Lead Management", desc: "Create, update, and track leads through different pipeline stages." },
    { icon: <Shield size={20} className="text-success"/>, title: "Secure Data", desc: "Local-storage based persistence ensures your data stays in your browser." },
    { icon: <BookOpen size={20} className="text-warning"/>, title: "Activity Logging", desc: "Automatic tracking of every action you take for audit trails." },
  ];

  const steps = [
    { num: "01", title: "Add a Lead", desc: "Go to the Leads page and click the + button. Enter the client details." },
    { num: "02", title: "Update Status", desc: "Click 'Edit' on any lead to change their status (e.g., New -> Converted)." },
    { num: "03", title: "View Analytics", desc: "Check the Dashboard to see a visual breakdown of your performance." },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: '1000px' }}>
      
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={onBack} className="btn btn-light rounded-circle p-2 hover-shadow">
          <ArrowLeft size={20} className="text-muted"/>
        </button>
        <h3 className="fw-bold m-0 text-dark">Help & About</h3>
      </div>

      <div className="row g-4">
        
        {/* --- LEFT COLUMN: INFO & FEATURES --- */}
        <div className="col-lg-7">
          {/* INTRO CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white"
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                <Info size={24} />
              </div>
              <h5 className="fw-bold m-0">What is MiniCRM?</h5>
            </div>
            <p className="text-muted lh-lg mb-0">
              MiniCRM is a lightweight customer relationship management tool designed to help 
              small teams and freelancers track their sales pipeline. It serves as a centralized 
              hub to manage contacts, monitor lead status, and visualize sales performance 
              without the complexity of enterprise software.
            </p>
          </motion.div>

          {/* KEY FEATURES */}
          <h6 className="fw-bold text-muted ms-1 mb-3">KEY FEATURES</h6>
          <div className="row g-3">
            {features.map((feat, index) => (
              <div key={index} className="col-12">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.1 }}
                  className="card border-0 shadow-sm rounded-4 p-3 bg-white"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-circle">{feat.icon}</div>
                    <div>
                      <h6 className="fw-bold m-0 text-dark">{feat.title}</h6>
                      <small className="text-muted">{feat.desc}</small>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: GUIDE & VERSION --- */}
        <div className="col-lg-5">
          
          {/* QUICK START GUIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white h-100"
          >
            <h5 className="fw-bold mb-4">How to use it</h5>
            <div className="d-flex flex-column gap-4">
              {steps.map((step, i) => (
                <div key={i} className="d-flex gap-3">
                  <div className="d-flex flex-column align-items-center">
                    <div className="bg-primary text-white rounded-circle fw-bold d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                      {step.num}
                    </div>
                    {i !== steps.length - 1 && <div className="bg-light my-1" style={{ width: '2px', height: '100%' }}></div>}
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark m-0">{step.title}</h6>
                    <p className="small text-muted m-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* --- FOOTER: VERSION & TECH INFO --- */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }}
        className="mt-5 text-center"
      >
        <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-3 px-4 py-2 bg-white rounded-pill shadow-sm border">
            <div className="d-flex align-items-center gap-2 text-muted small">
                <GitBranch size={14}/> <span>v1.0.0 (Beta)</span>
            </div>
            <div className="vr d-none d-sm-block"></div>
            <div className="d-flex align-items-center gap-2 text-muted small">
                <Code size={14}/> <span>React + Bootstrap</span>
            </div>
            <div className="vr d-none d-sm-block"></div>
            <div className="d-flex align-items-center gap-2 text-muted small">
                <Heart size={14} className="text-danger" fill="currentColor"/> <span>Made for Internship Task</span>
            </div>
        </div>
        <p className="text-muted small mt-3 opacity-50">&copy; {new Date().getFullYear()} MiniCRM Project. All rights reserved.</p>
      </motion.div>

    </div>
  );
};

export default HelpPage;