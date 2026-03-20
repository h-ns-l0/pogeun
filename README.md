# Pogeun

간단한 `FastAPI + PostgreSQL + React(Vite)` 프로젝트입니다.

## 현재 상태

- Git 원격 저장소: 연결됨 (`origin -> https://github.com/h-ns-l0/pogeun.git`)
- PostgreSQL 연결: 로컬 환경에서는 성공 확인
- 백엔드 앱 연동: `/health/db` 엔드포인트로 확인 가능

## 백엔드 실행

```bash
cd /Users/h_ns_l/pogeun/backend
cp .env.example .env
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

DB 확인:

```bash
curl http://127.0.0.1:8000/health/db
```

## 프론트엔드 실행

```bash
cd /Users/h_ns_l/pogeun/frontend
npm install
npm run dev
```

## 정리 메모

- `backend/__pycache__` 같은 캐시 파일은 Git에서 제외하는 것이 맞습니다.
- DB 접속 정보는 코드에 직접 쓰지 말고 `.env`로 관리하는 것이 안전합니다.
- `frontend/README.md`는 아직 Vite 기본 템플릿 문서라서 나중에 프로젝트 문서로 바꾸는 편이 좋습니다.

## 백엔드 구조

```text
backend
├── app
│   ├── api
│   ├── core
│   ├── models
│   ├── schemas
│   ├── services
│   ├── utils
│   └── main.py
├── tests
├── main.py
├── database.py
└── requirements.txt
```

```text
frontend
├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── features
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── types
│   ├── utils
│   ├── App.tsx
│   └── main.tsx
├── public
└── package.json
```
