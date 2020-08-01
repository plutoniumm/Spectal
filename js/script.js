function getDat ( id ) { return document.getElementById( id ) }; const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal', storageBucket: 'spectal.appspot.com', appId: '1:867384801306:web:79c8fa283858b0357ab9a3' }; var app = firebase.initializeApp( firebaseConfig ), list = "", artsFull; const db = firebase.firestore( app ); const home = db.collection( 'home' );

home.doc( 'about' ).get().then( function ( q ) { getDat( 'aboutHead' ).innerHTML = q.data().heading; getDat( 'aboutPara' ).innerHTML = q.data().paragraph; } );

home.doc( 'services' ).get()
      .then( function ( q ) {
            getDat( 'servsHead' ).innerHTML = q.data().heading;
            getDat( 'servsPara' ).innerHTML = q.data().paragraph;
            list = "";
            q.data().services.forEach( service => {
                  list += `
                  <div class="item">
                        <div class="container">
                              <div class="row" style="width:80%; margin:0 auto;">
                                    <div class="col-5">
                                          <div class="row">
                                                <div class="col">
                                                      <img src="${service.image }" />
                                                </div>
                                          </div>
                                    </div>
                                    <div class="col-7" style="background-color:rgba(255,255,255,0.15); padding:1.5em;">
                                          <div class="row">
                                                <div class="col">
                                                      <h2 class="movetext">${service.name }</h2>
                                                </div>
                                          </div>
                                          <div class="row">
                                                <div class="col">
                                                      <p style="padding-top:1em; font-size:100%;" class="movetext">${service.description }</p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  `
            } );
            getDat( 'services' ).innerHTML += `<div id="servsMain" class="services slider row">${ list }</div>`;
            $( document ).ready( function () {
                  $( '.services' ).slick( {
                        centerMode: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 2000,
                        draggable: true,
                        dots: true,
                        fade: true,
                        infinite: true,
                        cssEase: 'ease',
                        touchThreshold: 100
                  } );
            } );
      } );

function artModal ( id ) {
      home.doc( 'artists' ).collection( 'artists' ).doc( id ).get().then(
            function ( q ) {
                  console.log( q.data() );
                  m = q.data();
                  photos = ``; events = ``;
                  m.images.forEach( image => {
                        photos += `
                        <div class="item">
                              <img src="${image }" style="width:100%; max-height:225px; object-fit:cover;"/>
                        </div>
            ` } );
                  m.events.forEach( event => { events += `<div class="row" style="padding:0.5em 1.5em; font-size:1.25em;">${ event }</div>` } );
                  getDat( 'artistModal' ).innerHTML = `
                  <div class="modal-dialog-scrollable" role="document">
                        <div class="modal-content">
                              <div class="modal-header">
                              <h2 class="modal-title">${m.name }</h2>
                              <button type="button" class="close" onclick="$( '#artistModal' ).modal( 'toggle' );">
                                    &times;
                              </button>
                              </div>
                              <div class="modal-body">
                                    <img class="modalArtist" src="${m.image }" alt="${ m.name }"/><br>
                                    ${m.description } <br>
                                    <div class="row" style="padding-top:0.5em;">
                                          <div class="col-7 artistPics">
                                          ${photos }
                                          </div>
                                          <div class="col-5 artistShows" style="padding:0 0.5em;">
                                          ${events }
                                          </div>
                                    </div>
                                    <div class="embed-responsive embed-responsive-16by9">
                                          <iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube-nocookie.com/embed/${m.video.split( '=' )[ 1 ] }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="filter:grayscale(100%);"></iframe>
                                    </div>
                              </div>
                        </div>
                  </div>
                  `
                  $( '#artistModal' ).modal( 'toggle' );
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
            } );
}

