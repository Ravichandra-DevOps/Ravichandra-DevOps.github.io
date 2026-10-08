export default {
  "_comment": "Everything spoken on the site. Keep this file valid JSON after 'export default'. After editing, run: python tools/gen_voice.py",
  "voices": {
    "presenter": {
      "name": "en-IN-PrabhatNeural",
      "rate": "-4%",
      "pitch": "-2Hz"
    },
    "bot": {
      "name": "en-US-AnaNeural",
      "rate": "+0%",
      "pitch": "+0Hz"
    }
  },
  "presenter": [
    {
      "id": "intro",
      "text": "Hi, I'm Ravichandra, a Senior Multi-Cloud DevOps Engineer. For the last ten years, I've been building and running production platforms on AWS, Azure and Google Cloud. I design CI/CD pipelines with Jenkins, GitHub Actions and GitLab. I run containers on Kubernetes, EKS, AKS and OpenShift. I build everything as code, with Terraform and Ansible. And I keep it all observable, with Datadog, Prometheus, Grafana, OpenTelemetry and CloudWatch. Come, let me walk you through my journey."
    },
    {
      "id": "tour-about",
      "target": "#about",
      "text": "Here's the short version. Ten years in production. Seventy percent faster releases. Ninety-nine point nine percent uptime after a major banking migration. And a twenty-five percent cut in cloud cost."
    },
    {
      "id": "tour-clouds",
      "target": "#clouds",
      "text": "I work across all three major clouds. AWS is my home ground, with EKS, IAM, KMS and WAF. And I bring the same Terraform-first approach to Azure with AKS, and to Google Cloud."
    },
    {
      "id": "tour-stack",
      "target": "#stack",
      "text": "This is my toolbox. Every logo you see here is something I've run in production, not something I tried once in a tutorial."
    },
    {
      "id": "tour-pipeline",
      "target": "#pipeline",
      "text": "This is how I think about delivery. Commit, build, security gates, packaging, provisioning, GitOps deployment, and finally, observability. Every stage automated. Every stage audited."
    },
    {
      "id": "tour-experience",
      "target": "#experience",
      "text": "My journey started at Wipro in 2016, as a system administrator. Then Infosys. Then Synechron, as a Technology Lead. And today, I'm a Senior Consultant at Deloitte."
    },
    {
      "id": "tour-observability",
      "target": "#observability",
      "text": "If my career were a Grafana dashboard, it would look something like this. Green, across the board."
    },
    {
      "id": "tour-contact",
      "target": "#contact",
      "text": "I'm open to new opportunities, from Hyderabad, or fully remote. Let's build something reliable together. Thank you for listening."
    },
    {
      "id": "job-0",
      "text": "At Deloitte, since March 2025, I lead platform automation and DevSecOps for a pharmaceutical client in APAC. I built reusable GitLab pipelines that cut release lead time by seventy percent, and I made security scanning a mandatory gate, closing more than forty audit findings across twelve AWS accounts."
    },
    {
      "id": "job-1",
      "text": "At Synechron, I was the Technology Lead for DevOps and SRE in banking. I led the migration of critical banking applications from on-premises to AWS, with ninety-nine point nine percent uptime. I moved more than twenty workloads onto EKS, and introduced Argo CD GitOps, taking deployments from weekly to daily, while cutting AWS cost by twenty-five percent."
    },
    {
      "id": "job-2",
      "text": "At Infosys, for a telecom client, I built and tuned more than thirty Jenkins pipelines with GitHub, Nexus and Maven, for teams spread across four time zones. And I operated Docker and Kubernetes platforms on AWS."
    },
    {
      "id": "job-3",
      "text": "I started my career at Wipro in 2016, as a system administrator, and grew into a DevOps engineer. Over six years, I owned end-to-end build and release for an insurance platform. More than two hundred production releases a year, with Jenkins, Docker, Kubernetes and Ansible."
    }
  ],
  "bot": [
    {
      "id": "bot-hello",
      "text": "Hi, I'm Piku! Ravichandra's AI assistant, powered by Ravi.SI, that's Super Intelligence. I've read his entire resume, so ask me anything about his cloud, Kubernetes, CI/CD or observability work. Or tap a suggestion below.",
      "say": "Hi, I'm Piku! Ravichandra's AI assistant, powered by Ravi S.I. That's Super Intelligence. I've read his entire resume, so ask me anything about his cloud, Kubernetes, CI/CD or observability work. Or just tap a suggestion below."
    },
    {
      "id": "bot-fallback",
      "text": "I'm trained on Ravichandra's resume, so I'm best at questions about his skills, experience and availability. Try asking, what does he do with Kubernetes? Or, which clouds has he used?"
    }
  ],
  "kb": [
    {
      "id": "kb-hi",
      "k": [
        "hi",
        "hello",
        "hey",
        "si",
        "intelligence",
        "namaste",
        "yo",
        "hola",
        "piku"
      ],
      "a": "Hey! 👋 I'm Piku, Ravichandra's AI assistant (powered by Ravi.SI). Ask me about his cloud skills, Kubernetes, pipelines, experience, or how to hire him.",
      "say": "Hey! I'm Piku, Ravichandra's AI assistant. Ask me about his cloud skills, Kubernetes, pipelines, experience, or how to hire him."
    },
    {
      "id": "kb-about",
      "g": 1,
      "k": [
        "ravichandra",
        "ravi",
        "who",
        "about",
        "summary",
        "yourself",
        "introduce",
        "tell",
        "profile",
        "overview"
      ],
      "a": "Ravichandra is a Senior Multi-Cloud DevOps Engineer with 10 years of experience building, securing and operating enterprise CI/CD and container platforms across AWS, Azure and GCP, for banking, insurance, life sciences and telecom clients."
    },
    {
      "id": "kb-exp",
      "g": 1,
      "k": [
        "experience",
        "years",
        "career",
        "journey",
        "companies",
        "worked",
        "work",
        "before",
        "previous",
        "past",
        "history",
        "jobs"
      ],
      "a": "10 years: Wipro (2016–2022, System Admin → DevOps Engineer) → Infosys (2022–2023, Sr. Associate Consultant) → Synechron (2023–2025, Technology Lead DevOps/SRE) → Deloitte (2025–now, Senior Consultant, Cloud & DevOps).",
      "say": "Ten years. He started at Wipro in 2016, growing from system admin to DevOps engineer. Then Infosys as a senior associate consultant. Then Synechron as Technology Lead for DevOps and SRE. And since 2025, he's a Senior Consultant for Cloud and DevOps at Deloitte."
    },
    {
      "id": "kb-deloitte",
      "k": [
        "deloitte",
        "current",
        "now",
        "present",
        "pharma",
        "life sciences"
      ],
      "a": "At Deloitte (Mar 2025–present) he leads platform automation & DevSecOps for a pharma client in APAC: reusable GitLab CI/CD templates (−70% lead time), mandatory security gates (40+ audit findings closed across 12+ AWS accounts), 60+ Terraform modules over 3 regions, and GenAI prototypes on Amazon Bedrock.",
      "say": "At Deloitte, since March 2025, he leads platform automation and DevSecOps for a pharma client in APAC. Reusable GitLab pipelines cut lead time by seventy percent, mandatory security gates closed more than forty audit findings across twelve AWS accounts, and he's written over sixty Terraform modules across three regions. He's also prototyping GenAI on Amazon Bedrock."
    },
    {
      "id": "kb-synechron",
      "k": [
        "synechron",
        "banking",
        "bank",
        "migration",
        "financial",
        "lead"
      ],
      "a": "At Synechron (Jul 2023–Jan 2025) as Technology Lead DevOps/SRE: led on-prem → AWS migration for banking apps with 99.9% uptime, containerised 20+ workloads onto EKS, introduced Argo CD GitOps (weekly → daily deploys) and cut AWS cost by 25%.",
      "say": "At Synechron, as Technology Lead for DevOps and SRE, he led the on-prem to AWS migration of banking apps with ninety-nine point nine percent uptime, moved more than twenty workloads onto EKS, introduced Argo CD GitOps, taking deploys from weekly to daily, and cut AWS cost by twenty-five percent."
    },
    {
      "id": "kb-infosys",
      "k": [
        "infosys",
        "telecom",
        "telecommunications"
      ],
      "a": "At Infosys (Apr 2022–Jan 2023) for a telecom client: built 30+ Jenkins pipelines with GitHub, Nexus and Maven for teams in 4 time zones, and operated Docker/Kubernetes platforms on AWS.",
      "say": "At Infosys, for a telecom client, he built more than thirty Jenkins pipelines with GitHub, Nexus and Maven, for teams in four time zones, and operated Docker and Kubernetes platforms on AWS."
    },
    {
      "id": "kb-wipro",
      "k": [
        "wipro",
        "insurance",
        "first",
        "start",
        "started",
        "sysadmin",
        "administrator"
      ],
      "a": "He started at Wipro in Aug 2016 as a System Administrator (RHEL/Windows, networking, SAN backups) and was promoted to DevOps Engineer, owning build & release for 200+ production releases a year with 24×7 on-call.",
      "say": "He started at Wipro in August 2016 as a system administrator, working on RHEL, Windows, networking and SAN backups, and was promoted to DevOps engineer, owning build and release for more than two hundred production releases a year, with round-the-clock on-call."
    },
    {
      "id": "kb-aws",
      "k": [
        "aws",
        "amazon",
        "ec2",
        "eks",
        "s3",
        "iam",
        "kms",
        "lambda",
        "cloudformation",
        "waf"
      ],
      "a": "AWS is his primary cloud: EKS, EC2, ECS, ECR, S3, RDS, VPC, IAM, KMS, WAF, Lambda, Route 53, CloudWatch, SQS/SNS, CloudFormation and Bedrock, across 12+ accounts and 3 APAC regions.",
      "say": "AWS is his primary cloud. EKS, EC2, ECS, ECR, S3, RDS, VPC, IAM, KMS, WAF, Lambda, Route 53, CloudWatch, SQS, SNS, CloudFormation and Bedrock, across more than twelve accounts and three APAC regions."
    },
    {
      "id": "kb-azure",
      "k": [
        "azure",
        "aks",
        "microsoft",
        "acr"
      ],
      "a": "On Azure he works with AKS, ACR, VNets, Key Vault, Azure Monitor and RBAC, provisioned with the same Terraform-first approach he uses on AWS."
    },
    {
      "id": "kb-gcp",
      "k": [
        "gcp",
        "google",
        "gke"
      ],
      "a": "On Google Cloud he works with GKE, Compute Engine, Cloud Storage, IAM/VPC and Cloud Monitoring, using consistent Terraform modules and pipelines across clouds.",
      "say": "On Google Cloud he works with GKE, Compute Engine, Cloud Storage, IAM and VPC, and Cloud Monitoring, using the same Terraform modules and pipelines across clouds."
    },
    {
      "id": "kb-multi",
      "g": 1,
      "k": [
        "cloud",
        "multi",
        "multicloud",
        "clouds"
      ],
      "a": "Multi-cloud: AWS (primary), Azure (AKS) and GCP (GKE). One IaC + GitOps playbook applied consistently across all three.",
      "say": "He's truly multi-cloud. AWS is primary, plus Azure with AKS, and Google Cloud with GKE. One infrastructure-as-code and GitOps playbook, applied consistently across all three."
    },
    {
      "id": "kb-k8s",
      "k": [
        "kubernetes",
        "k8s",
        "container",
        "containers",
        "helm",
        "openshift",
        "pods",
        "cluster"
      ],
      "a": "Kubernetes is home turf: EKS, AKS and OpenShift, with Helm, Ingress (NGINX/Traefik), HPA autoscaling, RBAC, IRSA, Secrets/ConfigMaps and zero-downtime cluster upgrades. He has moved 20+ legacy workloads onto EKS.",
      "say": "Kubernetes is home turf. EKS, AKS and OpenShift, with Helm, ingress controllers, autoscaling, RBAC, IRSA, secrets and config maps, and zero-downtime cluster upgrades. He's moved more than twenty legacy workloads onto EKS."
    },
    {
      "id": "kb-docker",
      "k": [
        "docker",
        "podman",
        "oci",
        "image",
        "registry",
        "jfrog",
        "ecr",
        "nexus",
        "artifactory"
      ],
      "a": "Docker & Podman with OCI-compliant images; registries in JFrog Artifactory, Nexus and Amazon ECR with tag policies, image promotion and vulnerability thresholds.",
      "say": "Docker and Podman, with OCI-compliant images, and registries in JFrog Artifactory, Nexus and Amazon ECR, with tag policies, image promotion and vulnerability thresholds."
    },
    {
      "id": "kb-cicd",
      "k": [
        "ci",
        "cd",
        "cicd",
        "pipeline",
        "pipelines",
        "jenkins",
        "github actions",
        "actions",
        "gitlab",
        "build",
        "release"
      ],
      "a": "CI/CD: GitLab CI (primary today), Jenkins and GitHub Actions, with reusable templates, artifact promotion, approval gates and automated rollback. Built 30+ Jenkins pipelines at Infosys and cut lead time by 70% at Deloitte.",
      "say": "For CI/CD, it's GitLab CI today, plus Jenkins and GitHub Actions. Reusable templates, artifact promotion, approval gates and automated rollback. He built over thirty Jenkins pipelines at Infosys, and cut lead time by seventy percent at Deloitte."
    },
    {
      "id": "kb-java",
      "k": [
        "maven",
        "tomcat",
        "java"
      ],
      "a": "Classic Java delivery: Maven builds, Nexus/Artifactory artifacts and Tomcat deployments, later containerised onto Kubernetes.",
      "say": "Classic Java delivery. Maven builds, Nexus and Artifactory artifacts, and Tomcat deployments, later containerised onto Kubernetes."
    },
    {
      "id": "kb-gitops",
      "k": [
        "argo",
        "argocd",
        "gitops",
        "flux"
      ],
      "a": "He introduced Argo CD GitOps at Synechron, taking deployment frequency from weekly to daily."
    },
    {
      "id": "kb-iac",
      "k": [
        "terraform",
        "iac",
        "infrastructure",
        "code",
        "ansible",
        "automation",
        "provision"
      ],
      "a": "Infrastructure as Code: Terraform (60+ reusable versioned modules, remote state, workspaces), Ansible for configuration, and AWS CloudFormation.",
      "say": "Infrastructure as code is core to everything he does. Terraform, with over sixty reusable, versioned modules, remote state and workspaces. Ansible for configuration. And AWS CloudFormation."
    },
    {
      "id": "kb-obs",
      "k": [
        "observability",
        "monitoring",
        "datadog",
        "prometheus",
        "grafana",
        "opentelemetry",
        "otel",
        "cloudwatch",
        "splunk",
        "logs",
        "metrics",
        "tracing",
        "sre",
        "slo"
      ],
      "a": "Observability: Datadog, Prometheus, Grafana, OpenTelemetry, CloudWatch, Splunk, New Relic and AppDynamics, with SLOs, alerting, runbooks and Lambda-driven self-healing that cut MTTR significantly.",
      "say": "For observability: Datadog, Prometheus, Grafana, OpenTelemetry, CloudWatch, Splunk, New Relic and AppDynamics. SLOs, alerting, runbooks, and Lambda-driven self-healing that cut recovery time significantly."
    },
    {
      "id": "kb-sec",
      "k": [
        "security",
        "devsecops",
        "sast",
        "sonarqube",
        "sbom",
        "scan",
        "scanning",
        "compliance",
        "audit",
        "tls",
        "certificate"
      ],
      "a": "DevSecOps: SAST (SonarQube), SCA, secret scanning, container image scanning, SBOM and licence checks, all as mandatory pipeline gates. Plus IAM hardening, KMS, WAF and TLS certificate lifecycle automation. 40+ audit findings closed.",
      "say": "DevSecOps is built into his pipelines. SonarQube, dependency scanning, secret scanning, container image scanning, SBOMs and licence checks, all as mandatory gates. Plus IAM hardening, KMS, WAF, and automated certificate lifecycle. More than forty audit findings closed."
    },
    {
      "id": "kb-linux",
      "k": [
        "linux",
        "rhel",
        "redhat",
        "ubuntu",
        "centos",
        "bash",
        "python",
        "go",
        "golang",
        "script",
        "scripting",
        "powershell"
      ],
      "a": "Linux (RHEL, Ubuntu, CentOS) hardening, systemd and package management. Scripting in Bash, Python, Go and PowerShell; he even built Go microservices streaming large PostgreSQL datasets.",
      "say": "Linux is his foundation. RHEL, Ubuntu and CentOS hardening, systemd and package management. He scripts in Bash, Python, Go and PowerShell, and has even built Go microservices that stream large PostgreSQL datasets."
    },
    {
      "id": "kb-ai",
      "k": [
        "ai",
        "genai",
        "bedrock",
        "llm",
        "rag",
        "copilot",
        "claude",
        "chatgpt"
      ],
      "a": "He prototypes GenAI workflows on Amazon Bedrock with RAG for internal knowledge assistants, and uses GitHub Copilot & Claude to speed up IaC and pipeline work by ~30%. (Fun fact: I'm a little piece of that.)",
      "say": "He prototypes GenAI workflows on Amazon Bedrock with retrieval-augmented generation, and uses GitHub Copilot and Claude to speed up his infrastructure and pipeline work by about thirty percent. Fun fact, I'm a little piece of that."
    },
    {
      "id": "kb-wins",
      "g": 1,
      "k": [
        "achievement",
        "achievements",
        "impact",
        "results",
        "numbers",
        "metrics",
        "proud",
        "best"
      ],
      "a": "Highlights: −70% release lead time · 99.9% uptime after banking migration · −25% AWS cost · weekly → daily deploys · 40+ audit findings closed · 60+ Terraform modules · 200+ releases/year.",
      "say": "Some highlights. Seventy percent faster release lead time. Ninety-nine point nine percent uptime after a banking migration. Twenty-five percent lower AWS cost. Deployments from weekly to daily. Over forty audit findings closed. And more than two hundred releases a year."
    },
    {
      "id": "kb-skills",
      "g": 1,
      "k": [
        "skills",
        "stack",
        "tools",
        "tech",
        "technologies",
        "know"
      ],
      "a": "Clouds: AWS, Azure, GCP · CI/CD: Jenkins, GitHub Actions, GitLab, Maven, Tomcat, Argo CD · Containers: Docker, Kubernetes, EKS, AKS, OpenShift, Helm · IaC: Terraform, Ansible · Observability: Datadog, Prometheus, Grafana, OpenTelemetry, CloudWatch.",
      "say": "Clouds: AWS, Azure and Google Cloud. CI/CD: Jenkins, GitHub Actions, GitLab, Maven, Tomcat and Argo CD. Containers: Docker, Kubernetes, EKS, AKS, OpenShift and Helm. Infrastructure as code: Terraform and Ansible. And observability with Datadog, Prometheus, Grafana, OpenTelemetry and CloudWatch."
    },
    {
      "id": "kb-edu",
      "k": [
        "education",
        "degree",
        "college",
        "btech",
        "study",
        "university"
      ],
      "a": "B.Tech from Sree Kavitha Engineering College, Khammam (2015).",
      "say": "He holds a B.Tech from Sree Kavitha Engineering College, Khammam, from 2015."
    },
    {
      "id": "kb-notice",
      "k": [
        "notice",
        "available",
        "availability",
        "join",
        "joining",
        "immediate",
        "when"
      ],
      "a": "He's open to new opportunities. Reach out by email or LinkedIn to discuss timelines.",
      "say": "He's open to new opportunities. Reach out by email or LinkedIn to discuss timelines."
    },
    {
      "id": "kb-location",
      "k": [
        "location",
        "where",
        "relocate",
        "relocation",
        "remote",
        "hyderabad",
        "based",
        "live"
      ],
      "a": "Based in Hyderabad, India, and open to any location or fully remote.",
      "say": "He's based in Hyderabad, India, and open to any location, or fully remote."
    },
    {
      "id": "kb-contact",
      "k": [
        "contact",
        "email",
        "reach",
        "hire",
        "phone",
        "linkedin",
        "connect",
        "call",
        "interview"
      ],
      "a": "Reach him at ravichandra.devops1993@gmail.com or on LinkedIn (linkedin.com/in/ravichandravajinepalli). He replies fast. 🚀",
      "say": "You can reach him by email, or on LinkedIn. The links are right there in the chat. He replies fast."
    },
    {
      "id": "kb-resume",
      "k": [
        "resume",
        "cv",
        "pdf",
        "download"
      ],
      "a": "You can download the PDF resume from the \"Resume\" button at the top, or in the contact section.",
      "say": "You can download his resume from the Resume button at the top, or in the contact section."
    },
    {
      "id": "kb-github",
      "k": [
        "github",
        "repo",
        "repos",
        "projects",
        "project",
        "portfolio"
      ],
      "a": "His GitHub is github.com/Ravichandra-DevOps. The projects that matter most are the enterprise platforms in the experience section; those live behind client firewalls 🔒.",
      "say": "His GitHub is linked in the chat. But the projects that matter most are the enterprise platforms in the experience section. Those live behind client firewalls."
    },
    {
      "id": "kb-why",
      "g": 1,
      "k": [
        "why",
        "should",
        "fit",
        "strength",
        "strengths",
        "different",
        "value"
      ],
      "a": "Because he's done it at scale in regulated industries: he migrates without downtime, makes security a pipeline default rather than an afterthought, and leaves teams with reusable templates instead of snowflakes. 10 years, 4 enterprises, measurable results.",
      "say": "Because he's done it at scale, in regulated industries. He migrates without downtime, makes security a pipeline default instead of an afterthought, and leaves teams with reusable templates instead of snowflakes. Ten years, four enterprises, and measurable results."
    },
    {
      "id": "kb-salary",
      "k": [
        "salary",
        "ctc",
        "compensation",
        "pay",
        "package",
        "expected"
      ],
      "a": "That's a conversation he'd love to have directly. Drop him a line at ravichandra.devops1993@gmail.com.",
      "say": "That's a conversation he'd love to have directly. Just drop him an email."
    },
    {
      "id": "kb-joke",
      "k": [
        "joke",
        "funny",
        "fun"
      ],
      "a": "Why did the Kubernetes pod break up with the node? It needed more space… and better resource limits. 😄",
      "say": "Why did the Kubernetes pod break up with the node? It needed more space, and better resource limits."
    }
  ],
  "piku": [
    {
      "id": "piku-wake",
      "text": "Mmm... oh! Hi there! Sorry, I was dreaming about Kubernetes clusters. I'm Piku, Ravichandra's personal assistant. He's a Senior Multi-Cloud DevOps Engineer, and he's right here. Let him introduce himself! And if you have any questions, just tap me."
    },
    {
      "id": "piku-hello",
      "text": "Hey there! I'm Piku, Ravichandra's personal assistant. He's a Senior Multi-Cloud DevOps Engineer, and honestly, he's the reason I run so smoothly on Kubernetes. I'll let him introduce himself. And if you have any questions, just tap me!"
    },
    {
      "id": "piku-tap",
      "text": "Hi! Ask me anything about Ravichandra. His skills, his experience, or when he can join."
    }
  ]
}
