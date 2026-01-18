#!/usr/bin/env python3
"""
GitHub Setup Script for Weather App
Creates repository, branches, commits, and PRs with proper developer workflow
"""

import os
import time
import subprocess
from github import Github, Auth, GithubException

# Configuration
TOKEN = "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"
REPO_NAME = "cl-tst-wthr"

# Initialize GitHub client
auth = Auth.Token(TOKEN)
g = Github(auth=auth)
user = g.get_user()

def run_git(cmd, cwd=None):
    """Run a git command"""
    result = subprocess.run(
        cmd, shell=True, cwd=cwd, capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result.returncode == 0

def create_repo():
    """Create the private repository"""
    print(f"Creating repository: {REPO_NAME}")
    try:
        repo = user.create_repo(
            REPO_NAME,
            private=True,
            description="Vue 3 Weather Application with multi-language support (EN/AR/FA)",
            auto_init=False
        )
        print(f"Repository created: {repo.html_url}")
        return repo
    except GithubException as e:
        if e.status == 422:
            print("Repository already exists, fetching...")
            return user.get_repo(REPO_NAME)
        raise

def commit_files_to_branch(repo, branch, files, commit_message, base_branch="main"):
    """Commit multiple files to a branch"""
    # Get base branch SHA
    try:
        base_ref = repo.get_git_ref(f"heads/{base_branch}")
        base_sha = base_ref.object.sha
    except:
        # If main doesn't exist, we're doing initial commit
        return False

    # Create new branch from base
    try:
        repo.create_git_ref(f"refs/heads/{branch}", base_sha)
        print(f"Created branch: {branch}")
    except GithubException as e:
        if e.status == 422:
            print(f"Branch {branch} already exists")
        else:
            raise

    # Get the base tree
    base_commit = repo.get_git_commit(base_sha)
    base_tree = base_commit.tree

    # Create tree elements for all files
    tree_elements = []
    for file_path, content in files.items():
        blob = repo.create_git_blob(content, "utf-8")
        tree_elements.append({
            "path": file_path,
            "mode": "100644",
            "type": "blob",
            "sha": blob.sha
        })

    # Create new tree
    new_tree = repo.create_git_tree(tree_elements, base_tree)

    # Create commit
    new_commit = repo.create_git_commit(commit_message, new_tree, [base_commit])

    # Update branch reference
    ref = repo.get_git_ref(f"heads/{branch}")
    ref.edit(new_commit.sha)

    print(f"Committed {len(files)} files to {branch}")
    return True

def create_and_merge_pr(repo, branch, title, body, base="main"):
    """Create a PR and merge it"""
    print(f"Creating PR: {title}")

    try:
        pr = repo.create_pull(
            title=title,
            body=body,
            head=branch,
            base=base
        )
        print(f"PR #{pr.number} created")

        # Wait for GitHub to process
        time.sleep(2)

        # Merge the PR
        pr.merge(merge_method="squash")
        print(f"PR #{pr.number} merged")

        # Delete the branch
        try:
            ref = repo.get_git_ref(f"heads/{branch}")
            ref.delete()
            print(f"Branch {branch} deleted")
        except:
            pass

        return pr.number
    except GithubException as e:
        print(f"Error creating PR: {e}")
        return None

def read_file(filepath):
    """Read file content"""
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(project_dir, filepath)
    with open(full_path, 'r', encoding='utf-8') as f:
        return f.read()

def main():
    print("=" * 50)
    print("GitHub Setup Script for Weather App")
    print("=" * 50)
    print()

    # Create repository
    repo = create_repo()
    repo_url = f"https://{TOKEN}@github.com/{user.login}/{REPO_NAME}.git"
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print(f"\nProject directory: {project_dir}")
    print(f"Repository URL: https://github.com/{user.login}/{REPO_NAME}")
    print()

    # Initialize local git repository
    os.chdir(project_dir)

    # Clean up any existing git
    subprocess.run("rm -rf .git", shell=True, cwd=project_dir)

    # Initialize git
    run_git("git init", project_dir)
    run_git(f"git remote add origin {repo_url}", project_dir)

    # ========== INITIAL COMMIT ==========
    print("\n--- Initial Commit ---")

    initial_files = {
        ".gitignore": read_file(".gitignore"),
        "package.json": read_file("package.json"),
        "tsconfig.json": read_file("tsconfig.json"),
        "tsconfig.app.json": read_file("tsconfig.app.json"),
        "tsconfig.node.json": read_file("tsconfig.node.json"),
        "vite.config.ts": read_file("vite.config.ts"),
        "vitest.config.ts": read_file("vitest.config.ts"),
        "index.html": read_file("index.html"),
        ".env.example": read_file(".env.example"),
    }

    # Create initial commit using git commands
    for filepath in initial_files.keys():
        run_git(f"git add {filepath}", project_dir)

    run_git('git commit -m "chore: initial project setup with Vite + Vue 3 + TypeScript"', project_dir)
    run_git("git branch -M main", project_dir)
    run_git("git push -u origin main", project_dir)
    print("Initial commit pushed to main")

    # ========== FEATURE: i18n Setup ==========
    print("\n--- Feature: i18n Setup ---")
    i18n_files = {
        "src/locales/en.json": read_file("src/locales/en.json"),
        "src/locales/ar.json": read_file("src/locales/ar.json"),
        "src/locales/fa.json": read_file("src/locales/fa.json"),
    }

    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/i18n-setup", project_dir)

    os.makedirs(os.path.join(project_dir, "src/locales"), exist_ok=True)
    for filepath, content in i18n_files.items():
        run_git(f"git add {filepath}", project_dir)

    run_git('git commit -m "feat(i18n): add multi-language support for EN, AR, FA"', project_dir)
    run_git("git push -u origin feature/i18n-setup", project_dir)

    create_and_merge_pr(
        repo,
        "feature/i18n-setup",
        "feat(i18n): Add multi-language support",
        "## Summary\n- Add vue-i18n with English, Arabic, and Persian translations\n- Support RTL layouts\n\n## Test Plan\n- Verify language switching works"
    )

    # ========== FEATURE: Types ==========
    print("\n--- Feature: Weather Types ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/weather-types", project_dir)

    os.makedirs(os.path.join(project_dir, "src/types"), exist_ok=True)
    run_git("git add src/types/weather.ts", project_dir)
    run_git('git commit -m "feat(types): add TypeScript types for weather data"', project_dir)
    run_git("git push -u origin feature/weather-types", project_dir)

    create_and_merge_pr(
        repo,
        "feature/weather-types",
        "feat(types): Add TypeScript weather types",
        "## Summary\n- Comprehensive TypeScript types for WeatherAPI.com\n- Types for current weather, forecast, air quality"
    )

    # ========== FEATURE: Composables ==========
    print("\n--- Feature: Composables ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/composables", project_dir)

    os.makedirs(os.path.join(project_dir, "src/composables"), exist_ok=True)
    run_git("git add src/composables/useWeather.ts src/composables/useSettings.ts", project_dir)
    run_git('git commit -m "feat(composables): add useWeather and useSettings composables"', project_dir)
    run_git("git push -u origin feature/composables", project_dir)

    create_and_merge_pr(
        repo,
        "feature/composables",
        "feat(composables): Add weather and settings composables",
        "## Summary\n- useWeather: city search, weather fetching\n- useSettings: theme, language management"
    )

    # ========== FEATURE: Components ==========
    print("\n--- Feature: Components ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/components", project_dir)

    os.makedirs(os.path.join(project_dir, "src/components"), exist_ok=True)
    run_git("git add src/components/*.vue", project_dir)
    run_git('git commit -m "feat(components): add weather display components"', project_dir)
    run_git("git push -u origin feature/components", project_dir)

    create_and_merge_pr(
        repo,
        "feature/components",
        "feat(components): Add weather display components",
        "## Summary\n- CitySearch with autocomplete\n- CurrentWeather, ForecastCard, HourlyForecast\n- AstroCard, SettingsMenu"
    )

    # ========== FEATURE: Main App ==========
    print("\n--- Feature: Main App ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/main-app", project_dir)

    run_git("git add src/main.ts src/App.vue", project_dir)
    run_git('git commit -m "feat(app): integrate all components in main App"', project_dir)
    run_git("git push -u origin feature/main-app", project_dir)

    create_and_merge_pr(
        repo,
        "feature/main-app",
        "feat(app): Integrate components in main application",
        "## Summary\n- Vuetify and i18n setup\n- Responsive App.vue layout\n- Complete application integration"
    )

    # ========== FEATURE: Tests ==========
    print("\n--- Feature: Tests ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/tests", project_dir)

    os.makedirs(os.path.join(project_dir, "src/__tests__"), exist_ok=True)
    run_git("git add src/__tests__/*.ts", project_dir)
    run_git('git commit -m "test: add comprehensive test suite with 68 tests"', project_dir)
    run_git("git push -u origin feature/tests", project_dir)

    create_and_merge_pr(
        repo,
        "feature/tests",
        "test: Add comprehensive test suite",
        "## Summary\n- Unit tests for composables\n- Component tests for all weather components\n- 68 tests total"
    )

    # ========== FEATURE: CI/CD ==========
    print("\n--- Feature: CI/CD ---")
    run_git("git checkout main && git pull origin main", project_dir)
    run_git("git checkout -b feature/cicd", project_dir)

    os.makedirs(os.path.join(project_dir, ".github/workflows"), exist_ok=True)
    run_git("git add .github/workflows/*.yml", project_dir)
    run_git('git commit -m "ci: add GitHub Actions workflows for deployment and PR checks"', project_dir)
    run_git("git push -u origin feature/cicd", project_dir)

    create_and_merge_pr(
        repo,
        "feature/cicd",
        "ci: Add GitHub Actions workflows",
        "## Summary\n- deploy.yml for GitHub Pages deployment\n- pr-check.yml for PR validation"
    )

    print("\n" + "=" * 50)
    print("GitHub repository setup complete!")
    print("=" * 50)
    print(f"\nRepository: https://github.com/{user.login}/{REPO_NAME}")
    print("\nNext steps:")
    print("1. Add WEATHER_API_KEY secret in repository settings")
    print("2. Enable GitHub Pages in repository settings (use gh-pages branch)")
    print("3. Get your API key from https://www.weatherapi.com/")
    print("=" * 50)

if __name__ == "__main__":
    main()
