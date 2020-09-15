@echo off
call "C:\Softwares\setenvc.cmd"
call ant -f "%~dp0\modules\ant\build.xml" %* studio
