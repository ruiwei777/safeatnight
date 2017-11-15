function preloadImage () {
    var $img = $("img.preload");
    var $body = $("body");
    if($img.length){
        var img = $img[0];
        if(img.complete){
            $body.addClass("loaded");
            return;
        }

        $img.on('load', function(){
            $body.addClass("loaded")
        });
    }
    
}

$(preloadImage);