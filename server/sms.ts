import twilio from 'twilio';

// We'll need to add these environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.warn('Twilio environment variables not set. SMS notifications will not be sent.');
}

// Create Twilio client if credentials are available
const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Send an SMS notification for a new order
 * @param orderNumber The order number/ID
 * @param customerName The customer's name
 * @param amount The order total amount
 * @param toPhoneNumber The phone number to send the SMS to
 * @returns Promise<boolean> Success status
 */
export async function sendNewOrderSms(
  orderNumber: string,
  customerName: string,
  amount: number, 
  toPhoneNumber: string = '+12133379858' // Default to your phone number
): Promise<boolean> {
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio client not initialized. SMS not sent.');
    return false;
  }

  try {
    // Format the message
    const message = `New Order Alert! Order #${orderNumber} from ${customerName} for $${amount.toFixed(2)}. Check your email for details.`;
    
    // Send the SMS
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber
    });
    
    console.log(`SMS notification sent to ${toPhoneNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    return false;
  }
}