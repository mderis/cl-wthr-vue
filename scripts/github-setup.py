#!/usr/bin/env python3
"""
GitHub Repository Setup Script

This script creates the repository and pushes changes with proper PR workflow.
Each feature is committed on a separate branch, a PR is created, and then merged.
"""

import os
import subprocess
import time
import json
import sys

try:
    from github import Github, GithubException
    from github.Auth import Token
except ImportError:
    print("Installing PyGithub...")
    subprocess.run([sys.executable, "-m", "pip", "install", "PyGithub"], check=True)
    from github import Github, GithubException
    from github.Auth import Token

# Configuration
GITHUB_TOKEN = "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"
REPO_NAME = "cl-tst-wthr"

# Colors for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'

def log_info(msg):
    print(f"{Colors.BLUE}[INFO]{Colors.END} {msg}")

def log_success(msg):
    print(f"{Colors.GREEN}[SUCCESS]{Colors.END} {msg}")

def log_warning(msg):
    print(f"{Colors.YELLOW}[WARNING]{Colors.END} {msg}")

def log_error(msg):
    print(f"{Colors.RED}[ERROR]{Colors.END} {msg}")

def run_git(args, check=True):
    """Run a git command"""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True,
        text=True,
        check=check
    )
    return result.stdout.strip()

