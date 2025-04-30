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
  
  // Map of carrier to SMS gateway domain with alternative formats
  const carrierMap: {[key: string]: string[]} = {
    'att': ['txt.att.net', 'mms.att.net'], // SMS and MMS gateways
    'verizon': ['vtext.com', 'vzwpix.com'], // SMS and MMS gateways
    'tmobile': ['tmomail.net'], 
    'sprint': ['messaging.sprintpcs.com', 'pm.sprint.com'], // SMS and MMS gateways
    'boost': ['sms.myboostmobile.com', 'myboostmobile.com'],
    'cricket': ['sms.cricketwireless.net', 'mms.cricketwireless.net'],
    'uscellular': ['email.uscc.net', 'mms.uscc.net'],
    'metro': ['mymetropcs.com'],
    'xfinity': ['vtext.com'], // Xfinity Mobile uses Verizon's network
    'spectrum': ['vtext.com'], // Spectrum Mobile uses Verizon's network
    'visible': ['vtext.com'], // Visible uses Verizon's network
  };
  
  const lowerCarrier = carrier.toLowerCase();
  
  // Try to find carrier in the map
  const domains = carrierMap[lowerCarrier];
  
  // If carrier not found, default to the first domain of the first carrier (ATT)
  const domain = domains ? domains[0] : 'txt.att.net';
  
  // Format might be different - some carriers use 10-digit, some use full number
  // For US numbers, ensure we're using 10 digits (remove country code if present)
  const formattedNumber = cleanNumber.length > 10 ? cleanNumber.slice(-10) : cleanNumber;
  
  // Log the SMS gateway email for debugging
  console.log(`Using SMS gateway: ${formattedNumber}@${domain}`);
  
  return `${formattedNumber}@${domain}`;
}

/**
 * Send an SMS using a specific carrier gateway
 * @param phoneNumber The recipient phone number
 * @param carrier The carrier to use
 * @param message The message to send
 * @param domainIndex Which domain to use from the carrier's list (0 = primary)
 * @returns Promise<boolean> Success status
 */
async function sendSmsViaCarrier(
  phoneNumber: string,
  carrier: string,
  message: string,
  domainIndex: number = 0
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not set. SMS notification will not be sent.');
    return false;
  }

  try {
    // Get the carrier domain mapping
    const lowerCarrier = carrier.toLowerCase();
    const carrierMap: {[key: string]: string[]} = {
      'att': ['txt.att.net', 'mms.att.net'],
      'verizon': ['vtext.com', 'vzwpix.com'],
      'tmobile': ['tmomail.net'],
      'sprint': ['messaging.sprintpcs.com', 'pm.sprint.com'],
      'boost': ['sms.myboostmobile.com', 'myboostmobile.com'],
      'cricket': ['sms.cricketwireless.net', 'mms.cricketwireless.net'],
      'uscellular': ['email.uscc.net', 'mms.uscc.net'],
      'metro': ['mymetropcs.com'],
      'xfinity': ['vtext.com'],
      'spectrum': ['vtext.com'],
      'visible': ['vtext.com'],
    };
    
    // Get the domains for this carrier
    const domains = carrierMap[lowerCarrier] || ['txt.att.net', 'mms.att.net'];
    
    // Use the specified domain if available, otherwise use first
    const domain = domains.length > domainIndex ? domains[domainIndex] : domains[0];
    
    // Clean phone number and format it properly
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.length > 10 ? cleanNumber.slice(-10) : cleanNumber;
    
    const smsGatewayEmail = `${formattedNumber}@${domain}`;
    console.log(`Attempting SMS via ${domain} gateway: ${smsGatewayEmail}`);
    
    // Send email to SMS gateway with complete email structure
    await sgMail.send({
      to: smsGatewayEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'dtaplin21@gmail.com',
      subject: 'Order Alert', // Short subject for SMS
      text: message,
      html: message,
    });
    
    console.log(`SMS notification successfully sent to ${smsGatewayEmail}`);
    return true;
  } catch (error: any) {
    console.error(`Error sending SMS to carrier ${carrier} (domain index ${domainIndex}):`, error);
    
    // Log detailed error information if available
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid API Error Details:', JSON.stringify(error.response.body.errors));
    }
    
    return false;
  }
}

/**
 * Send a sale notification SMS via email-to-SMS gateway
 * Will try multiple carrier gateways to increase the chance of delivery
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

  // Create a short message (SMS are limited in length)
  const message = `NEW ORDER: #${orderNumber} from ${customerName} for $${amount.toFixed(2)}`;
  
  // Try primary SMS gateway
  const primarySuccess = await sendSmsViaCarrier(PHONE_NUMBER, CARRIER, message, 0);
  if (primarySuccess) {
    return true;
  }
  
  console.log('Primary SMS gateway failed, trying alternative...');
  
  // Try alternative gateway for the same carrier (if available)
  const alternativeSuccess = await sendSmsViaCarrier(PHONE_NUMBER, CARRIER, message, 1);
  if (alternativeSuccess) {
    return true;
  }
  
  console.log('Alternative SMS gateway failed, trying a different carrier...');
  
  // As a last resort, try a different carrier (ATT tends to be most reliable)
  if (CARRIER.toLowerCase() !== 'att') {
    const lastResortSuccess = await sendSmsViaCarrier(PHONE_NUMBER, 'att', message, 0);
    if (lastResortSuccess) {
      return true;
    }
  }
  
  console.log('All SMS gateway attempts failed');
  return false;
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