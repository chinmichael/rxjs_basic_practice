// Transformation Operators
// >> 파이프 안에서 콜백함수 등으로 발행값을 개발자가 원하는 값으로 변경하는 연산자들

// 1. map
// >> JS의 Array 자료형 기본 함수이기도 하며 함수형기능 제공 언어서도 제공되는 것들과 유사 (Java도 람다, 스트림 추가하면서 map 넣었지...)

// 여러 타입의 데이터의 각 요소들을 콜백함수에서 정의한 방식으로 매핑함

const { of } = rxjs;
const { map } = rxjs.operators;

of(1, 2, 3, 4, 5).pipe(
    map(x => x + '의 제곱은 ' + Math.pow(x, 2))
).subscribe(x => console.log(x));

const { from } = rxjs;

from([
    { name: 'apple', price: 12000 },
    { name: 'pork', price: 20000 },
    { name: 'milk', price: 5000 },
]).pipe(
    map(item => item.price) // >> 이렇게 Array 내부 Object의 특정 key값만 뽑거나 수정도 되는 등
).subscribe(console.log);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. pluck
// >> 위 map의 두번쨰 예제처럼 객체의 특정 요소를 뽑아오는 등의 작업에서 좀 더 적합

const { pluck } = rxjs.operators;

const obs_pluck1$ = from([
    { name: 'apple', price: 12000, info: { category: 'fruit' } },
    { name: 'pork', price: 20000, info: { category: 'meet' } },
    { name: 'milk', price: 5000, info: { category: 'drink' } },
]);

obs_pluck1$.pipe(
    pluck('price')
    // 위와같이 내부 객체가 있는 경우(NoSQL에서 자주 보는 데이터 연결)도 문제없이 뽑힘
    // 대신 내부객체의 요소를 확인할 경우 아래처럼 그만큼 pluck으로 파고들면 됨.
).subscribe(console.log);

// obs_pluck1$.pipe(
//     pluck('info'),
//     pluck('category')
// ).subscribe(console.log);

// 하지만 pluck이 이런 상황에서 map보다 잘 쓰이는건 다음과 같이 순서대로 파라미터를 입력하면 되기 때문

obs_pluck1$.pipe(
    pluck('info', 'category')
).subscribe(console.log);

// 아래와 같은 Ajax요청에서 걸러낼때도 많이 씀

const { ajax } = rxjs.ajax;

const obs_pluck2$ = ajax(`http://api.github.com/search/users?q=user:mojombo`).pipe(
    pluck('response', 'items', 0, 'html_url') // pluck을 주석하면 ajax get요청의 무수한 정보를 볼수 있을거임....
); // 이렇게 observable을 아예 걸러서 뽑아내기도 함 >> ☆ 파이프를 거친것의 반환값도 observable이므로

obs_pluck2$.subscribe(console.log);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. toArray Operator
// >> 말그대로 연속되는 일련의 값을 배열로 묶어버림

const { range } = rxjs;
const { toArray, filter } = rxjs.operators;

range(1, 50).pipe(
    filter(x => x % 3 === 0),
    filter(x => x % 2 === 1),
    toArray(), // 스트림이 끝날때까지 기다리며 다 묶은다음 발행함
).subscribe(console.log);  // 참고로 이거 보면 위 ajax 요청이 요청시간땜에 확실히 뒤로 오는 것을 볼 수 있음 >> 나중에 시간차 설정을 잘해야한다.


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. scan Operator
// >> 누적연산을 하는 reduce와 비교될 수 있음 (사용법은 유사)
// >> reduce : 결과만 발행 vs scan : 과정 모두 발행
// >> 연속적인 계산, 배열에 붙여가던가, object 항목에 하나씩 카운트 되게하는 등 중간 과정이 모두 발행 됨으로 쓸데가 다양

const { reduce, scan } = rxjs.operators;

const obs_scan1$ = of(1, 2, 3, 4, 5);

obs_scan1$.pipe(
    reduce((acc, x) => { return acc + x }, 0)
).subscribe(x => console.log('reduce : ' + x));

obs_scan1$.pipe(
    scan((acc, x) => { return acc + x }, 0)
).subscribe(x => console.log('scan : ' + x));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 5. zip operator
// >> rxjs.operator가 아닌 rxjs에서 로드하는 것 주의 >> observable 만드는 연산자
// >> 두 스트림을 엮어 배열을 만듦, .zip이 아니라 zipper을 생각

const { interval, fromEvent, zip } = rxjs;

const obs_zip1$ = from([1, 2, 3, 4, 5]);
const obs_zip2$ = from(['a', 'b', 'c', 'd', 'e']);
const obs_zip3$ = from([true, false, 'F', [6, 7, 8], { name: 'zip' }]);

zip(obs_zip1$, obs_zip2$).subscribe(console.log); // 두개 이상 observable 스트림을 배열로 엮어 새 observable만듦
zip(obs_zip1$, obs_zip2$, obs_zip3$).subscribe(console.log); // zipper처럼 합친다고 했지만 2개 이상의 스트림 엮는거 가능

const obs_zip4$ = from([1, 2, 3, 4, 5, 6, 7]);

zip(obs_zip4$, obs_zip2$, obs_zip3$).subscribe(console.log);
// 만약 한쪽 스트림이 다른 스트림보다 발행값이 많아 매치가 안되는 경우 매치가 다 되는 것까지만 출력 (6,7은 출력 안됨)
// 가장 작은 스트림을 기준으로 함

const obs_zip5$ = interval(1000);
const obs_zip6$ = fromEvent(document, 'click').pipe(pluck('x'));

zip(obs_zip5$, obs_zip6$).subscribe(console.log);
// 이렇게 두 개를 엮으면 1초에 클릭 이벤트 한개씩 엮게 하므로 다중클릭, 연속 클릭 방지가 됨
// 근데 이 경우는 오래 기다려서 interval이 쌓여 있음 그만큼 연속클릭이나 다중클릭이 되므로 좋은 방식이 아님

//(출력 타이밍이 다르더라도 매치가 되면 됨)

// 대신 이벤트 혹은 interval과 1차원 데이터를 엮으면
// 발행값 출력을 특정 시간, 이벤트 간격으로 맞출수도 있음
