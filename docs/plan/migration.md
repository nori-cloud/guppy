## Database migration automation plan (Kubernetes + Argo CD)

### Objective

Automate database schema and data migrations during production deployments, ensuring safety, repeatability, and zero/near-zero downtime in a GitOps workflow managed by Argo CD.

### Assumptions

- The application is deployed to a Kubernetes cluster via Argo CD (pull-based GitOps).
- The application uses a migration tool or command (e.g., Flyway, Liquibase, Prisma, Knex, Alembic, Rails, Django, Atlas, etc.).
- Production changes must be auditable via Git, observable, and reversible where practical.

## Safety principles (zero-downtime oriented)

- **Expand-only first, contract later**: Use a two-phase expand/contract approach. Deploy backward-compatible schema changes first (additive), then roll code, then remove deprecated schema in a later release.
- **Backwards/forwards compatibility**: Ensure app code can run against both old and new schemas during rollout.
- **Idempotent, safe migrations**: Migrations should be re-runnable and protective against concurrent execution.
- **Gate destructive changes**: For drops/renames, require explicit approvals, backups, and preferably separate releases.
- **Operational safeguards**: Take a quick backup or a point-in-time recovery marker before applying risky migrations.

## Options to automate migrations

### 1) Argo CD Resource Hooks with Kubernetes Job (recommended)

How it works:

- Define a `Job` annotated with Argo CD hook annotations to run during `PreSync` (before app rollout), optionally `PostSync` for verification.
- Argo CD orchestrates ordering with sync waves and treats hook results as part of sync health.

Pros:

- **GitOps-native** (fully driven by manifests in Git).
- **Deterministic ordering** with sync phases and waves.
- **Observability**: status and logs visible in Argo CD UI.
- **Clean-up** via hook delete policies.

Cons:

- Requires well-designed migration images/commands.
- Long-running migrations can hit Job timeouts or cluster limits if not tuned.

Use when:

- You want end-to-end GitOps control and visibility, with predictable ordering relative to application rollout.

### 2) Helm hooks (pre-install/pre-upgrade) running a Job

How it works:

- Use Helm hook annotations on a `Job` to run before/after releases. Argo CD renders Helm and applies the hooks.

Pros:

- Keeps migration definitions close to Helm chart.
- Works with Helm-native workflows.

Cons:

- Interaction between Helm hooks and Argo CD can be less transparent than Argo CD hooks (hook lifecycle managed by Helm engine).
- Harder to compose ordering across non-Helm resources.

Use when:

- You already standardize on Helm hooks and keep everything inside the chart.

### 3) InitContainer in the app `Deployment`

How it works:

- Add an `initContainer` to run migrations before the app container starts.

Pros:

- Simple; co-locates lifecycle with the app.

Cons:

- **Concurrency hazard** with multiple replicas rolling at once.
- **Long startup** and potential failed rollouts if migrations are slow.
- Hard to separate responsibilities and enforce single-run semantics.

Use when:

- Single-replica services or non-critical environments; not recommended for production multi-replica rollouts.

### 4) CI/CD step outside the cluster

How it works:

- CI pipeline runs migrations against the database before Argo CD syncs the app.

Pros:

- Familiar to many teams; can reuse existing CI runners.

Cons:

- **Not GitOps-aligned**; Argo CD has no visibility into migration status.
- Increased risk of drift if CI succeeds but manifests fail, or vice versa.

Use when:

- Transitioning towards GitOps; plan to migrate to Argo CD hooks later.

### 5) Dedicated migration operator/controller (e.g., Flyway/Liquibase/Atlas controllers)

How it works:

- A controller reconciles `Migration` CRDs or watches a versioned changelog.

Pros:

- Strong domain features (checksums, dry-runs, drift detection, approvals).
- Can manage complex sequences and policies.

Cons:

- Additional infrastructure and operational learning curve.
- Vendor/tool lock-in considerations.

Use when:

- You need advanced governance or multi-db choreography beyond simple Jobs.

## Recommended approach

1. **Argo CD PreSync hook Job** runs migrations before app rollout.
2. **Optional PreSync backup Job** (sync wave -1) for safety before risky changes.
3. **Application rollout** in a later sync wave.
4. **Optional PostSync verification Job** to run smoke checks on schema/data.
5. Follow **expand/contract**: split destructive steps into separate releases.

### Ordering with sync waves

- Use `argocd.argoproj.io/sync-wave` to sequence hooks and resources:
  - Backup Job: wave `-1`
  - Migration Job: wave `0`
  - App `Deployment`/`StatefulSet`: wave `1`
  - Verification Job: wave `2`

## Reference manifests (Argo CD hooks)

