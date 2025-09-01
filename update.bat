@echo off
SET ZIP_URL=https://github.com/Pablo1BC/mini-share/releases/download/v1.1.0/mini-share.zip
SET TEMP_DIR=temp_update
SET ZIP_FILE=temp.zip

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

echo Atualização concluída!
pause
