const btnSubmit = document.getElementById('submit');
const url = '/users/register';


btnSubmit.addEventListener( "click", function(){

  console.log( 'Add Event Listener Called....' );

  var okToPost = true;

  var name = document.getElementById('name');
  var username = document.getElementById('username');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var password2 = document.getElementById('password2');
  var errormessage = document.getElementById('errormessage');

  var fields = [ name, username, email, password, password2 ];

  console.log( 'fields Length: ' + fields.length );
  okToPost = ValidateFields( fields );

  if( !okToPost )
  {
    swal({
            title: "Warning",
            text: "Please fill out all fields marked in red",
            icon: "warning",
            button: "Ok",
          });
  }

  // if( !ValidateEmail( email )  )
  // {
  //    okToPost = false;
  //
  //   email.style.border="1px solid red";
  //
  //    swal({
  //            title: "Warning",
  //            text: "Please enter a valid email address",
  //            icon: "warning",
  //            button: "Ok",
  //          });
  // }
  // else {
  //   okToPost = true;
  // }

  console.log( name.value + ' : ' + username.value + ' : ' + email.value + ' : ' + password.value + ' : ' + password2.value );



  //Ajax Request ...to register user data
  data={
    "name" : name.value,
    "username" : username.value,
    "email" : email.value,
    "password" : password.value,
    "password2" : password2.value
  }

  console.log( ":P " + okToPost );

if( okToPost )
    postAjax( url, data ,function(data){ console.log(data); } );

  //Ends

})

function ValidateFields( fields  )
{
  var result = true;

  console.log( fields.length );

   for( var i = 0; i < fields.length; i++ )
   {

     console.log( fields[i].value );

     if( fields[i].value.length == 0 || fields[i].value === '' || fields[i].value == undefined )
     {
       console.log( 'Field ' + fields[i].name + ' is empty.'  );
       fields[i].style.border="1px solid red";
        result =  false;
     }
     else
     {
       fields[i].style.border="1px solid silver";
     }

    // result = ValidateField( fields[i] );
    //
    //   if( result == false )
    //   {
    //      console.log('validation failed');
    //      break;
    //   }



   }

   return result;

}

function ValidateEmail( email )
{
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function ValidateField( field )
{

  console.log('Validating ' + field.name );

  if( field.value === '' || field.value == undefined || field.length <= 0 )
  {
     field.style.border="1px solid red";
     return false;

  }
  else
  {
      field.style.border="";
      return true;
  }

}

function postAjax(url, data, success)
{
    var params = typeof data == 'string' ? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');

    console.log(params);

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url, false);
    xhr.onreadystatechange = function() {
        if ( xhr.readyState>3 && xhr.status==200 )
        {

          console.log( xhr.responseText );

          var response =  JSON.parse( xhr.responseText );

          if( response.error === 'email_exists' )
          {
            swal({
                    title: "Warning",
                    text: "A user with the email supplied already exists",
                    icon: "warning",
                    button: "Ok",
                  });
            email.style.border="1px solid red";
          }

          if( response.error === 'username_exists' )
          {
            swal({
                    title: "Warning",
                    text: "The username supplied is already in use",
                    icon: "warning",
                    button: "Ok",
                  });

            username.style.border="1px solid red";
          }


          if( response.success === 'saved' )
          {
            swal({
                title: "Good job!",
                text: "You are now registered. Click ok to proceed to login",
                icon: "success",
                button: "Aww yiss!",
              }).then(function() {
                window.location = "/users/login";
              });
          }

          //Save token to local storage
          //window.location.replace('/users/login');
        }
        else {
          console.log( "Problem:"+  xhr.status );
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest;charset=UTF-8');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(data));

    return xhr;
}
