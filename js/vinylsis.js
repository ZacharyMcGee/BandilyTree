$(document).ready(function() {
    $("#filter").click(function(){
        SearchArtists();
    });
});

function SearchArtists() {
  $.ajax({
      type: "GET",
      url: 'functions/search-artists.php',
      data: {
        "artist":  $('#artist').val(),
      },
      success: function(data) {
        //console.log(data);
         var jsonData = JSON.parse(data);
         console.log(jsonData);

         BuildArtistPage(jsonData);
         //LoadArtistsResults(jsonData);
      },
      error: function(result) {
          alert('error');
      }
  });
}

function GetArtistInfo() {
  $.ajax({
      type: "GET",
      url: 'functions/get-info.php',
      data: {
        "artist":  $('#artist').val(),
      },
      success: function(data) {
        //console.log(data);
         var jsonData = JSON.parse(data);
         console.log(jsonData);
      },
      error: function(result) {
          alert('error');
      }
  });
}

function BuildArtistPage(jsonArtistResults){
  if(jsonArtistResults.results.length > 0) {
    $(".content").load("templates/artist-tree.html", function(){
      BuildTree(jsonArtistResults);
    });
  }
}

function BuildTree(jsonArtistResults) {
  var nodes = null;
  var edges = null;
  var network = null;

  function draw() {
    nodes = [
      {
        id: jsonArtistResults.results[0]["id"],
        shape: "image",
        image: jsonArtistResults.results[0]["thumb"],
        //brokenImage: DIR + "missingBrokenImage.png",
        label: jsonArtistResults.results[0]["title"]
      },
      {
        id: jsonArtistResults.results[0]["id"] + 1,
        shape: "image",
        image: jsonArtistResults.results[0]["thumb"],
        //brokenImage: DIR + "missingBrokenImage.png",
        label: jsonArtistResults.results[0]["title"]
      }
    ];

    // create connections between people
    // value corresponds with the amount of contact between two people
    edges = [
      { from: jsonArtistResults.results[0]["id"], to: jsonArtistResults.results[0]["id"] },
      //{ from: 2, to: 3 },
      //{ from: 2, to: 4 },
      //{ from: 4, to: 5 },
      //{ from: 4, to: 10 },
      //{ from: 4, to: 6 },
      //{ from: 6, to: 7 },
    ];

    // create a network
    var container = document.getElementById("artist-tree");
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      nodes: {
        borderWidth: 4,
        size: 30,
        color: {
          border: "#406897",
          background: "#6AAFFF"
        },
        font: { color: "#eeeeee" },
        shapeProperties: {
          useBorderWithImage: true
        }
      },
      edges: {
        color: "lightgray"
      }
    };
    network = new vis.Network(container, data, options);
  }
    draw();
}

function LoadArtistsResults(jsonArtistResults) {
  $( ".content" ).fadeOut( "slow", function() {
    $( ".content" ).empty();

    if(jsonArtistResults.results.length > 1)
    {
      BuildPickArtist(jsonArtistResults);
    }
  });
}

function BuildPickArtist(jsonArtistResults) {
  for(var i = 0; i < jsonArtistResults.results.length; i++){
    var artistResult = "<div class='artist-result' id='artist-result-" + i + "'>" + jsonArtistResults.results[i]["title"] + "</div>"
    $(".content").append(artistResult);
  }
}
