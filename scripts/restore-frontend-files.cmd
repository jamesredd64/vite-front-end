@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\restore-frontend-files.ps1"
pause