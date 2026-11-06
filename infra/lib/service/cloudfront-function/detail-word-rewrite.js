// CloudFront Functions(viewer request)で動く処理。ランタイムの都合でES5で書く
// 英単語詳細ページは全単語で共通の1ファイルしか出力されないため、/englishBot/detailWord/<id>/ へのアクセスをそのファイルに読み替える
// ブラウザのURLは変わらず、画面側はURLからidを読む
var DETAIL_WORD_PATH = /^\/englishBot\/detailWord\/(\d+)(\/index\.html|\/)?$/;

function handler(event) {
  var request = event.request;
  var matched = request.uri.match(DETAIL_WORD_PATH);
  if (!matched) {
    return request;
  }

  // /index.html付きのURLでは画面側でidを読めないため、末尾スラッシュの形へ転送する
  if (matched[2] === '/index.html') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/englishBot/detailWord/' + matched[1] + '/' } }
    };
  }

  request.uri = '/englishBot/detailWord/%5Bid%5D/index.html';
  return request;
}