home.doc( 'artists' ).get()
      .then( function ( q ) {
            artsFull = q.data();
            getDat( 'artsHead' ).innerHTML = artsFull.heading;
            getDat( 'artsPara' ).innerHTML = artsFull.paragraph;
            home.doc( 'artists' ).collection( 'artists' ).get().then(
                  function ( querySnapshot ) {
                        list = "";
                        querySnapshot.forEach( function ( doc ) {
                              artist = doc.data();
                              list += `
                  <div class="item">
                        <div class="artCont">
                              <div class="row" style="margin:0 auto;">
                                    <div class="col-5">
                                          <div class="row">
                                                <div class="col">
                                                      <img src="${artist.image }" />
                                                      <button type="button" onclick="artModal('${doc.id }')" class="artbtn blur">See More</button>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="col-7 blur" style="background-color:rgba(255,255,255,0.15); padding:1.5em;">
                                          <div class="row">
                                                <div class="col">
                                                      <h2 class="movetext">${artist.name }</h2>
                                                </div>
                                          </div>
                                          <div class="row">
                                                <div class="col">
                                                      <p style="padding-top:1em; font-size:115%;" class="movetext">${artist.description.slice( 0, 160 ) }...</p>
                                                </div>
                                          </div>
                                          <div class="row">
                                                <span class="artSocShow"><i class="fab fa-instagram articon"></i></span>
                                                <span class="artSocShow"><i class="fab fa-facebook-f articon"></i></span>
                                                <span class="artSocShow"><i class="fab fa-twitter articon"></i></span>
                                                <span class="artSocShow"><i class="fas fa-globe articon"></i></span>
                                                <span class="artSocShow"><i class="fab fa-apple articon"></i></span>
                                                <span class="artSocShow"><i class="fab fa-spotify articon"></i></span>
                                                <span class="artSocShow"><i class="fab fa-amazon articon"></i></span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  `
                        } );
                        getDat( 'artists' ).innerHTML += `<div id="artsMain" class="artists slider row">${ list }</div>`;
                        $( document ).ready( function () {
                              $( '.artists' ).slick( {
                                    centerMode: true,
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    autoplay: true,
                                    autoplaySpeed: 2000,
                                    draggable: true,
                                    dots: true,
                                    arrows: true,
                                    fade: true,
                                    infinite: true,
                                    cssEase: 'ease',
                                    touchThreshold: 100,
                                    responsive: [
                                          {
                                                breakpoint: 768,
                                                settings: {
                                                      arrows: false
                                                }
                                          },
                                    ]
                              } );
                        } );
                  } );
      } );

home.doc( 'brands' ).get()
      .then( function ( q ) {
            getDat( 'brandsHead' ).innerHTML = q.data().heading;
            getDat( 'brandsPara' ).innerHTML = q.data().paragraph;
            list = "";
            q.data().brands.forEach( brand => {
                  list += `
            <div class="col brnFull">
                  <div class="brnImg" style="background-image:url(${brand.image })">
                  </div>
                  <div class="brnTex d-flex align-items-center text-center">
                        ${brand.description }
                  </div>
                  <button class="brnbtn btn">Learn More</button>
            </div>
            `
            } );
            getDat( 'brands' ).innerHTML += `<div id="brandsMain" class="brands row">${ list }</div>`;
            $( document ).ready( function () {
                  $( '.brands' ).slick( {
                        cssEase: 'linear',
                        speed: 4500,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 0,
                        responsive: [
                              {
                                    breakpoint: 1600,
                                    settings: {
                                          slidesToShow: 3,
                                    }
                              },
                              {
                                    breakpoint: 1400,
                                    settings: {
                                          slidesToShow: 2,
                                    }
                              },
                              {
                                    breakpoint: 991,
                                    settings: {
                                          slidesToShow: 1,
                                    }
                              },

                        ]
                  } );
            } );
      } );

home.doc( 'events' ).get().then( function ( q ) {
      getDat( 'evensHead' ).innerHTML = q.data().heading; getDat( 'evensPara' ).innerHTML = q.data().paragraph; list = ""; q.data().events.forEach( event => {
            list +=
                  `<div class="col d-inline-block">
                        <h1><span data-purecounter-end="${ event.value }" class="purecounter">0</span></h1>
                        <p>${ event.name }</p>
                  </div>`
      } ); getDat( 'evensList' ).innerHTML = `${ list }`; lateCall();
} );


home.doc( 'testimonials' ).get()
      .then( function ( q ) {
            getDat( 'tmonHead' ).innerHTML = q.data().heading;
            getDat( 'tmonPara' ).innerHTML = q.data().paragraph;
            list = "";
            q.data().tmons.forEach( tmon => {
                  list += `
                  <div class="col text-center" style="margin-top:16px;">
                        <p style="padding:20px;" class"movetext">"${tmon.paragraph }"</p>
                        <h3 class"movetext">${tmon.name }</h3>
                        <h5 class"movetext">${tmon.via }</h5>
                  </div>
                  `
            } )
            getDat( 'tmonList' ).innerHTML = list;
            $( document ).ready( function () {
                  $( '.tmonials' ).slick( {
                        centerMode: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        draggable: true,
                        dots: true,
                        infinite: true,
                        cssEase: 'ease',
                        touchThreshold: 100
                  } );
            } );
      } )


home.doc( 'contact' ).get().then( function ( q ) { getDat( 'contHead' ).innerHTML = q.data().heading + '<br><br>'; list = ""; q.data().contacts.forEach( cont => { list += `<p style="text-align:justify;"><i class="${ cont.icon }" style="padding:0.5em;"></i>${ cont.value }</p>` } ); getDat( 'contList' ).innerHTML = `${ list }` } );

$( document ).ready( function () {
      $( "a" ).on( 'click', function ( event ) {
            if ( this.hash !== "" ) {
                  event.preventDefault(); var hash = this.hash;
                  // (400) milliseconds
                  $( 'html, body' ).animate( { scrollTop: $( hash ).offset().top }, 400, function () { window.location.hash = hash; } );
            }
      } );
} );

