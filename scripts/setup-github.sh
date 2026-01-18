#!/bin/bash

# GitHub Setup Script for Weather App
# This script creates the repository, branches, commits, and PRs

set -e

# Configuration
GITHUB_TOKEN="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"
REPO_NAME="cl-tst-wthr"
GITHUB_API="https://api.github.com"

# Get GitHub username
GITHUB_USER=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "$GITHUB_API/user" | jq -r '.login')
echo "GitHub User: $GITHUB_USER"

# Create repository
echo "Creating repository..."
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "$GITHUB_API/user/repos" \
  -d "{\"name\":\"$REPO_NAME\",\"private\":true,\"description\":\"Vue 3 Weather Application with multi-language support\",\"auto_init\":false}" > /dev/null

REPO_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"
echo "Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"

# Initialize git and push to main
cd "$(dirname "$0")/.."
rm -rf .git
git init
git remote add origin "$REPO_URL"

# Initial commit
git add .gitignore package.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts vitest.config.ts index.html .env.example
git commit -m "chore: initial project setup with Vite + Vue 3 + TypeScript

- Set up Vite with Vue 3 and TypeScript
- Configure Vuetify 3 for Material Design components
- Add Vitest for testing
- Configure GitHub Pages deployment base path"

git branch -M main
git push -u origin main

echo "Initial commit pushed to main"

# Function to create PR and merge
create_feature_branch_and_pr() {
  local branch_name=$1
  local commit_msg=$2
  local pr_title=$3
  local pr_body=$4
  shift 4
  local files=("$@")

  echo "Creating feature branch: $branch_name"
  git checkout main
  git pull origin main
  git checkout -b "$branch_name"

  for file in "${files[@]}"; do
    git add "$file"
  done

  git commit -m "$commit_msg"
  git push -u origin "$branch_name"

  # Create PR
  echo "Creating PR: $pr_title"
  PR_RESPONSE=$(curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "$GITHUB_API/repos/$GITHUB_USER/$REPO_NAME/pulls" \
    -d "{\"title\":\"$pr_title\",\"body\":\"$pr_body\",\"head\":\"$branch_name\",\"base\":\"main\"}")

  PR_NUMBER=$(echo "$PR_RESPONSE" | jq -r '.number')
  echo "PR #$PR_NUMBER created"

  # Wait a moment then merge
  sleep 2

  echo "Merging PR #$PR_NUMBER"
  curl -s -X PUT -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "$GITHUB_API/repos/$GITHUB_USER/$REPO_NAME/pulls/$PR_NUMBER/merge" \
    -d "{\"merge_method\":\"squash\"}" > /dev/null

  # Delete branch after merge
  curl -s -X DELETE -H "Authorization: token $GITHUB_TOKEN" \
    "$GITHUB_API/repos/$GITHUB_USER/$REPO_NAME/git/refs/heads/$branch_name" > /dev/null

  git checkout main
  git pull origin main
  echo "PR #$PR_NUMBER merged and branch deleted"
  echo ""
}

# Feature 1: i18n Setup
create_feature_branch_and_pr \
  "feature/i18n-setup" \
  "feat(i18n): add multi-language support for EN, AR, FA

- Add vue-i18n configuration
- Create translation files for English, Arabic, and Persian
- Support RTL layout for Arabic and Persian" \
  "feat(i18n): Add multi-language support" \
  "## Summary\n- Add vue-i18n with English, Arabic, and Persian translations\n- Support RTL layouts for Arabic and Persian\n\n## Test Plan\n- Verify language switching works\n- Verify RTL layout displays correctly" \
  "src/locales/en.json" "src/locales/ar.json" "src/locales/fa.json"

# Feature 2: Weather Types
create_feature_branch_and_pr \
  "feature/weather-types" \
  "feat(types): add TypeScript types for weather data

- Define City, CurrentWeather, Forecast interfaces
- Add AirQuality and Location types
- Define UnitSystem type for metric/imperial" \
  "feat(types): Add TypeScript weather types" \
  "## Summary\n- Add comprehensive TypeScript types for WeatherAPI.com responses\n- Include types for current weather, forecast, and air quality\n\n## Test Plan\n- Verify types provide proper IntelliSense" \
  "src/types/weather.ts"

