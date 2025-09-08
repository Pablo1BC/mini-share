@echo off
REM Recebe o link do ZIP como parâmetro ou usa o padrão
SET ZIP_URL=%1
IF "%ZIP_URL%"=="" SET ZIP_URL=https://devzone-pbc.netlify.app/update/mini-share/MiniShare.zip

SET TEMP_DIR=temp_update
SET ZIP_FILE=temp.zip
SET APP_EXE=MiniShare.exe

REM Fecha o programa antigo
taskkill /IM %APP_EXE% /F >nul 2>&1
echo %APP_EXE% fechado (se estava aberto)

REM Cria pasta temporária
if exist %TEMP_DIR% rmdir /S /Q %TEMP_DIR%
mkdir %TEMP_DIR%

REM Baixa o ZIP
powershell -Command "Invoke-WebRequest -Uri '%ZIP_URL%' -OutFile '%ZIP_FILE%'"

REM Extrai o ZIP
powershell -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%TEMP_DIR%' -Force"

REM Copia os arquivos para a pasta atual
xcopy /E /Y %TEMP_DIR%\* .

REM Limpa arquivos temporários
rmdir /S /Q %TEMP_DIR%
del /F /Q %ZIP_FILE%

REM Reinicia o app atualizado
start "" %APP_EXE%

echo Atualização concluída!
pause
