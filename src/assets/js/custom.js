jQuery(document).ready(function() {
    alert("dsfsdf");

    jQuery('.testimonials').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
    });

    //*+++++++++++ Notification Js +++++++++++++++++*//
    var removeClass = true;
    jQuery(".button").click(function() {
        jQuery(".show").toggleClass('notification-open');
        removeClass = false;
    });
    jQuery("html").click(function() {
        if (removeClass) {
            jQuery(".show").removeClass('notification-open');
        }
        removeClass = true;
    });

    //*+++++++++++ Menu Sidebar Js +++++++++++++++++*//


    //*+++++++++++ Message Sidebar Js +++++++++++++++++*//
    jQuery('#messageBox').click(function() {
        jQuery('.menu-push').toggleClass('active');
        jQuery('#sidebar').toggleClass('menu-left-open');
        jQuery(this).find('i').toggleClass('fa-cog fa-times')
    });


    //*+++++++++++ Offer Send Js +++++++++++++++++*//
    jQuery(".sendbox").on('click', function() {
        jQuery(".sendoffer-box").addClass('open');
    });
    jQuery(".close-btn").click(function() {
        jQuery(".sendoffer-box").removeClass('open');
    });


    //*+++++++++++ Add Colleagues Js +++++++++++++++++*//
    jQuery(".colleague").on('click', function() {
        jQuery(".add-colleagues-box").addClass('box');
    });
    jQuery(".close-colleagues").click(function() {
        jQuery(".add-colleagues-box").removeClass('box');
    });

    i = 0;
    jQuery("#text").keyup(function() {
        var v = 140;
        var v1 = jQuery(this).val().replace(/\s/g, '').length;
        jQuery("#count").html(v1);
    });

    jQuery('.form-sliderbox').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        dots: true,
    });
});