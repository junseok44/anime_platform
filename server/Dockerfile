FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

# 단계별로 분리해서 버그 방지
COPY package.json ./

# 종속성 설치 (모든 dependency 처리)
RUN yarn install

RUN yarn add @css-inline/css-inline-linux-x64-gnu

# 나머지 소스 복사
COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
