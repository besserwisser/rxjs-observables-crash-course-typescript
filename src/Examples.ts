import * as $ from 'jquery';
import {Observable} from 'rxjs/Rx';

export class Examples_Operators {

    constructor(){

    }

    init(){

    }

}

export class Examples_Promise {

    myPromise: Promise<string>;
    source$: Observable<string>;
    userStream$: Observable<any>;
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
            .subscribe(v => {
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

interface ReturnValuesGithub {
    data: {
        name: string,
        blog: string,
        public_repos: string
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
            () => console.log('completed')    
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
                    this.output.html('x: ' + String(x) + ' y: ' + String(y));
                }
            },
            (err) => console.log(err),
            () => console.log('completed')    
        );

        
    }
}