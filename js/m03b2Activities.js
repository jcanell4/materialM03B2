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
               if(activity.defaultValue){
                   activity = defaultValues[activity.defaultValue];
               }
               if(activity.type == "ref"){
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


