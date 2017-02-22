import { Subject, Observable, ReplaySubject } from "rxjs/Rx";

class Service {
    private o1: Observable<any>;
    private o2: Observable<any>;

    constructor(source: Observable<any>) {
        this.o1 = Observable
            .from(source);
        this.o2 = Observable
            .from(source)
            .filter(value => value % 2 == 0);
    }

    public getO1(): Observable<any> {
        return this.o1;
    }

    public getO2(): Observable<any> {
        return this.o2;
    }
}

export class Attribute {
    name: String;
    value: String;
}

export class Test {
    constructor() {

        var o1 = Observable
            .interval(1000)
            .take(1)
            .map(() => "A");

        var o2 = Observable
            .interval(2000)
            .take(1)
            .map(() => "B");

        var o3 = Observable.merge(o1, o2);

        var tick = Observable
            .interval(4000)
            .map(() => "TICK");

        tick.subscribe(result => console.log(result));

        var o4 = Observable
            .from(tick)
            .map(() => Observable.merge(o1, o2))
            .mergeAll();

        o4.subscribe(result => console.log(result));
    }

    f2() {

        //recover from error:
        var o1 = Observable.from(["a", "b", "c", "d"])
            .map(x => {
                if (x === "b")
                    throw new Error("b!")
                else
                    return x;
            })
            .retryWhen(x => Observable.interval(2000))

        var o2 = Observable.interval(1000);

        var o3 = Observable.concat([o2, o2, o2]);

        o1.subscribe(result => console.log(result));

    }

    f3() {
        console.log("Test.constructor");

        var scenario: number = 6;

        if (scenario === 1) {

            var o = Observable
                .interval(1000)
                .take(5)
                .do(result => console.log("source: " + result));

            var service = new Service(o);

            Observable
                .interval(5000)
                .take(1)
                .subscribe(() => {
                    console.log("5000: ")
                    service.getO1().subscribe(result => console.log("O1: " + result));
                    service.getO2().subscribe(result => console.log("O2: " + result));
                });
        } else if (scenario === 2) {
            this.getO3()
                .subscribe(result => {
                    console.log("O3: " + result.toString());
                });
        }
        else if (scenario === 3) {

            var s1: Subject<any> = new Subject();
            var s2: Subject<any> = new Subject();


            var addressProvider: Observable<Array<number>> = Observable //get
                .interval(0)
                .take(1)
                .map(() => [2, 3, 4]);

            var settingsProvider: Observable<any> = Observable
                .from(addressProvider)
                .map(result => result.map(n => 1000 * n))

            var stream = Observable
                .from(settingsProvider)
                .map(result => {    //settings
                    return result.map(server => Observable
                        .interval(server)
                        .map(() => server)
                        .take(1));
                })
                .mergeAll()
                .mergeAll();

            //maregeAll flatMap

            //stream
            //.subscribe(result => console.log(result), error => console.error(error));


            var a = Observable
                .interval(3000)
                .take(1);

            var b = a.map(() => a);

            /*b
                .mergeAll()
                .subscribe(result => console.log(result));
                */

            a
                .flatMap(() => a)
                .subscribe(result => console.log(result));

            /*backendServicesObservables.subscribe(result => {
                console.log(result);
                Observable
                    .concat(...result)
                    .subscribe(result => {
                        console.log(": " + result);
                        if(result === 2000)
                            s1.next(result);
                        else
                            s2.next(result);
                    }, error => {

                    })
            }, error => Observable.throw(error));*/

            s1.subscribe(result => {
                console.log("s1: " + result);
            }, error => Observable.throw(error));

            s2.subscribe(result => {
                console.log("s2: " + result);
            }, error => Observable.throw(error));

            /*var settingsProvider: Observable<string> = Observable
                .interval(1500)
                .concat(() => addressProvider)
                .map(address => address + "_based_data")*/

        } else if (scenario === 4) {

            var o1 = Observable
                .interval(5000)
                .startWith(null)
                .map(() => 10);

            //o1.subscribe(result => console.log(result));

            var o2 = Observable
                .interval(2000)
                .startWith(null)
                .do(() => { throw new Error("error1") })
                .catch(e => Observable.from("a"));

            //o2.subscribe(result => console.log(result), error => console.error(error));

        } else if (scenario === 5) {

            var o3 = Observable
                .interval(500)
                .startWith(null)
                .map(() => "x");

            var p = Observable
                .interval(1000)
                .map(() => Math.random())


            var s = Observable
                .from(p)
                .map(x => x > 0.5)
                .bufferCount(3)
            /*.scan<any>((acc:Array<number>, v: number, i: number) => {
                if(acc.length === 3)
                    acc = [];
                acc.push(v);
                return acc;
            }, new Array<number>())
            .filter(result => result.length === 3)
            .subscribe(result => {
                console.log(result);
                //r.next(result);
            });*/


            p.subscribe(result => console.log(result));

            s.subscribe(result => console.log(result));

            //r.subscribe(result => console.log(result));

            //.from()
            //.subscribe(result => console.log(result));

            var cancelable: Observable<any> = Observable
                .interval(1000)
                .startWith(null)
                .map(() => "x");

            var sub = cancelable.subscribe(result => console.log(result))
            sub.unsubscribe();

        }
    }

    public old1() {

        var stream = Observable.of([1, 1, 1, 2, 3, 4, 5, 9])
            .flatMap(x => x);

        var s1 = Observable.from(stream)
            .filter(x => x > 2);

        var s2 = Observable.from(stream)
            .distinct();

        var s3 = Observable.of([{ 'a': 1 }, { 'a': 1 }, { 'a': 1 }, { 'a': 2 }])
            .flatMap(x => x)
            .distinctUntilChanged((x, y) => x === y, x => x['a'])

        s3.subscribe(result => console.log(result));
    }

    public getO3(): Observable<any> {

        var getProcessesFromServer = (host) => {

        }

        /*Observable.forkJoin([
            this.getConfig(),
            this.getSettings()])
            .map((config, settings) => {
                console.log(config);
                console.log(settings);
                //return Observable.forkJoin([]);
                //return Observable.interval(+result);
            });*/

        return this.getConfig()
            .map(config => this.getSettings(config.settingsAddress))
    }

    private getConfig(): Observable<any> {
        return Observable
            .interval(250)
            .take(1)
            .mapTo({ "settingsAddress": "123" });
    }

    private getSettings(settingsAddress: string): Observable<any> {
        if (settingsAddress == "123") {
            return Observable
                .interval(1000)
                .take(1)
                .mapTo({ "servers": ["A", "B", "C"] });
        } else {
            throw Error("");
        }
    }
}

var test = new Test();