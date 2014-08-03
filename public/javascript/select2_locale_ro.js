/**
 * Select2 Romanian translation.
 */
(function ($) {
    "use strict";

    $.fn.select2.locales['ro'] = {
        formatNoMatches: function () { return "Nu a fost gasit nimic"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Va rugam sa introduceti inca " + n + " caracter" + (n == 1 ? "" : "e"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Va rugam sa introduceti mai putin de " + n + " caracter" + (n == 1? "" : "e"); },
        formatSelectionTooBig: function (limit) { return "Aveti voie sa selectati cel mult " + limit + " element" + (limit == 1 ? "" : "e"); },
        formatLoadMore: function (pageNumber) { return "Se incarca…"; },
        formatSearching: function () { return "Cautare…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['ro']);
})(jQuery);
