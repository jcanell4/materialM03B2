jssor_slider1_starter = function (containerId) {
    
    var _CaptionTransitions = [];
    _CaptionTransitions["L"] = { $Duration: 800, x: 0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["R"] = { $Duration: 800, x: -0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["T"] = { $Duration: 800, y: 0.6, $Easing: { $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["B"] = { $Duration: 800, y: -0.6, $Easing: { $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["TL"] = { $Duration: 800, x: 0.6, y: 0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine, $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["TR"] = { $Duration: 800, x: -0.6, y: 0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine, $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["BL"] = { $Duration: 800, x: 0.6, y: -0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine, $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };
    _CaptionTransitions["BR"] = { $Duration: 800, x: -0.6, y: -0.6, $Easing: { $Left: $JssorEasing$.$EaseInOutSine, $Top: $JssorEasing$.$EaseInOutSine }, $Opacity: 2 };

    _CaptionTransitions["CLIP|L"] = { $Duration: 900, $Clip: 1, $Easing: { $Clip: $JssorEasing$.$EaseInOutCubic }, $Opacity: 2 };
    _CaptionTransitions["WAVE|L"] = { $Duration: 1500, x: 0.6, y: 0.3, $Easing: { $Left: $JssorEasing$.$EaseLinear, $Top: $JssorEasing$.$EaseInWave }, $Opacity: 2, $Round: { $Top: 2.5} };
    _CaptionTransitions["MCLIP|B"] = { $Duration: 900, $Clip: 8, $Move: true, $Easing: $JssorEasing$.$EaseOutExpo };
    _CaptionTransitions["L-*|B"] = {$Duration:1200,x:0.7,$Rotate:-0.5,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Opacity:$JssorEasing$.$EaseInQuad,$Rotate:$JssorEasing$.$EaseInBack},$Opacity:2,$During:{$Left:[0.2,0.8]}};
    _CaptionTransitions["RTT|360"] = {$Duration:2000,$Rotate:1,$Easing:{$Opacity:$JssorEasing$.$EaseLinear,$Rotate:$JssorEasing$.$EaseInQuad},$Opacity:2};
    _CaptionTransitions["R-CROSS"] = {$Duration:2000,x:-1,$Easing:$JssorEasing$.EaseInOutSine,$Opacity:1};
    _CaptionTransitions["L-CROSS"] = {$Duration:2000,x:1,$Easing:$JssorEasing$.EaseInOutSine,$Opacity:1};
    var options = {
        $SlideDuration: 400,
        $AutoPlay: false,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
        $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        $CaptionSliderOptions: {                            //[Optional] Options which specifies how to animate caption
            $Class: $JssorCaptionSlider$,                   //[Required] Class to create instance to animate caption
            $CaptionTransitions: _CaptionTransitions,       //[Required] An array of caption transitions to play caption, see caption transition section at jssor slideshow transition builder
            $PlayInMode: 1,                                 //[Optional] 0 None (no play), 1 Chain (goes after main slide), 3 Chain Flatten (goes after main slide and flatten all caption animations), default value is 1
            $PlayOutMode:1                                 //[Optional] 0 None (no play), 1 Chain (goes before main slide), 3 Chain Flatten (goes before main slide and flatten all caption animations), default value is 1
        }
    };

    var jssor_slider = new $JssorSlider$(containerId, options);

    var ScaleSlider = function() {
        var parentWidth;
        var rate=1;
        var minWidth=300;
        if(jssor_slider.$Elmt.dataset.rate){
            rate=parseFloat(jssor_slider.$Elmt.dataset.rate);
        }
        if(jssor_slider.$Elmt.dataset.minWidth){
            minWidth=parseInt(jssor_slider.$Elmt.dataset.minWidth);
        }
        parentWidth = $(jssor_slider.$Elmt).parent().width();
        if (parentWidth) {
            var sliderWidth = Math.max(parentWidth*rate, Math.min(minWidth, parentWidth));
            //console.log(sliderWidth);
            jssor_slider.$ScaleWidth(sliderWidth);
        }else{
            $Jssor$.$Delay(ScaleSlider, 30);
        }
    };

    ScaleSlider();

    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);

    return jssor_slider;
};

