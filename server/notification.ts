import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// This is the phone number to receive SMS alerts in the format 1234567890
const PHONE_NUMBER = process.env.ALERT_PHONE_NUMBER || '5103261121';

// The carrier of the phone (can be updated as needed)
const CARRIER = process.env.ALERT_CARRIER || 'att';

/**
 * Get the SMS gateway email address for a carrier
 * @param phoneNumber The phone number without any formatting (just digits)
 * @param carrier The mobile carrier (att, verizon, tmobile, sprint, etc.)
 * @returns The SMS gateway email address
 */
function getSmsGatewayEmail(phoneNumber: string, carrier: string): string {
  // Strip any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Map of carrier to SMS gateway domain
  const carrierMap: {[key: string]: string} = {
    'att': 'txt.att.net',
    'verizon': 'vtext.com',
    'tmobile': 'tmomail.net',
    'sprint': 'messaging.sprintpcs.com',
    'boost': 'sms.myboostmobile.com',
    'cricket': 'sms.cricketwireless.net',
    'uscellular': 'email.uscc.net',
    'metro': 'mymetropcs.com',
  };
  
  const domain = carrierMap[carrier.toLowerCase()] || 'tmomail.net'; // Default to T-Mobile
  return `${cleanNumber}@${domain}`;
}

/**
 * Send a sale notification SMS via email-to-SMS gateway
 * @param orderNumber Order ID/number
 * @param customerName Customer's name
 * @param amount Order total amount
 * @returns Promise<boolean> Success status
 */
export async function sendSaleNotificationSms(
  orderNumber: string,
  customerName: string,
  amount: number
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not set. SMS notification will not be sent.');
    return false;
  }

  // Get the SMS gateway email for your carrier
  const smsGatewayEmail = getSmsGatewayEmail(PHONE_NUMBER, CARRIER);
  
  try {
    // Create a short message (SMS are limited in length)
    const message = `NEW ORDER: #${orderNumber} from ${customerName} for $${amount.toFixed(2)}`;
    
    // Send email to SMS gateway
    await sgMail.send({
      to: smsGatewayEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'dtaplin21@gmail.com', // Using verified sender email
      subject: '',
      text: message,
    });
    
    console.log(`SMS notification sent to ${smsGatewayEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS notification via email gateway:', error);
    return false;
  }
}

/**
 * Updates the phone number and carrier for SMS notifications
 * @param phoneNumber The new phone number
 * @param carrier The mobile carrier
 */
export function updateSmsSettings(phoneNumber: string, carrier: string): void {
  process.env.ALERT_PHONE_NUMBER = phoneNumber;
  process.env.ALERT_CARRIER = carrier;
  console.log(`SMS settings updated: ${phoneNumber} (${carrier})`);
}