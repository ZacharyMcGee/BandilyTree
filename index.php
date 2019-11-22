<?php
header('Access-Control-Allow-Origin: *');
?>
<!doctype html>
<html>
<head>
  <title>BandilyTree - Explore Musical Artist Family Trees</title>

  <link rel="stylesheet" type="text/css" href="css/style.css">
  <script
  src="https://code.jquery.com/jquery-3.4.1.js"
  integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
  crossorigin="anonymous"></script>
  <script src="https://kit.fontawesome.com/322089c541.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <script src="js/vinylsis.js"></script>
  <script src="https://visjs.github.io/vis-network/standalone/umd/vis-network.min.js"></script>
</head>
<body>
<div class="header">
  <div class="header-logo">
    <a href="index.php"><img src="images/logo.png"></a>
  </div>

  <div class="header-menu">
    <ul>
      <li><a href="index.php">Home</a></li>
      <li><a href="news.asp">About</a></li>
      <li><a href="contact.asp">Source</a></li>
    </ul>
  </div>
</div>
<div class="content" id="content">
  <div class="search-artist" id="search-artist">
    <div class="search-form" id="search-form">
      <p class="artist-search-text">Search for a Band or Artist</p>
      <input type="text" autocomplete="off" class="artist-search-input" id="artist-search-input" placeholder="e.g. The Beatles" name="artist">
      <input type="button" class="artist-search-button" id="artist-search-button" name="submit" value="Search" />
      <p class="artist-search-info"><i class="fas fa-info-circle"></i> What is BandilyTree?</p>
    </div>
  </div>
</div>

<div class="info-section">
<h2>Visualize Musical Groups with BandilyTree</h2>
  <div class="info-panels">
    <div class="info-panel-1">
      <div class="info-header">
        <p><i class="fas fa-search"></i> Search Members</p>
        <img src="images/info-1.png">
        <p class="info-panel-body">View the current and past members of a group.</p>
      </div>
    </div>
    <div class="info-panel-2">
      <p><i class="fas fa-sitemap"></i> Traverse Relationships</p>
      <img src="images/info-2.png">
      <p class="info-panel-body">Expand members to view the other musical groups they belong to.</p>
    </div>
    <div class="info-panel-3">
      <p><i class="far fa-lightbulb"></i> Discover New Music</p>
      <img src="images/info-3.png">
      <p class="info-panel-body">Discover new musical artists that are related to your search.</p>
    </div>
  </div>
</div>

<div class="footer">
  <p>Another project by <a href="https://zmcgee.com">Zachary McGee</a></p>
</div>

</body>
