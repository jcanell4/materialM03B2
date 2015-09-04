/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//$("#modalWindow button.close").on("click", function(e){
//    e.preventDefault();
//    $("#modalWindow").toggle();
//});

$(document).ready(function(){
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
});

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

function toReplaceOnLoad(url, id, onError){
    if(!onError){
        onError=function() {
           alert( "error" );
        };
    }
    $.ajax({
        url:url,
        dataType: "json",
         method: "POST"
    }).done(function(data) {
       var selector;
       var defaultValues = data["defaultValues"];
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
}


