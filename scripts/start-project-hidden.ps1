$ErrorActionPreference = "SilentlyContinue"

$root = Split-Path -Parent $PSScriptRoot
$client = Join-Path $root "client"
$server = Join-Path $root "server"
$url = "http://127.0.0.1:5173/gear-labs-landing-market/"

function Test-PortOpen {
  param([int]$Port)

  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $connect = $tcp.BeginConnect("127.0.0.1", $Port, $null, $null)
    if (-not $connect.AsyncWaitHandle.WaitOne(250, $false)) {
      return $false
    }
    $tcp.EndConnect($connect)
    return $true
  } catch {
    return $false
  } finally {
    $tcp.Close()
  }
}

$node = "C:\Program Files\nodejs\node.exe"
if (-not (Test-Path -LiteralPath $node)) {
  $nodeCommand = Get-Command node.exe
  if ($nodeCommand) {
    $node = $nodeCommand.Source
  }
}

if ((Test-Path -LiteralPath $node) -and -not (Test-PortOpen -Port 5050)) {
  $serverEntry = Join-Path $server "index.js"

  if (Test-Path -LiteralPath $serverEntry) {
    Start-Process `
      -FilePath $node `
      -ArgumentList @($serverEntry) `
      -WorkingDirectory $server `
      -WindowStyle Hidden
  }
}

if ((Test-Path -LiteralPath $node) -and -not (Test-PortOpen -Port 5173)) {
  $vite = Join-Path $client "node_modules\vite\bin\vite.js"

  if ((Test-Path -LiteralPath $node) -and (Test-Path -LiteralPath $vite)) {
    Start-Process `
      -FilePath $node `
      -ArgumentList @($vite, "--host", "127.0.0.1") `
      -WorkingDirectory $client `
      -WindowStyle Hidden

    Start-Sleep -Seconds 2
  }
}

Start-Process $url
