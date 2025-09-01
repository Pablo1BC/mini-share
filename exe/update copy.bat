@echo off
REM ---------------------------------------------------
REM Atualização automática de programa portátil via ZIP
REM ---------------------------------------------------

SET OLD_EXE=programa.exe
SET BACKUP_EXE=programa_backup.exe
SET ZIP_FILE=programa_novo.zip
SET DOWNLOAD_URL=https://seusite.com/programa_novo.zip
SET TEMP_DIR=temp_update

REM 1. Fecha o programa antigo
taskkill /IM %OLD_EXE% /F >nul 2>&1
ping 127.0.0.1 -n 3 >nul

REM 2. Faz backup do executável antigo
if exist %BACKUP_EXE% del /F /Q %BACKUP_EXE%
if exist %OLD_EXE% rename %OLD_EXE% %BACKUP_EXE%

REM 3. Baixa o ZIP da nova versão
echo Baixando nova versão...
powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%ZIP_FILE%'"

REM 4. Cria pasta temporária e extrai o ZIP
if exist %TEMP_DIR% rmdir /S /Q %TEMP_DIR%
mkdir %TEMP_DIR%
powershell -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%TEMP_DIR%' -Force"

REM 5. Copia arquivos extraídos para a pasta do programa
xcopy /E /Y %TEMP_DIR%\* .

REM 6. Limpa arquivos temporários
rmdir /S /Q %TEMP_DIR%
del /F /Q %ZIP_FILE%

REM 7. Reinicia o programa atualizado
start "" %OLD_EXE%

echo Atualização concluída!
pause