function lateCall () {
      !function ( e ) { var t = {}; function n ( r ) { if ( t[ r ] ) return t[ r ].exports; var o = t[ r ] = { i: r, l: !1, exports: {} }; return e[ r ].call( o.exports, o, o.exports, n ), o.l = !0, o.exports } n.m = e, n.c = t, n.d = function ( e, t, r ) { n.o( e, t ) || Object.defineProperty( e, t, { enumerable: !0, get: r } ) }, n.r = function ( e ) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty( e, Symbol.toStringTag, { value: "Module" } ), Object.defineProperty( e, "__esModule", { value: !0 } ) }, n.t = function ( e, t ) { if ( 1 & t && ( e = n( e ) ), 8 & t ) return e; if ( 4 & t && "object" == typeof e && e && e.__esModule ) return e; var r = Object.create( null ); if ( n.r( r ), Object.defineProperty( r, "default", { enumerable: !0, value: e } ), 2 & t && "string" != typeof e ) for ( var o in e ) n.d( r, o, function ( t ) { return e[ t ] }.bind( null, o ) ); return r }, n.n = function ( e ) { var t = e && e.__esModule ? function () { return e.default } : function () { return e }; return n.d( t, "a", t ), t }, n.o = function ( e, t ) { return Object.prototype.hasOwnProperty.call( e, t ) }, n.p = "/", n( n.s = 0 ) }( [ function ( e, t, n ) { e.exports = n( 1 ) }, function ( e, t ) { function n () { var e = document.querySelectorAll( ".purecounter" ); if ( "IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype ) for ( var t = new IntersectionObserver( o, { root: null, rootMargin: "20px", threshold: .5 } ), n = 0;n < e.length;n++ )t.observe( e[ n ] ); else window.addEventListener && ( r( e ), window.addEventListener( "scroll", function ( t ) { r( e ) }, { passive: !0 } ) ) } function r ( e ) { for ( var t = 0;t < e.length;t++ ) { !0 === a( e[ t ] ).legacy && u( e[ t ] ) && o( [ e[ t ] ] ) } } function o ( e, t ) { e.forEach( function ( e ) { var n = void 0 !== e.target ? a( e.target ) : a( e ); return n.duration <= 0 ? e.innerHTML = n.end.toFixed( n.decimals ) : !t && !u( e ) || t && e.intersectionRatio < .5 ? e.target.innerHTML = n.start > n.end ? n.end : n.start : void setTimeout( function () { return void 0 !== e.target ? i( e.target, n ) : i( e, n ) }, n.delay ) } ) } function i ( e, t ) { var n = ( t.end - t.start ) / ( t.duration / t.delay ), r = "inc"; t.start > t.end && ( r = "dec", n *= -1 ), n < 1 && t.decimals <= 0 && ( n = 1 ); var o = t.decimals <= 0 ? parseInt( t.start ) : parseFloat( t.start ).toFixed( t.decimals ); e.innerHTML = o, !0 === t.once && e.setAttribute( "data-purecounter-duration", 0 ); var i = setInterval( function () { var a = function ( e, t, n, r ) { r || ( r = "inc" ); if ( "inc" === r ) return n.decimals <= 0 ? parseInt( e ) + parseInt( t ) : parseFloat( e ) + parseFloat( t ); return n.decimals <= 0 ? parseInt( e ) - parseInt( t ) : parseFloat( e ) - parseFloat( t ) }( o, n, t, r ); e.innerHTML = function ( e, t ) { return t.decimals <= 0 ? parseInt( e ) : e.toLocaleString( void 0, { minimumFractionDigits: t.decimals, maximumFractionDigits: t.decimals } ) }( a, t ), ( ( o = a ) >= t.end && "inc" == r || o <= t.end && "dec" == r ) && ( clearInterval( i ), o != t.end && ( e.innerHTML = t.decimals <= 0 ? parseInt( t.end ) : parseFloat( t.end ).toFixed( t.decimals ) ) ) }, t.delay ) } function a ( e ) { for ( var t = [].filter.call( e.attributes, function ( e ) { return /^data-purecounter-/.test( e.name ) } ), n = { start: 0, end: 9001, duration: 2e3, delay: 10, once: !0, decimals: 0, legacy: !0 }, r = 0;r < t.length;r++ ) { var o = t[ r ].name.replace( "data-purecounter-", "" ); n[ o.toLowerCase() ] = "duration" == o.toLowerCase() ? parseInt( 1e3 * s( t[ r ].value ) ) : s( t[ r ].value ) } return n } function s ( e ) { return /^[0-9]+\.[0-9]+$/.test( e ) ? parseFloat( e ) : /^[0-9]+$/.test( e ) ? parseInt( e ) : e } function u ( e ) { for ( var t = e.offsetTop, n = e.offsetLeft, r = e.offsetWidth, o = e.offsetHeight;e.offsetParent; )t += ( e = e.offsetParent ).offsetTop, n += e.offsetLeft; return t >= window.pageYOffset && n >= window.pageXOffset && t + o <= window.pageYOffset + window.innerHeight && n + r <= window.pageXOffset + window.innerWidth } n() } ] );
}