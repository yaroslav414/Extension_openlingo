var image = document.getElementById("thumbnail")
var title = document.getElementById("title")

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    console.log(url);
    video_id = youtube_parser(url);
    updateResourceImage(video_id);
    updateTitle(video_id);
});

chrome.tabs.onActivated.addListener( function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        y = tab.url;
        video_id = youtube_parser(y);
        updateResourceImage(video_id);
        updateTitle(video_id);
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) {
        video_id = youtube_parser(change.url);
        updateResourceImage(video_id);
        updateTitle(video_id);
    }
});


function updateResourceImage(video_id) {
    image.src = `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;
  }

function updateTitle(video_id) {
    const url = (`https://www.youtube.com/oembed?url=youtube.com/watch?v=${video_id}&format=json`);
    fetch(url).then(response => response.json()).then(json => {
        if (json.title) {
            title.innerHTML = json.title;
        };
    })
};
