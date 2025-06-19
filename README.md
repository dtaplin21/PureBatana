# Pure Batana Oil E-Commerce Platform

A sophisticated, single-product e-commerce website dedicated to Pure Batana Oil, featuring a streamlined shopping experience with integrated payment processing and comprehensive order management.

## Overview

This platform serves as a complete e-commerce solution for Pure Batana Oil products, offering customers an intuitive shopping experience while providing business owners with powerful administrative tools for managing products, orders, and notifications.

## Key Features

### 🛍️ Customer Experience
- **Product Showcase**: Detailed product pages with high-quality image galleries
- **Shopping Cart**: Persistent cart functionality with localStorage integration
- **Secure Checkout**: Embedded Stripe payment processing with real-time validation
- **Order Confirmation**: Professional order confirmation pages with receipt details
- **Responsive Design**: Mobile-first design optimized for all device sizes

### 📱 Product Information
- **Benefits Page**: Comprehensive overview of Pure Batana Oil benefits
- **Usage Instructions**: Step-by-step guidance for hair, face, and body applications
- **Company Story**: Mission and sustainability commitment information
- **Customer Reviews**: Product review system with ratings display

### 🔧 Administrative Features
- **Admin Dashboard**: Secure access-controlled panel for business management
- **Price Management**: Real-time product pricing updates
- **Order Tracking**: Complete customer order history and details
- **Notification System**: Automated SMS and email alerts for new orders
- **Customer Data**: Comprehensive customer information for order fulfillment

### 🔔 Notification System
- **Email Notifications**: Professional order confirmations via SendGrid
- **SMS Alerts**: Real-time SMS notifications via Twilio integration
- **Admin Alerts**: Instant notifications for new orders with customer details

## Technical Stack

### Frontend
- **React.js** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **TailwindCSS** for responsive, utility-first styling
- **Shadcn/UI** for consistent, accessible component library
- **TanStack Query** for efficient data fetching and caching
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for type safety across the stack
- **PostgreSQL** with Neon serverless database
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication (admin access)

### Payment & Commerce
- **Stripe** for secure payment processing
- **Embedded checkout** for seamless on-site transactions
- **Real-time payment validation** and error handling
- **Comprehensive order tracking** and management

### Communication Services
- **SendGrid** for transactional email delivery
- **Twilio** for SMS notification services
- **Professional email templates** for order confirmations

### Infrastructure
- **Replit** hosting and development environment
- **Environment-based configuration** for different deployment stages
- **Automated database migrations** via Drizzle
- **Session-based authentication** for admin access

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   └── context/       # React context providers
├── server/                # Express backend application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations and ORM
│   ├── email.ts           # Email notification services
│   ├── sms.ts             # SMS notification services
│   └── auth.ts            # Authentication middleware
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── public/                # Static assets and images
```

## Key Business Features

### Single Product Focus
- Streamlined experience centered around Pure Batana Oil
- Detailed product information and benefits
- Multiple product variants (sizes/quantities)
- Professional product photography and descriptions

### Efficient Order Management
- Real-time order processing and confirmation
- Automated customer communication
- Complete shipping information collection
- Order history and tracking for administrators

### Customer Communication
- Professional email receipts and confirmations
- SMS notifications for order updates
- Customer support contact integration
- Newsletter subscription functionality

### Administrative Control
- Secure admin panel with access code protection
- Real-time price management capabilities
- Complete customer order visibility
- Notification system management and testing

## Security Features

- Secure admin access with session-based authentication
- Environment variable protection for sensitive data
- Stripe-compliant payment processing
- Data validation and sanitization
- HTTPS-ready configuration

## Deployment & Environment

The platform is designed for seamless deployment across multiple environments:

- **Development**: Local development with hot-reload
- **Staging**: Testing environment for quality assurance
- **Production**: Live e-commerce platform with full functionality

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account for payment processing
- SendGrid account for email services
- Twilio account for SMS notifications

### Environment Variables
The platform requires several environment variables for full functionality:
- Database connection strings
- Stripe API keys (public and secret)
- SendGrid API credentials
- Twilio API credentials
- Session secrets and security keys

## Business Benefits

### For Customers
- Fast, intuitive shopping experience
- Secure payment processing
- Professional order confirmations
- Educational product information
- Mobile-optimized browsing

### For Business Owners
- Complete order management
- Real-time sales notifications
- Easy price management
- Professional customer communication
- Comprehensive order tracking
- Scalable infrastructure

## Performance & Optimization

- Optimized image loading and caching
- Efficient database queries with proper indexing
- Client-side caching for improved performance
- Responsive design for all device types
- SEO-optimized structure and content

---

This platform represents a complete e-commerce solution specifically designed for Pure Batana Oil products, combining modern web technologies with business-focused features to create an effective online presence and sales channel.