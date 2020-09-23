function getDat ( id ) { return document.getElementById( id ) }; const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal' }; var app = firebase.initializeApp( firebaseConfig ), list = "", artsFull; const db = firebase.firestore( app ); const home = db.collection( 'home' ); function wi () { w = window.innerWidth; if ( w > 991 ) return ( w / 3 - 125 ); if ( w > 600 && w < 991 ) return ( w / 2 - 50 ); if ( w < 600 ) return ( w - 25 ) }

function artModal ( id ) {
      home.doc( 'artists' ).collection( 'artists' ).doc( id ).get().then(
            function ( q ) {
                  m = q.data(); photos = ``; events = ``; console.log( m.social );
                  m.images.forEach( image => { photos += `<div class="item"><img src="${ image }" style="width:100%; max-height:225px; object-fit:cover;"/></div>` } );
                  m.events.forEach( event => { events += `<div class="row" style="padding:0.5em 1.5em; font-size:1.25em;">${ event }</div>` } );
                  getDat( 'artistModal' ).innerHTML = `
                  <div class="modal-dialog-scrollable" role="document">
                        <div class="modal-content">
                              <div class="modal-header">
                                    <h2 class="modal-title">${ m.name }</h2>
                                    <button class="Merchbtn btn" style="${ disp( m.social, 'merch' ) }" onclick="window.location.href='${ m.social.merch }'">Get Merch</button>
                                    <button type="button" class="close" onclick="$( '#artistModal' ).modal( 'toggle' );">&times;</button>
                              </div>
            <div class="modal-body">
                  <img class="modalArtist" src="${ m.image }" alt="${ m.name }" /><br>
                        ${ m.description } <br>
                              <div class="row" style="padding-top:0.5em;">
                                    <div class="col-7 artistPics">${ photos }</div>
                                    <div class="col-5 artistShows" style="padding:0 0.5em;">${ events }</div>
                              </div>
                              <div class="embed-responsive embed-responsive-16by9">
                                    <iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube-nocookie.com/embed/${ m.video.split( '=' )[ 1 ] }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="filter:grayscale(100%);"></iframe>
                              </div>
                              </div>
                        </div>
            </div>
      `
                  $( '#artistModal' ).modal( 'toggle' );
                  $( document ).ready( function () { $( '.artistPics' ).slick( { slidesToShow: 1, arrows: false, slidesToScroll: 1, autoplay: true, autoplaySpeed: 1000, draggable: true, dots: true, infinite: true, touchThreshold: 100 } ); } );
                  $( document ).ready( function () { $( '.artistShows' ).slick( { arrows: false, slidesToShow: 4, vertical: true, slidesToScroll: 1, autoplay: true, autoplaySpeed: 1000, draggable: true, dots: true, touchThreshold: 100 } ); } );
            } );
}
function disp ( soc, link ) { if ( soc[ link ] ) return 'inline-block'; else return 'none'; };
home.doc( 'artists' ).get()
      .then( function ( q ) {
            artsFull = q.data();
            getDat( 'artsHead' ).innerHTML = artsFull.heading;
            getDat( 'artsPara' ).innerHTML = artsFull.paragraph;
            home.doc( 'artists' ).collection( 'artists' ).get().then(
                  function ( querySnapshot ) {
                        list = "";
                        querySnapshot.forEach( function ( doc ) {
                              artist = doc.data(); soc = artist.social;
                              list += `
            <div class="item">
                  <div class="artCont">
                        <div class="row" style="margin:0 auto;">
                              <div class="col-5">
                                    <div class="row">
                                          <div class="col">
                                                <img src="${ artist.image }" />
                                                <button type="button" onclick="artModal('${ doc.id }')" class="artbtn blur">See More</button>
                                          </div>
                                    </div>
                              </div>
                              <div class="col-7" style="background-color:rgba(128,128,128,0.15); padding:1.5em;backdrop-filter:blur(0.1em);-webkit-backdrop-filter:blur(0.1em);-moz-backdrop-filter:blur(0.1em);">
                                    <div class="row">
                                          <div class="col">
                                                <h2 class="movetext">${ artist.name }</h2>
                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col">
                                                <p style="padding-top:1em; font-size:115%;line-height:2em;" class="movetext">${ artist.description.slice( 0, 280 ) }...</p>
                                          </div>
                                    </div>
                                    <div class="row" style="position:absolute;bottom:0.75em;">
                                          <a href="${ soc.instagram }" style="display:${ disp( soc, 'instagram' ) }" class="artSocShow"><i class="fab fa-instagram articon"></i></a><a href="${ soc.facebook }" style="display:${ disp( soc, 'facebook' ) }" class="artSocShow"><i class="fab fa-facebook-f articon"></i></a><a href="${ soc.twitter }" style="display:${ disp( soc, 'twitter' ) }" class="artSocShow"><i class="fab fa-twitter articon"></i></a><a href="${ soc.website }" style="display:${ disp( soc, 'website' ) }" class="artSocShow"><i class="fas fa-globe articon"></i></a><a href="${ soc.apple }" style="display:${ disp( soc, 'apple' ) }" class="artSocShow"><i class="fab fa-apple articon"></i></a><a href="${ soc.spotify }" style="display:${ disp( soc, 'spotify' ) }" class="artSocShow"><i class="fab fa-spotify articon"></i></a><a href="${ soc.amazon }" style="display:${ disp( soc, 'amazon' ) }" class="artSocShow"><i class="fab fa-amazon articon"></i></a><a href="${ soc.merch }" style="display:${ disp( soc, 'merch' ) }" class="artSocShow"><i class="fas fa-tshirt articon"></i></a>
                                    </div>
                              </div>
                        </div>
                  </div>
                  </div>
            `
                        } );
                        getDat( 'artists' ).innerHTML += `<div id="artsMain" class="artists slider row"> ${ list }</div> `;
                        $( document ).ready( function () {
                              $( '.artists' ).slick( {
                                    centerMode: true, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 2000, draggable: true, dots: true, arrows: true, fade: true, infinite: true, cssEase: 'ease', touchThreshold: 100,
                                    responsive: [ { breakpoint: 768, settings: { arrows: false } }, ]
                              } );
                        } );
                  } );
      } );
