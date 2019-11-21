var results = [];
var nodes = [];
var edges = [];

var MAX_BIO_LENGTH = 250;

$(function(){
      particlesJS("search-artist", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1.2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":4,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var update; update = function() {  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { } 				requestAnimationFrame(update); };
 	requestAnimationFrame(update);
});

$(document).ready(function() {
    $("#artist-search-button").click(function(){
      var artist = $('#artist-search-input').val();
      $(".search-form").load("extra/loading-spinner.html", function(){
        UpdateLoaderStatusText("Searching for Artist ID");
        //GetArtistID($('#artist').val());
        $.ajax({
            type: "GET",
            url: 'functions/search-artists.php',
            data: {
              "artist": artist,
            },
            success: function(data) {
              var jsonData = JSON.parse(data);
              UpdateLoaderStatusText("Found ID: " + jsonData.results[0]["id"]);
              GetArtistInfo(jsonData.results[0]["id"], 0, 1, 0);
            },
            error: function(result) {
                alert('error');
            }
        });
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
             font: {color: '#3d8863', size: '16'},
             data: jsonData
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
             label: jsonData["name"],
             data: jsonData
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
            UpdateLoaderStatusText("Found Group: " + jsonData["name"]);
            var node =
            {
              id: jsonData["id"],
              size : 60,
              color: {background:'#3d8863', border:'#3d8863',highlight:{background:'white',border:'white'}},
              shape: "image",
              image: jsonData["images"][0]["uri"],
              //brokenImage: DIR + "missingBrokenImage.png",
              label: jsonData["name"],
              font: {color: '#3d8863', weight: 'bold'},
              data: jsonData
            }
          }
          else
          {
            var image;

            UpdateLoaderStatusText("Found Member: " + jsonData["name"]);

            if(jsonData["images"]) {
              image = jsonData["images"][0]["uri"];
            }
            else
            {
              image = "images/artists/Artist-Placeholder.png";
            }
            var node =
            {
              id: jsonData["id"],
              shape: "circularImage",
              image: image,
              brokenImage: "missingBrokenImage.png",
              label: jsonData["name"],
              data: jsonData
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
        chosen : { label: function(values, id, selected, hovering) { values.color = '#7af2b7'; values.strokeColor = '#3d8863'; values.strokeWidth = 3; } },
        size: 30,
        color: {
          border: "#33b194",
          background: "#3d8863"
        },
        font: { color: "#3d8863" },
        shapeProperties: {
          useBorderWithImage: false
        }
      },
      edges: {
        length: 150,
        width: 1,
        color: {
          color: '#bdf5d9',
          highlight: '#33b194'
        },
      },
    };
    network = new vis.Network(container, data, options);
    network.on('click', function (properties) {
            var nodeID = properties.nodes[0];
            if (nodeID) {
                var titleIcon;
                console.log(this.body.nodes[nodeID].options);

                var expandButton = "<div class='pop-up-expand-button' id='pop-up-expand-button'><input type='button' value='Expand Tree'></div>";

                var sNodeLabel = this.body.nodes[nodeID].options.label;
                var sToolTip = this.body.nodes[nodeID].options.title;

                if(this.body.nodes[nodeID].options.data["members"]) {
                  titleIcon = '<i class="fas fa-users"></i>'
                }
                else
                {
                  titleIcon = '<i class="fas fa-user"></i>';
                }

                if(this.body.nodes[nodeID].options.data["images"][0]) {
                  //profileImage = '<div class="pop-up-profile-image"><image src="' + this.body.nodes[nodeID].options.data['images'][0]['uri'] + ')"></div>';
                  profileImage = '<div class="pop-up-profile-image"><image src="' + this.body.nodes[nodeID].options.data["images"][0]["uri"] + '"></div>'
                }

                if(this.body.nodes[nodeID].options.data["profile"]) {
                  var bioInformation = this.body.nodes[nodeID].options.data["profile"];
                  if(bioInformation.length > 250) {
                    bioInformation = bioInformation.substring(0, MAX_BIO_LENGTH);
                    bioInformation = bioInformation + "... <a href='" + this.body.nodes[nodeID].options.data["uri"] + "'>Read More</a>";
                  }
                  bioInformation = bioInformation.replaceAll("[a=", "");
                  bioInformation = bioInformation.replaceAll("[l=", "");
                  bioInformation = bioInformation.replaceAll("]", "");
                  profileText = '<div class="info-header">' + sNodeLabel + '</div><div class="pop-up-profile-text"><p>' + bioInformation + '</p></div>'
                }
                else
                {
                  profileText = '<div class="info-header">' + sNodeLabel + '</div><div class="pop-up-profile-text"><p>No bio information available</p></div>'
                }

                //use JQUERY to see where the canvas is on the page.
                var canvasPosition = $('.vis-network').position();

                //the properties give x & y relative to the edge of the canvas, not to the whole document.
                var clickX = canvasPosition.top;
                var clickY = canvasPosition.left;

            //make sure we have a valid div, either clear it or generate one.
                if ($('#cellBatchAttrPopUp').length) {
                    $('div#cellBatchAttrPopUp').empty();
                }
                else {
                    $('<div id="cellBatchAttrPopUp"></div>').css('position','absolute').prependTo("#content");
                }

                // put the div over the node, display the tooltip and show it.
                $('div#cellBatchAttrPopUp').append('<div class="pop-up-title">' + titleIcon + ' Member Info' + '<div class="close-pop-up" id="close-pop-up"><i class="fas fa-times"></i></div></div>')
                  .append('<div class="pop-up-bio">' + profileImage + '</div>')
                  .append(profileText)
                  .append(sToolTip)
                  .append(expandButton)
                  .css('top', 62).css('left', 0)
                  .show();

                  $('.close-pop-up').click(function () {
                      $('#cellBatchAttrPopUp').empty().hide();
                  });

                  $('.pop-up-expand-button').click(function () {
                    ExpandArtist(nodeID, 1, network);
                  });
            }
        });

    network.on("doubleClick", function(params) {
      params.event = "[original event]";
      console.log(params.pointer.DOM);
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

function UpdateLoaderStatusText(text) {
  $(".lds-roller-status").html(text);
}

String.prototype.replaceAll = function (stringToFind, stringToReplace) {
    if (stringToFind === stringToReplace) return this;
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};
