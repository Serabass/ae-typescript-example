@echo off
for /f "usebackq tokens=*" %%p in (`node ae`) do (
  for /f "usebackq tokens=*" %%d in (`node cwd`) do (
    for /f "usebackq tokens=*" %%x in (`get-out-file`) do (
      echo %%p
      echo %%d
      echo %%x
    )
  )
)