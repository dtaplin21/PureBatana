import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Type for SendGrid email address format
interface EmailAddress {
  email: string;
  name?: string;
}

interface EmailParams {
  to: string;
  from: string | EmailAddress;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  dateCreated: Date | string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    };
    
    if (params.replyTo) {
      emailData.replyTo = params.replyTo;
    }
    
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendAdminOrderNotification(orderData: OrderEmailData): Promise<boolean> {
  try {
    // Format the date
    const date = orderData.dateCreated instanceof Date 
      ? orderData.dateCreated 
      : orderData.dateCreated ? new Date(orderData.dateCreated) : new Date();
      
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate the notification in text format
    const textNotification = `
NEW ORDER RECEIVED - ${orderData.orderNumber}

Customer Information:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Address: ${orderData.shippingAddress}

Order Details:
${orderData.items.map(item => `${item.name} (${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Order Summary:
Subtotal: $${orderData.subtotal.toFixed(2)}
Shipping: $${orderData.shipping.toFixed(2)}
Total: $${orderData.total.toFixed(2)}

Order Date: ${formattedDate}
    `;
    
    // Generate the notification in HTML format
    const htmlNotification = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .notification {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 2px solid #3a5a40;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #3a5a40;
      margin: 0;
    }
    .order-info {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .customer-info {
      background-color: #edf7ed;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      border-left: 4px solid #3a5a40;
    }
    .order-items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .order-items th, .order-items td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .order-items th {
      color: #3a5a40;
    }
    .totals {
      margin-top: 15px;
    }
    .totals div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .total-row {
      font-weight: bold;
      color: #3a5a40;
      font-size: 18px;
      padding-top: 5px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="notification">
    <div class="header">
      <h1 class="logo">PURE BATANA - NEW ORDER</h1>
      <p>Order #${orderData.orderNumber}</p>
    </div>
    
    <div class="customer-info">
      <h3>Customer Information:</h3>
      <p><strong>Name:</strong> ${orderData.customerName}</p>
      <p><strong>Email:</strong> ${orderData.customerEmail}</p>
      <p><strong>Shipping Address:</strong><br>${orderData.shippingAddress.replace(/,/g, ',<br>')}</p>
    </div>
    
    <div class="order-info">
      <h3>Order Details:</h3>
      <p><strong>Order Date:</strong> ${formattedDate}</p>
    </div>
    
    <h3>Items Ordered:</h3>
    <table class="order-items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderData.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="totals">
      <div>
        <span>Subtotal:</span>
        <span>$${orderData.subtotal.toFixed(2)}</span>
      </div>
      <div>
        <span>Shipping:</span>
        <span>$${orderData.shipping.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Total:</span>
        <span>$${orderData.total.toFixed(2)}</span>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    
    // Send the email to admin
    // Use the verified sender email address
    const fromEmail = 'dtaplin21@gmail.com';
    
    return await sendEmail({
      to: 'dtaplin21@gmail.com', // Your email for order notifications
      from: {
        email: fromEmail,
        name: 'Pure Batana'
      }, // Using properly formatted sender
      subject: `New Order #${orderData.orderNumber} - Pure Batana`,
      text: textNotification,
      html: htmlNotification
    });
    
  } catch (error) {
    console.error('Admin order notification email error:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
  if (!orderData.shippingAddress) {
    orderData.shippingAddress = "No shipping address provided";
  }
  try {
    // Format the date
    const date = orderData.dateCreated instanceof Date 
      ? orderData.dateCreated 
      : orderData.dateCreated ? new Date(orderData.dateCreated) : new Date();
      
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate the receipt in text format
    const textReceipt = `
PURE BATANA - ORDER CONFIRMATION
    
Dear ${orderData.customerName},

Thank you for your order! We're excited to confirm that your Pure Batana order has been received and is being processed.

ORDER DETAILS:
Order Number: ${orderData.orderNumber}
Order Date: ${formattedDate}

ITEMS ORDERED:
${orderData.items.map(item => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

SHIPPING ADDRESS:
${orderData.shippingAddress}

ORDER SUMMARY:
Subtotal: $${orderData.subtotal.toFixed(2)}
Shipping: $${orderData.shipping.toFixed(2)}
Total: $${orderData.total.toFixed(2)}

Your Pure Batana products will be carefully packaged and shipped to you shortly. You will receive a shipping notification once your order is on its way.

If you have any questions about your order, please contact us at dtaplin21@gmail.com.

Thank you for choosing Pure Batana!

Sincerely,
The Pure Batana Team
    `;
    
    // Generate the receipt in HTML format
    const htmlReceipt = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .receipt {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #3a5a40;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #3a5a40;
      margin: 0;
    }
    .order-info {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .order-items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .order-items th, .order-items td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .order-items th {
      color: #3a5a40;
    }
    .totals {
      margin-top: 15px;
    }
    .totals div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .total-row {
      font-weight: bold;
      color: #3a5a40;
      font-size: 18px;
      padding-top: 5px;
      border-top: 1px solid #eee;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1 class="logo">PURE BATANA</h1>
      <p>Order Confirmation</p>
    </div>
    
    <p>Dear ${orderData.customerName},</p>
    
    <p>Thank you for your order! We're excited to confirm that your Pure Batana order has been received and is being processed.</p>
    
    <div class="order-info">
      <h3>Order Details:</h3>
      <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
      <p><strong>Order Date:</strong> ${formattedDate}</p>
      <p><strong>Shipping Address:</strong><br>${orderData.shippingAddress.replace(/,/g, ',<br>')}</p>
    </div>
    
    <h3>Items Ordered:</h3>
    <table class="order-items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderData.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="totals">
      <div>
        <span>Subtotal:</span>
        <span>$${orderData.subtotal.toFixed(2)}</span>
      </div>
      <div>
        <span>Shipping:</span>
        <span>$${orderData.shipping.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Total:</span>
        <span>$${orderData.total.toFixed(2)}</span>
      </div>
    </div>
    
    <p>Your Pure Batana products will be carefully packaged and shipped to you shortly. You will receive a shipping notification once your order is on its way.</p>
    
    <p>If you have any questions about your order, please contact us at <a href="mailto:dtaplin21@gmail.com">dtaplin21@gmail.com</a>.</p>
    
    <p>Thank you for choosing Pure Batana!</p>
    
    <p>Sincerely,<br>The Pure Batana Team</p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Pure Batana. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    // Use the verified sender email address
    const fromEmail = 'dtaplin21@gmail.com';
    
    // Send the email
    return await sendEmail({
      to: orderData.customerEmail,
      from: {
        email: fromEmail,
        name: 'Pure Batana'
      }, // Using properly formatted sender
      subject: `Pure Batana - Order Confirmation #${orderData.orderNumber}`,
      text: textReceipt,
      html: htmlReceipt
    });
    
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return false;
  }
}