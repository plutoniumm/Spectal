function artsModal ( index ) {
      musician = artsFull.artists[ index ];
      getDat( 'artistModal' ).innerHTML = `
      <div class="modal-dialog" role="document">
            <div class="modal-content">
                  <div class="modal-header">
                  <h2 class="modal-title">${musician.name }</h2>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        &times;
                  </button>
                  </div>
                  <div class="modal-body">
                  <img class="modalArtist" src="${musician.image }" alt="${ musician.name }"/> <br>
                  ${musician.description } <br>
                  </div>
            </div>
      </div>
      `
      $( '#artistModal' ).modal( 'show' );
      console.log( artsFull.artists[ index ] );
}

$( document ).ready( function () {
      $( "a" ).on( 'click', function ( event ) {
            if ( this.hash !== "" ) {
                  event.preventDefault();
                  var hash = this.hash;
                  // (400) milliseconds
                  $( 'html, body' ).animate( {
                        scrollTop: $( hash ).offset().top
                  }, 400, function () {
                        window.location.hash = hash;
                  } );
            }
      } );
} );