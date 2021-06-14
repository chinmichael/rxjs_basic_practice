// Observable : 관찰대상, 스트림 생성

// 5가지 Observable

// 1. 배열형, 시간에 구애되지 않는 1차원적 스트림
const { of, from, range, generate } = rxjs // rxjs 라이브러리로부터 각 함수를 const로 지정해서 사용

/*
위의 변수 선언은
const of = rxjs.of
const from = rxjs.from
const range = rxjs.range
const generate = rxjs.generate 와 같은 의미들
*/

const obs1$ = of(1, 2, 3, 4, 5) // of는 해당 함수 파라미터 자체가 값의 스트림으로 생성됨 >> 값이 많을 때 하드코딩은 힘듦
const obs2$ = from([6, 7, 8, 9, 10]) // from은 배열을 파라미터로 스트림을 생성
const obs3$ = range(11, 5) // range는 시작 파라미터와 / 몇개를 스트림으로 생성할지를 파라미터로
const obs4$ = generate(
    15, x => x < 30, x => x + 2 // for문과 비슷 위에서는 15부터 시작해서 x가 30보다 작을때까지 x에 2를 더함
)

//obs1$.subscribe(item => console.log(`of: ${item}`))
//obs2$.subscribe(item => console.log(`from: ${item}`))
//obs3$.subscribe(item => console.log(`range: ${item}`)) // range는 시작 파라미터와 / 몇개를 스트림으로 생성할지를 파라미터로 (11 ~ 15)
//obs4$.subscribe(item => console.log(`generate: ${item}`)) // for문과 비슷 위에서는 15부터 시작해서 x가 30보다 작을때까지 x에 2를 더함 (15, 17, 19, ~ , 29)


//==========================================================================================================================================

// 2. 스트림 생성에 시간개념이 필요

const { interval, timer } = rxjs

// 파라미터 단위는 밀리초
const obs_t1$ = interval(1000) // 1초(1000밀리초)마다 1씩 증가하는 스트림 생성
const obs_t2$ = timer(3000) // 3초가 지나면 값이 출력

//obs_t1$.subscribe(item => console.log(`interval: ${item}`))
//obs_t2$.subscribe(item => console.log(`timer: ${item}`))

//==========================================================================================================================================

// 3. 이벤트에 의한 스트림 생성

const { fromEvent } = rxjs

const obs_e1$ = fromEvent(document, 'click') // 클릭 이벤트 스트림 발생
const obs_e2$ = fromEvent(document.getElementById('myInput'), 'keypress') // 위 input 객체에 키를 누르는 이벤트마다 스트림 발생

//obs_e1$.subscribe(item => console.log(item)) // 클릭마다 마우스 이벤트에 대한 오브젝트로 된 정보를 받을 수 있음 >> 이걸로 뭘 변수로해 띄어낼지도 알수있게다
//obs_e2$.subscribe(item => console.log(item)) // 마찬가지로 위에 이벤트마다 눌린 key 이벤트 정보 관련 데이터 전부 나옴

//==========================================================================================================================================

// 4. Ajax

const { ajax } = rxjs.ajax

const obs_aj$ = ajax(`http://127.0.0.1:3000/people/1`)

//obs_aj$.subscribe(result => console.log(result.response))

//==========================================================================================================================================

// 5. 사용자 정의 : new로 Observable 객체를 생성하여 정의함 >> 아래처럼 어떤식으로 어떤값을 발행해갈지 정의 가능

const { Observable } = rxjs

const obs_cus$ = new Observable(subscriber => { // 헷갈리지 않도록 변수를 subscibe가 아니라 subscriber로
    subscriber.next(1) // 각 next()함수로 스트림으로 보낼 발행 값을 생성하여 subscribe함수를 실행시킴
    subscriber.next(2)
    subscriber.next(3)
    subscriber.complete() // 스트림 끝

    //let i = 4
    //setInterval(_ => subscriber.next(i++), 1000) // setInterval 함수로 시간에 따른 사용자 정의 Observable 등도 만들수 있음
})

//obs_cus$.subscribe(item => console.log(item))

//==========================================================================================================================================

/*
위 Observable 객체들의 특징 : lazy
>> 미리 값을 발행하지 않고 subscribe되야 발행을 시작함
>> 
*/
const obs_prop1$ = of('a', 'b', 'c');
const obs_prop2$ = interval(1000);
const obs_prop3$ = fromEvent(document, 'click');

// setTimeout()의 두번째 파라미터로 첫번째 파라미터의 람다식이 언제부터 동작할지 지정
// >> 이를 보면 특히 클릭 이벤트 같은 경우 15초 이후부터 먹히는 걸 볼 수 있음
// >> subscribe해야 observable의 스트림이 발행되기 시작한다
// >> 또 2번째 obs_prop2 interval 구독을 보면 같은 observable 객체지만 다른 subscribe 구독에는 각각 스트림을 발행하는 것을 볼 수 있음

setTimeout(_ => {
    console.log("of 구독시작")
    obs1$.subscribe(item => console.log(item))
}, 5000);

setTimeout(_ => {
    console.log('interval 구독시작')
    obs_prop2$.subscribe(item => console.log(item))
}, 10000);

setTimeout(_ => {
    console.log('fromEvent 구독시작')
    obs_prop3$.subscribe(_ => console.log('click!'))
}, 15000);

setTimeout(_ => {
    console.log('interval2 구독시작')
    obs_prop2$.subscribe(item => console.log(item))
}, 20000);