# TailAdmin React - Free React Tailwind Admin Dashboard Template

TailAdmin is a free and open-source admin dashboard template built on **React and Tailwind CSS**, providing developers with everything they need to create a comprehensive, data-driven back-end,
dashboard, or admin panel solution for upcoming web projects.

With TailAdmin, you get access to all the necessary dashboard UI components, elements, and pages required to build a feature-rich and complete dashboard or admin panel. Whether you're building dashboard or admin panel for a complex web application or a simple website, TailAdmin is the perfect solution to help you get up and running quickly.

![TailAdmin React.js Dashboard Preview](./banner.png)

## Overview

TailAdmin provides essential UI components and layouts for building feature-rich, data-driven admin dashboards and control panels. It's built on:

- React 18 (create-react-app)
- TypeScript
- Tailwind CSS

### Quick Links

- [✨ Visit Website](https://tailadmin.com)
- [📄 Documentation](https://tailadmin.com/docs)
- [⬇️ Download](https://tailadmin.com/download)
- [🖌️ Figma Design File (Community Edition)](https://www.figma.com/community/file/1214477970819985778)
- [⚡ Get PRO Version](https://tailadmin.com/pricing)

### Demos

- [Free Version](https://free-react-demo.tailadmin.com/)
- [Pro Version](https://react-demo.tailadmin.com)

### Other Versions

- [HTML Version](https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template)
- [Next.js Version](https://github.com/TailAdmin/free-nextjs-admin-dashboard)
- [Vue.js Version](https://github.com/TailAdmin/vue-tailwind-admin-dashboard)

## Installation

### Prerequisites

To get started with TailAdmin, ensure you have the following prerequisites installed and set up:

- Node.js 18.x or later (recommended to use Node.js 20.x or later)

### Cloning the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/TailAdmin/free-react-tailwind-admin-dashboard.git
```

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   > On `npm` some included packages can cause peer-deps issue with React 18 while installing.
   >
   > Use the `--legacy-peer-deps` flag, at the end of the installation command, as a workaround for that.

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Components

TailAdmin is a pre-designed starting point for building a web-based dashboard using React.js and Tailwind CSS. The template includes:

- Sophisticated and accessible sidebar
- Data visualization components
- Prebuilt profile management and 404 page
- Tables and Charts(Line and Bar)
- Authentication forms and input elements
- Alerts, Dropdowns, Modals, Buttons and more
- Can't forget Dark Mode 🕶️

All components are built with React and styled using Tailwind CSS for easy customization.

## Feature Comparison

### Free Version

- 1 Unique Dashboard
- 30+ dashboard components
- 50+ UI elements
- Basic Figma design files
- Community support

### Pro Version

- 5 Unique Dashboards: Analytics, Ecommerce, Marketing, CRM, Stocks (more coming soon)
- 400+ dashboard components and UI elements
- Complete Figma design file
- Email support

To learn more about pro version features and pricing, visit our [pricing page](https://tailadmin.com/pricing).

## Changelog

### Version 2.0.1 - [February 27, 2025]

#### Update Overview

- Upgraded to Tailwind CSS v4 for better performance and efficiency.
- Updated class usage to match the latest syntax and features.
- Replaced deprecated class and optimized styles.

#### Next Steps

- Run npm install or yarn install to update dependencies.
- Check for any style changes or compatibility issues.
- Refer to the Tailwind CSS v4 [Migration Guide](https://tailwindcss.com/docs/upgrade-guide) on this release. if needed.
- This update keeps the project up to date with the latest Tailwind improvements. 🚀

### Version 2.0.0 - [February 2025]

A major update with comprehensive redesign and modern React patterns implementation.

#### Major Improvements

- Complete UI redesign with modern React patterns
- New features: collapsible sidebar, chat, and calendar
- Improved performance and accessibility
- Updated data visualization using ApexCharts

#### Key Features

- Redesigned dashboards (Ecommerce, Analytics, Marketing, CRM)
- Enhanced navigation with React Router integration
- Advanced tables with sorting and filtering
- Calendar with drag-and-drop support
- New UI components and improved existing ones

#### Breaking Changes

- Updated sidebar component API
- Migrated charts to ApexCharts
- Revised authentication system

[Read more](https://tailadmin.com/docs/update-logs/react) on this release.

### Version 1.3.7 - [June 20, 2024]

#### Enhancements

1. Remove Repetition of DefaultLayout in every Pages
2. Add ClickOutside Component for reduce repeated functionality in Header Message, Notification and User Dropdowns.

### Version 1.3.6 - [Jan 31, 2024]

#### Enhancements

1. Integrate flatpickr in [Date Picker/Form Elements]
2. Change color after select an option [Select Element/Form Elements].
3. Make it functional [Multiselect Dropdown/Form Elements].
4. Make best value editable [Pricing Table One/Pricing Table].
5. Rearrange Folder structure.

### Version 1.2.0 - [Apr 28, 2023]

- Add Typescript in TailAdmin React.

### Version 1.0.0 - Initial Release - [Mar 13, 2023]

- Initial release of TailAdmin React.

## License

TailAdmin React.js Free Version is released under the MIT License.

## Support

If you find this project helpful, please consider giving it a star on GitHub. Your support helps us continue developing and maintaining this template.


changed image src from 
// Instead of:
// <img src="/images/logo/logo-dark.svg" />

// Use:
<img src={`${import.meta.env.VITE_APP_URL}/images/logo/logo-dark.svg`} />

# Moving Images to back end server
---
#### Based on the code excerpts, I see you have several image references in components like ResponsiveImage.tsx, ThreeColumnImageGrid.tsx, and AppHeader.tsx. Here's my recommendation:
#### For a production environment, it's better to serve static assets like images through your backend for several reasons:
#### Better asset management and caching
#### Centralized storage
#### Ability to implement CDN easily
#### Better security control

##Here's how to implement this:
### 1. First, create a static assets route in your backend. Update your backend's vercel.json:
```
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/public/images/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    }
  ]
}
```
### 2. Move your images from the frontend to a new structure in your backend:
backend-app/
└── public/
    └── images/
        ├── logo/
        │   ├── logo-dark.svg
        │   └── logo.svg
        └── grid-image/
            ├── image-01.png
            ├── image-02.png
            └── image-03.png
### 3. Create an images configuration file in your frontend:

```
src/config
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://admin-backend-eta.vercel.app'
  : 'http://localhost:5000';

export const getImageUrl = (path: string): string => {
  return `${API_URL}/images/${path}`;
};
```

### 4. Update your components to use the new image URLs. For example:

src/components/ui/images
ResponsiveImage.tsx - Create New in FE App
```
###
```

```
 src/layout/AppHeader.tsx
 import { getImageUrl } from '../config/images.config';

// In your component:
<Link to="/" className="lg:hidden">
  <img
    className="dark:hidden"
    src={getImageUrl('logo/logo.svg')}
    alt="Logo"
  />
  <img
    className="hidden dark:block"
    src={getImageUrl('logo/logo-dark.svg')}
    alt="Logo"
  />
</Link>
```

## For development environment, add a static file serving middleware to your backend Express app:

```
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
```

### 5. Update your environment variables:
```
### VITE_API_URL=http://localhost:5000/api
### VITE_ASSETS_URL=http://localhost:5000
### VITE_API_URL=https://admin-backend-eta.vercel.app/api
### VITE_ASSETS_URL=https://admin-backend-eta.vercel.app
```

## This setup will:
### Serve images through your backend in both development and production
### Keep your image assets centralized
### Make it easier to implement CDN or other optimizations later
### Maintain consistent URLs across environments
### Allow for better caching and asset management

## Remember to:
### Update all image references in your components
### Test the image loading in both development and production environments
### Consider implementing image optimization middleware in your backend
### Set up proper caching headers for static assets