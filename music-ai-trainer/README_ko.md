# 음악 AI 트레이너

인공지능 기반의 음악 학습 플랫폼으로, 보컬을 오디오에서 분리하고 피치 및 호흡 지점을 분석하며 음악 성과 향상을 위한 실시간 시각 피드백을 제공합니다.

## 프로젝트 구조

```
music-ai-trainer/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## 기능들

1. **보컬 분리**: Spleeter/Demucs를 사용하여 보컬을 인스트루멘탈 트랙에서 분리합니다.
2. **피치 분석**: Librosa를 사용한 실시간 피치 추적
3. **호흡 지점 감지**: 연주에서 최적의 호흡 지점을 자동으로 감지합니다.
4. **실시간 시각화**: 웹 오디오 API를 통한 라이브 마이크 입력 분석
5. **대화형 UI**: 어두운 모드와 글라스모피즘 디자인, 부드러운 애니메이션

## 기술 스택

### 프론트엔드
- Next.js (App Router)
- Tailwind CSS
- Framer Motion (애니메이션)
- Lucide React (아이콘)

### 백엔드
- FastAPI (Python)
- WebSocket을 통한 실시간 커뮤니케이션
- Librosa (피치 분석)
- Spleeter (보컬 분리)
- PyTorch

### 인프라
- PostgreSQL (사용자 데이터 저장소)
- Redis (캐싱)
- Docker Compose (컨테이너화)

## 시작하기

1. 레포지토리를 클론합니다:
```bash
git clone <repository-url>
```

2. 컨테이너를 빌드하고 실행합니다:
```bash
docker-compose up --build
```

3. 애플리케이션에 다음 주소에서 접근합니다: `http://localhost:3000`

## API 엔드포인트

- `GET /` - 상태 확인 엔드포인트
- `POST /process-audio` - 피치 분석을 위한 오디오 파일 처리
- `WS /ws` - 실시간 커뮤니케이션을 위한 WebSocket 연결

## 개발

### 프론트엔드 개발
```bash
cd frontend
yarn dev
```

### 백엔드 개발
```bash
cd backend
uvicorn main:app --reload
```

## 배포

애플리케이션은 Ubuntu 서버에서 Proxmox 가상화 환경에서 실행되도록 설계되었습니다.

프로덕션 배포를 위한 단계:
1. 환경 변수 구성
2. 적절한 SSL 인증서 설정
3. 성능을 위한 오디오 처리 최적화
4. 사용자 인증 및 권한 부여 구현