home.doc( 'brands' ).get()
      .then( function ( q ) {
            getDat( 'brandsHead' ).innerHTML = q.data().heading; getDat( 'brandsPara' ).innerHTML = q.data().paragraph; list = "";
            q.data().brands.forEach( b => {
                  list += `
                  <div class="card">
                  <img class="card-img-top" src="${ b.image }" alt="Card image cap">
                        <div class="card-img-overlay" style="background-color:${ b.color };mix-blend-mode:multiply;"></div>
                        <div class="card-body">
                              <p class="card-text" style="line-height:2em">${ b.description }</p>
                        </div>
                  </div>
      `
            } );
            getDat( 'brands' ).innerHTML += `<div id="brandsMain" class="brands row" style="padding: 0 0.5em;"> ${ list }</div> `;
            $( document ).ready( function () {
                  $( '.brands' ).slick( {
                        cssEase: 'linear', speed: 500, infinite: true, slidesToShow: 4, slidesToScroll: 1,
                        responsive: [
                              {
                                    breakpoint: 1600,
                                    settings: { slidesToShow: 3, }
                              },
                              {
                                    breakpoint: 1400,
                                    settings: { slidesToShow: 2, }
                              },
                              {
                                    breakpoint: 991,
                                    settings: { slidesToShow: 1, }
                              },

                        ]
                  } );
            } );
      } );
home.doc( 'events' ).get().then( function ( q ) {
      getDat( 'evensHead' ).innerHTML = q.data().heading; getDat( 'evensPara' ).innerHTML = q.data().paragraph; list = ""; q.data().events.forEach( event => {
            list +=
                  `<div class="col d-inline-block">
            <h1><span data-purecounter-start="${ event.value - 40 }" data-purecounter-end="${ event.value }" data-purecounter-duration="4" class="purecounter">0</span>+</h1>
            <p>${ event.name }</p>
                  </div> `
      } ); getDat( 'evensList' ).innerHTML = `${ list } `; lateCall();
} );
