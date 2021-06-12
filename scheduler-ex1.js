
// Scheduler : Observable, Operator, Observer가 / 멀티스레드 환경에서 / 어떤 스레드에 실행될 지 결정하는 것

// >> ex : 작업을 무조건 당장 실행 or 현재 진행되는 빨리끝나는 작업만 끝나고 실행 or 다 끝나고 실행 or 특정 시간대에 실행 등

// 스레드 관련 파트 >> ReactiveX 중 언어마다 상세가 큰 차이를 보이는 파트임 (RxJS에 비해 RxJava는 공식문서 상세가 몇 배 길다 ㄷㄷ)
// 조금 어려운 파트이므로 강좌 다 듣고 다시 복습 필수!! (으... 자바 스레드 파트 언제 보냐...)


// =======================================================================================================================

// Operator들은 각각의 특성에 맞는 디폴트 설정 Schedular가 있음(Scheduler가 없음(null) 포함)
// ex) RxJava에서 timestamp, timeinterval처럼 발행 즉시 구독자에게 넘겨지는 경우는 immediate가 default

/* RxJS Scheduler 종류 

   null : 스케줄러 없음 >> 동기적, 재귀적 연산자에 사용

   queueScheduler : 새 작업을 현재 작업 대기줄 마지막에 세움 >> 반복 연산자

   asapScheduler :  현 소작업(microtask)이 끝나고 다음 소작업 시작 전에 실행 >> 비동기 작업

   asyncScheduler : setInterval과 함께 사용 >> 시간 관련 연산자

   animationFrameScheduler : 브라우저가 내용을 새로 그리기(repaint) 전에 실행, 부드러운 애니메이션을 위해 사용 */


/* Scheduler를 파이프에 적용하기 위한 연산자 (각 언어 공통)

   SubscribeOn : Observable or (Observable을 처리할) Operator를 실행할 Scheduler 지정

   ObserveOn : Observer에 알림을 보낼 때 사용할 Scheduler 지정*/

// =======================================================================================================================

const { of, asyncScheduler } = rxjs;
const { subscribeOn, observeOn, tap } = rxjs.operators;

const tapper = x => console.log(`${x} 발행`);
const observer = x => console.log(`${x} 구독`);

of(1, 2, 3).pipe(
   tap(tapper),
   subscribeOn(asyncScheduler) // Observable이나 Operator 시점에 적용 | 123 발행, 구독 모두 DEF까지 끝난 뒤
).subscribe(observer);

of(4, 5, 6).pipe(
   tap(tapper)
).subscribe(observer);


of('A', 'B', 'C').pipe(
   tap(tapper),
   observeOn(asyncScheduler) // Observer 구독 시점 적용 >> ABC 발행은 먼저 DEF 전에 나옴 | ABC 구독만 맨 마지막
).subscribe(observer);

of('D', 'E', 'F').pipe(
   tap(tapper)
).subscribe(observer);

// asyncScheduler문서를 다시 번역하면 : 이벤트 루프 대기열에 배치하여 비동기 예약을 함. / 작업을 지연 시키거나 / 일정 간격 반복되는 작업을 예약
// 우선 asapScheduler처럼 작업 지연이 됨을 알 수 있음

// 보통 SubscribeOn(적절한 스케줄러 부여되어 있음)보다 ObserveOn으로 발행된 값으로 구독자가 작업을 하는 시점을 정하는 경우가 많다.

// 강의가 끝나고 좀 더 이해를 한뒤에 보충 메모를 해야할듯



