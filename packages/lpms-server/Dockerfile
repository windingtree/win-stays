FROM node:16.15-bullseye

RUN mkdir repo
RUN mkdir database
RUN mkdir temp

RUN git clone https://github.com/windingtree/win-stays.git /repo
RUN echo $(ls /repo)

WORKDIR /repo
RUN yarn
RUN yarn bootstrap

WORKDIR /repo/packages/stays-models
RUN yarn prepublish
RUN echo $(ls /repo/packages/stays-models)

WORKDIR /repo/packages/lpms-server
RUN yarn build

VOLUME /database
VOLUME /temp

ENV CLIENT_URL=$CLIENT_URL
ENV APP_ACCESS_TOKEN_KEY=$APP_ACCESS_TOKEN_KEY
ENV APP_REFRESH_TOKEN_KEY=$APP_REFRESH_TOKEN_KEY
ENV APP_WALLET_PASSPHRASE=$APP_WALLET_PASSPHRASE
ENV WEB3STORAGE_KEY=$WEB3STORAGE_KEY
ENV DEBUG_LPMS_SERVER=$DEBUG_LPMS_SERVER
ENV APP_CHAIN_ID=$APP_CHAIN_ID
ENV APP_VERIFYING_CONTRACT=$APP_VERIFYING_CONTRACT
ENV APP_DB_DIR=$APP_DB_DIR
ENV PORT=$PORT

ENTRYPOINT [ "/repo/packages/lpms-server/node_modules/.bin/nodemon","--exec","node","dist/src/index.js" ]
