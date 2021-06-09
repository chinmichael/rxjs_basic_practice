// Observer(관찰자 -> 구독자)에게 발행물 구독(Observable 발행값 -> Subscribe) 시키기


// 1. Observer 생성해 구독시키기

const { from } = rxjs; // == const from = rxjs.from;

const observable$ = from([1, 2, 3, 4, 5]); // observable 변수에는 $를 붙이는게 관례

// 저번엔 subscribe(람다식) 그냥 처리한걸 Observer를 생성하여
// JSON( JS Object Notation : JS객체(Object) 문법으로 데이터 표현하는 표준 포맷 ) 형태
// 3가지 요소(next, error, complete)가 있음 >> error나 complete로 할 일이 없을 때는 next만 해도 됨
const observer = {
    next: console.log, // 스트림에서 들어오는 값을 처리하는 함수, == next: x => console.log(x)
    error: err => console.error("발행 중 오류", err),
    complete: () => console.log("발행물 완결"), // 스트림의 수명이 다하면 실행
}

// 저번시간 custom observable를 만들때 마지막에 subscriber.complete()을 해줘야 발행완료 후 제대로 메모리를 해제함
// 위의 complete는 위 complete()까지 처리가 되었는지 

observable$.subscribe(observer);

observable$.subscribe(
    console.log,
    err => console.error("발행 중 오류", err),
    _ => console.log("발행물 완결")
); // 위와 같이 작용함 (바로 람다식으로 갈겨도 됨 순서를 next, err, complete로)

//==========================================================================================================================================

// 2. observer next, error, complete
// next : 스트림에서 들어오는 값을 처리

const { Observable } = rxjs;

const obs1$ = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    (null)[0]; // 오류 발생시 그 시점 이후 함수들은 당빠 실행안됨
    subscriber.next(4);

    subscriber.complete();
});

const obs2$ = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete(); // 메모리 해제되니 당빠 뒤의 next()는 실행이 되지 않음
    subscriber.next(4);
});

obs1$.subscribe(
    console.log,
    err => console.error("발행물 중 오류", err),
    _ => console.log("발행물 완결")
)

const observer2 = {
    next: x => console.log(x),
    error: err => console.error("발행 중 오류 발생", err),
    complete: () => console.log("발행 완료")
}

obs2$.subscribe(observer2);

//==========================================================================================================================================

// 3. 구독 해제

// 구독자가 하나일때는 그냥 observable 자체에 complete로 지정되는것이 메모리 누수가 생기지 않지만
// 하나의 observable를 여러 observer가 구독할 때 특정 observer만 해제할 경우 unsubscribe()가 사용됨

const { interval } = rxjs;

const obs3$ = interval(1000);
const subscription = obs3$.subscribe(console.log); // Observable이 구독 시작고 있음

setTimeout(_ => subscription.unsubscribe(), 5500); // 위에 구독을 상수에 대입 후에 구독 해제(여기선 5초후)

setTimeout(_ => obs3$.subscribe(console.log), 7500); // 위 상수로 선언된 subscription은 이미 해제되었으므로 새로 구독 
                                                     // 참고로 observable은 구독자마다 새로 구독이 되기에 0부터 숫자가 다시 발행됨
