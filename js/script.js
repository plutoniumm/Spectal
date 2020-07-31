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
                              <div class="row" style="width: 80%; margin: 0 auto;">
                                    <div class="col-5">
                                          <div class="row">
                                                <div class="col">
                                                      <img src="${service.image }" />
                                                </div>
                                          </div>
                                    </div>
                                    <div class="col-7" style="background-color: rgba(255,255,255,0.15); padding: 1.5em;">
                                          <div class="row">
                                                <div class="col">
                                                      <h2 class="movetext">${service.name }</h2>
                                                </div>
                                          </div>
                                          <div class="row">
                                                <div class="col">
                                                      <p style="padding-top: 1em; font-size: 100%;" class="movetext">${service.description }</p>
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
                              <div class="row" style="margin: 0 auto;">
                                    <div class="col-5">
                                          <div class="row">
                                                <div class="col">
                                                      <img src="${artist.image }" />
                                                      <button type="button" onclick="artModal('${doc.id }')" class="artbtn blur">See More</button>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="col-7 blur" style="background-color: rgba(255,255,255,0.15); padding: 1.5em;">
                                          <div class="row">
                                                <div class="col">
                                                      <h2 class="movetext">${artist.name }</h2>
                                                </div>
                                          </div>
                                          <div class="row">
                                                <div class="col">
                                                      <p style="padding-top: 1em; font-size: 115%;" class="movetext">${artist.description.slice( 0, 160 ) }...</p>
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
                  <div class="brnImg" style="background-image: url(${brand.image })">
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

home.doc( 'events' ).get()
      .then( function ( q ) {
            getDat( 'evensHead' ).innerHTML = q.data().heading;
            getDat( 'evensPara' ).innerHTML = q.data().paragraph;
            list = "";
            q.data().events.forEach( event => {
                  list += `
                  <div class="col d-inline-block">
                        <h1><span data-purecounter-end="${event.value }" class="purecounter">0</span></h1>
                        <p>${event.name }</p>
                  </div>
                  `
            } );
            getDat( 'evensList' ).innerHTML = `${ list }`;
            lateCall();
      } );


home.doc( 'testimonials' ).get()
      .then( function ( q ) {
            getDat( 'tmonHead' ).innerHTML = q.data().heading;
            getDat( 'tmonPara' ).innerHTML = q.data().paragraph;
            list = "";
            q.data().tmons.forEach( tmon => {
                  list += `
                  <div class="col text-center" style="margin-top: 16px;">
                        <p style="padding: 20px;" class"movetext">"${tmon.paragraph }"</p>
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
                        autoplaySpeed: 2500,
                        draggable: true,
                        dots: true,
                        fade: true,
                        infinite: true,
                        cssEase: 'ease',
                        touchThreshold: 100
                  } );
            } );
      } )


home.doc( 'contact' ).get()
      .then( function ( q ) {
            getDat( 'contHead' ).innerHTML = q.data().heading + '<br><br>';
            list = "";
            q.data().contacts.forEach( cont => {
                  list += `
                  <p style="text-align: justify;"> <i class="${cont.icon }" style="padding: 0.5em;"></i> ${ cont.value }</p>
                  `
            } );
            getDat( 'contList' ).innerHTML = `${ list }`
      } );