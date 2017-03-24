import * as $ from 'jquery';
import {Observable} from 'rxjs/Rx';

interface ReturnValuesGithub {
    data: {
        name: string,
        blog: string,
        public_repos: string
    }
}

interface Users {
    name: string,
    age: number
}

export class Examples_MergeMap {

    userinputStream$: Observable<string>;

    constructor(){
        this.userinputStream$ = Observable.fromEvent($("#smuserinput"), "keyup")
            .map((i: Event) => (<HTMLInputElement>i.target).value);
    }

    init(){

        /* 
            As far as I understand it: mergeMap will always emit all combinations of the 
            values from the first and second Observable. The switchMap will stop emitting
            the old values as soon as a new value combination emerges.
        */

       Observable.of("Hello")
            .mergeMap( v => {
                return Observable.of(v + " Everyone");
            })
            .subscribe(
                x => $("#mergemap").append(x + "<br/>"),
                err => console.log("Error"),
                () => $("#mergemap").append("Completed Mergemap!")            
            );


        this.userinputStream$
            .switchMap( username => Observable.fromPromise(this.getUser(username)) )
            .subscribe( 
                (v: ReturnValuesGithub) => {
                    $("#smname").html(v.data.name);
                    $("#smblog").html(v.data.blog);
                    $("#smrepos").html(v.data.public_repos);
                },
                err => console.log("Error"),
                () => $("#switchmap").append("Completed Switchmap!")   
            )      
    }

    getUser(username){
        return $.ajax({
            url: "https://api.github.com/users/" + username,
            dataType: "jsonp"
        }).promise();
    }

}

export class Examples_Merge {

    source1$: Observable<string>;
    source2$: Observable<string>;
    concat1$: Observable<string>;
    concat2$: Observable<string>;

    constructor(){
        this.source1$ = Observable.interval(2000).map(v => "First: " + v);
        this.source2$ = Observable.interval(500).map(v => "Second: " + v);
        this.concat1$ = Observable.range(0,5).map(v => "First: " + v);
        this.concat2$ = Observable.range(0,3).map(v => "Second: " + v);
    }

    init(){
        Observable.of("Hello")
            .merge(Observable.of("Everyone"))
            .subscribe( x => $("#merge").append(x));

        Observable.interval(2000)
            .merge(Observable.interval(500))
            .take(5)
            .subscribe( x => $("#mergeInterval").append(x));
        
        Observable.merge(this.source1$, this.source2$)
            .take(10)
            .subscribe(v => $("#mergeIntervalOperator").append(v + "<br/>"))

        Observable.concat(this.concat1$, this.concat2$)
            .subscribe(v => $("#concat").append(v + "<br/>"))
    }

}

export class Examples_MapPlug {

    intervalSource$: Observable<number>;
    arrSource$: Observable<string>;
    users: Array<Users>;
    userStream$: Observable<Users>;

    constructor(){
        this.intervalSource$ = Observable.interval(1000)
            .take(10)
            .map(v => v * v);
        this.arrSource$ = Observable.from(["Oli", "Ole", "Sascha"])
            .map(v => v.toUpperCase())
            .map(v => "I am " + v);
        this.users = [
            { name: "Will", age: 34 },
            { name: "Tobi", age: 21 },
            { name: "Rafael", age: 54 }
        ];
        this.userStream$ = Observable.from(this.users)
            .pluck("name");
    }

    init(){
        this.intervalSource$.subscribe(v => {
            $("#mapinterval").html(v);
        })

        this.arrSource$.subscribe(v => {
            $("#arr").append(v + "<br />");
        })

        Observable.fromPromise(this.getUser("bradtraversy"))
            .map( (user: ReturnValuesGithub) => user.data.name)
            .subscribe(name => {
                $("#mapuser").html(name);
            }
        );

        this.userStream$
        
            .subscribe(v => {
                $("#mapuserArray").append(v + "<br />");
            });
    }

    getUser(username){
        return $.ajax({
            url: "https://api.github.com/users/" + username,
            dataType: "jsonp"
        }).promise();
    }

}

export class Examples_Operators {

    source$: Observable<number>;
    timer$: Observable<number>;
    range$: Observable<number>;

    constructor(){
        this.source$ = Observable.interval(100)
            .take(6);
        this.timer$ = Observable.timer(1000, 1000)
            .take(3);
        this.range$ = Observable.range(25, 100);
    }

    init(){
        this.source$.subscribe( 
            v => {
                $("#interval").html(v);
            },
            err => console.log(err),
            () => $("#interval").append("<br />Complete")
        )

        this.timer$.subscribe( 
            v => {
                $("#timer").html(v);
            },
            err => console.log(err),
            () => $("#timer").append("<br />Complete")
        )
       
        this.range$.subscribe( 
            v => {
                $("#range").html(v);
            },
            err => console.log(err),
            () => $("#range").append("<br />Complete")
        )
    }

}

export class Examples_Promise {

