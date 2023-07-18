/**
 * This is a basic linear morning process. Use as starting point for scenario elaboration.
 */

bthread("main", function () {
  request(Actions.wakeUp());
  
  // if ( maybe("tired") ) {
  //   while( maybe("sleep") ) {
  //     request(Actions.backToSleep());
  //   }
  // }

  if ( maybe("dress first") ) {
    dressUp();
    eat();
  } else {
     eat();
     dressUp();
  }
  
  request(Actions.brushTeeth());
  
  request(Actions.tidyUp());
  request(Actions.goOut());
});

function dressUpFull() {
  let wearOptions = ["pants", "shirt", "shoes", "socks"];
  let toWearStr = selectSome("toWear").from(wearOptions);
  let toWear = toWearStr.map( item => Actions.wear(item) );

  requestAtAnyOrder(toWear);
}

function dressUp() {
  let toWear = [Actions.wear("pants"),
  Actions.wear("shirt"),
  Actions.wear("socks"),
  Actions.wear("shoes")];

  requestAtAnyOrder(toWear);
}

function eat() {
  let breakfastType = select("breakfast").from("healthy", "quick", "basic");
  
  switch ( breakfastType ) {
    case "healthy":
      request(Actions.eat("banana"));
      break;
    case "quick":
      request(Actions.eat("cereal"));
      break;
    case "basic":
      requestAtAnyOrder(
        Actions.eat("friedEgg"),
        Actions.eat("salad")
      );
      break;
  }
}