function artsModal ( index ) {
      musician = artsFull.artists[ index ];
      photos = ``; events = ``;
      musician.data.images.forEach( image => {
            photos += `
            <div class="item">
                  <img src="${image }" style="width:100%; max-height: 225px; object-fit: cover;"/>
            </div>
            `
      } );
      musician.data.events.forEach( event => { events += `<div class="row" style="padding: 0.5em 1.5em; font-size: 1.25em;">${ event }</div>` } );
      getDat( 'artistModal' ).innerHTML = `
      <div class="modal-dialog-scrollable" role="document">
            <div class="modal-content">
                  <div class="modal-header">
                  <h2 class="modal-title">${musician.name }</h2>
                  <button type="button" class="close" onclick="modalClose()">
                        &times;
                  </button>
                  </div>
                  <div class="modal-body">
                        <img class="modalArtist" src="${musician.image }" alt="${ musician.name }"/> <br>
                        ${musician.description } <br>
                        <div class="row" style="padding-top: 0.5em;">
                              <div class="col-7 artistPics">
                              ${photos }
                              </div>
                              <div class="col-5 artistShows" style="padding: 0 0.5em;">
                              ${events }
                              </div>
                        </div>
                        <div class="embed-responsive embed-responsive-16by9">
                              <iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube-nocookie.com/embed/hvKaPTmQBA8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="filter: grayscale(100%);"></iframe>
                        </div>
                  </div>
            </div>
      </div>
      `
      $( '#artistModal' ).modal( 'show' );
      $( document ).ready( function () {
            $( '.artistPics' ).slick( {
                  slidesToShow: 1,
                  arrows: false,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 1000,
                  draggable: true,
                  dots: true,
                  infinite: true,
                  touchThreshold: 100
            } );
      } );
      $( document ).ready( function () {
            $( '.artistShows' ).slick( {
                  arrows: false,
                  slidesToShow: 4,
                  vertical: true,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 1000,
                  draggable: true,
                  dots: true,
                  touchThreshold: 100
            } );
      } );
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

function modalClose () {
      console.log( 'pehle' );
      getDat( 'artistModal' ).remove();
      document.getElementsByClassName( 'modal-backdrop' )[ 0 ].remove();
      console.log( 'badme' );
}