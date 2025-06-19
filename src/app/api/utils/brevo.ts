const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();

export async function sendContactEmail(email: string, message: string, name: string): Promise<void> {
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `New Contact Message from ${name} - Amoria`;
    sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - Amoria</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 650px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);">
            
            <!-- Header with Amoria Branding -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Amoria</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">New Contact Message</p>
                </div>
            </div>
            
            <!-- Content Section -->
            <div style="padding: 40px 30px;">
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #2d3748; font-size: 22px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
                    
                    <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                        <div style="margin-bottom: 15px;">
                            <span style="display: inline-block; width: 80px; color: #4a5568; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Name:</span>
                            <span style="color: #2d3748; font-size: 16px; font-weight: 500;">${name}</span>
                        </div>
                        <div>
                            <span style="display: inline-block; width: 80px; color: #4a5568; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email:</span>
                            <span style="color: #667eea; font-size: 16px; font-weight: 500;">${email}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Message Section -->
                <div>
                    <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Message</h3>
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 25px; border-left: 4px solid #764ba2; position: relative;">
                        <div style="position: absolute; top: 15px; left: 15px; width: 40px; height: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; opacity: 0.1;"></div>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic; position: relative; z-index: 1;">"${message}"</p>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="margin-bottom: 20px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; padding: 12px; margin-bottom: 15px;">
                        <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%;"></div>
                    </div>
                </div>
                <p style="color: #4a5568; font-size: 16px; margin: 0 0 10px 0; font-weight: 500;">Thank you for reaching out to Amoria!</p>
                <p style="color: #718096; font-size: 14px; margin: 0; line-height: 1.5;">We appreciate your message and will get back to you as soon as possible. Our team is committed to providing you with the best service.</p>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #a0aec0; font-size: 12px; margin: 0;">This email was sent from the Amoria contact form</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
    
    sendSmtpEmail.sender = { "name": "Amoria Contact Form", "email": "noreply@amoriaglobal.com"};
    sendSmtpEmail.to = [
      { "email": "admin@amoriaglobal.com", "name": "Amoria Support Team" }
    ];
    sendSmtpEmail.replyTo = { "email": email, "name": name };
    sendSmtpEmail.headers = { "X-Amoria-Contact": "contact-form-submission" };
    sendSmtpEmail.params = { 
      "sender_name": name, 
      "sender_email": email,
      "message_preview": message.substring(0, 100) + "..."
    };
    
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Contact email sent successfully:', data);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send contact email:', error);
      return Promise.reject(error);
    }
  }

  export async function sendContactReply(
    recipientEmail: string, 
    recipientName: string, 
    originalMessage?: string,
    customResponse?: string
  ): Promise<void> {
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `Thank you for contacting Amoria, ${recipientName}!`;
    sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - Amoria</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh;">
        <div style="max-width: 650px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);">
            
            <!-- Header with Amoria Branding -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; display: inline-block;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Amoria</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Thank You for Reaching Out</p>
                </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 35px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; padding: 15px; margin-bottom: 20px;">
                        <div style="width: 30px; height: 30px; background: rgba(255, 255, 255, 0.3); border-radius: 50%; position: relative;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 16px;">✓</div>
                        </div>
                    </div>
                    <h2 style="color: #2d3748; font-size: 24px; font-weight: 600; margin: 0 0 10px 0;">Hi ${recipientName}!</h2>
                    <p style="color: #4a5568; font-size: 18px; margin: 0; font-weight: 400;">We've received your message</p>
                </div>
                
                <!-- Main Message -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #667eea;">
                    <p style="color: #2d3748; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                        Thank you for taking the time to contact us! We truly appreciate your interest in Amoria and are excited to connect with you.
                    </p>
                    
                    
                    <p style="color: #2d3748; font-size: 16px; line-height: 1.7; margin: 20px 0 0 0;">
                        Our team will review your message and get back to you within <strong style="color: #667eea;">24-48 hours</strong>. 
                        We're committed to providing you with the best possible service and look forward to assisting you.
                    </p>
                </div>
                
                
                <!-- What Happens Next -->
                <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                        <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px;">→</span>
                        What happens next?
                    </h3>
                    <div style="color: #4a5568; font-size: 15px; line-height: 1.6;">
                        <p style="margin: 0 0 12px 0;">• Our team will carefully review your inquiry</p>
                        <p style="margin: 0 0 12px 0;">• We'll prepare a personalized response for your specific needs</p>
                        <p style="margin: 0;">• You'll hear back from us within 24-48 hours via email</p>
                    </div>
                </div>
                
                <!-- Contact Information -->
                <div style="text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 25px;">
                    <h4 style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Need immediate assistance?</h4>
                    <p style="color: #4a5568; font-size: 14px; margin: 0 0 15px 0;">
                        If you have an urgent matter, feel free to reach out to us directly:
                    </p>
                    <div style="display: inline-block; background: #ffffff; border-radius: 8px; padding: 15px 20px; margin: 5px;">
                        <a href="mailto:support@amoriaglobal.com" style="color: #667eea; text-decoration: none; font-weight: 500; font-size: 14px;">support@amoriaglobal.com</a>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="margin-bottom: 20px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; padding: 8px; margin-bottom: 15px;">
                        <div style="width: 16px; height: 16px; background: rgba(255, 255, 255, 0.3); border-radius: 50%;"></div>
                    </div>
                </div>
                <p style="color: #4a5568; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">Best regards,</p>
                <p style="color: #667eea; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">The Amoria Team</p>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #a0aec0; font-size: 12px; margin: 0 0 5px 0;">
                        This is an automated response to confirm we received your message.
                    </p>
                    <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                        Please do not reply to this email. For support, contact us at 
                        <a href="mailto:support@amoria.com" style="color: #667eea; text-decoration: none;">support@amoria.com</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
    
    sendSmtpEmail.sender = { "name": "Amoria Global Tech", "email": "noreply@amoriaglobal.com"};
    sendSmtpEmail.to = [
      { "email": recipientEmail, "name": recipientName }
    ];
    sendSmtpEmail.headers = { "X-Amoria-Type": "contact-reply-confirmation" };
    sendSmtpEmail.params = { 
      "recipient_name": recipientName,
      "response_type": "contact_confirmation"
    };
    
    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Reply email sent successfully to:', recipientEmail);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to send reply email:', error);
      return Promise.reject(error);
    }
  }