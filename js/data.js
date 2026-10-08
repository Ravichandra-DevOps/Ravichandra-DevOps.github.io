/* ==========================================================================
   RESUME DATA — single source of truth for the site, the voice and the bot.
   Edit this file to update anything on the portfolio.
   ========================================================================== */

import LINES from './lines.js';

const DI = (n, v = 'original') => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${n}/${n}-${v}.svg`;
const SI = (n) => `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${n}.svg`;

export const PROFILE = {
  name: 'Ravichandra',
  short: 'Ravichandra',
  title: 'Senior Multi-Cloud DevOps Engineer',
  tagline: 'I build the roads software ships on.',
  roles: ['Multi-Cloud Architect', 'CI/CD Engineer', 'Kubernetes Operator', 'DevSecOps Advocate', 'SRE at heart'],
  years: 10,
  location: 'Hyderabad, India — open to relocation / remote',
  availability: 'Open to new opportunities — Hyderabad or remote',
  email: 'ravichandra.devops1993@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ravichandravajinepalli',
  github: 'https://github.com/Ravichandra-DevOps',
  githubUser: 'Ravichandra-DevOps',
  resume: 'assets/Ravichandra_Resume.pdf',
};

export const TOOLS = {
  aws:        { name: 'AWS',            icon: DI('amazonwebservices', 'original-wordmark') },
  azure:      { name: 'Azure',          icon: DI('azure') },
  gcp:        { name: 'Google Cloud',   icon: DI('googlecloud') },
  jenkins:    { name: 'Jenkins',        icon: DI('jenkins') },
  gha:        { name: 'GitHub Actions', icon: DI('githubactions') },
  gitlab:     { name: 'GitLab CI',      icon: DI('gitlab') },
  github:     { name: 'GitHub',         icon: DI('github') },
  git:        { name: 'Git',            icon: DI('git') },
  maven:      { name: 'Maven',          icon: DI('maven') },
  tomcat:     { name: 'Tomcat',         icon: DI('tomcat') },
  docker:     { name: 'Docker',         icon: DI('docker') },
  podman:     { name: 'Podman',         icon: DI('podman') },
  k8s:        { name: 'Kubernetes',     icon: DI('kubernetes') },
  eks:        { name: 'Amazon EKS',     icon: DI('kubernetes'), badge: 'EKS' },
  aks:        { name: 'Azure AKS',      icon: DI('azure'), badge: 'AKS' },
  openshift:  { name: 'OpenShift',      icon: SI('redhatopenshift'), color: '#EE0000' },
  helm:       { name: 'Helm',           icon: DI('helm') },
  argocd:     { name: 'Argo CD',        icon: DI('argocd') },
  terraform:  { name: 'Terraform',      icon: DI('terraform') },
  ansible:    { name: 'Ansible',        icon: DI('ansible') },
  datadog:    { name: 'Datadog',        icon: DI('datadog') },
  prometheus: { name: 'Prometheus',     icon: DI('prometheus') },
  grafana:    { name: 'Grafana',        icon: DI('grafana') },
  otel:       { name: 'OpenTelemetry',  icon: DI('opentelemetry') },
  cloudwatch: { name: 'CloudWatch',     icon: SI('amazoncloudwatch'), color: '#FF4F8B' },
  splunk:     { name: 'Splunk',         icon: DI('splunk', 'original-wordmark') },
  newrelic:   { name: 'New Relic',      icon: DI('newrelic') },
  sonarqube:  { name: 'SonarQube',      icon: DI('sonarqube') },
  jfrog:      { name: 'JFrog',          icon: SI('jfrog'), color: '#40BE46' },
  traefik:    { name: 'Traefik',        icon: DI('traefikproxy') },
  nginx:      { name: 'NGINX',          icon: DI('nginx') },
  cfn:        { name: 'CloudFormation', icon: DI('amazonwebservices', 'original-wordmark'), badge: 'CFN' },
  lambda:     { name: 'AWS Lambda',     icon: DI('amazonwebservices', 'original-wordmark'), badge: 'λ' },
  ecr:        { name: 'Amazon ECR',     icon: DI('amazonwebservices', 'original-wordmark'), badge: 'ECR' },
  nexus:      { name: 'Nexus',          icon: SI('sonatype'), color: '#1B1C30' },
  appd:       { name: 'AppDynamics',    txt: 'AppD', color: '#0a84d0' },
  ubuntu:     { name: 'Ubuntu',         icon: DI('ubuntu') },
  centos:     { name: 'CentOS',         icon: DI('centos') },
  postgres:   { name: 'PostgreSQL',     icon: DI('postgresql') },
  copilot:    { name: 'GitHub Copilot', icon: SI('githubcopilot'), color: '#000000' },
  claude:     { name: 'Claude',         icon: SI('claude'), color: '#D97757' },
  sbom:       { name: 'SBOM',           txt: 'SBOM', color: '#7c3aed' },
  gitops:     { name: 'GitOps',         txt: 'Git​Ops', color: '#f97316' },
  linux:      { name: 'Linux',          icon: DI('linux') },
  redhat:     { name: 'RHEL',           icon: DI('redhat') },
  python:     { name: 'Python',         icon: DI('python') },
  bash:       { name: 'Bash',           icon: DI('bash') },
  go:         { name: 'Go',             icon: DI('go', 'original-wordmark') },
  powershell: { name: 'PowerShell',     icon: DI('powershell') },
  bedrock:    { name: 'Amazon Bedrock', icon: DI('amazonwebservices', 'original-wordmark'), badge: 'AI' },
};

export const STACK = [
  { cat: 'Cloud',                  color: '#ff9a3c', items: ['aws', 'azure', 'gcp', 'lambda'] },
  { cat: 'CI / CD',                color: '#3ef2ff', items: ['gitlab', 'jenkins', 'gha', 'maven', 'tomcat', 'git'] },
  { cat: 'GitOps & Delivery',      color: '#f97316', items: ['argocd', 'helm', 'gitops'] },
  { cat: 'Containers & K8s',       color: '#5b8cff', items: ['docker', 'podman', 'k8s', 'eks', 'aks', 'openshift'] },
  { cat: 'Infra as Code',          color: '#a78bfa', items: ['terraform', 'ansible', 'cfn'] },
  { cat: 'Observability & SRE',    color: '#34d399', items: ['datadog', 'prometheus', 'grafana', 'otel', 'cloudwatch', 'splunk', 'newrelic', 'appd'] },
  { cat: 'DevSecOps & Artifacts',  color: '#f472b6', items: ['sonarqube', 'sbom', 'jfrog', 'nexus', 'ecr'] },
  { cat: 'Networking & Edge',      color: '#22d3ee', items: ['traefik', 'nginx'] },
  { cat: 'OS, Code & Data',        color: '#facc15', items: ['linux', 'redhat', 'ubuntu', 'centos', 'python', 'bash', 'go', 'powershell', 'postgres'] },
  { cat: 'AI & Productivity',      color: '#c084fc', items: ['bedrock', 'copilot', 'claude'] },
];

/* Market-standard tools NOT on the resume. Move a key into STACK only once Ravichandra confirms hands-on use. */
export const OPTIONAL_TOOLS = ['kustomize', 'trivy', 'flux', 'istio', 'karpenter', 'checkov', 'loki', 'vault'];

export const CLOUDS = [
  {
    key: 'aws', name: 'Amazon Web Services', short: 'AWS', color: '#ff9a3c', level: 'Primary',
    services: ['EKS', 'EC2', 'ECS', 'ECR', 'S3', 'RDS', 'VPC', 'IAM', 'KMS', 'WAF', 'Lambda', 'Route 53', 'CloudWatch', 'SQS / SNS', 'CloudFormation', 'Bedrock'],
    blurb: '12+ accounts across 3 APAC regions. Landing zones, EKS platforms, IAM & KMS hardening, WAF, cost right-sizing (−25%).',
  },
  {
    key: 'azure', name: 'Microsoft Azure', short: 'Azure', color: '#3b9bff', level: 'Production',
    services: ['AKS', 'ACR', 'Virtual Machines', 'VNet', 'Key Vault', 'Azure Monitor', 'Entra ID / RBAC', 'Blob Storage'],
    blurb: 'AKS clusters, container registries and RBAC-driven access with IaC-first provisioning through Terraform.',
  },
  {
    key: 'gcp', name: 'Google Cloud', short: 'GCP', color: '#34d399', level: 'Production',
    services: ['GKE', 'Compute Engine', 'Cloud Storage', 'IAM', 'VPC', 'Cloud Monitoring', 'Artifact Registry'],
    blurb: 'GKE workloads, IAM and networking with consistent Terraform modules and pipelines across clouds.',
  },
];

export const PIPELINE = [
  { step: '01', name: 'Commit',    desc: 'Branching strategy, PR checks, tags & hooks.',                 tools: ['git', 'github', 'gitlab'],            cmd: 'git push origin feature/*' },
  { step: '02', name: 'Build',     desc: 'Reusable templates, cached builds, artifact versioning.',     tools: ['jenkins', 'gha', 'maven'],            cmd: 'mvn -B clean verify' },
  { step: '03', name: 'Secure',    desc: 'SAST, SCA, secret & image scans, SBOM, licence gates.',        tools: ['sonarqube', 'sbom'],                  cmd: 'sonar-scanner && sbom gen' },
  { step: '04', name: 'Package',   desc: 'OCI images, tag policies, registry promotion.',               tools: ['docker', 'podman', 'jfrog'],          cmd: 'docker build -t app:$SHA .' },
  { step: '05', name: 'Provision', desc: '60+ versioned Terraform modules, Ansible config.',            tools: ['terraform', 'ansible'],               cmd: 'terraform apply -auto-approve' },
  { step: '06', name: 'Deploy',    desc: 'Helm + GitOps to EKS / AKS / OpenShift, zero-downtime.',      tools: ['k8s', 'helm', 'argocd', 'openshift'], cmd: 'argocd app sync prod' },
  { step: '07', name: 'Observe',   desc: 'SLOs, alerting, tracing, self-healing runbooks.',             tools: ['datadog', 'prometheus', 'grafana', 'otel'], cmd: 'slo: 99.9% ✓' },
];

export const STATS = [
  { value: 10,   suffix: '+',  label: 'Years shipping production' },
  { value: 70,   suffix: '%',  label: 'Faster release lead time' },
  { value: 99.9, suffix: '%',  label: 'Uptime after migration', decimals: 1 },
  { value: 25,   suffix: '%',  label: 'AWS cost reduced' },
  { value: 60,   suffix: '+',  label: 'Terraform modules authored' },
  { value: 200,  suffix: '+',  label: 'Production releases / year' },
];

export const EXPERIENCE = [
  {
    company: 'Deloitte India', role: 'Senior Consultant — Cloud & DevOps', period: 'Mar 2025 — Present', domain: 'Pharma & Life Sciences (APAC)',
    color: '#86efac',
    metrics: ['−70% lead time', '40+ audit findings closed', '12+ AWS accounts', '3 regions'],
    points: [
      'Designed reusable GitLab CI/CD templates with artifact promotion, approval gates and automated rollback — cut release lead time by 70%.',
      'Made SAST (SonarQube), secret scanning, image scanning, SBOM and licence checks mandatory pipeline gates — closed 40+ audit findings.',
      'Run OCI images through JFrog Artifactory & Amazon ECR with tag policies, promotion workflows and vulnerability thresholds.',
      'Authored 60+ versioned Terraform modules plus CloudFormation across 3 APAC regions.',
      'TLS lifecycle automation, IAM hardening, KMS encryption and AWS WAF rules.',
      'Prototyped GenAI assistants on Amazon Bedrock with RAG; boosted delivery 30% with Copilot & Claude.',
    ],
    tools: ['gitlab', 'sonarqube', 'jfrog', 'terraform', 'aws', 'bedrock'],
  },
  {
    company: 'Synechron Technologies', role: 'Technology Lead — DevOps / SRE', period: 'Jul 2023 — Jan 2025', domain: 'Banking & Financial Services',
    color: '#7dd3fc',
    metrics: ['99.9% uptime', '20+ workloads on EKS', 'weekly → daily deploys', '−25% AWS cost'],
    points: [
      'Led on-prem to AWS migration of business-critical banking apps — sustained 99.9% uptime.',
      'Containerised 20+ legacy workloads onto Amazon EKS: Helm, Ingress (NGINX/Traefik), HPA, RBAC, IRSA, zero-downtime upgrades.',
      'Introduced Argo CD GitOps — deployment frequency from weekly to daily.',
      'SonarQube quality gates in Jenkins & GitHub Actions used by 6+ teams.',
      'Observability with CloudWatch, Prometheus/Grafana, Splunk, New Relic, AppDynamics + Lambda self-healing.',
      'Right-sized compute & storage — AWS bill down 25%.',
    ],
    tools: ['eks', 'argocd', 'helm', 'jenkins', 'gha', 'prometheus', 'grafana'],
  },
  {
    company: 'Infosys', role: 'Senior Associate Consultant — DevOps', period: 'Apr 2022 — Jan 2023', domain: 'Telecommunications',
    color: '#c4b5fd',
    metrics: ['30+ Jenkins pipelines', '4 time zones'],
    points: [
      'Built and tuned 30+ Jenkins pipelines with GitHub, Nexus and Maven for teams across 4 time zones.',
      'Operated Docker & Kubernetes platforms — networking, namespaces, scaling.',
      'AWS infra (EC2, S3, ELB, Auto Scaling, VPC) with CloudWatch alarms & least-privilege IAM.',
      'Designed the branching strategy and release management across Dev, QA and Prod.',
    ],
    tools: ['jenkins', 'maven', 'docker', 'k8s', 'aws'],
  },
  {
    company: 'Wipro', role: 'DevOps Engineer (promoted from System Administrator)', period: 'Aug 2016 — Mar 2022', domain: 'Insurance',
    color: '#fda4af',
    metrics: ['200+ releases / year', '24×7 on-call', '6 years'],
    points: [
      'Owned end-to-end build & release across Dev, QA, Performance and Production — 200+ releases a year.',
      'Jenkins CI/CD with Docker & Kubernetes; authored manifests and managed cluster scaling.',
      'Automated provisioning with Ansible, Bash & Python; bootstrapped full toolchains on Linux.',
      'Built Go microservices streaming large PostgreSQL datasets to third-party APIs.',
      'Started as a System Administrator: RHEL/Windows, networking, SAN backups — the OS foundation under everything since.',
    ],
    tools: ['jenkins', 'docker', 'k8s', 'ansible', 'go', 'tomcat', 'redhat'],
  },
];

export const EDUCATION = 'B.Tech — Sree Kavitha Engineering College, Khammam (2015)';

/* ---------- Voice + bot knowledge (from lines.js) ---------- */
export { LINES };
export const SECTION_LINES = LINES.presenter.filter((l) => l.target);
export const KB = LINES.kb;

export const SUGGESTIONS = ['Tell me about him', 'Kubernetes experience?', 'Which clouds?', 'Biggest achievements', 'When can he join?', 'How to contact?'];
