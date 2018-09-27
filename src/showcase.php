<?php

$domain = $_SERVER['HTTP_HOST'];
$user_id = $_GET['user_id'];
$type = $_GET['type'];
$card_id = $_GET['card_id'];

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

$card = callEndpoint($api_baseurl . '/user/' . $user_id . '/' . $type . '/' . $card_id);

?>
<!doctype html>
<html lang="en">

<head>
  <title><?php echo $card->meta->name . ' | Staffconnect4'; ?></title>
  <base href="/">

  <meta charset="utf-8">
  <meta name="description" content="StaffConnect4 showcase for <?php echo $card->meta->name; ?>">
  <meta name="keywords" content="StaffConnect,Staff management system,promotions,acting,modelling,scheduling,accounting,management">
  <meta name="author" content="Nobox Limited">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <meta property="og:title" content="<?php echo $card->meta->name . ' | Staffconnect4'; ?>">
  <meta property="og:description" content="StaffConnect4 showcase for <?php echo $card->meta->name; ?>">
  <meta property="og:image" content="<?php echo $card->meta->thumbnail; ?>">
  <meta property="og:url" content="https://<?php echo $domain; ?>/showcase.php?user_id=<?php echo $user_id; ?>&type=<?php echo $type; ?>&card_id=<?php echo $card_id; ?>">
  <meta property="og:type" content="website">

  <style>
    body {
      margin: 0;
    }
  </style>

  <script>
    var data = <?php echo json_encode($card); ?>;
    data.type = '<?php echo $type; ?>';
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
      iframeEle.contentWindow.postMessage(data, "*");
    }
  </script>
</body>
</html>