    myPromise: Promise<string>;
    source$: Observable<string>;
    userStream$: Observable<ReturnValuesGithub>;
    userinputStream$: Observable<string>;

    constructor(){
        this.myPromise = new Promise((resolve, reject) => {
            $("#promises").append("Creating Promise" + "<br />");
            setTimeout(() => {
                resolve("Hello from Promise");
            }, 3000);
        });
        this.source$ = Observable.fromPromise(this.myPromise);
        this.userStream$ = Observable.fromPromise(this.getUser("bradtraversy"));
        this.userinputStream$ = Observable.fromEvent($("#userinput"), "keyup")
            .map((i: Event) => (<HTMLInputElement>i.target).value);
    }

    init(){
        // this.myPromise.then((res) => {
        //     $("#promises").append(res + "<br />");
        // })    

        this.source$.subscribe(
            v => $("#promises").append(v + "<br />")
        )

        this.userStream$
            .subscribe( (v: ReturnValuesGithub) => {
                $("#name").html(v.data.name);
                $("#blog").html(v.data.blog);
                $("#repos").html(v.data.public_repos);
            });

        this.userinputStream$
            .mergeMap( username => Observable.fromPromise(this.getUser(username)) )
            .subscribe( (v: ReturnValuesGithub) => {
                $("#name").html(v.data.name);
                $("#blog").html(v.data.blog);
                $("#repos").html(v.data.public_repos);
            })        
        
        // this.userinputStream$.subscribe(i => {
        //     Observable.fromPromise(this.getUser((<HTMLInputElement>i.target).value))
        //         .subscribe( (v: ReturnValuesGithub) => {
        //             $("#name").html(v.data.name);
        //             $("#blog").html(v.data.blog);
        //             $("#repos").html(v.data.public_repos);
        //         }) 
        // });

    }

    getUser(username){
        return $.ajax({
            url: "https://api.github.com/users/" + username,
            dataType: "jsonp"
        }).promise();
    }
}

export class Examples_Scratch {

    source: Observable<{}>;
        
    constructor(){
        this.source = new Observable(observer => {

            observer.next("Hello World");
            observer.next("Hello World2");

            //observer.error(new Error("Errrror"));

            setTimeout(() => {
                observer.next("After 3 Secs");
                observer.complete();
            }, 3000);
        });
    }

    init(){
        this.source
            .catch(err => Observable.of(err))
            .subscribe(
                x => {
                    $("#scratcher").append(x + "<br />")
                },
                err => $("#scratcher").append(err + "<br />"),
                () => $("#scratcher").append("Complete")
            )

    }
}

export class Examples_Arrays {

    numbArray: number[];
    posts: [{title: string, body: string}];
    numbArrayStream$: Observable<number>;
    postsStream$: Observable<{title: string, body: string}>;
    
    constructor(){
        this.numbArray = [12,14,12,33,55];
        this.posts = [
            {title: 'Post 1', body: 'Body1'},
            {title: 'Post 2', body: 'Body2'},
            {title: 'Post 3', body: 'Body3'},
        ];

    }

    init(){
        this.numbArrayStream$ = Observable.from<number>(this.numbArray);
        this.numbArrayStream$.subscribe(
            v => {
                $('#numbers').append('<li><h3>' + v + '</h3></li>');
            },
            err => {
                console.log(err);
            },
            () => {
                //console.log('completed NumberArray');
            }
        );

        this.postsStream$ = Observable.from<{title: string, body: string}>(this.posts);
        this.postsStream$.subscribe(
            post => {
                $('#posts').append('<li><h3>' + post.title + '</h3><p>' + post.body + '</p> </li>');
            },
            err => {
                console.log(err);
            },
            () => {
                //console.log('completed ObjectArray');
            }
        );

    }
}

export class Examples_UI {

    btn: $;
    input: $;
    output: $;
    btnStream$: Observable<Event>; 
    inputStream$: Observable<Event>; 
    moveStream$: Observable<Event>; 

    constructor(){
        this.btn = $('#btn');
        this.input = $('#input');
        this.output = $('#output');
        this.btnStream$ = Observable.fromEvent(this.btn, 'click');
        this.inputStream$ = Observable.fromEvent(this.input, 'keyup');
        this.moveStream$ = Observable.fromEvent(window, 'mousemove');
    }

    init(){
        this.btnStream$.subscribe(
            (e) => console.log(e),
            (err) => console.log(err),
            () => console.log('completed ')    
        );

        this.inputStream$.subscribe(
            (e: KeyboardEvent) => {
                let targetElement: $ = e.currentTarget;
                let val = targetElement.value;
                if(val) {
                    //this.output.append(val);
                }
            },
            (err) => console.log(err),
            () => console.log('completed')    
        );

        this.moveStream$.subscribe(
            (e: MouseEvent) => {
                let x: number = e.clientX;
                let y: number = e.clientY;
                if(x && y) {
                    this.output.html('X: ' + String(x) + ' Y: ' + String(y));
                }
            },
            (err) => console.log(err),
            () => console.log('completed')    
        );

        
    }
}