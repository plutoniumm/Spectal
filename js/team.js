const firebaseConfig = { apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc', authDomain: 'spectal.firebaseapp.com', databaseURL: 'https://spectal.firebaseio.com', projectId: 'spectal', storageBucket: 'spectal.appspot.com', appId: '1:867384801306:web:79c8fa283858b0357ab9a3' }; var app = firebase.initializeApp( firebaseConfig ), evenList = ''; const db = firebase.firestore( app ); const home = db.collection( 'home' ); function getDat ( id ) { return document.getElementById( id ) };

home.doc( 'team' ).get()
      .then( function ( querySnapshot ) {
            team = querySnapshot.data();
            getDat( 'founder' ).innerHTML = `
            <div class="col-6 text-center"><img class="founder" src="${ team.image }" /></div>
            <div class="col-6"><h1>${ team.name }</h1><p>${ team.description }.${ team.description }.${ team.description }</p></div>`;
      } );

home.doc( 'team' ).collection( 'people' ).get().then(
      function ( querySnapshot ) {
            querySnapshot.forEach( function ( doc ) {
                  console.log( doc.data() );
                  getDat( 'team' ).innerHTML += `
                  <div class="imgbox">
                        <img class="image" src="${doc.data().image }" />
                        <div class="text">
                              ${doc.data().name }
                        </div>
                  </div>
                  `
            } );
      } );