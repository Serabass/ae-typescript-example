@echo off
for /f "usebackq tokens=*" %%p in (`node ae`) do (
  for /f "usebackq tokens=*" %%d in (`node -p "process.cwd().replace(/\\/g, '\\\\')"`) do (
    for /f "usebackq tokens=*" %%x in (`get-out-file`) do (
      "%%pAfterFX.exe" -s "$.evalFile('%%d\\%%x')"
    )
  )
)