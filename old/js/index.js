var x = document.querySelectorAll( ".txtcolor" );
console.log( x );

for ( var i = 0;i in x;i++ ) {
      console.log( x[ i ] );
      x[ i ].style.color = "#378B89";
      console.log( x[ i ] );

      // x[ i ].style.backgroundImage = "linear-gradient(to bottom, #378B89, #5FB1AF, #378B89)";
      // console.log( "378B89" );
}
