/*
 * To relocate elements with existent attribute data-parent-selector as children of this 
 * attribute value.
 */
$(document).ready(function(){
    $("[data-parent-selector]").each(function(){
        var parent = this.dataset.parentSelector;
        var element = $(this).detach();
        $(parent).append(element);        
    });
});

/*
 * Captura les tecles fletxa-esq i fletxa-dreta per simular un click al botó
 * prevArrow o nextArrow respectivament.
 */
$(document).keydown(function(e){
    switch(e.which){
        case 39:
             $("#nextArrow").click();
             break;
         case 37:
             $("#prevArrow").click();
             break;
    }
    return true;
});

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

/* ----------------------------------------------------------- */
/*  MOBILE MENU CLOSE 
/* ----------------------------------------------------------- */ 

$('.navbar-nav').on('click', 'li a', function() {
  $('.navbar-collapse').collapse('hide');
});

/* ----------------------------------------------------------- */
/*  Toggle Menu
/* ----------------------------------------------------------- */
// Closes the sidebar menu
$("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Opens the sidebar menu
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

/*-----------------------------------*/
/*  INFO PANEL
 *-----------------------------------*/
//Set function to close the info-panel on click button panel-close 
$(".panel-close").click(function(e) {
    e.preventDefault();
    var parent = $(this).parent();
    $(parent).removeClass("active");
    $(parent).children("div").each(function() {
    //$("#emptypanel-wrapper > div" ).each(function() {
        $(this).addClass("hidden");
    });
});

//Set an extended function to jquery
$.fn.extend({
    //Opens the info-panel
    togglePanelOnClick: function () {
        this.toggleClass("hidden");
        $("#sidepanel-wrapper").toggleClass("active");
        $("#sidebar-wrapper").toggleClass("active");
        return false;
    }
});

/*Object to manage the slider actions
 */
IocSlider = function(){
    this.hindx=-1;
    this.vindx=-1;
    this.watchers={"onSetCurrentSlide":[function(e){
        var hCurrentId, vCurrentId;
        if(e.newValues.hindx>=0){
            hCurrentId = $(e.newValues.hslides[e.newValues.hindx]).attr("id");            
            var pathname = location.pathname;
            if(location.search){
                pathname += location.search;
            }
            if(e.newValues.vindx<0){                
                history.pushState({hash:pathname+"#"+hCurrentId}, 
                                    document.title, 
                                    pathname+"#"+hCurrentId);
            }else{
                vCurrentId = $(e.newValues.vslides[e.newValues.vindx]).attr("id");
                if(vCurrentId){                
                    history.pushState(
                                //{hash:location.pathname+"#"+hCurrentId+"__"+vCurrentId}, 
                                {hash:pathname+"#"+hCurrentId+"__"+vCurrentId}, 
                                document.title, 
                                pathname+"#"+hCurrentId+"__"+vCurrentId);
                }else{
                    history.pushState({hash:pathname+"#"+hCurrentId}, 
                                        document.title, 
                                        pathname+"#"+hCurrentId);
                }
            }
            if(e.oldValues.hindx!=e.newValues.hindx){
                $(".navbar-fixed-top a").each(function(){
                    var idInRef = this.href.split("#")[1];
                    if (hCurrentId == idInRef) {
                        $(".navbar-fixed-top").find(".active").removeClass("active");
                        $(this).parent().addClass("active");
                    }
                }); 
            }
        }
    }]};
    
    var slider = $("#mainSlider").get(0);
    
    this.watch = function(target, observer){
        if(!this.watchers[target]){
            this.watchers[target]=[];
        }
        this.watchers[target].push(observer);
    }
    
    this._fireEvent=function(event, dataEvent){
        for(var i=0; this.watchers[event] 
                    && i<this.watchers[event].length; i++){
            this.watchers[event][i].call(this, dataEvent);
        }
    }
    
    this._setVerticalSlides = function(last){
        var vSlides, cssClass, indx;
        
        if(this.hindx>=0){
            vSlides = $(this.hslides[this.hindx]).children(".section");
            if(vSlides.length){
                this.vslides = vSlides;
                if(last){
                    cssClass = {add:"rear", remove:"front"};
                    indx = vSlides.length-1;
                }else{
                    cssClass = {add:"front", remove:"rear"};
                    indx = 0;
                }
                for(var i=0; i<this.vslides.length; i++){
                   var $vslides = $(this.vslides[i]);
                    $vslides.addClass(cssClass.add).removeClass(cssClass.remove);
                }
                this._setVIndx(indx);
            }else{
                this._setVIndx(-1);
                this.vslides = undefined;
            }
        }else{
            this.vslides = undefined;
                this._setVIndx(-1);
        }
    };

    this.hasVerticalSlides = function(){
        return this.vindx>=0;
    };
    
    this.next = function(){
        var hor = !this.hasVerticalSlides();
        if(!hor){
            if(this.vslides.length>(this.vindx+1)){
                this.incVIndx(1);
            }else{
                this.setVIndx(-1);
                hor = true;
            }
        }
        if(hor){
            if(this.hslides.length>(this.hindx+1)){
                this.incHIndx(1);
            }
        }
    };

    this.previous = function(){
        var hor = !this.hasVerticalSlides();
        if(!hor){
            if((this.vindx-1)>=0){
                this.incVIndx(-1, true);
            }else{
                this.setVIndx(-1, true);
                hor = true;
            }
        }
        if(hor){
            if((this.hindx-1)>=0){
                this.incHIndx(-1, true);
            }
        }
    };

    this.setHIndx = function(hindx, toBack, vToBack){
        var e = {oldValues:{
                        hslides: this.hslides, hindx:this.hindx, 
                        vslides: this.vslides, vindx:this.vindx}, 
                 newValues:{
                        hslides: this.hslides, hindx:hindx, 
                        vslides: this.vslides, vindx:this.vindx}};
        this._setHIndx(hindx, toBack, vToBack);
        e.newValues.vindx = this.vindx;
        e.newValues.vslides= this.vslides;
        this._fireEvent('onSetCurrentSlide', e);        
    }
    
    this._setHIndx = function(hindx, toBack, vToBack){
        if(this.hindx>=0){
            if(toBack){
                $(this.hslides[this.hindx]).addClass("front").removeClass("current");
            }else{
                $(this.hslides[this.hindx]).addClass("rear").removeClass("current");
                
            }
        }
        this.hindx=hindx;

        if(this.hindx>=0){
            $(this.hslides[this.hindx]).addClass("current").removeClass("rear").removeClass("front");
            $(this.hslides[this.hindx]).scrollLeft( 0 );
        }
        
        if(vToBack===undefined){
            vToBack = toBack;
        }
        this._setVerticalSlides(vToBack);
    };
    
    this.incHIndx = function(hindx, toBack){
        this.setHIndx(this.hindx+hindx, toBack)
    };
    
    this.setVIndx = function(vindx, toBack){
        var e = {oldValues:{
                        hslides: this.hslides, hindx:this.hindx, 
                        vslides: this.vslides, vindx:this.vindx}, 
                newValues:{hslides: this.hslides, hindx:this.hindx, 
                        vslides: this.vslides, vindx:vindx}};
        this._setVIndx(vindx, toBack);
        this._fireEvent('onSetCurrentSlide', e);
    }
    
    this._setVIndx = function(vindx, toBack){
        if(this.vindx>=0){
            if(toBack){
                $(this.vslides[this.vindx]).addClass("front").removeClass("current");
            }else{
                $(this.vslides[this.vindx]).addClass("rear").removeClass("current");
            }
        }
                        
        this.vindx=vindx;

        if(this.vindx>=0){
            $(this.vslides[this.vindx]).addClass("current").removeClass("rear").removeClass("front");
            $(this.vslides[this.vindx]).scrollTop( 0 );
        }     
    };
    
    this.incVIndx = function(vindx, toBack){
        this.setVIndx(this.vindx+vindx, toBack);
    };
    
    this.setTargetIndx = function(hTarget, vTarget){
        var i=0;
        while(i<this.hslides.length && this.hslides[i]!==hTarget){
            i++;
        }
        if(i<this.hslides.length){
            if(this.hindx!=i){
                //this.setVIndx(-1);
                this.setHIndx(i, i<this.hindx, false);
                if(vTarget){
                    _setVerticalTargetIndx(vTarget);
                }
            }
        }else{
            console.error("error slide not fount (" + hTarget.id +")");
        }
    };
    
    this.addJssorSlider = function(jssorSliderId){
        if(!this.aSliders){
            this.aSliders = {};
        }
        this.aSliders[jssorSliderId] = jssor_slider1_starter(jssorSliderId);
        this.watch('onSetCurrentSlide', function(e){
            var slide,
            jssorSlider,
            oldSlide =e.oldValues.hindx!=-1
                                ?e.oldValues.hslides[e.oldValues.hindx]
                                :e.oldValues.vslides[e.oldValues.vindx];
            
            jssorSlider = $(oldSlide).find("[data-u='slider']");            
            if(jssorSlider.length){
                this.aSliders[jssorSlider.attr('id')].$Pause();
            }
            
            slide = this.hasVerticalSlides()
                                ?this.vslides[this.vindx]
                                :this.hslides[this.hindx];
            jssorSlider = $(slide).find("[data-u='slider']");
            if(jssorSlider.length){
                this.aSliders[jssorSlider.attr('id')].$Play();
                this.aSliders[jssorSlider.attr('id')].$PlayTo(0);
            }  
        });
    };

    this.hslides = $(slider).children(".slides").children("section");
    
    var vWidth = $(window).width();
    var vHeight = $(window).height();
    
    for(var i=0; i<this.hslides.length; i++){
        var $hslides = $(this.hslides[i]);
        $hslides.addClass("front");
    }

    var self = this;
    
    var _setVerticalTargetIndx = function(vTarget){
        var i=0;
        while(i<self.vslides.length && self.vslides[i]!==vTarget){
            i++;
        }
        if(i<self.vslides.length){
            if(self.vindx!=i){
                self.setVIndx(i);
            }
        }else{
            console.error("error slide not fount (" + vTarget.id +")");
        }
    };
    
    if(location.hash){
        var target = location.hash.split("__");
        self.setTargetIndx($(target[0]).get(0), $("#" + target[1]).get(0));
    }else{
        this.setHIndx(this.hslides?0:-1);        
    }
    
    $("#nextArrow").click(function(){
        self.next();
    });

    $("#prevArrow").click(function(){
        self.previous();
    });

    $(function() {
//        $('a[href*=#]:not([href=#])').click(function() {
        $('a[href|="#slc"]').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
                var targeth;
                var targetv;
                var aTarget = this.hash.split("__");
                if(aTarget.length>0){
                    targeth = $(aTarget[0]);
                    if(aTarget.length>1){
                        targetv = $("#" + aTarget[1]);
                    }
                    if (targeth.length && targetv) {
                        self.setTargetIndx(targeth.get(0), targetv.get(0));
                        return false;
                    }else if (targeth.length) {
                        self.setTargetIndx(targeth.get(0));
                        return false;
                    }
                }
            }
        });
    });

//    $(window).unload(function(e){
//        e.preventDefault();
//        if(location.hash){
//            location=location.hash;
//        }
//    });    
};
