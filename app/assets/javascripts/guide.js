//= require legacy

$('.asset-group__downloads a[rel=download]').on('click', function(event) {
  event.preventDefault();

  $assetGroup = $(this).parent('.asset-group__downloads');
  
  $selectedAssets = $assetGroup.find('.asset').filter(function() {
    return $(this).find('input').is(':checked');
  });

  assetIds = $selectedAssets.map(function() {
    return $(this).attr('data-id');
  }).toArray();

  var downloadUrl = $(this).attr('href');

  if(assetIds.length) downloadUrl = downloadUrl+'?asset_ids='+assetIds.join(',');

  window.location = downloadUrl;
});