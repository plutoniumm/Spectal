const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal', storageBucket: 'spectal.appspot.com', appId: '1:867384801306:web:79c8fa283858b0357ab9a3' }; var app = firebase.initializeApp( firebaseConfig ), evenList = ''; const db = firebase.firestore( app ); const home = db.collection( 'home' ); function getDat ( id ) { return document.getElementById( id ) };

home.doc( 'events' ).get()
      .then( function ( querySnapshot ) {
            list = "";
            querySnapshot.data().types.forEach( ( type, index ) => {
                  list += `
                  <div class="flip-box">
                        <div class="flip-box-inner">
                              <div class="flip-box-front">
                                    <img src="${type.image }">
                              </div>
                              <div class="flip-box-back">
                                    <p class="w-100">${type.description }</p>
                              </div>
                        </div>
                        <h3>${type.name }</h3>
                  </div>
                              `
            } );
            getDat( 'navi' ).innerHTML += `<div id="evensMain" style="display: flex; flex-wrap:wrap;">${ list }</div>`;
      } );
