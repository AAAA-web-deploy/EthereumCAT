$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$node = "C:\Program Files\nodejs\node.exe"
$logDir = Join-Path $repo "data\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $repo "data") | Out-Null

$listening = netstat -ano | Select-String -Pattern ":8801\s+.*LISTENING"
if ($listening) {
  Write-Host "ETHCAT analytics already listening on 8801"
  exit 0
}

$env:HOST = "127.0.0.1"
$env:PORT = "8801"
$env:NODE_ENV = "production"
$env:TRUST_PROXY = "1"
$env:TRUSTED_PROXIES = "127.0.0.1,::1"
$env:TRUSTED_IP_HEADER = "x-forwarded-for"
$env:ALLOWED_ORIGINS = "https://ethercat.online,https://www.ethercat.online,http://ethercat.online,http://www.ethercat.online,https://ethcat.103.161.35.238.sslip.io,https://aaaa-web-deploy.github.io,http://127.0.0.1:8801,http://localhost:8801"
$env:ETHCAT_DIST = $repo
$env:ETHCAT_DATA_DIR = Join-Path $repo "data"
if (-not $env:DASHBOARD_PASSWORD) {
  $env:DASHBOARD_PASSWORD = "AAAA"
}

Start-Process -FilePath $node `
  -ArgumentList "--experimental-strip-types","server/index.ts" `
  -WorkingDirectory $repo `
  -WindowStyle Hidden `
  -RedirectStandardOutput (Join-Path $logDir "node.out.log") `
  -RedirectStandardError (Join-Path $logDir "node.err.log")

Start-Sleep -Seconds 2
$listening = netstat -ano | Select-String -Pattern ":8801\s+.*LISTENING"
if (-not $listening) {
  Write-Error "ETHCAT analytics failed to start. Check data\logs\node.err.log"
  exit 1
}
Write-Host "ETHCAT analytics listening on 127.0.0.1:8801"
