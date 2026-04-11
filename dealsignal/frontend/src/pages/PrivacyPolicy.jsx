import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: '#38bdf8', fontSize: '32px', marginBottom: '8px' }}>DealSignal CRM</h1>
          <h2 style={{ fontSize: '24px', color: '#f1f5f9', marginBottom: '8px' }}>Privacy Policy</h2>
          <p style={{ color: '#94a3b8' }}>Last updated: April 11, 2025</p>
        </div>

        {/* Section */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>1. Introduction</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            Welcome to DealSignal CRM, operated by Narrow Tech ("we", "our", or "us"). 
            We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, and share information about you 
            when you use our services.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>2. Information We Collect</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>We collect the following types of information:</p>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li><strong style={{ color: '#f1f5f9' }}>Personal Information:</strong> Name, mobile number, email address</li>
            <li><strong style={{ color: '#f1f5f9' }}>WhatsApp Data:</strong> Messages sent to our WhatsApp business number for lead qualification</li>
            <li><strong style={{ color: '#f1f5f9' }}>Usage Data:</strong> How you interact with our platform</li>
            <li><strong style={{ color: '#f1f5f9' }}>Device Data:</strong> IP address, browser type, operating system</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>3. How We Use Your Information</h3>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li>To provide and maintain our CRM services</li>
            <li>To qualify and manage real estate leads via WhatsApp</li>
            <li>To send OTP for authentication purposes</li>
            <li>To communicate with brokers about their leads</li>
            <li>To improve our platform and services</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>4. WhatsApp Messaging</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            Our platform uses the WhatsApp Business API (Meta) to communicate with potential 
            real estate leads. By messaging our WhatsApp number, users consent to receiving 
            automated responses as part of our lead qualification process. We do not share 
            WhatsApp conversation data with third parties except as required for service delivery.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>5. Data Sharing</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            We do not sell your personal data. We may share data with:
          </p>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li><strong style={{ color: '#f1f5f9' }}>Meta (WhatsApp):</strong> For messaging services</li>
            <li><strong style={{ color: '#f1f5f9' }}>MongoDB Atlas:</strong> For secure data storage</li>
            <li><strong style={{ color: '#f1f5f9' }}>Resend:</strong> For email OTP delivery</li>
            <li><strong style={{ color: '#f1f5f9' }}>Railway / Vercel:</strong> For platform hosting</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>6. Data Retention</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            We retain your personal data for as long as your account is active or as needed 
            to provide services. You may request deletion of your data by contacting us.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>7. Your Rights</h3>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to opt-out of communications</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>8. Security</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            We implement industry-standard security measures including JWT authentication, 
            encrypted data transmission (HTTPS), and secure cloud storage to protect your data.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>9. Contact Us</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginTop: '12px' }}>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Company:</strong> Narrow Tech</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Owner:</strong> Kuldeep Singh</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Email:</strong> kuldeepsingh55210@gmail.com</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Website:</strong> narrowtech.in</p>
          </div>
        </section>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e293b' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>© 2025 Narrow Tech. All rights reserved.</p>
          <a href="/terms" style={{ color: '#38bdf8', fontSize: '14px' }}>Terms of Service</a>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;