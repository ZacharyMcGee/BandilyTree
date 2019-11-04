<?php
header('Access-Control-Allow-Origin: *');
?>
<!doctype html>
<html>
<head>
  <script
  src="https://code.jquery.com/jquery-3.4.1.js"
  integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
  crossorigin="anonymous"></script>
  <script>
  $(function(){
      $("#filter").click(function(){
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
      });
  });
  </script>
</head>
<body>

Artist: <input type="text" id="artist" name="artist"><br>
<input type="button" id="filter" name="filter" value="Filter" />


</body>
