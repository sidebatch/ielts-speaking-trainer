# IELTS Speaking Trainer

한국어 사용자를 위한 **IELTS Speaking Part 1 학습 앱**입니다.

좋은 예시 답변을 많이 읽고, 듣고, 타이핑하면서 자연스럽게 반복해 익히는 것을 목표로 합니다.  
단순히 답안을 외우기보다 여러 질문에서 반복되는 표현과 문장 구조를 익혀 실제 말하기에 사용할 수 있는 기반을 만드는 방식입니다.

## Live Demo

https://sidebatch.github.io/ielts-speaking-trainer/

## Current Content

- Season: **2026 Sep–Dec**
- IELTS Speaking **Part 1**
- 13 topics
- 53 questions
- 113 answer paths
- Target levels: **5.0 / 6.0 / 7.0**
- English sample answers + natural Korean meanings
- Korean translations for questions and answer-path labels

> Question data is maintained separately from generated learning answers so future seasonal updates can be handled more safely.

## Main Features

- 목표 레벨 선택: 5.0 / 6.0 / 7.0
- 오늘 학습
- 토픽별 학습
- 질문 영어 / 한국어 뜻 보기
- 질문 TTS
- 여러 답변 방향(answer path) 중 선택
- 레벨별 답변 비교
- 답변 영어 / 한국어 뜻 보기
- 일반 속도 / 느린 속도 TTS
- 영어 발음 선택: 미국 / 영국 / 캐나다 / 호주 + 기기 음성 선택
- 문장별 학습
- 영어 가리기 + 타이핑 연습
- 성공 / 다시 연습
- 맞춤 복습
- 학습 기록 저장

## Learning Approach

이 앱의 핵심은 **좋은 영어 답변에 반복 노출되는 것**입니다.

같은 표현이 다른 토픽에서 다시 등장하는 것은 의도된 학습 요소입니다. 예를 들어:

- `I'd probably...`
- `It depends on...`
- `I don't really...`
- `I usually...`
- `I'd rather...`

같은 표현을 여러 질문에서 반복해서 만나면서 자연스럽게 말하기 패턴을 익히도록 설계했습니다.

답변은 모든 질문을 같은 구조로 만들지 않고, 질문에 따라 1–3개의 자연스러운 답변 방향을 제공합니다.

## Project Structure

```text
ielts-speaking-trainer/
├── index.html
├── styles.css
├── app.js
└── data/
    └── content.js
```

현재 GitHub Pages 배포본은 안정적인 테스트를 위해 `index.html` 안에도 앱에 필요한 코드와 데이터를 포함하고 있습니다.  
분리된 `styles.css`, `app.js`, `data/content.js` 파일은 이후 개발과 유지보수를 위한 소스 구조입니다.

## Storage

현재 학습 기록은 브라우저의 **localStorage**에 저장됩니다.

따라서:

- 같은 브라우저/기기에서는 기록이 유지됩니다.
- 다른 기기와 자동 동기화되지는 않습니다.
- 브라우저 데이터를 삭제하면 기록도 사라질 수 있습니다.

로그인 및 클라우드 동기화는 향후 기능으로 고려할 수 있습니다.

## Tech

- HTML
- CSS
- Vanilla JavaScript
- Web Speech API (TTS)
- localStorage
- GitHub Pages

별도 프레임워크나 서버 없이 동작하는 MVP입니다.

## Status

**Part 1 MVP in progress**

현재는 실제 사용 흐름과 모바일 UX를 테스트하는 단계입니다.  
Part 1이 충분히 안정화된 뒤 Part 2 / Part 3 확장을 검토합니다.

## Disclaimer

이 앱의 5.0 / 6.0 / 7.0 표시는 학습용 답변 난이도 기준입니다.  
특정 답변을 외우거나 말한다고 실제 IELTS Band 점수가 보장되는 것은 아닙니다.
