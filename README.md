# Weather App

A beautiful, responsive weather application built with Vue 3, Vuetify 3, and TypeScript. Features multi-language support (English, Arabic, Persian) with RTL layout support.

## Features

- 🌍 **City Autocomplete Search** - Search for any city worldwide with instant suggestions
- 🌡️ **Current Weather** - Real-time temperature, feels like, humidity, wind, and more
- 📅 **5-Day Forecast** - Detailed daily weather predictions
- ⏰ **Hourly Forecast** - Hour-by-hour weather breakdown
- 🌅 **Astronomy Data** - Sunrise, sunset, and moon phase information
- 🌬️ **Air Quality Index** - Real-time air quality monitoring
- 🌐 **Multi-language Support** - English, Arabic (العربية), and Persian (فارسی)
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🎨 **Dark/Light Theme** - Toggle between themes
- 📏 **Unit System Toggle** - Switch between Metric (°C) and Imperial (°F)

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component framework
- **TypeScript** - Type-safe JavaScript
- **Vue I18n** - Internationalization plugin
- **Vite** - Next-generation frontend build tool
- **Vitest** - Fast unit testing framework
- **WeatherAPI.com** - Weather data provider

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/cl-tst-wthr.git
cd cl-tst-wthr
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file based on \`.env.example\`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/) and add it to your \`.env\` file:
\`\`\`
VITE_WEATHER_API_KEY=your_api_key_here
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build locally
- \`npm run test\` - Run tests in watch mode
- \`npm run test:run\` - Run tests once
- \`npm run test:coverage\` - Run tests with coverage report
- \`npm run type-check\` - Run TypeScript type checking

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup GitHub Pages Deployment

1. Go to your repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Add your WeatherAPI key as a repository secret:
   - Go to Settings > Secrets and variables > Actions
   - Add a new secret named \`WEATHER_API_KEY\`

The app will automatically deploy to GitHub Pages when you push to the \`main\` branch.

## Project Structure

\`\`\`
src/
├── components/          # Vue components
│   ├── AstroCard.vue   # Sunrise/sunset/moon info
│   ├── CitySearch.vue  # Autocomplete city search
│   ├── CurrentWeather.vue  # Current weather display
│   ├── ForecastCard.vue    # 5-day forecast
│   ├── HourlyForecast.vue  # Hourly forecast
│   └── SettingsMenu.vue    # Language/theme/unit settings
├── composables/         # Vue composables
│   ├── useSettings.ts  # Theme, language, RTL management
│   └── useWeather.ts   # Weather API integration
├── locales/            # Translation files
│   ├── ar.json        # Arabic translations
│   ├── en.json        # English translations
│   └── fa.json        # Persian translations
├── types/              # TypeScript types
│   └── weather.ts     # Weather API types
├── __tests__/          # Test files
├── App.vue            # Root component
└── main.ts            # Application entry point
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Icons from [Material Design Icons](https://materialdesignicons.com/)
- UI components from [Vuetify](https://vuetifyjs.com/)
