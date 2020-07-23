const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal', storageBucket: 'spectal.appspot.com', appId: '1:867384801306:web:79c8fa283858b0357ab9a3' }; var app = firebase.initializeApp( firebaseConfig ), evenList = ''; const db = firebase.firestore( app ); const home = db.collection( 'home' ); function getDat ( id ) { return document.getElementById( id ) };


db.collection( 'details' ).doc( 'events' ).get()
      .then( function ( querySnapshot ) {
            evenList = querySnapshot.data().list
            console.log( evenList );
      } );

function evnDeet ( index = 0 ) {
      console.log( evenList[ index ] ); x = evenList[ index ];
      proto = `
      <div class="container">
            <div class="row">
                  <div class="col">
                        <img src="${x.backimg }">
                  </div>
                  <div class="col">
                        <h1> ${x.name }</h1>
                        <p> ${x.description }</p>
                  </div>
            </div>
            <div class="row">
                  <img src="${x.pics[ 1 ] }">
            </div>
      </div>
      `
      getDat( 'evnDeets' ).innerHTML = proto;
}

home.doc( 'events' ).get()
      .then( function ( querySnapshot ) {
            list = "";
            querySnapshot.data().types.forEach( ( type, index ) => {
                  list += `
                  <div class="eventIndi col" onclick="evnDeet(${index })">
                        <img class="typeImg" src="${type.image }">
                        <h1 class="onImg">${type.name.slice( 0, 6 ) }</h1>
                  </div>`
            } );
            getDat( 'navi' ).innerHTML += `<div id="evensMain" class="events row">${ list }</div>`;
            $( document ).ready( function () {
                  $( '.events' ).slick( {
                        infinite: true,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        autoplay: true,
                        arrows: false,
                        dots: true,
                        pauseOnHover: false,
                        autoplaySpeed: 1000,
                        responsive: [
                              { breakpoint: 991, settings: { slidesToShow: 3, } },
                              { breakpoint: 768, settings: { slidesToShow: 2, } },
                              { breakpoint: 600, settings: { slidesToShow: 1, } },
                        ]
                  } );
            } );
      } );
