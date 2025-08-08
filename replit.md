# Pure Batana Oil E-Commerce Platform

## Overview

This is a sophisticated single-product e-commerce website dedicated to Pure Batana Oil. The platform provides a complete shopping experience with integrated Stripe payment processing, comprehensive order management, and automated notification systems. Built as a full-stack TypeScript application, it serves both customers seeking premium natural beauty products and business owners requiring robust administrative tools.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development builds and optimized production bundles
- **TailwindCSS** with custom theme configuration for consistent, responsive styling
- **Shadcn/UI** component library for accessible, professionally designed UI elements
- **Wouter** for lightweight client-side routing with custom compatibility layer
- **TanStack Query** for efficient API state management, caching, and synchronization

### Backend Architecture
- **Node.js** with Express.js framework for RESTful API endpoints
- **TypeScript** throughout the entire backend for type safety and developer experience
- **PostgreSQL** database hosted on Neon serverless platform
- **Drizzle ORM** for type-safe database operations and schema management
- **Stripe** integration for secure payment processing

### Routing Compatibility
The application includes a custom routing compatibility layer (`client/src/lib/routing.tsx`) to handle path-to-regexp errors that can occur in Replit environments. This wrapper safely sanitizes route paths while maintaining full wouter functionality.

## Key Components

### Customer-Facing Features
- **Product Showcase**: Detailed product pages with image galleries and comprehensive product information
- **Shopping Cart**: Persistent cart functionality using localStorage with real-time updates
- **Secure Checkout**: Embedded Stripe Elements for PCI-compliant payment processing
- **Order Confirmation**: Professional confirmation pages with detailed receipt information
- **Responsive Design**: Mobile-first approach optimized for all device sizes

### Content Management
- **Benefits Page**: Comprehensive overview of Batana Oil benefits with detailed explanations
- **Usage Instructions**: Step-by-step guidance for hair, face, and body applications
- **Company Story**: Mission statement and sustainability commitment information
- **Customer Reviews**: Dynamic review system with ratings and customer feedback

### Administrative Dashboard
- **Order Management**: Complete customer order tracking with detailed order history
- **Price Management**: Real-time product pricing updates through admin interface
- **Customer Data**: Comprehensive customer information for efficient order fulfillment
- **Notification Systems**: Automated alerts for new orders via multiple channels

## Data Flow

### Order Processing Flow
1. Customer adds products to cart (stored in localStorage)
2. Checkout process creates Stripe payment intent
3. Customer completes payment through Stripe Elements
4. Successful payment triggers order creation in database
5. Automated notifications sent via email (SendGrid) and SMS (Twilio)
6. Order confirmation displayed with tracking information

### Cart Management
- Cart state managed through React Context with localStorage persistence
- Real-time cart count updates across all components
- Automatic cart loading on page refresh
- Cart clearing after successful order completion

### Database Schema
- **Products**: Core product information including pricing, descriptions, and metadata
- **Orders**: Order tracking with customer information and order status
- **Order Items**: Individual line items within orders
- **Reviews**: Customer feedback system with ratings
- **Contact Messages**: Customer service inquiries and communications
- **Subscribers**: Email newsletter subscription management

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment processing solution with embedded checkout
- Live keys configured for production environment
- Support for multiple payment methods and currencies

### Communication Services
- **SendGrid**: Professional email delivery for order confirmations and notifications
- **Twilio**: SMS notification system for real-time order alerts
- Custom SMS gateway fallback for carrier-specific message delivery

### Database & Hosting
- **Neon**: Serverless PostgreSQL database with automatic scaling
- **Vercel**: Production deployment platform with serverless functions
- Environment-based configuration for development and production

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast bundling for server-side code
- **PostCSS & Autoprefixer**: CSS processing and browser compatibility

## Deployment Strategy

### Production Environment
- Frontend and backend deployed as unified application on Vercel
- Database hosted on Neon with connection pooling
- Environment variables managed through Vercel dashboard
- Automatic deployments triggered by Git commits

### Development Environment
- Local development server with hot module replacement
- Environment-specific API configurations
- Replit compatibility with custom plugin support
- Development database connection through environment variables

### Build Process
- Vite builds optimized frontend bundle
- ESBuild compiles TypeScript server code
- Static assets served from dist/public directory
- API routes handled through Express.js middleware

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```