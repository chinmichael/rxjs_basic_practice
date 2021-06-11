// Subject? Observable 한계 극복

const { Subject } = rxjs;

const sub1 = new Subject();

sub1.subscribe(console.log);

sub1.next(1); sub1.next(2); sub1.next(3);

/*  observable : unicast, cold 발행

    > 구독을 해야 발행을 시작
    > 각 구독자에 따로 발행

    >> 미리 정의된 방식, 값을 발행
*/

/*  subject : multicast, hot 발행

    > 개발자가 원할 때 발행
    > 모든 구독자에 똑같이 발행 (뒤 구독자는 똑같이 앞 구독자 시점부터)

    >> 위에서처럼 발행 값을 추후에 지정 가능 (발행 시점, 발행 값을 외부 지정 가능)
*/

//==========================================================================================================================================

const sub2 = new Subject();

setTimeout(() => {
    let x = 0;
    setInterval(_ => {
        sub2.next(x++); // ++x가 아니라 x++니까 0부터 시작
    }, 2000)
}, 5000); // 5초 이후부터 2초마다 발행 (첫 발행은 7초란 소리)

// 외부에서 Subject의 next가 지정됨

// sub2.subscribe(x => console.log("바로 구독 : " + x)); // 7초 이후 바로 발행, 10초짜리 전까지 2번

// setTimeout(_ => {
//     sub2.subscribe(x => console.log("3초 후 구독 : " + x)); // 7초 이후 바로 발행, 10초짜리 전까지 2번
// }, 3000);

// setTimeout(_ => {
//     sub2.subscribe(x => console.log("10초 후 구독 : " + x)); // 11초 이후 바로 발행, 14초짜리 전까지 2번
// }, 10000);

// setTimeout(_ => {
//     sub2.subscribe(x => console.log("14초 후 구독 : " + x));
// }, 14000);

// Observable의 경우는 각가 subscribe마다 각 다른 값 구독함
// Subject이기에 뒤의 구독자들도 같은 발행값들을 봄

//==========================================================================================================================================

// 2. Observable + Subject >> 동일 값 구독시키기

const { interval } = rxjs;

const sub3 = new Subject();
const obs1$ = interval(1000);

obs1$.subscribe(sub3);
// Observable을 Subject가 구독하게 하면 모든 구독에 똑같이 발행시킬 수 있음
/*
    obs1$.subscribe(x => {
        sub3.next(x);
    });
    로 결합되었다고 생각
*/

//sub3.subscribe(x => console.log("바로 구독 : " + x));

// setTimeout(_ => {
//     sub3.subscribe(x => console.log('3초 후 구독 : ' + x));
// }, 3000);

// setTimeout(_ => {
//     sub3.subscribe(x => console.log('5초 후 구독 : ' + x));
// }, 5000);

// setTimeout(_ => {
//     sub3.subscribe(x => console.log('10초 후 구독 : ' + x));
// }, 10000);

//==========================================================================================================================================

// 4. 추가 기능 Subject

const { BehaviorSubject } = rxjs;

const behavior = new BehaviorSubject(0); // 초기값 있음 >> 내부 변수에 현재 발행 값 저장 후 거기부터 구독자에 발행

behavior.subscribe(x => console.log('A : ' + x));

behavior.next(1);
behavior.next(2);
behavior.next(3);

behavior.subscribe(x => console.log('B : ' + x)); // 마지막 발행이 next(3)이므로 3부터 B 구독자에게 발행해줌

behavior.next(4);
behavior.next(5);

const { ReplaySubject } = rxjs;
const reSub = new ReplaySubject(3); // 생성자 파라미터로 지정된 횟수만큼 뒤 구독자에게 재발행해줌, 마지막 n개값을 저장

reSub.subscribe(x => console.log('reA : ' + x));

reSub.next(1);
reSub.next(2);
reSub.next(3);
reSub.next(4);
reSub.next(5);

reSub.subscribe(x => console.log('reB : ' + x)); // next(3) ~ next(5) 만큼(3) 재발행

reSub.next(6);
reSub.next(7);

const { AsyncSubject } = rxjs;
const asySub = new AsyncSubject(); // complete 직전 발행값 만을 구독시킨다.

asySub.subscribe(x => console.log('asyA : ' + x));

asySub.next(1);
asySub.next(2);
asySub.next(3);

asySub.subscribe(x => console.log('asyB : ' + x));

asySub.next(4);
asySub.next(5);

asySub.subscribe(x => console.log('asyC : ' + x));

asySub.next(6);
asySub.next(7);
asySub.complete();


// Subject >> 값 발행 시점을 특정할 때 / 특정 프로그램 상태를 변수 대신 지정할 때