# Deployment Strategy

## Overview

This project uses GitHub Actions to automatically build and publish Docker images to GitHub Container Registry (GHCR) whenever code is pushed to the `main` branch.

## GitHub Actions Workflow

### Trigger

- **Event**: Push to `main` branch
- **Location**: `.github/workflows/docker-publish.yml`

### Workflow Components

#### 1. Docker Buildx Setup

We use Docker Buildx for several advantages:

- Multi-platform build support
- Advanced caching capabilities
- Better build performance
- BuildKit features (improved layer caching, build secrets, etc.)

#### 2. Authentication

- **Registry**: GitHub Container Registry (`ghcr.io`)
- **Method**: Uses the built-in `GITHUB_TOKEN` secret
- **Permissions**: The workflow has `packages: write` permission to push images

The `GITHUB_TOKEN` is automatically provided by GitHub Actions and doesn't require manual configuration. It authenticates as the user who triggered the workflow (`github.actor`).

#### 3. Image Tagging Strategy

We use the `docker/metadata-action` to generate tags following best practices:

- **Commit SHA tag**: `sha-<full-commit-hash>` (e.g., `sha-abc123def456...`)

  - Provides immutable reference to exact code version
  - Enables precise rollbacks and debugging
  - Uses full SHA for uniqueness

- **Latest tag**: `latest`
  - Always points to the most recent build from main
  - Convenient for development and testing
  - Should not be used in production without pinning

#### 4. Build and Push

- Builds the Next.js application using the multi-stage Dockerfile
- Leverages GitHub Actions cache (`type=gha`) to speed up subsequent builds
- Cache mode set to `max` to cache all layers (including intermediate stages)
- Automatically pushes both tags to GHCR

### Best Practices Implemented

1. **Minimal Permissions**: Workflow only requests `contents: read` and `packages: write`
2. **Layer Caching**: GitHub Actions cache dramatically speeds up builds (can reduce build time by 70-90%)
3. **Immutable Tags**: SHA-based tags ensure reproducibility
4. **Multi-stage Build**: Dockerfile optimizes image size by separating build and runtime environments
5. **Metadata Labels**: Adds OCI-compliant labels for better image management
6. **Latest Ubuntu Runner**: Uses `ubuntu-latest` for most recent tooling

## Image Location

After the workflow runs, images are available at:

```
ghcr.io/<owner>/<repository>:<tag>
```

For example:

- `ghcr.io/owner/guppy:latest`
- `ghcr.io/owner/guppy:sha-abc123def456...`

## Using the Image

### Pull the image

```bash
# Pull latest
docker pull ghcr.io/<owner>/guppy:latest

# Pull specific commit
docker pull ghcr.io/<owner>/guppy:sha-abc123...
```

### Run the container

```bash
docker run -p 3000:3000 ghcr.io/<owner>/guppy:latest
```

## Next Steps for Production

Consider adding:

1. **Environment-specific deployments**: Add staging/production environment workflows
2. **Version tags**: Semantic versioning (v1.0.0, v1.0.1, etc.) for releases
3. **Build matrix**: Multi-architecture builds (amd64, arm64)
4. **Security scanning**: Integrate Trivy or similar for vulnerability scanning
5. **Deployment automation**: Auto-deploy to cloud platforms after successful builds
6. **Branch protection**: Require tests to pass before pushing to main
