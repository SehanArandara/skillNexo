// Email service utility
// For demo purposes, we'll log the email. In production, integrate with services like:
// - Resend (resend.com)
// - SendGrid
// - AWS SES
// - EmailJS

export const sendWelcomeEmail = async (recipientEmail, credentials) => {
    const emailData = {
        to: recipientEmail,
        subject: 'Welcome to SkillNexo LMS - Your Login Credentials',
        body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to SkillNexo LMS!</h2>
        <p>Your payment has been verified and your account is now active.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials:</h3>
          <p><strong>Email:</strong> ${credentials.email}</p>
          <p><strong>Password:</strong> <span style="background-color: #dbeafe; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${credentials.password}</span></p>
          <p><strong>Enrolled Course:</strong> ${credentials.courseName}</p>
        </div>
        
        <p>You can now log in to the LMS and start learning!</p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Please keep your credentials secure. You can change your password after logging in.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message from SkillNexo LMS. Please do not reply to this email.
        </p>
      </div>
    `
    };

    // For demo: Log to console
    console.log('📧 EMAIL SENT TO:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Credentials:', credentials);

    // TODO: In production, integrate with your email service:
    /*
    const response = await fetch('YOUR_EMAIL_SERVICE_API', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_EMAIL_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    */

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        message: `Email sent to ${recipientEmail}`
    };
};

export const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters
    const length = 8;
    let password = 'LMS@';
    for (let i = 0; i < length - 4; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};
