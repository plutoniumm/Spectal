const firebaseConfig = {
      apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc',
      authDomain: 'spectal.firebaseapp.com',
      databaseURL: 'https://spectal.firebaseio.com',
      projectId: 'spectal',
      storageBucket: 'spectal.appspot.com',
      appId: '1:867384801306:web:79c8fa283858b0357ab9a3'
};
var app = firebase.initializeApp( firebaseConfig ), list = "", artsFull;

const db = firebase.firestore( app );
const home = db.collection( 'home' );

function getDat ( id ) { return document.getElementById( id ) };

home.doc( 'about' ).get()
      .then( function ( querySnapshot ) {
            getDat( 'aboutHead' ).innerHTML = querySnapshot.data().heading;
            getDat( 'aboutPara' ).innerHTML = querySnapshot.data().paragraph;
      } );

home.doc( 'services' ).get()
      .then( function ( querySnapshot ) {
            getDat( 'servsHead' ).innerHTML = querySnapshot.data().heading;
            getDat( 'servsPara' ).innerHTML = querySnapshot.data().paragraph;
            list = "";
            querySnapshot.data().services.forEach( service => {
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
                                          <div class="row">
                                                <div class="col">
                                                      <button class="artbtn">Learn More</button>
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

home.doc( 'artists' ).get()
      .then( function ( querySnapshot ) {
            artsFull = querySnapshot.data();
            getDat( 'artsHead' ).innerHTML = artsFull.heading;
            getDat( 'artsPara' ).innerHTML = artsFull.paragraph;
            list = "";
            artsFull.artists.forEach( ( artist, index ) => {
                  list += `
                  <div class="item">
                        <div class="container">
                              <div class="row" style="width: 80%; margin: 0 auto;">
                                    <div class="col-5">
                                    <div class="row">
                                          <div class="col">
                                                <img src="${artist.image }" />
                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col">
                                                <button onclick="artsModal(${index })" type="button" class="artbtn">Learn More</button>
                                          </div>
                                    </div>
                                    </div>
                                    <div class="col-7" style="background-color: rgba(255,255,255,0.15); padding: 1.5em;">
                                    <div class="row">
                                          <div class="col">
                                                <h3 class="movetext">${artist.superhead }</h3>
                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col">
                                                <h2 class="movetext">${artist.name }</h2>
                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col">
                                                <p style="padding-top: 1em; font-size: 100%;" class="movetext">${artist.description }</p>
                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col">
                                                <p>
                                                <i class="fab fa-youtube articon"></i>
                                                <i class="fab fa-facebook-f articon"></i>
                                                <i class="fab fa-instagram articon"></i>
                                                </p>
                                          </div>
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
                        fade: true,
                        infinite: true,
                        cssEase: 'ease',
                        touchThreshold: 100
                  } );
            } );
      } );

home.doc( 'brands' ).get()
      .then( function ( querySnapshot ) {
            getDat( 'brandsHead' ).innerHTML = querySnapshot.data().heading;
            getDat( 'brandsPara' ).innerHTML = querySnapshot.data().paragraph;
            list = "";
            querySnapshot.data().brands.forEach( brand => {
                  list += `
                  <div>
                        <div class="col">
                              <img src="${brand.image }" style="z-index: 3;">
                              <div class="container" style="position: absolute; top: 0; z-index:-1; padding: 1em;">
                              ${brand.paragraph }
                              </div>
                              <button class="brnbtn btn">Learn More</button>
                        </div>
                  </div>
                  <div>
                        <div class="col">
                              <img src="${brand.image }" style="z-index: 3;">
                              <div class="container" style="position: absolute; top: 0; z-index:-1; padding: 1em;">
                              ${brand.paragraph }
                              </div>
                              <button class="brnbtn btn">Learn More</button>
                        </div>
                  </div>
                  `
            } );
            getDat( 'brands' ).innerHTML += `<div id="brandsMain" class="brands row">${ list }</div>`;
            $( document ).ready( function () {
                  $( '.brands' ).slick( {
                        centerMode: true,
                        infinite: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 1000
                  } );
            } );
      } );

home.doc( 'events' ).get()
      .then( function ( querySnapshot ) {
            getDat( 'evensHead' ).innerHTML = querySnapshot.data().heading;
            getDat( 'evensPara' ).innerHTML = querySnapshot.data().paragraph;
            list = "";
            querySnapshot.data().events.forEach( event => {
                  list += `
                  <div class="col d-inline-block">
                        <h1> <span data-purecounter-end="${event.value }" class="purecounter">0</span></h1>
                        <p>${event.name }</p>
                  </div>
                  `
            } );
            getDat( 'evensList' ).innerHTML = `${ list }`;
            lateCall();
      } );


home.doc( 'testimonials' ).get()
      .then( function ( querySnapshot ) {
            getDat( 'tmonHead' ).innerHTML = querySnapshot.data().heading;
            getDat( 'tmonPara' ).innerHTML = querySnapshot.data().paragraph;
            list = "";
            querySnapshot.data().tmons.forEach( tmon => {
                  list += `
                  <div class="col">
                        <div class="container text-center">
                              <div class="row" style="margin-top: 16px;">
                                    <div class="col">
                                          <h3 style="padding: 20px;" class"movetext">"${tmon.paragraph }"</h3>
                                    </div>
                              </div>
                              <div class="row">
                                    <div class="col">
                                          <div class="row">
                                          <div class="col">
                                                <h3 class"movetext">${tmon.name }</h3>
                                                <h5 class"movetext">${tmon.via }</h5>
                                          </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
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
                        autoplaySpeed: 1500,
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
      .then( function ( querySnapshot ) {
            getDat( 'contHead' ).innerHTML = querySnapshot.data().heading;
            list = "";
            querySnapshot.data().contacts.forEach( cont => {
                  list += `
                  <div class="col">
                        <p> <i class="conticons ${cont.icon }"></i> 
                        <br /> ${ cont.value }</p>
                  </div>
                  `
            } );
            getDat( 'contList' ).innerHTML = `${ list }`
      } );