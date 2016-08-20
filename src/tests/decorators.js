function decorator(){
    return function(target){
        console.log('Hey mate! ima decorator aligator');
    }
}

@decorator
function foe(){
    console.log('neega !');
}