### PreSync backup Job (optional, wave -1)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: app-db-backup
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded,BeforeHookCreation
    argocd.argoproj.io/sync-wave: "-1"
spec:
  backoffLimit: 0
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: backup
          image: ghcr.io/your-org/backup:stable
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-db
                  key: url
          command: ["sh", "-c"]
          args:
            - |
              ./backup --url "$DATABASE_URL" --snapshot-label "pre-migration"
```

### PreSync migration Job (wave 0)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: app-db-migrate
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded,BeforeHookCreation
    argocd.argoproj.io/sync-wave: "0"
    argocd.argoproj.io/sync-options: SkipDryRunOnMissingResource=true
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: ghcr.io/your-org/app-migrations:sha-<commit>
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-db
                  key: url
          command: ["sh", "-c"]
          args:
            - |
              # Example: pick your tool/command here
              ./migrate up
              # flyway -url=$DATABASE_URL migrate
              # liquibase --url=$DATABASE_URL update
```

### Application rollout (wave 1)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  annotations:
    argocd.argoproj.io/sync-wave: "1"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: ghcr.io/your-org/app:sha-<commit>
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-db
                  key: url
```

### PostSync verification Job (optional, wave 2)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: app-db-verify
  annotations:
    argocd.argoproj.io/hook: PostSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded,BeforeHookCreation
    argocd.argoproj.io/sync-wave: "2"
spec:
  backoffLimit: 0
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: verify
          image: ghcr.io/your-org/app-migrations:sha-<commit>
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-db
                  key: url
          command: ["sh", "-c"]
          args:
            - |
              ./migrate verify
```

### Helm hook alternative (if using Helm hooks)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: app-db-migrate
  annotations:
    helm.sh/hook: pre-install,pre-upgrade
    helm.sh/hook-delete-policy: before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: ghcr.io/your-org/app-migrations:sha-<commit>
          command: ["sh", "-c"]
          args: ["./migrate up"]
```

## Concurrency and single-run guarantees

- Ensure the migration tool provides a **database lock** or versioning (e.g., Liquibase/Flyway) to avoid concurrent execution.
- Limit `Job` concurrency to 1 by design (one Job per sync); use `hook-delete-policy: BeforeHookCreation` to prevent duplicate hooks.
- For canary/blue-green: keep migrations backward compatible; run them first, then ship new code.

## Handling long-running or risky migrations

- Break large changes into multiple small, safe migrations (expand/contract).
- Use online migration techniques or tool-specific strategies (e.g., gh-ost, pt-online-schema-change) for large tables.
- For backfills, run a separate `CronJob` or `Job` after rollout, rate-limited and cancellable.
- Increase Job `activeDeadlineSeconds` if needed; tune resources and node placement.

## Rollback strategy

- App rollback does not automatically rollback schema. Prefer forward fixes.
- For reversible changes, provide `down` migrations but use cautiously in production.
- For destructive changes, take a backup (snapshot/binlog/PITR) and have a restore procedure.
- Gate destructive migrations behind manual approval or environment-specific flags.

## Secrets, security, and networking

- Store DB credentials in a Kubernetes `Secret` and mount via `envFrom`/`valueFrom`.
- Use least-privilege DB roles for migration vs runtime if supported.
- Restrict network egress with `NetworkPolicy` to only the DB endpoint.
- Run non-root containers; add resource requests/limits and sensible timeouts.

## Observability and operations

- Surface Job logs in centralized logging; expose metrics (e.g., success/failure counters, duration).
- Alert on failed hook Jobs and long-running migrations.
- Annotate PRs with migration steps and risk level. Consider requiring a checklist for risky changes.

## Local and CI workflows

- Developers test migrations locally against ephemeral DBs.
- CI runs `migrate validate`/`dry-run` against a throwaway database.
- Main branch changes produce a migration image and manifests; Argo CD pulls and runs hooks.

## Pull request checklist (for migrations)

- Migration is backward-compatible with currently deployed app.
- No destructive statements in the same release as the code change.
- Dry-run/validation passed in CI.
- Backup step enabled or explicitly waived with justification.
- Rollout plan noted (waves, hooks, verification).

## FAQ

- **Can we use initContainers?** Possible, but risky for multi-replica and long migrations; prefer hook Jobs.
- **What about multi-tenant databases?** Parameterize the Job to loop tenants, or orchestrate a Job per tenant with waves.
- **Do hooks block the entire sync?** Yes—failed PreSync hooks fail the sync; this is desirable to avoid partial rollouts.
- **How do we ensure only one migration runs?** Use tool-level locks and one PreSync Job per sync; Argo CD won't create a new hook until the previous is cleaned based on delete policy.
