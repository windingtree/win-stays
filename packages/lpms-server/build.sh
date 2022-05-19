set -e

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

docker build --platform=linux/x86_64 \
      --progress=plain \
      -t windingtree/lpms-server:$LPMS_SERVER_TAG \
    .
