console.log( "Hi" );


const firebaseConfig = {
      apiKey: "AIzaSyDCHqrIu7LTjcElbyTEjkjB3zqN_LMJHFc",
      authDomain: "spectal.firebaseapp.com",
      databaseURL: "https://spectal.firebaseio.com",
      projectId: "spectal",
      storageBucket: "spectal.appspot.com",
      appId: "1:867384801306:web:79c8fa283858b0357ab9a3"
};
var app = firebase.initializeApp( firebaseConfig );

var db = firebase.firestore( app );

db.collection( "Home" ).get()
      .then( function ( querySnapshot ) {
            querySnapshot.forEach( function ( doc ) {
                  console.log( doc.id, " => ", doc.data() );
            } );
      } )
      .catch( function ( error ) {
            console.log( "Error getting documents: ", error );
      } );
