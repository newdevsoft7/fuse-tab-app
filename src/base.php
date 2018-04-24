<?php 
header('Access-Control-Allow-Origin: *');

$tenant_name = basename(__DIR__);

if ($tenant_name == 'src' || $tenant_name == 'dist') {
  $tenant_name = 'demo';
}

$logo = 'https://assets.staffconnect-app.com/tenants/' . $tenant_name . '/logo.png';
$background = 'https://assets.staffconnect-app.com/tenants/' . $tenant_name . '/login_bg.jpg';
$favicon = 'https://assets.staffconnect-app.com/tenants/' . $tenant_name . '/favicons/favicon.ico';

$logoHeaders = get_headers($logo, 1);
$bgHeaders = get_headers($background, 1);
$favHeaders = get_headers($favicon, 1);
if (strpos($logoHeaders[0], '404') !== false) {
  $logo = 'assets/images/logos/staffconnect.svg';
}
if (strpos($bgHeaders[0], '404') !== false) {
  $background = 'assets/images/backgrounds/dark-material-bg.jpg';
}
if (strpos($favHeaders[0], '404') !== false) {
  $favicon = 'favicon.ico';
}

echo json_encode(array(
  'name' => $tenant_name,
  'logo' => $logo,
  'favicon' => $favicon,
  'background' => $background
));

?>
