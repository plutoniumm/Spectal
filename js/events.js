const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal', storageBucket: 'spectal.appspot.com', appId: '1:867384801306:web:79c8fa283858b0357ab9a3' }; var app = firebase.initializeApp( firebaseConfig ); const db = firebase.firestore( app ); const home = db.collection( 'home' ); function getDat ( id ) { return document.getElementById( id ) };

home.doc( 'events' ).get()
      .then( function ( querySnapshot ) {
            list = "";
            querySnapshot.data().types.forEach( type => {
                  list += `
                  <div class="eventIndi col">
                        <img class="typeImg" src="${type.image }">
                        <h1 class="onImg">${type.name.slice( 0, 6 ) }</h1>
                  </div>
                  `
            } );
            getDat( 'navi' ).innerHTML += `<div id="evensMain" class="events row">${ list }</div>`;
            $( document ).ready( function () {
                  $( '.events' ).slick( {
                        centerMode: true,
                        infinite: true,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        autoplay: true,
                        arrows: false,
                        dots: true,
                        autoplaySpeed: 1000
                  } );
            } );
      } );
