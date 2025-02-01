import { Boxes, Globe, RefreshCcw, Shield } from 'lucide-react'

// 엔터프라이즈 기능 목록
export const ENTERPRISE_FEATURES = [
  {
    icon: Globe,
    label: '글로벌 인프라',
    desc: '전 세계 엣지 노드에서 번개처럼 빠른 실행',
  },
  {
    icon: Shield,
    label: '엔터프라이즈 보안',
    desc: '은행 등급의 암호화 및 보안 프로토콜',
  },
  {
    icon: RefreshCcw,
    label: '실시간 동기화',
    desc: '모든 장치에서 즉각적인 동기화',
  },
  {
    icon: Boxes,
    label: '무제한 저장소',
    desc: '무제한 스니펫 및 프로젝트 저장',
  },
]

// 기능 목록
export const FEATURES = {
  development: [
    '고급 AI',
    '맞춤 테마 빌더',
    '통합 디버깅 도구',
    '다중 언어 지원',
  ],
  collaboration: [
    '실시간 페어 프로그래밍',
    '팀 작업 공간',
    '버전 관리 통합',
    '코드 리뷰 도구',
  ],
  deployment: [
    '원클릭 배포',
    'CI/CD 통합',
    '컨테이너 지원',
    '맞춤 도메인 매핑',
  ],
}
