/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
if(hljs){
    hljs.addLineNumbers=function(){
        $('pre code.linenumbers').each(function(){
            var result = this.innerHTML.replace(/\n/g, function() {
                return "\n" + '<span class="line"></span>';
            });                
            this.innerHTML = result;
        });
    };
}else{
    console.log("No existeix hljs");
}

$(".iocnoteOpener a").hover(function(e) {
    var $svgc = new SvgConnector();
    var $target = $("#"+this.dataset.target);
    var $noteBy = $("#"+this.dataset.noteBy);
    var $svgContainer = $("#svgContainerId");
    var bcolor = $(".iocnoteSlidePane").css("border-color");
    var $path = $("#pathId");
    var $svg = $("#svgId");
    
    $target.addClass("top").removeClass("toggle-off").fadeTo(500,1);
    
    var pathCoord = $svgc.calculatePathCoord($svgContainer, $target, $noteBy);
    while(pathCoord.endY - pathCoord.startY < 20){
        $target.offset({top:$target.offset().top+10, left:$target.offset().left});
        pathCoord = $svgc.calculatePathCoord($svgContainer, $target, $noteBy);
    }
    
    $path.attr("stroke", bcolor);
    
    $svgc.drawPath($svg, $path , pathCoord.startX, pathCoord.startY
                                        , pathCoord.endX, pathCoord.endY);
    
    $svgContainer.addClass("top").removeClass("toggle-off").fadeTo(500,1);
                                    
}, function(e){
    $("#"+this.dataset.target).fadeTo(500,0).addClass("toggle-off").removeClass("top");
    $("#svgContainerId").fadeTo(500,0).addClass("toggle-off").removeClass("top");
});

