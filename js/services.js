const firebaseConfig = {
      apiKey: 'AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc',
      authDomain: 'spectal.firebaseapp.com',
      databaseURL: 'https://spectal.firebaseio.com',
      projectId: 'spectal',
      storageBucket: 'spectal.appspot.com',
      appId: '1:867384801306:web:79c8fa283858b0357ab9a3'
}; var app = firebase.initializeApp( firebaseConfig ), servslist = '';
const db = firebase.firestore( app ); const home = db.collection( 'home' );
function getDat ( id ) { return document.getElementById( id ) };

home.doc( 'services' ).get()
      .then( function ( querySnapshot ) {
            querySnapshot.data().services.forEach( serv => {
                  console.log( serv.image );
                  servslist += `
                  <section>
                        <div class="row">
                              <div class="col-6">
                                    <img class="servImg" src="${serv.image }">
                              </div>
                              <div class="col-6">
                                  <h1>${serv.name }</h1>
                                  <p>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, voluptates fugiat doloribus dolor dignissimos quibusdam nemo cum maiores minima necessitatibus consequatur incidunt iusto culpa rem nobis excepturi quasi nisi. Quidem reprehenderit quibusdam qui deleniti? Recusandae repellendus illum aspernatur quia libero!
                                  </p>
                              </div>
                        </div>
                  </section>
                  `
            } );
            getDat( 'main' ).innerHTML = `${ servslist }`
      } );