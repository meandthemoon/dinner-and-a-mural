

(function ( state ) {  

  window.stuff =
    d3.select('#app')
    .selectAll('div')
    .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    // .text(function ( d ) { return d; })
    // .style('background', function ( d ) {
    //   if (!d) { return '#888'; }
    //   return d > 7 ? '#af5f5f'
    //     : d > 4 ? '#caca86'
    //     : '#005f5f';
    // })
    // .style
    // .style('width', function ( d ) {
    //   return (d * 20 + 20) + 'px';
    // })
    .enter()
    .append('div')
    .text(function ( d ) { return d; })
    .style('background', function ( d ) {
      if (!d) { return '#333'; }
      return d > 7 ? '#af5f5f'
        : d > 4 ? '#caca86'
        : '#005f5f';
    })
    .style('width', function ( d ) {
      return (d * 20 + 20) + 'px';
    })
    .style('margin', '0 5px')
    .style('padding', '0 5px')
    .style('border-top', '1px solid #999999')
    .style('border-bottom', '1px solid #999999');


}(
  // (function ( state ) {
  //   return {
  //     'get': function ( key ) {
  //       var value = localStorage[key];

  //       return value ? JSON.parse(value) : value;
  //     },
  //     'set!': function ( key, value ) {
  //       var serialized = JSON.stringify(value);
  //       state.setItem(key, serialized);
  //       return serialized;
  //     }
  //   };
  // }(localStorage))
));



// setTimeout(function () {
//   d3.selectAll('#app div')
//     .data(["one"])
//     .text(function ( d ) { return d; })
//   // .enter()
//   // .text(function ( d ) { return d; })
//     .exit()
//     .text(function ( d ) { return 'no new value...'; });
// }, 3000);
