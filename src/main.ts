import * as $ from 'jquery';
import {Examples_UI, 
        Examples_Arrays, 
        Examples_Scratch,
        Examples_Promise,
        Examples_Operators,
        Examples_MapPlug,
        Examples_Merge, 
        Examples_MergeMap} from './Examples';

$(document).ready(function(){ 
    const examples_UI: Examples_UI = new Examples_UI();
    examples_UI.init();

    const examples_Arrays: Examples_Arrays = new Examples_Arrays();
    examples_Arrays.init();
    
    const examples_Scratch: Examples_Scratch = new Examples_Scratch();
    examples_Scratch.init();

    const examples_Promise: Examples_Promise = new Examples_Promise();
    examples_Promise.init();

    const examples_Operators: Examples_Operators = new Examples_Operators();
    examples_Operators.init();

    const examples_MapPlug: Examples_MapPlug = new Examples_MapPlug();
    examples_MapPlug.init();

    const examples_Merge: Examples_Merge = new Examples_Merge();
    examples_Merge.init();

    const examples_MergeMap: Examples_MergeMap = new Examples_MergeMap();
    examples_MergeMap.init();
});

