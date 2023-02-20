# 42Manager
42Manager는 42구해줘카뎃의 철학을 이어받은 TODO 웹서비스입니다.  
Next.js와 Nest.js를 이용했으며, DB는 Postgresql을 이용했습니다.  
42 카뎃들의 마지막 과제인 트센 과제와 동일한 기술을 사용합니다.

# INDEX

- [42Manager](#42manager)
- [INDEX](#index)
- [BackGround](#background)
- [Installation](#installation)
  - [설치방법](#설치방법)
  - [ENVFILE LIST](#envfile-list)
  - [Tech](#tech)
- [api-endpoints](#api-endpoints)
- [contributing](#contributing)
- [license](#license)
# BackGround
- 구해줘 카뎃(Save42Cadet)의 서비스 종료로 인한, 새로운 웹서비스 필요 발생
- 기존 서비스의 철학(해당일에 어떤 공부를 할지 말함으로써 카뎃들이 더 좋은 인생(a.k.a 갓생)을 사는 것을 지향함)을 계승하는 프로젝트 필요성 증대
- 기존(오전 : 할 일 말하기, 오후 : 한 일 공유하기)에서 오늘 할 일 TODO리스트 작성 및 성취도를 기반으로 인센티브 제공으로 변환 
# Installation
## 설치방법
``git clone $REPOSITORY; npm install; npm start ``

## ENVFILE LIST
``DB_HOST DB_PORT DB_USERNAME DB_PASSWORD DB_NAME JWT_SECRET JWT_ISSUER JWT_ACCESS_EXPIRE JWT_REFRESH_EXPIRE FRONT_DOMAIN FT_REDIRECT_URI FT_RESPONSE_TYPE SSL_KEY_LOCATION SSL_CERT_LOCATION SERVER_PORT`` 

## Tech 
- Nest.js
- PostgreSQL
- Nginx(proxy server)
- AWS EC2
- Github Action && Github

# api-endpoints

# contributing
- **Seonghle** (Backend Leader, Backend Developer)
- **Gyeon** (DB, Backend Developer)
- **Susong** (PM, INFRA, Backend Reviewer)

# license
MIT LICENSE