#!/bin/sh
TIMEOUT=15
HOST="$1"
PORT="$2"
echo "⏳ Waiting for $HOST:$PORT..."
for i in $(seq $TIMEOUT) ; do
  nc -z "$HOST" "$PORT" > /dev/null 2>&1
  if [ $? -eq 0 ] ; then
    echo "✅ $HOST:$PORT is available!"
    exit 0
  fi
  sleep 1
done
echo "❌ Timeout waiting for $HOST:$PORT"
exit 1