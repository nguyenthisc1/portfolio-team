# Portfolio Website

A modern, SEO-optimized portfolio website built with Next.js 15, featuring 3D animations, dynamic content management, and best-in-class performance.

## 🚀 Features

### SEO Optimizations
- ✅ **Robots.txt** - Configured for optimal search engine crawling
- ✅ **XML Sitemap** - Auto-generated sitemap for better indexing
- ✅ **Structured Data (JSON-LD)** - Schema.org markup for rich snippets
- ✅ **Open Graph & Twitter Cards** - Social media optimization
- ✅ **Semantic HTML** - Proper heading hierarchy and ARIA labels
- ✅ **Meta Tags** - Dynamic metadata based on CMS content
- ✅ **Canonical URLs** - Prevent duplicate content issues

### Performance
- ⚡ Server-side rendering (SSR)
- ⚡ Image optimization with lazy loading
- ⚡ Code splitting and tree shaking
- ⚡ Optimized fonts with Next.js font optimization

### Features
- 🎨 3D animations with GSAP and Three.js
- 🎵 Interactive sound experience
- 📱 Fully responsive design
- 🌟 Interactive star field background
- 🎯 Dynamic cursor effects
- 📊 CMS-driven content management

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with custom properties
- **Animations**: GSAP
- **3D Graphics**: Three.js / React Three Fiber
- **State Management**: Zustand
- **Database**: MongoDB (via dashboard)
- **Fonts**: IBM Plex Sans Condensed, Oswald

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Base URL for SEO
NEXT_PUBLIC_BASE_URL=https://yourwebsite.com

# API endpoints (if needed)
NEXT_PUBLIC_API_URL=your-api-url
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/            # Home page route group
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── robots.ts          # Robots.txt configuration
│   │   └── sitemap.ts         # Dynamic sitemap
│   ├── features/              # Feature-based modules
│   │   └── home/              # Home page features
│   │       ├── canvas/        # 3D canvas components
│   │       └── components/    # Home page components
│   ├── server/                # Server actions
│   ├── shared/                # Shared utilities
│   │   ├── components/        # Reusable components
│   │   ├── fonts/            # Custom fonts
│   │   ├── providers/        # Context providers
│   │   └── stores/           # State management
│   └── types.ts              # TypeScript types
├── public/                    # Static assets
│   ├── images/               # Image assets
│   └── favicon/              # Favicon files
└── README.md                 # This file
```

## 🎯 SEO Best Practices Implemented

### 1. Metadata & Tags
- Dynamic meta titles and descriptions
- Proper Open Graph tags for social sharing
- Twitter Card optimization
- Keywords management via CMS

### 2. Structured Data
- WebSite schema
- Organization schema
- Person schema for team members
- Breadcrumb navigation (ready to implement)

### 3. Technical SEO
- Clean, semantic HTML structure
- Proper heading hierarchy (h1, h2, h3)
- Alt text for all images
- Canonical URLs
- Mobile-responsive design
- Fast page load times

### 4. Content SEO
- Hidden content for crawlers during loading state
- Proper internal linking
- Descriptive anchor text
- Rich content sections

## 🔍 Search Console Setup

To monitor your SEO performance:

1. **Google Search Console**
   - Verify ownership using meta tag
   - Submit sitemap: `https://yourwebsite.com/sitemap.xml`
   - Monitor indexing status

2. **Bing Webmaster Tools**
   - Add verification meta tag
   - Submit sitemap
   - Monitor crawl errors

3. **Analytics**
   - Set up Google Analytics
   - Configure conversion tracking
   - Monitor user behavior

## 🎨 Customization

### Update SEO Content
Content is managed through the dashboard CMS:
- Navigate to the dashboard
- Update SEO section (title, description, keywords)
- Changes reflect immediately on the website

### Update Base URL
Update `NEXT_PUBLIC_BASE_URL` in your environment variables for:
- Canonical URLs
- Open Graph URLs
- Sitemap URLs
- Structured data URLs

## 📊 Performance Optimization

- Uses Next.js Image component for automatic optimization
- Implements lazy loading for images
- Code splitting by route
- Font optimization with `next/font`
- Vercel Speed Insights integration

## 🌐 Deployment

### Vercel (Recommended)
```bash
pnpm build
# Deploy to Vercel
```

### Other Platforms
1. Build the application: `pnpm build`
2. Set environment variables
3. Deploy the `.next` folder
4. Set up your custom domain
5. Update `NEXT_PUBLIC_BASE_URL`

## 📝 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a private project. For team members, please follow the development workflow:
1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for review

## 📞 Support

For questions or support, contact the development team.

---

Built with ❤️ by the Portfolio Team
