# 개발 환경용 Dockerfile
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package.json yarn.lock ./
RUN yarn install

# 소스 복사
COPY . .

# 포트 노출 (NestJS 기본 3000)
EXPOSE 3000

# 개발 모드로 실행
CMD ["yarn", "start:dev"]
