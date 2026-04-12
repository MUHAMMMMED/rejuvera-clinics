
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# تثبيت الـ dependencies بسرعة وبأقل requests
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .

# بناء المشروع
RUN npm run build

# تثبيت serve بشكل عالمي
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]