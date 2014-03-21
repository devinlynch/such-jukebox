(function() {
  $('#location').bootstrapSwitch('state'); // whether to use locaiton
  var partyLocation = null;
  var google_api_key = 'AIzaSyCGqplXIkBDqyyUeGqRssGLVGl6X84ghqU';
  var map = null;
  var marker = null;


  $('#location').on('switchChange', function(e, data) {
    if(data.value){
      getLocation();
    }
    else{
      partyLocation = null;
      $('#map').css('display','none');

    }
  });

  $(document).bind('keypress', function(e){
      if(e.charCode === 13){
        return $('#host').click();
      }
  });

  $('#host').on('click', function(){

    var fallbackGenre = $('#fallback').val();
    var partyName = $('#partyName').val();
    var validName = partyName.length > 0;
    var validGenre = fallbackGenre !== "--- Select a Genre ---";
    var genreID = undefined;

    if(!validName){
      $('#nameWarn').css('display', 'block');
    }
    else{
      $('#nameWarn').css('display', 'none');
    }
    if(!validGenre){
      $('#fallbackWarn').css('display', 'block');
    }
    else{
      $('#fallbackWarn').css('display', 'none');
      switch(fallbackGenre){
        case('Top 40'):
          genreID = 0;
          break;
        case('Hip-hop'):
          genreID = 1;
          break;
        case('Rap'):
          genreID = 2;
          break;
        case('Pop'):
          genreID = 3;
          break;
      }
    }
    if(validName && validGenre){
      $.post('/hostParty', {name: partyName, genreId: genreID, location: partyLocation}, function(data){
        console.dir(data);
        window.location.replace('/party/' + data.partyId);
      });
    }

  })

  var getLocation = function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        partyLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }
        var latLng = new google.maps.LatLng(partyLocation.lat, partyLocation.lon);
        if(map === null){
          var mapOptions = {
              center: latLng,
              disableDefaultUI: true,
              zoom: 16
          };
          map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        }

        var contentString = '<div><p class="lead" style="color:black;margin:0px;">'+
        'Your Location</p></div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker = new google.maps.Marker({
          icon: '/img/marker.png',
          position: latLng,
          map: map,
          title: 'Your Location'
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

        $('#map').css('display','block');

        console.dir(partyLocation);
      });
      }
      else{
        alert("Geolocation is not supported by this browser.");
      }
  }
}).call(this);