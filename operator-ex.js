// Operator : ReactiveX의 가장 광범위한 기능을 갖춘 부분 >> 스트림이 통과하는 pipe를 조정하니까

// 1.Operator 큰 2줄기
// Creation Operator : of, from, fromEvent, interval 등 Observable을 생성하는 함수 (rxjs에서 import / ajax만 rxjs.ajax)
// Pipable Operator : 스트림을 가공할 순수함수들(보통 rxjs.operators에서 import) -> pipe함수에 하나 이상을 넣어 연결해서 사용 가능
//                  : 순수함수(pure function)을 지향하기에 변수 변동에 의한 오류 최소화 / Observable의 소스 데이터를 직접 수정 X

const { from } = rxjs;
const { map } = rxjs.operators; // const map = rxjs.operators.map;

const array = [1, 2, 3, 4, 5];

from(array).pipe(
    map(x => x * 2) // 콜백함수으로 스트림의 각 요소에 값들을 매핑함
).subscribe(console.log);

console.log(array); // 소스 데이터가 수정되지 않은걸 확인할 수 있음


const { range } = rxjs;

const { filter } = rxjs.operators;

const obs$ = range(1, 10);
const observer = {
    next: x => console.log(x + "발행"),
    error: err => console.error("발행 중 오류", err),
    complete: () => console.log("발행물 완결"),
}

obs$.pipe(
    filter(x => x % 2 === 0), // map이 콜백함수를 기준으로 값을 치환한다면, filter는 콜백함수를 기준으로 조건에 부합하는 값만 남김 | JS Array에서도 제공
    map(x => Math.pow(x, 2)), // ','로 pipable operator 연결 가능 이때 순서가 중요
    map(x => x + 10)
).subscribe(observer);

//==========================================================================================================================================

const { interval } = rxjs;

const { tap } = rxjs.operators; // 파이프 중간에 원하는 실행을(콘솔에 찍는다던가) 미리 해보는 함수

const obs_t1$ = interval(1000);

// const subscription = obs_t1$.pipe(
//     tap(console.log), // 순서가 중요한걸 다시 알게 함
//     filter(x => x % 2 === 0),
//     map(x => Math.pow(x, 2))
// ).subscribe(observer);

// setTimeout(() => subscription.unsubscribe(), 10000);
// unsubscribe()가 아니라 Observable 자체를 10초 뒤 complete 할 수 있도록 아래 obs_t$에 개인적으로 구현해봄

//==========================================================================================================================================

const { Observable } = rxjs;

const obs_t2$ = new Observable(subscriber => {
    let item = 0;
    setInterval(() => { // 첫번째 파라미터 콜백함수로 실행될 연산, 두번째는 실행'주기' 타이밍
        subscriber.next(item++);
    }, 1000)
    setTimeout(() => { // 첫번째 파라미터 콜백함수로 실행될 연산, 두번째는 실행 타이밍
        subscriber.complete();
    }, 10000);
});

obs_t2$.pipe(
    tap(console.log),
    filter(x => x % 2 === 0),
    map(x => Math.pow(x, 2))
).subscribe(observer);

//==========================================================================================================================================

const { fromEvent } = rxjs;

const obs_e$ = fromEvent(document, 'click');
// 그냥 스트림을 발행하면 클릭이벤트의 모든 정보가 JSON으로 까발려짐 -> 여기서 맨 밑의 x,y key의 value만 뽑고 싶다면 아래처럼 map을 사용해 객체(e)의 해당 키 데이터를 뽑아온다.

obs_e$.pipe(
    map(e => "x좌표 : " + e.x + " y좌표 : " + e.y)
).subscribe(x => console.log(x, "발행"));

//==========================================================================================================================================

/*  마블 다이어그램 : ReactiveX Operator 함수 공부 필수 파트

    >> 어차피 꽤 직관적이긴 함 : 화살표 방향대로 Complete(|)까지 발행 데이터를 쭉 보여줌
    >> 근데 헷갈릴 수 있는 부분이 시간에 흐름에따라 왼쪽에서 오른쪽으로 데이터가 이동하는 것이 아니라,
       왼쪽(첫 발행 값)부터 오른쪽으로 시간에 따라 값들이 발행되는 것 (이동이 아니라 발행 시점들임)

    >> 화살표 사이 박스 : 파이프에서 각 함수가 하는 행위 (아래 스트림은 연산자 결과 흐름 마찬가지로 이동이 아니라 각 발행 시점임)

    >> X는 오류 (첨부한 이미지'marble-diagram.png'를 보면 observable에서 값들은 complete까지 무사히 발행되도 중간에 pipe 연산결과로 구독에서 오류가 관측되어 complete되지 않을 수 있음을 알 수 있음)
*/
