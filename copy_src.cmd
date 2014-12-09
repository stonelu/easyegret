set easyegret_dir=E:\items\h5
set h5_dir=E:\items\h5
set project_dir=
set /p project_dir=请输入项目根目录:
echo project_dir=%project_dir%

xcopy %h5_dir%\%project_dir%\src\com %easyegret_dir%\easyegret\src\com\  /E /Y /F /R
pause