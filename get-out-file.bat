@echo off
type tsconfig.json | json "compilerOptions.outFile"