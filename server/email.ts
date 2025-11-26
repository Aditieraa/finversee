import fetch from 'node-fetch';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY.split('-')[1]; // Extract server from key (e.g., us1)
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || 'default'; // You can set this in env

interface EmailPayload {
  email: string;
  subject: string;
  title: string;
  message: string;
  type: 'achievement' | 'budget-alert';
  icon?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.log('Mailchimp API key not configured. Skipping email.');
      return false;
    }

    const endpoint = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/messages/send`;

    const emailContent = generateEmailHTML(payload);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({
        message: {
          subject: payload.subject,
          from_email: 'noreply@finverse.app',
          from_name: 'Finverse',
          to: [
            {
              email: payload.email,
              type: 'to',
            },
          ],
          html: emailContent,
          auto_text: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mailchimp email error:', error);
      return false;
    }

    console.log(`✅ Email sent to ${payload.email}: ${payload.subject}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

function generateEmailHTML(payload: EmailPayload): string {
  if (payload.type === 'achievement') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1B263B 0%, #4A90E2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
            .achievement-badge { font-size: 48px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 Achievement Unlocked!</h1>
            </div>
            <div class="content">
              <div class="achievement-badge">${payload.icon || '🎉'}</div>
              <h2>${payload.title}</h2>
              <p>${payload.message}</p>
              <p>You're on your way to mastering your finances! Keep up the excellent work.</p>
              <a href="https://finverse.replit.dev" class="cta-button">View Your Profile</a>
            </div>
            <div class="footer">
              <p>Finverse Financial Intelligence Platform</p>
              <p>Keep learning, keep growing! 📈</p>
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    // Budget alert email
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1B263B 0%, #4A90E2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
            .alert-badge { font-size: 48px; margin: 20px 0; }
            .alert-box { padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 15px 0; }
            .cta-button { display: inline-block; background: #4A90E2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Budget Alert</h1>
            </div>
            <div class="content">
              <div class="alert-badge">⚠️</div>
              <h2>${payload.title}</h2>
              <div class="alert-box">
                <p><strong>${payload.message}</strong></p>
              </div>
              <p>Review your budget and spending patterns to stay on track with your financial goals.</p>
              <a href="https://finverse.replit.dev" class="cta-button">Review Your Budget</a>
            </div>
            <div class="footer">
              <p>Finverse Financial Intelligence Platform</p>
              <p>Stay in control of your finances! 💰</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
