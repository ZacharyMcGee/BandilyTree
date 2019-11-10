var results = [];
var nodes = [];
var edges = [];

$(function(){
      particlesJS("search-artist", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1.2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":4,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var update; update = function() {  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { } 				requestAnimationFrame(update); };
 	requestAnimationFrame(update);
});

$(document).ready(function() {
    $("#artist-search-button").click(function(){
      var artist = $('#artist-search-input').val();
        //GetArtistID($('#artist').val());
        $.ajax({
            type: "GET",
            url: 'functions/search-artists.php',
            data: {
              "artist": artist,
            },
            success: function(data) {
              var jsonData = JSON.parse(data);

              GetArtistInfo(jsonData.results[0]["id"], 0, 1, 0);
            },
            error: function(result) {
                alert('error');
            }
        });
    });
});

function ExpandArtist(id, parent, network) {
  $.ajax({
      type: "GET",
      url: 'functions/get-info.php',
      data: {
        "artist": id,
      },
      success: function(data) {
         var jsonData = JSON.parse(data);
         if(jsonData["groups"]) {
          for(var i = 0; i < jsonData["groups"].length; i++){
           AddNode(jsonData["groups"][i]["id"], id, jsonData["groups"].length, i, network);
          }
         }
         else
         {
           for(var i = 0; i < jsonData["members"].length; i++){
            AddNode(jsonData["members"][i]["id"], id, jsonData["members"].length, i, network);
           }
         }
       }
     });
}

function AddNode(id, parent, total, i, network) {
  $.ajax({
      type: "GET",
      url: 'functions/get-info.php',
      data: {
        "artist": id,
      },
      success: function(data) {
         var jsonData = JSON.parse(data);
         var image;

         if(jsonData["images"]) {
            image = jsonData["images"][0]["uri"]
         }
         else
         {
            image = "images/artists/Artist-Placeholder.png";
         }

         if(jsonData["members"] || id == 0) {
           var node =
           {
             id: jsonData["id"],
             size : 30,
             shape: "image",
             image: image,
             brokenImage: "missingBrokenImage.png",
             label: jsonData["name"],
             font: {color: 'black', size: '16'}
           }
         }
         else
         {
           var node =
           {
             id: jsonData["id"],
             shape: "circularImage",
             image: image,
             brokenImage: "missingBrokenImage.png",
             label: jsonData["name"]
           }
         }

         var edge =
           {
             from: jsonData["id"],
             to: parent
           }

         var foundNode = false;
         var foundEdge = false;
         for(var j = 0; j < nodes.length; j++) {
           if(nodes[j]["id"] == node["id"]) {
             foundNode = true;
           }
         }

         for(var k = 0; k < edges.length; k++) {
           if(edges[k]["from"] == edge["to"] && edges[k]["to"] == edge["from"]) {
             foundEdge = true;
           }
         }

         if(!foundNode) {
           nodes.push(node);
         }

         if(!foundEdge) {
           edges.push(edge);
         }

         if(i + 1 == total) {
           console.log(nodes);
           //BuildTree();
           network.setData({ nodes: nodes, edges: edges });
         }
       }
     });
}

function GetArtistInfo(id, count, total, parent) {
  if(count < 2) {
   $.ajax({
       type: "GET",
       url: 'functions/get-info.php',
       data: {
         "artist": id,
       },
       success: function(data) {
          var jsonData = JSON.parse(data);

          if(jsonData["members"] || id == 0) {
            var node =
            {
              id: jsonData["id"],
              size : 60,
              color: {background:'#F03967', border:'#713E7F',highlight:{background:'red',border:'black'}},
              shape: "image",
              image: jsonData["images"][0]["uri"],
              //brokenImage: DIR + "missingBrokenImage.png",
              label: jsonData["name"],
              font: {color: 'black', weight: 'bold'}
            }
          }
          else
          {
            var node =
            {
              id: jsonData["id"],
              shape: "circularImage",
              image: jsonData["images"][0]["uri"],
              brokenImage: "missingBrokenImage.png",
              label: jsonData["name"]
            }
          }

          if(parent != 0) {
          var edge =
            {
              from: jsonData["id"],
              to: parent
            }
            edges.push(edge);
          }
          nodes.push(node);

          if(jsonData["members"]) {
            for(var i = 0; i < jsonData["members"].length; i++){
              GetArtistInfo(jsonData["members"][i]["id"], count + 1, total + jsonData["members"].length, id);
            }
          }
          if(nodes.length == total && count == 1) {
            console.log(nodes);
            $(".content").load("templates/artist-tree.html", function(){
                BuildTree();
            });
          }
       },
       error: function(result) {
           alert('error');
       }
   });
 }
}

function BuildTree() {
  var network = null;

  function draw() {

    // create connections between people
    // value corresponds with the amount of contact between two people

    // create a network
    var container = document.getElementById("artist-tree");
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      height: '100%',
      width: '100%',
      nodes: {
        borderWidth: 2,
        size: 30,
        color: {
          border: "#3d8863",
          background: "#3d8863"
        },
        font: { color: "#444d56" },
        shapeProperties: {
          useBorderWithImage: true
        }
      },
      edges: {
        width: 2,
        color: {
          color: '#bdf5d9',
          highlight: '#A22'
        },
      },
    };
    network = new vis.Network(container, data, options);
    network.on("doubleClick", function(params) {
      params.event = "[original event]";
      ExpandArtist(this.getNodeAt(params.pointer.DOM), 1, network);
      console.log(
        "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
      );
    });
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
