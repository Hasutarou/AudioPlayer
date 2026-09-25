@echo off
chcp 65001 >nul
title Создание структуры проекта

echo Создаю структуру проекта...

REM Создаем папки
mkdir json 2>nul
mkdir media 2>nul
mkdir media\backgrounds 2>nul
mkdir media\icons 2>nul
mkdir media\images 2>nul
mkdir media\logotype 2>nul
mkdir media\prototypes 2>nul
mkdir pages 2>nul
mkdir scripts 2>nul
mkdir styles 2>nul
mkdir styles\core 2>nul
mkdir styles\layout 2>nul

REM Создаем пустые файлы в core
type nul > index.html
type nul > styles\core\_adaptation.scss
type nul > styles\core\_animation.scss
type nul > styles\core\_components.scss
type nul > styles\core\_functions.scss
type nul > styles\core\_inheritance.scss
type nul > styles\core\_mixins.scss
type nul > styles\core\_normalize.scss
type nul > styles\core\_variables.scss

REM Создаем пустой style.scss
type nul > styles\style.scss

echo.
echo ✅ Готово! Структура создана.
pause