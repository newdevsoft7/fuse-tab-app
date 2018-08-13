<?php

$domain = $_SERVER['HTTP_HOST'];
$presentation_id = $_GET['id'];
$code = $_GET['code'];

function callEndpoint($url) {
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_POST, false);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
  $curl_response = curl_exec($curl);
  curl_close($curl);
  return json_decode($curl_response);
}

$base_data = callEndpoint('https://admin.staffconnect-app.com/api/identify/' . $domain);

$api_baseurl = 'https://api.' . $base_data->name . '.staffconnect-app.com/api';
$presentation = callEndpoint($api_baseurl . '/presentation/' . $presentation_id . '/present/' . $code);
?>
<!doctype html>
<html lang="en">

<head>
  <title><?php echo $presentation->meta->name . ' | Staffconnect4 presentation'; ?></title>
  <base href="/">

  <meta charset="utf-8">
  <meta name="description" content="StaffConnect4 presentation for users">
  <meta name="keywords" content="StaffConnect,Staff management system,promotions,acting,modelling,scheduling,accounting,management">
  <meta name="author" content="Nobox Limited">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <meta property="og:title" content="<?php echo $presentation->meta->name . ' | Staffconnect4 presentation'; ?>">
  <meta property="og:description" content="StaffConnect4 presentation for users">
  <meta property="og:url" content="https://<?php echo $domain; ?>/presentation.php?presentation_id=<?php echo $presentation_id; ?>&code=<?php echo $code; ?>">
  <meta property="og:type" content="website">

  <style>
    body {
      margin: 0;
    }
  </style>

  <script>
    var data = <?php echo json_encode($presentation); ?>;
  </script>
</head>
<body>
  <div id="iframeWrapper"></div>
  <script>
    var iframeUrl = 'https://showcaseconnect.net/main/templates/view/' + data.other_id + '?public=true';
    var iframeWrapper = document.getElementById('iframeWrapper');
    var iframeEle = document.createElement('iframe');
    iframeEle.src = iframeUrl;
    iframeEle.frameBorder = 0;
    iframeEle.width = window.innerWidth;
    iframeEle.height = window.innerHeight;
    iframeWrapper.appendChild(iframeEle);
    iframeEle.onload = function () {
      data.type = 'presentation';
      data.hostname = window.location.hostname;
      iframeEle.contentWindow.postMessage(data, "*");
    }
  </script>
</body>
</html>
