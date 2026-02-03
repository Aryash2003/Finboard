# Finance Dashboard - Widget-Based Application

A comprehensive, real-time finance dashboard built with **Next.js** and **Redux Toolkit** that enables dynamic widget creation for Indian Stock Market data visualization.

## 🚀 Features

- **20+ API Endpoints** - IPO data, trending stocks, mutual funds, market news, and more
- **Dynamic Widget Creation** - Multi-step modal with API testing and field selection
- **3 Display Modes** - Card, Table, and Chart views for different data types
- **Drag-and-Drop** - Reorder widgets with smooth animations
- **Real-Time Updates** - Configurable auto-refresh intervals
- **Data Persistence** - Widgets automatically saved to localStorage
- **Responsive Design** - Optimized for desktop, tablet, and mobile

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| Redux Toolkit | State management |
| Tailwind CSS | Styling and responsive design |
| @dnd-kit | Drag-and-drop functionality |
| Recharts | Data visualization |
| React Hot Toast | Notifications |
| TypeScript | Type safety |

## 🎯 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 📊 Supported API Endpoints

### Market Data
- IPO Data
- Trending Stocks
- Price Shockers
- BSE/NSE Most Active
- 52 Week High/Low
- Commodities

### Stocks & Analysis
- Stock Details
- Stock Forecasts
- Historical Data
- Target Prices

### Funds & News
- Mutual Funds
- Fund Search
- Market News
- Corporate Actions

## 🎨 Usage

### Creating a Widget

1. Click the **"Add Widget"** button in the header
2. Enter a widget name
3. Select an API endpoint from the dropdown
4. Fill in required parameters (if any)
5. Choose a display mode (Card/Table/Chart)
6. Set refresh interval
7. Click **"Test & Continue"** to validate the API
8. Select fields to display
9. Click **"Add Widget"** to create

### Managing Widgets

- **Refresh** - Click the refresh icon to update widget data
- **Delete** - Click the trash icon to remove a widget
- **Reorder** - Drag and drop widgets to rearrange
- **Persistent** - Widgets automatically save and restore on page reload

## 📁 Project Structure

```
my-app/
├── app/
│   ├── components/header.tsx       # Dashboard header
│   ├── page.tsx                    # Main dashboard page
│   ├── layout.tsx                  # Root layout
│   ├── providers.tsx               # Redux Provider
│   └── globals.css                 # Global styles
├── components/
│   ├── UI/                         # Reusable components
│   ├── AddWidgetModal/             # Widget creation flow
│   ├── Dashboard/                  # Widget grid
│   └── Widget/                     # Display components
├── store/
│   ├── store.ts                    # Redux configuration
│   ├── slices/widgetSlice.ts      # Widget state
│   └── middleware/localStorage.ts  # Persistence
├── config/api-endpoints.ts         # API configurations
├── services/api.ts                 # API service layer
├── hooks/                          # Custom React hooks
├── types/                          # TypeScript definitions
└── utils/                          # Helper functions
```

## 🔧 Configuration

### API Key

The Indian Stock API key is required for most endpoints. We proxy requests through a server-side route to avoid CORS and keep the key secret.

Preferred (server-only):
```env
INDIAN_STOCK_API_KEY=your_api_key_here
```

Optional (public, not recommended):
```env
NEXT_PUBLIC_INDIAN_STOCK_API_KEY=your_api_key_here
```

After setting environment variables, restart the dev server so the new values are picked up.

### Customization

- **Refresh Intervals** - Modify default in AddWidgetModal (currently 30 seconds)
- **Cache Duration** - Adjust in `services/api.ts` (currently 30 seconds)
- **Theme Colors** - Customize in `globals.css` and Tailwind config

## 📸 Screenshots

### Dashboard with Widget
![Dashboard showing IPO data widget](./docs/dashboard-screenshot.png)

### Add Widget Modal
![Modal for creating new widgets](./docs/modal-screenshot.png)

## 🎯 Key Components

### WidgetCard
Displays individual widgets with refresh/delete controls and three view modes.

### AddWidgetModal
Multi-step modal for widget configuration with API testing.

### WidgetGrid
Drag-and-drop sortable grid using @dnd-kit.

### Redux Store
Centralized state management with localStorage persistence.

## 🔐 Security Note

> **Warning**: The API key is currently exposed in the codebase. For production deployment:
> - Use environment variables
> - Implement Next.js API routes as proxy
> - Add rate limiting
> - Implement user authentication

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Minor Next.js hydration warning in development (does not affect functionality)
- Export/Import feature not yet implemented

## 🚧 Future Enhancements

- [ ] Widget configuration export/import
- [ ] User authentication and cloud sync
- [ ] More chart types (candlestick, area, pie)
- [ ] Widget templates library
- [ ] Dark/light mode toggle
- [ ] Advanced filtering and sorting

---

Built with ❤️ using Next.js and Redux
