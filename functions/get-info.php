<?php
$key = 'buGfNhMTMtHMGmkyAyRt';
$secret = 'DHIXkPjCSdyLcfPNsHlzWjNOqrwmyiyU';
$artist = 1;

if (isset($_GET['artist']))
{
    $artist = $_GET['artist'];
}
else
{
    // Fallback behaviour goes here
}

$ch = curl_init('https://api.discogs.com/artists/' . $artist);

curl_setopt(
    $ch,
    CURLOPT_HTTPHEADER,
    array(
        'Content-Type: application/x-www-form-urlencoded',
        'Authorization: Discogs key=' . $key . ', secret=' . $secret . '',
        'User-Agent: VinylAnalysis'
    )
);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

curl_getinfo($ch);
echo curl_exec($ch);
curl_close($ch);
?>
