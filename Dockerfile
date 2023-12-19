FROM node:18.15.0 as base 

FROM base as development
WORKDIR /app
COPY package*.json ./
RUN npm install
#to copy all files to our app
COPY . .
ENV PORT=3000
EXPOSE $PORT
CMD ["npm","run","start:dev"]

FROM base as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
ENV PORT=3000
EXPOSE $PORT
CMD ["npm","start"]
#ARG NODE_ENV
#RUN if [ "$NODE_ENV" = "development" ]; \
    #then npm install; \
    #else npm install --only=production; \
    #fi

