import React from 'react';

const Terms = () => {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: '#38bdf8', fontSize: '32px', marginBottom: '8px' }}>DealSignal CRM</h1>
          <h2 style={{ fontSize: '24px', color: '#f1f5f9', marginBottom: '8px' }}>Terms of Service</h2>
          <p style={{ color: '#94a3b8' }}>Last updated: April 11, 2025</p>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>1. Acceptance of Terms</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            By accessing or using DealSignal CRM ("Service"), operated by Narrow Tech, 
            you agree to be bound by these Terms of Service. If you do not agree, 
            please do not use our Service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>2. Description of Service</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            DealSignal CRM is a real estate lead management platform that allows brokers to:
          </p>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li>Manage and qualify real estate leads via WhatsApp</li>
            <li>Track HOT, WARM, and COLD leads</li>
            <li>Communicate with potential buyers and renters</li>
            <li>Access a dashboard for lead analytics</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>3. User Responsibilities</h3>
          <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li>You must provide accurate registration information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must not misuse the WhatsApp messaging system</li>
            <li>You must comply with Meta's WhatsApp Business Policy</li>
            <li>You must not use the service for spam or illegal activities</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>4. WhatsApp Usage Policy</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            Our service uses the WhatsApp Business API provided by Meta. Users must comply 
            with WhatsApp's Terms of Service and Business Policy. We reserve the right to 
            suspend accounts that violate WhatsApp's policies.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>5. Intellectual Property</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            All content, features, and functionality of DealSignal CRM are owned by 
            Narrow Tech and are protected by intellectual property laws.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>6. Limitation of Liability</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            Narrow Tech shall not be liable for any indirect, incidental, or consequential 
            damages arising from your use of the Service. We do not guarantee uninterrupted 
            or error-free service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>7. Termination</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            We reserve the right to suspend or terminate your account at any time for 
            violations of these Terms. You may also delete your account by contacting us.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>8. Changes to Terms</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8' }}>
            We may update these Terms at any time. Continued use of the Service after 
            changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px' }}>9. Contact Us</h3>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginTop: '12px' }}>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Company:</strong> Narrow Tech</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Owner:</strong> Kuldeep Singh</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Email:</strong> kuldeepsingh55210@gmail.com</p>
            <p style={{ color: '#f1f5f9', margin: '4px 0' }}><strong>Website:</strong> narrowtech.in</p>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e293b' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>© 2025 Narrow Tech. All rights reserved.</p>
          <a href="/privacy" style={{ color: '#38bdf8', fontSize: '14px' }}>Privacy Policy</a>
        </div>

      </div>
    </div>
  );
};

export default Terms;