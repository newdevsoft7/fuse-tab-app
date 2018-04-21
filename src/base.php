<?php 
header('Access-Control-Allow-Origin: *');

echo json_encode(array(
  'name' => 'demo',
  'logo' => 'https://assets.staffconnect-app.com/logos/staffconnect.svg',
  'favicon' => 'https://assets.staffconnect-app.com/favicons/favicon.ico'
));

?>
