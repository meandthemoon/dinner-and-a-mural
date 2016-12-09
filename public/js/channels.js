window.channel = function ( ) {

  // Contains functions that will handle
  // when data gets `put` on the channel.
  var takes = [];

  function safeTake ( fnOfData, data ) {
    try { fnOfData(data); }
    catch ( e ) { console.error(e); }
    // fnOfData(data); // for better debugging stack
  }

  return {
    // `put` data on the channel
    put: function ( data ) {
      takes.forEach(function ( fnOfData ) {
        safeTake.apply(null, [fnOfData, data]);
      });
    },
    // `take` data from the channel via named fn 
    take: function ( fnOfData ) {
      if (!fnOfData.name) { console.warn('no name'); }
      takes.push(fnOfData);
    },
    // removes the named fn from `takes` list
    remove: function ( name ) {
      takes = takes.filter(function ( fnOfData ) {
        return fnOfData.name === name;
      });
    }
  };

};