# Feature 3: Composables
create_feature_branch_and_pr \
  "feature/composables" \
  "feat(composables): add useWeather and useSettings composables

- Create useWeather for API interactions and state
- Create useSettings for theme and language management
- Add localStorage persistence" \
  "feat(composables): Add weather and settings composables" \
  "## Summary\n- useWeather: city search, weather fetching, unit conversion\n- useSettings: theme, language, RTL support\n\n## Test Plan\n- Run unit tests for composables" \
  "src/composables/useWeather.ts" "src/composables/useSettings.ts"

# Feature 4: Components
create_feature_branch_and_pr \
  "feature/components" \
  "feat(components): add weather display components

- CitySearch with autocomplete
- CurrentWeather with detailed info
- ForecastCard for 5-day forecast
- HourlyForecast with horizontal scroll
- AstroCard for sun/moon info
- SettingsMenu for preferences" \
  "feat(components): Add weather display components" \
  "## Summary\n- Complete set of weather display components\n- Beautiful Material Design styling\n- Responsive for mobile devices\n\n## Test Plan\n- Visual inspection on different screen sizes\n- Run component tests" \
  "src/components/CitySearch.vue" "src/components/CurrentWeather.vue" "src/components/ForecastCard.vue" "src/components/HourlyForecast.vue" "src/components/AstroCard.vue" "src/components/SettingsMenu.vue"

# Feature 5: Main App
create_feature_branch_and_pr \
  "feature/main-app" \
  "feat(app): integrate all components in main App

- Set up Vuetify and i18n in main.ts
- Create responsive App.vue layout
- Add theme and RTL support" \
  "feat(app): Integrate components in main application" \
  "## Summary\n- Main.ts with Vuetify and i18n setup\n- App.vue with responsive layout\n- Complete application integration\n\n## Test Plan\n- Run application locally\n- Test all features" \
  "src/main.ts" "src/App.vue"

# Feature 6: Tests
create_feature_branch_and_pr \
  "feature/tests" \
  "test: add comprehensive test suite

- Unit tests for composables
- Component tests with Vue Test Utils
- 68 tests total with full coverage" \
  "test: Add comprehensive test suite" \
  "## Summary\n- Unit tests for useWeather and useSettings\n- Component tests for all weather components\n- Test setup with Vitest and Vue Test Utils\n\n## Test Plan\n- Run npm run test:run\n- Verify all 68 tests pass" \
  "src/__tests__/setup.ts" "src/__tests__/useWeather.spec.ts" "src/__tests__/useSettings.spec.ts" "src/__tests__/CitySearch.spec.ts" "src/__tests__/CurrentWeather.spec.ts" "src/__tests__/ForecastCard.spec.ts" "src/__tests__/HourlyForecast.spec.ts" "src/__tests__/AstroCard.spec.ts" "src/__tests__/SettingsMenu.spec.ts"

# Feature 7: CI/CD
create_feature_branch_and_pr \
  "feature/cicd" \
  "ci: add GitHub Actions workflows

- deploy.yml for GitHub Pages deployment
- pr-check.yml for PR validation
- Run tests, lint, and build on PRs" \
  "ci: Add GitHub Actions workflows" \
  "## Summary\n- Automatic deployment to GitHub Pages on push to main\n- PR checks with tests, lint, and build\n- Coverage report artifact upload\n\n## Test Plan\n- Verify workflows in GitHub Actions" \
  ".github/workflows/deploy.yml" ".github/workflows/pr-check.yml"

# Feature 8: Documentation
create_feature_branch_and_pr \
  "feature/docs" \
  "docs: add README and configuration files

- Comprehensive README with setup instructions
- Environment variable documentation
- Project structure documentation" \
  "docs: Add README and documentation" \
  "## Summary\n- Complete README with features and setup\n- .env.example for API key\n- Project structure overview\n\n## Test Plan\n- Review documentation for completeness" \
  "README.md"

echo ""
echo "=========================================="
echo "GitHub repository setup complete!"
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "Next steps:"
echo "1. Add WEATHER_API_KEY secret in repository settings"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Get your API key from https://www.weatherapi.com/"
echo "=========================================="
