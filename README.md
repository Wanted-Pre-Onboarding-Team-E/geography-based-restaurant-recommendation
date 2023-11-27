![save](https://github.com/Wanted-Pre-Onboarding-Team-E/geography-based-restaurant-recommendation/assets/68440583/9c848047-be3f-4827-9b14-bccf398b6022)

# :sushi: 여기가자

## #️⃣ 프로젝트 소개

본 서비스는 `공공 데이터`를 활용하여, `지역 음식점 목록`을 자동으로 업데이트 합니다.<br>
이를 통해 `사용자 위치 기반`의 `맛집 리스트`를 제공하고 맛집들의 `메뉴를 추천`합니다.<br>
더불어 맛집에 대한 `평가`를 등록하여 음식을 좋아하는 사람들 간의 소통을 할 수 있는 서비스입니다.

<br>

## 🛠️ 기술 스택

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-fcad03?style=for-the-badge">&nbsp;
<img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white">&nbsp;
<img src="https://img.shields.io/badge/Redis-DC382C?style=for-the-badge&logo=redis&logoColor=white">

<br>

## 🏷️ 목차

1. [:gear: 환경 설정 및 실행](#gear-환경-설정-및-실행)
2. [:cd: 데이터베이스 모델링](#cd-데이터베이스-모델링)
3. [:earth_asia: API 명세](#earth_asia-API-명세)
4. [:bookmark_tabs: 구현 내용](#bookmark_tabs-구현-내용)
5. [:wave: 팀원 소개](#wave-팀원-소개)

<br>

## :gear: 환경 설정 및 실행

데이터베이스 스키마를 생성합니다.

```sql
CREATE DATABASE `wanted`
    DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

서버 및 데이터베이스 연결을 위한 환경 변수를 설정합니다.

```dotenv
SERVER_PORT=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
OPEN_API_KEY=
DISCORD_WEBHOOK_URL=
```

데이터베이스 스키마 생성 후, 스크립트 파일 실행으로 초기 설정합니다.

```bash
> sh start.sh # 리눅스 스크립트 파일 실행
> ./start.bat # 윈도우 스크립트 파일 실행
```

<br>

## :cd: 데이터베이스 모델링

- 사용자 ↔️ 평가 `1:N`
    - 하나의 사용자가 여러 개의 평가를 등록할 수 있습니다.
- 맛집 ↔️ 평가 `1:N`
    - 하나의 맛집에 여러 개의 평가를 등록할 수 있습니다.

![image.png](https://hackmd.io/_uploads/S1j4QjDmT.png)

<br>

## :earth_asia: API 명세

> [`GitHub Wiki`로 이동! 🏃🏻‍💨](https://github.com/Wanted-Pre-Onboarding-Team-E/geography-based-restaurant-recommendation/wiki/REST-API)

<br>

## :bookmark_tabs: 구현 내용

#### 사용자

- 계정명, 비밀번호를 사용하여 회원가입하고, `bcrypt`로 비밀번호를 암호화합니다.
- `Cookie`와 `JWT` 기반으로 인증합니다.
- 로그인 이후 모든 `API` 요청에 대해 `JWT` 유효성을 검증합니다.
- 인증된 사용자는 사용자의 정보를 확인할 수 있습니다.
- 사용자는 현재 위치(위도/경도), 점심 추천 기능 사용 여부를 수정할 수 있습니다.

#### 데이터 수집 및 전처리

- 공공데이터 `Open API` 중 <경기도_일반음식점 김밥(도시락), 일식, 중국식>을 사용했습니다.
- `Open API` 에 포함된 모든 필드를 팀 회의를 통해 재정의하였고, `null` 값의 경우 필드 타입에 맞게 디폴트 값을 설정하는 전처리 과정을 거쳐서 `DB`에 저장됩니다.
- 도로명 주소를 `Unique`로 설정하고 동일한 도로명 주소가 있다면 업데이트, 없다면 신규 등록됩니다.

#### 맛집

- 사용자 위도/경도를 기반으로 `주변 맛집 리스트`를 `조회`합니다.
    - 검색어, 거리 설정을 통한 맛집 리스트 조회
    - 거리순, 평점순으로 정렬 가능
- 평가 정보를 포함하여 `특정 맛집을 상세 조회`할 수 있습니다.
- 사용자는 특정 맛집에 대해 `평가`를 등록할 수 있습니다. 평가 점수에 따라 맛집의 총 평점이 업데이트 됩니다.

#### 자동화

- `Cron Job` 스케줄링을 통해 다음과 같이 자동화를 진행합니다.
- 매주 월요일~목요일 오전 05:00
    - `Open API` 호출을 통한 맛집 데이터 업데이트
- 매주 월요일 오전 12:00
    - 시군구 목록이 담긴 `.csv` 파일을 파싱 후 캐싱
- 매주 월요일~금요일 오전 11:30
    - 서비스 사용에 동의한 사용자 대상
    - 사용자 현재 위치에서 반경 500m 이내의 랜덤 카테고리(중식, 일식, 김밥) 중 1개의 맛집
    - 메뉴(이름과 가격) 3개를 포함
    - 디스코드 `Webhook URL`과 연결된 채널로 메세지를 전송  
      <img src="https://hackmd.io/_uploads/SkP845Lm6.png" width="50%">

#### 대규모 트래픽 대비 캐싱

- 시군구 목록 데이터를 캐싱합니다.
    - 자주 변경되지 않으므로 만료 기간 없음
- 자주 조회되는 맛집 상세 정보를 캐싱합니다.
    - 조회수 100 이상일 경우 캐싱
    - 600초 삭제 데드라인 설정

<br>

## :wave: 팀원 소개

|                                강희수                                |                                박동훈                                |                                신은수                                |                               이드보라                                |                                이승원                                |
|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|:-----------------------------------------------------------------:|
| <img src="https://hackmd.io/_uploads/SJ-7MdLma.jpg" width="100"/> | <img src="https://hackmd.io/_uploads/B12ir7pGp.png" width="100"/> | <img src="https://hackmd.io/_uploads/HyZ86pjzp.png" width="100"/> | <img src="https://hackmd.io/_uploads/ByC5xOhz6.jpg" width="100"/> | <img src="https://hackmd.io/_uploads/B19HTJ6zp.jpg" width="100"/> |!
|              [@kangssu](https://github.com/kangssu)               |            [@laetipark](https://github.com/laetipark)             |              [@dawwson](https://github.com/dawwson)               |             [@sayapin1](https://github.com/sayapin1)              |             [@tomeee11](https://github.com/tomeee11)              |

</br>

#### 역할

- **강희수**
    - 공공데이터포털 `Open API` 사용 및 데이터 전처리 진행하여 데이터 저장
    - `NestJS Task Scheduling` 사용
- **박동훈**
    - `Typeorm` 마이그레이션
    - 사용자 회원가입 및 `JWT`를 이용한 로그인
    - 사용자 조회 및 점심 추천 여부, 위치 설정
    - 시군구 조회 및 `CSV`파일과 `Scheduling`을 이용한 시군구 목록 데이터 캐싱
    - 검색어 또는 필터링을 통한 `주변 맛집 리스트 조회`
- **신은수**
    - 보일러 플레이트 코드 작성 및 개발 환경 설정
    - 디스코드 `Webhook`을 사용한 점심 추천 기능 및 단위 테스트
- **이드보라**
    - `맛집 상세 정보` 불러오기 및 캐싱
    - `Redis` 사용
- **이승원**
    - `CSV` 데이터를 `Scheduling`을 통해 일정 주기마다 데이터 캐싱
    - `Redis` 사용하여 캐싱된 데이터 저장
    - 음식점 평가`API` 구현 및 단위 테스트
