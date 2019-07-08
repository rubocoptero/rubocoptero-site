$(document).ready(function () {
    // Navbar background on scroll

    var toggleClassPosition = 150;

    $(window).scroll(function () {
        var scrollPosition = $(window).scrollTop();
        var $nav = $("nav");

        $nav.toggleClass('scrolled', scrollPosition > toggleClassPosition);
    });

    $(".navbar-toggler").click(function() {
        var scrollPosition = $(window).scrollTop();
        var $nav = $("nav");

        if (scrollPosition < toggleClassPosition) {
          $nav.toggleClass('scrolled');
        }
    });

    // Close navbar on click when collapsed
    $(".navbar a").click(function () {
        $('.navbar-collapse').collapse('hide');
    })

    // Form submission
    $("#contact-form").submit(function(e) {
        e.preventDefault();
        var $form = $(this);

        $.post($form.attr("action"), $form.serialize())
        .then(function() {
            showSuccess();
            sendContactSubmitToAnalytics();
        });
    });

    // Fill in the context
    $("#evaluation-cta").click(function (e) {
        $("#context").val("Evaluación");
    });
    $("#training-cta").click(function (e) {
        $("#context").val("Formación");
    });
    $("#coaching-cta").click(function (e) {
        $("#context").val("Acompañamiento");
    });

    function showSuccess() {
        Swal.fire({
          titleText: '¡Enviado!',
          text: 'En breve me pondré en contacto contigo.',
          type: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#36b37e'
        });
    }

    function sendContactSubmitToAnalytics() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Contact',
          eventAction: 'submit'
        });
    }
});