// 1. 기본 산수 관련 Operator

const { of } = rxjs;
const { count, max, min, reduce } = rxjs.operators;

// 딱 봐도 무슨 Operator인지 알 수 있는 애들
// count : Observable의 발행 값 개수
// max : 발행 값들 중 가장 큰 수
// min : 발행 값들 중 가장 작은 수

// reduce : JS Array의 reduce 기능과 유사 >> 누적연산 | 상세는 아래 코드에서

const obs1$ = of(4, 2, 6, 10, 8);

obs1$.pipe(count()).subscribe(x => console.log('count : ' + x));
obs1$.pipe(max()).subscribe(x => console.log('max : ' + x));
obs1$.pipe(min()).subscribe(x => console.log('min : ' + x));

obs1$.pipe(
    reduce((acc, x) => { return acc + x }, 0)
    // 첫번째 파라미터 = 파라미터가 둘인(누적값, 현재값) 콜백함수, 초기 누적값(acc)
    // 연산결과를 계속 저장하여 누적시킴
).subscribe(x => console.log('reduce : ' + x));

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. (배열, 시간 등등) 선택관련 Operator

const { from } = rxjs;
const { first, last, elementAt, filter, distinct } = rxjs.operators;

/*  얘들도 굉장히 이름유추가 쉬움

    first : 첫번째 요소
    last : 마지막 요소
    elementAt(index) : 0부터 시작하는 index의 요소 
    distinct : 중복값 제거 (DBMS distinct 생각)
    filter : 파라미터인 콜백함수 기준으로 해당 발행값만 남김
*/

const obs2$ = from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2]);

obs2$.pipe(first()).subscribe(x => console.log("first : " + x));
obs2$.pipe(last()).subscribe(x => console.log("last : " + x));

obs2$.pipe(elementAt(5)).subscribe(x => console.log("elementAt(5) : " + x));
obs2$.pipe(distinct()).subscribe(x => console.log("distinct : " + x));

obs2$.pipe(
    distinct(),
    count()
).subscribe(x => console.log("distinct + count : " + x));
// distinct 후 count하면 중복값 없이 총 몇 개인지 체크가능(함수 순서 중요)

obs2$.pipe(
    filter(x => x % 2 === 1)
).subscribe(x => console.log('홀수 filter : ' + x));

// 중복 없이 짝수 중 가장 큰 수
obs2$.pipe(
    distinct(),
    filter(x => x % 2 === 0),
    max()
).subscribe(x => console.log('가장 큰 짝수 : ' + x));


/////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. tap operator : 파이프 사이에 통과되는 값들에 특정 동작(콜백함수 : 로그를 출력한다거나 등)을 수행

const { tap } = rxjs.operators;

from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])
    .pipe(
        tap(x => console.log("초기 발행 tap : " + x)),
        filter(x => x % 2 === 0),
        tap(x => console.log("짝수 필터 적용 후 tap : " + x)),
        distinct(),
        tap(x => console.log("중복 제거 적용 후 tap : " + x)),
    ).subscribe(x => console.log("발행물 : " + x));