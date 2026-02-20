#!/bin/bash
set -e

echo "Waiting for SQL Server to be healthy..."
for i in {1..60}; do
  if timeout 1 bash -c "echo >/dev/tcp/sqlserver/1433" 2>/dev/null; then
    echo "SQL Server is responding on port 1433"
    break
  fi
  echo "Attempt $i: SQL Server not ready yet - waiting..."
  sleep 2
done

sleep 3
echo "Starting application..."
exec dotnet EcommerceProducts.dll
