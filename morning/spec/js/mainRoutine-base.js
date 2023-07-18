/**
 * This is a basic linear morning process. Use as starting point for scenario elaboration.
 */

bthread("main", function () {
  request(Actions.wakeUp());
  
  requestAtAnyOrder(
    Actions.wear("pants"),
    Actions.wear("shirt"),
    Actions.wear("socks"),
    Actions.wear("shoes")
  );
  
  request(Actions.brushTeeth());
  request(Actions.eat("cereal"));
  request(Actions.eat("banana"));
  if ( maybe("want mango?") ) {
    request(Actions.eat("mango"));
  }
  
  request(Actions.tidyUp());
  request(Actions.goOut());
});

