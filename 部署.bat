@echo off
chcp 65001 >nul
echo 🚀 正在部署到 Cloudflare...
echo.
cd /d "%~dp0"

REM 读取 .env 中的凭证
for /f "tokens=1,2 delims==" %%a in (.env) do set %%a=%%b

REM 1. Git 提交 + 推送
git add .
git commit -m "📝 更新 %date% %time%" 2>nul
git push 2>nul

REM 2. Wrangler 直接部署
set PATH=C:\Program Files\nodejs;%PATH%
npx wrangler pages deploy . --project-name=supersuperchik-home --branch=main

echo.
echo ✅ 部署完成！
echo    访问: https://supersuperchik-home.pages.dev
pause
