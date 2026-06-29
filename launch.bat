@echo off
REM Droplet Labs · 期权之路 · Options Path —— 本地启动
REM 用本地服务器打开（不要直接双击 index.html）：
REM   1) 浏览器内的交互演示（Black-Scholes 定价、希腊字母曲线、蒙特卡洛）需要安全上下文
REM   2) 课程内容是按需 import 的，也需要服务器
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Droplet Labs - Options Path  ->  http://localhost:8780/
echo   关闭本窗口即停止。若浏览器先打开报错，刷新一下即可。
echo.
start "" http://localhost:8780/
python -m http.server 8780