SvgConnector = function(){
    this.calculatePathCoord = function(svgContainer, startElem, endElem){
        var ret = {};
        
        // if first element is lower than the second, swap!
        if(startElem.offset().top > endElem.offset().top){
            var temp = startElem;
            startElem = endElem;
            endElem = temp;
        }

        // get (top, left) corner coordinates of the svg container   
        var svgTop  = svgContainer.offset().top;
        var svgLeft = svgContainer.offset().left;

        // get (top, left) coordinates for the two elements
        var startCoord = startElem.offset();
        var endCoord   = endElem.offset();

        // calculate path's start (x,y)  coords
        // we want the x coordinate to visually result in the element's mid point
        ret.startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
        ret.startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

            // calculate path's end (x,y) coords
        ret.endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
        ret.endY = endCoord.top  - svgTop;
        
        return ret;
    }

    this.drawPath = function(svg, path, startX, startY, endX, endY) {
        // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
        var stroke =  parseFloat(path.attr("stroke-width"));
        // check if the svg is big enough to draw the path, if not, set heigh/width
        if (svg.attr("height") <  endY)                 svg.attr("height", endY);
        if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
        if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));

        var deltaX = (endX - startX) * 0.15;
        var deltaY = (endY - startY) * 0.15;
        // for further calculations which ever is the shortest distance
        var delta  =  deltaY < this.absolute(deltaX) ? deltaY : this.absolute(deltaX);

        // set sweep-flag (counter/clock-wise)
        // if start element is closer to the left edge,
        // draw the first arc counter-clockwise, and the second one clock-wise
        var arc1 = 0; var arc2 = 1;
        if (startX > endX) {
            arc1 = 1;
            arc2 = 0;
        }
        // draw tha pipe-like path
        // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
        path.attr("d",  "M"  + startX + " " + startY +
                        " V" + (startY + delta) +
                        " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*this.signum(deltaX)) + " " + (startY + 2*delta) +
                        " H" + (endX - delta*this.signum(deltaX)) + 
                        " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                        " V" + endY );
    };
    
    this.signum = function(x) {
        return (x < 0) ? -1 : 1;
    };
    
    this.absolute = function(x) {
        return (x < 0) ? -x : x;
    }
}


    
ActivityManager = function (){
    this.init = function(replaceParams, id, async, onError){
        if(id){
            this.toReplaceOnLoad(replaceParams, id, async, onError);
        }else if(replaceParams ){
            this.toReplaceOnLoad(replaceParams.url, replaceParams.id, replaceParams.async, replaceParams.onError);
        }
        
        $(document).ready(function(){
            $('[data-ref-figure]').each(function(){
                var idFigure = "#" + this.dataset.refFigure;
                var text = $(idFigure).find(".figuretitle:after").text();
                if(text){
                    $(this).text(text);
                }
                /*
                var spanNodeTitle = $(idFigure).find(".figuretitle");
                if(spanNodeTitle.lenth>0){
                    var text = spanNodeTitle.text();
                    $(this).text(text);
                }
                */
            });
            $('[data-toggle="tooltip"]').tooltip(); 

            $("[data-selector-to-set-class]").each(function(){
                var toSetClass = $(this.dataset.selectorToSetClass);        
                var classToSet = this.dataset.classToSetClass
                $(this).click(function(){
                    $(toSetClass).attr("class", classToSet);
                });
            });

            $("[data-selector-solution]").each(function(){
                var solution = $(this.dataset.selectorSolution).get(0);
                $(this).click(function(){
                    var modalWindow = $(".iocModal")
                    var modalBody = $(modalWindow).find(".modal-body");

                    $(modalWindow).find(".modal-title").html("SOLUCIÓ");
                    modalBody.children().each(function(){
                        var element = $(this).detach();
                        $("#hiddenContent").append(element);                        
                    });
                    $(solution).detach().removeClass("hidden");
                    modalBody.append(solution);
                    modalBody.css("max-height", ""+($(document).height()-140)+"px");
                    modalWindow.toggleClass("iocModalSolution hidden");            
                });
            });    

            $("[data-selector-advice]").each(function(){
                var advices = $(this.dataset.selectorAdvice).get(0);
                $(this).click(function(){
                    var modalWindow = $(".iocModal")
                    var modalBody = $(modalWindow).find(".modal-body");

                    $(modalWindow).find(".modal-title").html("CONSELLS");
                    modalBody.children().each(function(){
                        var element = $(this).detach();
                        $("#hiddenContent").append(element);                        
                    });
                    $(advices).detach().removeClass("hidden");
                    modalBody.append(advices);
                    //modalBody.css("max-height", ""+($(document).height()-140)+"px");
                    modalWindow.toggleClass("iocModalAdvice hidden");            
                });
            });    

            $("[data-selector-clue]").each(function(){
                var clue = $(this.dataset.selectorClue).get(0);
                $(this).click(function(){
                    var buttonActive = $("[data-selector-clue].active").get(0);
                    if(this!==buttonActive){
                        $(buttonActive).click();
                    }
                    var emptyPanel = $("#emptypanel-wrapper")
                    if(emptyPanel.hasClass("active")){
                        emptyPanel.children("div").each(function() {
                            //$("#emptypanel-wrapper > div" ).each(function() {
                            $(this).addClass("hidden");
                        });                
                        emptyPanel.removeClass("active");
                        emptyPanel.css("width", "0px");
                        $(this).attr("title", "Prem per obtenir una pista")
                    }else{            
                        emptyPanel.children("div").each(function(){
                            var element = $(this).detach();
                            $("#hiddenContent").append(element);                        
                        });
                        $(clue).detach().removeClass("hidden");
                        emptyPanel.append(clue);
                        emptyPanel.addClass("active");
                        emptyPanel.css("width", ""+($(document).width()-100)+"px");
                        $(this).attr("title", "Prem per tornar a l'activitat")
                    }
                });
            });  
            if(hljs){
                hljs.addLineNumbers();
                hljs.initHighlightingOnLoad();
            }
        });
    };

    this.updateDisplayButtons = function(iocSlider){
        $("[data-display-on-set-slide]").each(function(){
            var slide;
            var self = this;
            var slideId = this.dataset.displayOnSetSlide; 
            iocSlider.watch("onSetCurrentSlide", function(e){
                var slide;
                var oldSlide =e.oldValues.vindx!=-1
                                    ?e.oldValues.vslides[e.oldValues.vindx]
                                    :e.oldValues.hslides[e.oldValues.hindx];
                if($(oldSlide).attr("id")===slideId){
                   $(self).hide();
                   if($(self).hasClass("active")){
                        $(self).click();
                   }
                }
                slide = this.hasVerticalSlides()
                                    ?this.vslides[this.vindx]
                                    :this.hslides[this.hindx];
                if($(slide).attr("id")===slideId){
                   $(self).show();
                }
            });

            slide = iocSlider.hasVerticalSlides()
                                ?iocSlider.vslides[iocSlider.vindx]
                                :iocSlider.hslides[iocSlider.hindx];
            if($(slide).attr("id")===slideId){
               $(this).show();
            }
        });    
    };

    this.toReplaceOnLoad = function(url, id, async, onError){
        if(async===undefined && !onError){
            async=true;
        }else if(!onError){
            if(typeof async ==='function'){
                onError=async;
                async = true;
            }
        }
        if(!onError){
            onError=function() {
               alert( "error" );
            };        
        }
        if(location.search){
            url = url.substring(0,url.lastIndexOf("/")).concat(
                                            "/", 
                                            location.search.substring(1),
                                            url.substring(url.lastIndexOf("/")));
        }
        $.ajax({
            url:url,
            dataType: "json",
            async: async,
             method: "POST"
        }).done(function(data) {
           var defaultValues = data["defaultValues"];
           var fReplaceByFile = function(url, type, selector){
                $.ajax({
                    url:url,
                    dataType: type,
                    async: false,
                    method: "POST"
                }).done(function(value){                
                    $(selector)[type](value);
                }).fail(function(){
                    $(selector)[type]("Error");
                });
           }
           var getValue = function(value, defaultValues, data){
               var ret;
               if(typeof value === "string"){
                   ret = value;
               }else{
                   if(value.defaultValue){
                       value = defaultValues[value.defaultValue];
                   }
                   if(value.type=="ref"){
                       value = data[value.name][value.value].value;
                       ret = getValue(value, defaultValues, data);
                   }else if(value.type=="text"){
                       ret = value.value;
                   }
               }   
               return ret;
           };
           var fReplaceData = function(selector, activity, defalutValues) {
               if(!activity){
                   return;
               }
               if(activity.defaultValue){
                   activity = defaultValues[activity.defaultValue];
                   fReplaceData(selector, activity, defalutValues);
               }else if(activity.type == "ref"){
                    var refActivity = data[activity.name][activity.value];
                    fReplaceData(selector, refActivity, defalutValues);
               }else if(activity.type=="arrayText"){
                   var value = "";
                   if(activity.value.length>0){
                       value = getValue(activity.value[0], defalutValues, data);
                   }
                   for(var i=1; i<activity.value.length; i++){
                       value += "/";
                       value += getValue(activity.value[i], defalutValues, data);
                   }
                   $(selector).text(value);
               }else if(activity.type=="file/text"){
                   fReplaceByFile(activity.value, "text", selector);
               }else if(activity.type=="file/html"){
                   fReplaceByFile(activity.value, "html", selector);
               }else if(activity.type=="text"){
                   $(selector).text(activity.value);
               }else if(activity.type=="html"){
                   $(selector).html(activity.value);
               }else if(activity.type=="attr"){
                   $(selector).attr(activity.name, activity.value);
               }           
            };
            var activities = data[id];    
            for(var i in activities){
                var activity = activities[i];
                var selector = activity.selector;
                fReplaceData(selector, activity, defaultValues);
            }
        }).fail(onError);    
    };
};


