@echo off
set "ROOT=%~dp0"
start "" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%ROOT%scripts\start-project-hidden.ps1"
exit /b
