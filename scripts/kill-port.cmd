@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\kill-port.ps1" %*
pause