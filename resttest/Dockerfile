# Node.js 기반 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 db.json 복사
COPY package.json ./
COPY db.json ./

# 의존성 설치
RUN npm install

# 컨테이너 외부에서 4000 포트 열기
EXPOSE 4000

# JSON Server 실행
CMD ["npm", "start"];