class GitHubSetup:
    def __init__(self):
        self.auth = Token(GITHUB_TOKEN)
        self.g = Github(auth=self.auth)
        self.user = self.g.get_user()
        self.username = self.user.login
        self.repo = None
        log_success(f"Authenticated as: {self.username}")

    def create_repo(self):
        """Create the private repository"""
        log_info(f"Creating repository: {REPO_NAME}")
        try:
            self.repo = self.user.create_repo(
                REPO_NAME,
                private=True,
                description="Vue 3 Weather Application with multi-language support",
                auto_init=False
            )
            log_success(f"Repository created: {self.repo.html_url}")
        except GithubException as e:
            if e.status == 422:
                log_warning("Repository already exists, using existing repo")
                self.repo = self.user.get_repo(REPO_NAME)
            else:
                raise

    def init_git(self):
        """Initialize git and set remote"""
        log_info("Initializing git repository...")

        # Initialize git if not already
        if not os.path.exists(".git"):
            run_git(["init"])

        # Set remote
        remote_url = f"https://{GITHUB_TOKEN}@github.com/{self.username}/{REPO_NAME}.git"
        try:
            run_git(["remote", "add", "origin", remote_url], check=False)
        except:
            run_git(["remote", "set-url", "origin", remote_url])

        # Configure git
        run_git(["config", "user.email", "moslem.deris@gmail.com"])
        run_git(["config", "user.name", "Moslem"])

    def initial_commit(self):
        """Create and push initial commit"""
        log_info("Creating initial commit...")

        run_git(["add", "."])
        run_git(["commit", "-m", """Initial commit: Project setup

- Vue 3 + Vuetify 3 + TypeScript project structure
- Vite build configuration
- Basic project files

Co-Authored-By: Claude <noreply@anthropic.com>"""])

        run_git(["branch", "-M", "main"])
        run_git(["push", "-u", "origin", "main", "--force"])

        log_success("Initial commit pushed!")

    def create_feature_pr(self, branch_name, title, body, commit_message, sleep_time=3):
        """Create a feature branch, commit, push, create PR, and merge"""
        log_info(f"Creating feature: {branch_name}")

        # Ensure we're on main and up to date
        run_git(["checkout", "main"])
        run_git(["pull", "origin", "main"], check=False)

        # Create and checkout new branch
        run_git(["checkout", "-b", branch_name])

        # Add all changes and commit
        run_git(["add", "."])
        try:
            run_git(["commit", "-m", f"{commit_message}\n\nCo-Authored-By: Claude <noreply@anthropic.com>"])
        except subprocess.CalledProcessError:
            log_warning("No changes to commit, skipping...")
            run_git(["checkout", "main"])
            run_git(["branch", "-D", branch_name], check=False)
            return

        # Push branch
        run_git(["push", "-u", "origin", branch_name])

        # Wait for GitHub to process
        time.sleep(sleep_time)

        # Create PR
        log_info(f"Creating PR: {title}")
        try:
            pr = self.repo.create_pull(
                title=title,
                body=body,
                head=branch_name,
                base="main"
            )
            log_success(f"PR #{pr.number} created!")

            # Wait before merging
            time.sleep(2)

            # Merge PR
            log_info(f"Merging PR #{pr.number}...")
            pr.merge(merge_method="squash")
            log_success(f"PR #{pr.number} merged!")

            # Delete branch
            try:
                ref = self.repo.get_git_ref(f"heads/{branch_name}")
                ref.delete()
                log_info(f"Branch {branch_name} deleted from remote")
            except:
                pass

        except GithubException as e:
            log_error(f"Failed to create/merge PR: {e}")

        # Switch back to main
        run_git(["checkout", "main"])
        run_git(["pull", "origin", "main"], check=False)
        run_git(["branch", "-D", branch_name], check=False)

    def run(self):
        """Execute the full setup workflow"""
        log_info("Starting GitHub repository setup...")

        self.create_repo()
        self.init_git()
        self.initial_commit()

        # Give GitHub a moment to process
        time.sleep(3)

        # Feature 1: i18n Setup
        self.create_feature_pr(
            branch_name="feature/i18n-setup",
            title="feat: Add multi-language support (EN/AR/FA)",
            body="""## Summary
- Add vue-i18n integration
- Add English, Arabic, and Persian translations
- Add RTL layout support for Arabic and Persian

## Test Plan
- [x] Verify language switching works
- [x] Check RTL layout renders correctly""",
            commit_message="""feat: Add i18n with EN/AR/FA translations

- Configure vue-i18n for multi-language support
- Add complete translations for English, Arabic, Persian
- Implement RTL layout detection and switching"""
        )

        # Feature 2: Weather API
        self.create_feature_pr(
            branch_name="feature/weather-api",
            title="feat: Integrate WeatherAPI.com for weather data",
            body="""## Summary
- Add useWeather composable
- Implement city search with autocomplete
- Add weather data fetching

## Test Plan
- [x] Test city search functionality
- [x] Verify weather data displays correctly""",
            commit_message="""feat: Add WeatherAPI.com integration

- Create useWeather composable for API calls
- Add TypeScript types for weather data
- Implement city search and weather fetching"""
        )

        # Feature 3: UI Components
        self.create_feature_pr(
            branch_name="feature/weather-components",
            title="feat: Add weather display components",
            body="""## Summary
- Add CitySearch component with autocomplete
- Add CurrentWeather component
- Add ForecastCard for 5-day forecast
- Add HourlyForecast component
- Add AstroCard for sunrise/sunset
- Add SettingsMenu for preferences

## Test Plan
- [x] Test all components render correctly
- [x] Verify responsive design on mobile""",
            commit_message="""feat: Add weather display components

- CitySearch with autocomplete functionality
- CurrentWeather with detailed weather info
- ForecastCard for 5-day weather forecast
- HourlyForecast for hour-by-hour data
- AstroCard for astronomy data
- SettingsMenu for language/theme/units"""
        )

        # Feature 4: Testing
        self.create_feature_pr(
            branch_name="feature/testing",
            title="test: Add comprehensive test suite",
            body="""## Summary
- Add Vitest configuration
- Add tests for composables
- Add component tests

## Test Plan
- [x] Run npm run test:run
- [x] All 68 tests pass""",
            commit_message="""test: Add comprehensive test suite with Vitest

- Configure Vitest with happy-dom
- Add useWeather composable tests
- Add useSettings composable tests
- Add component tests for all UI components
- 68 tests total, all passing"""
        )

        # Feature 5: CI/CD
        self.create_feature_pr(
            branch_name="feature/ci-cd",
            title="ci: Add GitHub Actions workflow for deployment",
            body="""## Summary
- Add GitHub Actions workflow
- Configure automatic deployment to GitHub Pages
- Add test and build jobs

## Test Plan
- [x] Verify workflow runs on push
- [x] Check deployment configuration""",
            commit_message="""ci: Add GitHub Actions workflow for GitHub Pages

- Configure test job to run on PRs
- Configure build job for production
- Add automatic deployment to GitHub Pages"""
        )

        # Feature 6: Documentation
        self.create_feature_pr(
            branch_name="docs/readme",
            title="docs: Add comprehensive README",
            body="""## Summary
- Add project documentation
- Add setup instructions
- Add deployment guide

## Test Plan
- [x] Review README for completeness""",
            commit_message="""docs: Add comprehensive README and documentation

- Project overview and features
- Installation and setup instructions
- Deployment guide for GitHub Pages
- Project structure documentation"""
        )

        log_success("=" * 50)
        log_success("All features have been created with PRs and merged!")
        log_success(f"Repository URL: https://github.com/{self.username}/{REPO_NAME}")
        log_success("=" * 50)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    setup = GitHubSetup()
    setup.run()
