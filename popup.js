var image = document.getElementById("thumbnail")
var title = document.getElementById("title")

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

chrome.tabs.onActivated.addListener( function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        y = tab.url;
        console.log("you are here: "+y);
        video_id = youtube_parser(y);
        console.log(video_id);
        updateResourceImage(video_id);
        updateTitle(video_id);
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) {
        console.log("you are here: "+change.url);  
        video_id = youtube_parser(change.url);
        console.log(video_id);
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
