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
  toPhoneNumber?: string
): Promise<boolean> {
  // Use the provided phone number, or the one from settings, or fall back to default
  const recipientNumber: string = toPhoneNumber || process.env.RECIPIENT_PHONE_NUMBER || '+12133379858';
  
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio client not initialized. SMS not sent.');
    return false;
  }
  
  // Log phone number formats for debugging
  console.log('Twilio From number:', process.env.TWILIO_PHONE_NUMBER);
  console.log('Recipient number:', recipientNumber);

  try {
    // Format the message
    const message = `New Order Alert! Order #${orderNumber} from ${customerName} for $${amount.toFixed(2)}. Check your email for details.`;
    
    // Ensure the Twilio phone number is in the correct format
    const fromNumber = process.env.TWILIO_PHONE_NUMBER?.startsWith('+')
      ? process.env.TWILIO_PHONE_NUMBER
      : `+${process.env.TWILIO_PHONE_NUMBER}`;
      
    // Send the SMS
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: recipientNumber
    });
    
    console.log(`SMS notification sent to ${recipientNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    return false;
  }
}