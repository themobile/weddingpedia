/*! 
 * medium-editor-insert-plugin v0.2.7 - jQuery insert plugin for MediumEditor
 *
 * https://github.com/orthes/medium-editor-insert-plugin
 *
 * Copyright (c) 2014 Pavel Linkesch (http://linkesch.sk)
 * Released under the MIT license
 */

!function (a) {
    var b = {};
    MediumEditor && "function" == typeof MediumEditor && (MediumEditor.prototype.serialize = function () {
        var b, c, d, e, f, g, h, i, j = {};
        for (b = 0; b < this.elements.length; b += 1) {
            for (d = "" !== this.elements[b].id ? this.elements[b].id : "element-" + b, e = a(this.elements[b]).clone(), f = a(".mediumInsert", e), c = 0; c < f.length; c++) g = a(f[c]), h = a(".mediumInsert-placeholder", g).children(), 0 === h.length ? g.remove() : (g.removeAttr("contenteditable"), a("img[draggable]", g).removeAttr("draggable"), g.hasClass("small") && h.addClass("small"), a(".mediumInsert-buttons", g).remove(), h.unwrap());
            i = e.html().trim(), j[d] = {
                value: i
            }
        }
        return j
    }, MediumEditor.prototype.deactivate = function () {
        var b;
        if (!this.isActive) return !1;
        for (this.isActive = !1, void 0 !== this.toolbar && (this.toolbar.style.display = "none"), document.documentElement.removeEventListener("mouseup", this.checkSelectionWrapper), b = 0; b < this.elements.length; b += 1) this.elements[b].removeEventListener("keyup", this.checkSelectionWrapper), this.elements[b].removeEventListener("blur", this.checkSelectionWrapper), this.elements[b].removeAttribute("contentEditable");
        a.fn.mediumInsert.insert.$el.mediumInsert("disable")
    }, MediumEditor.prototype.activate = function () {
        var b;
        if (this.isActive) return !1;
        for (void 0 !== this.toolbar && (this.toolbar.style.display = "block"), this.isActive = !0, b = 0; b < this.elements.length; b += 1) this.elements[b].setAttribute("contentEditable", !0);
        this.bindSelect(), a.fn.mediumInsert.insert.$el.mediumInsert("enable")
    }), a.fn.mediumInsert = function (c) {
        return "string" == typeof c && a.fn.mediumInsert.insert[c] ? void a.fn.mediumInsert.insert[c]() : (a.fn.mediumInsert.settings = a.extend(a.fn.mediumInsert.settings, c), this.each(function () {
            a(this).addClass("medium-editor-insert-plugin");
            var c = "p, h1, h2, h3, h4, h5, h6, ol, ul, blockquote";
            a(this).on("dragover drop", c, function (a) {
                return a.preventDefault(), !1
            }), a.fn.mediumInsert.insert.init(a(this)), a.each(a.fn.mediumInsert.settings.addons, function (c) {
                var d = a.fn.mediumInsert.settings.addons[c];
                d.$el = a.fn.mediumInsert.insert.$el, b[c].init(d)
            })
        }))
    }, a.fn.mediumInsert.settings = {
        enabled: !0,
        addons: {
            images: {},
            embeds: {}
        }
    }, a.fn.mediumInsert.registerAddon = function (a, c) {
        b[a] = c
    }, a.fn.mediumInsert.getAddon = function (a) {
        return b[a]
    }, a.fn.mediumInsert.insert = {
        init: function (a) {
            this.$el = a, this.isFirefox = navigator.userAgent.match(/firefox/i), this.setPlaceholders(), this.setEvents()
        },
        deselect: function () {
            document.getSelection().removeAllRanges()
        },
        disable: function () {
            a.fn.mediumInsert.settings.enabled = !1, a.fn.mediumInsert.insert.$el.find(".mediumInsert-buttons").addClass("hide")
        },
        enable: function () {
            a.fn.mediumInsert.settings.enabled = !0, a.fn.mediumInsert.insert.$el.find(".mediumInsert-buttons").removeClass("hide")
        },
        getMaxId: function () {
            var b = -1;
            return a('div[id^="mediumInsert-"]').each(function () {
                var c = parseInt(a(this).attr("id").split("-")[1], 10);
                c > b && (b = c)
            }), b
        },
        getButtons: function (c) {
            var d = a.fn.mediumInsert.settings.editor,
                e = d && d.options ? d.options.buttonLabels : "",
                f = '<div class="mediumInsert-buttons"><a class="mediumInsert-buttonsShow">+</a><ul class="mediumInsert-buttonsOptions medium-editor-toolbar medium-editor-toolbar-active">';
            return 0 === Object.keys(a.fn.mediumInsert.settings.addons).length ? !1 : ("undefined" == typeof c ? a.each(a.fn.mediumInsert.settings.addons, function (a) {
                f += "<li>" + b[a].insertButton(e) + "</li>"
            }) : f += "<li>" + b[c].insertButton(e) + "</li>", f += "</ul></div>")
        },
        setPlaceholders: function () {
            var b = this,
                c = a.fn.mediumInsert.insert.$el,
                d = a.fn.mediumInsert.settings.editor,
                e = (d && d.options ? d.options.buttonLabels : "", this.getButtons());
            return e === !1 ? !1 : (e = '<div class="mediumInsert" contenteditable="false">' + e + '<div class="mediumInsert-placeholder"></div></div>', c.is(":empty") && c.html("<p><br></p>"), void c.keyup(function () {
                var d, f = c.children(":last");
                ("" === c.html() || "<br>" === c.html()) && c.html("<p><br></p>"), f.hasClass("mediumInsert") && f.find(".mediumInsert-placeholder").children().length > 0 && c.append("<p><br></p>"), this.isFirefox && a(".mediumInsert .mediumInsert-placeholder:empty", c).each(function () {
                    a(this).parent().remove()
                }), d = b.getMaxId() + 1;
                var g = "p, h1, h2, h3, h4, h5, h6, ol, ul, blockquote";
                c.children(g).each(function () {
                    a(this).next().hasClass("mediumInsert") === !1 && (a(this).after(e), a(this).next(".mediumInsert").attr("id", "mediumInsert-" + d)), d++
                })
            }).keyup())
        },
        setEvents: function () {
            var c = this,
                d = a.fn.mediumInsert.insert.$el;
            d.on("selectstart", ".mediumInsert", function (a) {
                return a.preventDefault(), !1
            }), d.on("blur", function () {
                var b, c = a(this).clone();
                c.find(".mediumInsert").remove(), b = c.html().replace(/^\s+|\s+$/g, ""), ("" === b || "<p><br></p>" === b) && a(this).addClass("medium-editor-placeholder")
            }), d.on("keypress", function (a) {
                if (c.isFirefox && 13 === a.keyCode) {
                    d.contents().each(function () {
                        return function (a, b) {
                            return "#text" === b.nodeName ? (document.execCommand("insertHTML", !1, "<p>" + b.data + "</p>"), b.remove()) : void 0
                        }
                    }(this));
                    var b = d.find("p").last();
                    b.text().length > 0 && b.find("br").remove()
                }
            }), d.on("keydown", function (a) {
                return navigator.userAgent.match(/chrome/i) && (d.children().last().removeClass("hide"), (a.ctrlKey || a.metaKey) && 65 === a.which) ? (a.preventDefault(), 0 === d.find("p").text().trim().length ? !1 : (d.children().last().addClass("hide"), document.execCommand("selectAll", !1, null))) : void 0
            }), d.on("click", ".mediumInsert-buttons a.mediumInsert-buttonsShow", function () {
                var b = a(this).siblings(".mediumInsert-buttonsOptions"),
                    d = a(this).parent().siblings(".mediumInsert-placeholder");
                a(this).hasClass("active") ? (a(this).removeClass("active"), b.hide(), a("a", b).show()) : (a(this).addClass("active"), b.show(), a("a", b).each(function () {
                    var c = a(this).attr("class").split("action-")[1],
                        e = c.split("-")[0];
                    a(".mediumInsert-" + e, d).length > 0 && a("a:not(.action-" + c + ")", b).hide()
                })), c.deselect()
            }), d.on("mouseleave", ".mediumInsert", function () {
                a("a.mediumInsert-buttonsShow", this).removeClass("active"), a(".mediumInsert-buttonsOptions", this).hide()
            }), d.on("click", ".mediumInsert-buttons .mediumInsert-action", function (c) {
                c.preventDefault();
                var d = a(this).data("addon"),
                    e = a(this).data("action"),
                    f = a(this).parents(".mediumInsert-buttons").siblings(".mediumInsert-placeholder");
                b[d] && b[d][e] && b[d][e](f), a(this).parents(".mediumInsert").mouseleave()
            })
        }
    }
}(jQuery),
    function (a) {
        a.fn.mediumInsert.registerAddon("images", {
            "default": {
                useDragAndDrop: !0,
                imagesUploadScript: "upload.php",
                imagesDeleteScript: "delete.php",
                formatData: function (a) {
                    var b = new FormData;
                    return b.append("file", a), b
                },
                uploadFile: function (b, c, d) {
                    a.ajax({
                        type: "post",
                        url: d.options.imagesUploadScript,
                        xhr: function () {
                            var a = new XMLHttpRequest;
                            return a.upload.onprogress = d.updateProgressBar, a
                        },
                        cache: !1,
                        contentType: !1,
                        complete: function (a) {
                            d.uploadCompleted(a, b)
                        },
                        processData: !1,
                        data: d.options.formatData(c)
                    })
                },
                deleteFile: function (b, c) {
                    a.ajax({
                        type: "post",
                        url: c.options.imagesDeleteScript,
                        data: {
                            file: b
                        }
                    })
                }
            },
            init: function (b) {
                b && b.$el && (this.$el = b.$el), this.options = a.extend(this.
                    default, b), this.setImageEvents(), this.options.useDragAndDrop === !0 && this.setDragAndDropEvents(), this.preparePreviousImages()
            },
            insertButton: function (a) {
                var b = "Img";
                return ("fontawesome" == a || "object" == typeof a && a.fontawesome) && (b = '<i class="fa fa-picture-o"></i>'), '<button data-addon="images" data-action="add" class="medium-editor-action mediumInsert-action">' + b + "</button>"
            },
            preparePreviousImages: function () {
                this.$el.find(".mediumInsert-images").each(function () {
                    var b = a(this).parent();
                    b.html(a.fn.mediumInsert.insert.getButtons("images") + '<div class="mediumInsert-placeholder" draggable="true">' + b.html() + "</div>")
                })
            },
            add: function (b) {
                var c, d, e = this;
                return c = a('<input type="file">').click(), c.change(function () {
                    d = this.files, e.uploadFiles(b, d, e)
                }), a.fn.mediumInsert.insert.deselect(), c
            },
            updateProgressBar: function (b) {
                var c, d = a(".progress:first", this.$el);
                b.lengthComputable && (c = b.loaded / b.total * 100, c = c ? c : 0, d.attr("value", c), d.html(c))
            },
            uploadCompleted: function (b, c) {
                var d, e = a(".progress:first", c);
                e.attr("value", 100), e.html(100), b.responseText ? (e.before('<figure class="mediumInsert-images"><img src="' + b.responseText + '" draggable="true" alt=""></figure>'), d = e.siblings("img"), d.load(function () {
                    d.parent().mouseleave().mouseenter()
                })) : (e.before('<div class="mediumInsert-error">There was a problem uploading the file.</div>'), setTimeout(function () {
                    a(".mediumInsert-error:first", c).fadeOut(function () {
                        a(this).remove()
                    })
                }, 3e3)), e.remove(), c.closest("[data-medium-element]").trigger("keyup").trigger("input")
            },
            uploadFile: function (a, b, c) {
                return c.options.uploadFile(a, b, c)
            },
            uploadFiles: function (a, b, c) {
                for (var d = {
                    "image/png": !0,
                    "image/jpeg": !0,
                    "image/gif": !0
                }, e = 0; e < b.length; e++) {
                    var f = b[e];
                    d[f.type] === !0 && (a.append('<progress class="progress" min="0" max="100" value="0">0</progress>'), c.uploadFile(a, f, c))
                }
            },
            deleteFile: function (a, b) {
                return b.options.deleteFile(a, b)
            },
            setImageEvents: function () {
                var b = this;
                this.$el.on("mouseenter", ".mediumInsert-images", function () {
                    var b, c, d = a("img", this);
                    a.fn.mediumInsert.settings.enabled !== !1 && d.length > 0 && (a(this).append('<a class="mediumInsert-imageRemove"></a>'), a(this).append(a(this).parent().parent().hasClass("small") ? '<a class="mediumInsert-imageResizeBigger"></a>' : '<a class="mediumInsert-imageResizeSmaller"></a>'), b = d.position().top + parseInt(d.css("margin-top"), 10), c = d.position().left + d.width() - 30, a(".mediumInsert-imageRemove", this).css({
                        right: "auto",
                        top: b,
                        left: c
                    }), a(".mediumInsert-imageResizeBigger, .mediumInsert-imageResizeSmaller", this).css({
                        right: "auto",
                        top: b,
                        left: c - 31
                    }))
                }), this.$el.on("mouseleave", ".mediumInsert-images", function () {
                    a(".mediumInsert-imageRemove, .mediumInsert-imageResizeSmaller, .mediumInsert-imageResizeBigger", this).remove()
                }), this.$el.on("click", ".mediumInsert-imageResizeSmaller", function () {
                    a(this).parent().parent().parent().addClass("small"), a(this).parent().mouseleave().mouseleave(), a.fn.mediumInsert.insert.deselect(), b.$el.closest("[data-medium-element]").trigger("keyup").trigger("input")
                }), this.$el.on("click", ".mediumInsert-imageResizeBigger", function () {
                    a(this).parent().parent().parent().removeClass("small"), a(this).parent().mouseleave().mouseleave(), a.fn.mediumInsert.insert.deselect(), b.$el.closest("[data-medium-element]").trigger("keyup").trigger("input")
                }), this.$el.on("click", ".mediumInsert-imageRemove", function () {
                    var c = a(this).siblings("img").attr("src");
                    0 === a(this).parent().siblings().length && a(this).parent().parent().parent().removeClass("small"), a(this).parent().remove(), b.deleteFile(c, b), a.fn.mediumInsert.insert.deselect(), b.$el.closest("[data-medium-element]").trigger("keyup").trigger("input")
                })
            },
            setDragAndDropEvents: function () {
                var b, c, d = this,
                    e = !1,
                    f = !1;
                a(document).on("dragover", "body", function () {
                    a.fn.mediumInsert.settings.enabled !== !1 && d.$el.addClass("hover")
                }), a(document).on("dragend", "body", function () {
                    a.fn.mediumInsert.settings.enabled !== !1 && d.$el.removeClass("hover")
                }), this.$el.on("dragover", ".mediumInsert", function () {
                    a.fn.mediumInsert.settings.enabled !== !1 && (a(this).addClass("hover"), a(this).attr("contenteditable", !0))
                }), this.$el.on("dragleave", ".mediumInsert", function () {
                    a.fn.mediumInsert.settings.enabled !== !1 && (a(this).removeClass("hover"), a(this).attr("contenteditable", !1))
                }), this.$el.on("dragstart", ".mediumInsert .mediumInsert-images img", function () {
                    a.fn.mediumInsert.settings.enabled !== !1 && (b = a(this).parent().index(), c = a(this).parent().parent().parent().attr("id"))
                }), this.$el.on("dragend", ".mediumInsert .mediumInsert-images img", function (b) {
                    a.fn.mediumInsert.settings.enabled !== !1 && e === !0 && (0 === a(b.originalEvent.target.parentNode).siblings().length && a(b.originalEvent.target.parentNode).parent().parent().removeClass("small"), a(b.originalEvent.target.parentNode).mouseleave(), a(b.originalEvent.target.parentNode).remove(), e = !1, f = !1, d.$el.closest("[data-medium-element]").trigger("keyup").trigger("input"))
                }), this.$el.on("dragover", ".mediumInsert .mediumInsert-images img", function (b) {
                    a.fn.mediumInsert.settings.enabled !== !1 && b.preventDefault()
                }), this.$el.on("drop", ".mediumInsert .mediumInsert-images img", function () {
                    var e, g, h;
                    if (a.fn.mediumInsert.settings.enabled !== !1) {
                        if (c !== a(this).parent().parent().parent().attr("id")) return f = !1, void(b = c = null);
                        e = parseInt(b, 10), g = a(this).parent().parent().find(".mediumInsert-images:nth-child(" + (e + 1) + ")"), h = a(this).parent().index(), h > e ? g.insertAfter(a(this).parent()) : e > h && g.insertBefore(a(this).parent()), g.mouseleave(), f = !0, b = null, d.$el.closest("[data-medium-element]").trigger("keyup").trigger("input")
                    }
                }), this.$el.on("drop", ".mediumInsert", function (b) {
                    var c;
                    b.preventDefault(), a.fn.mediumInsert.settings.enabled !== !1 && (a(this).removeClass("hover"), d.$el.removeClass("hover"), a(this).attr("contenteditable", !1), c = b.originalEvent.dataTransfer.files, c.length > 0 ? d.uploadFiles(a(".mediumInsert-placeholder", this), c, d) : f === !0 ? f = !1 : (a(".mediumInsert-placeholder", this).append('<figure class="mediumInsert-images">' + b.originalEvent.dataTransfer.getData("text/html") + "</figure>"), a("meta", this).remove(), e = !0))
                })
            }
        })
    }(jQuery),
    function (a) {
        a.fn.mediumInsert.registerAddon("maps", {
            init: function () {
                this.$el = a.fn.mediumInsert.insert.$el
            },
            insertButton: function (a) {
                var b = "Map";
                return ("fontawesome" == a || "object" == typeof a && a.fontawesome) && (b = '<i class="fa fa-map-marker"></i>'), '<button data-addon="maps" data-action="add" class="medium-editor-action mediumInsert-action">' + b + "</button>"
            },
            add: function (b) {
                a.fn.mediumInsert.insert.deselect(), b.append('<div class="mediumInsert-maps">Map - Coming soon...</div>')
            }
        })
    }(jQuery),
    function (a) {
        a.fn.mediumInsert.registerAddon("embeds", {
            "default": {
                urlPlaceholder: "type or paste url here"
            },
            init: function (b) {
                this.options = a.extend(this.
                    default, b), this.$el = a.fn.mediumInsert.insert.$el, this.setEmbedButtonEvents(), this.preparePreviousEmbeds()
            },
            insertButton: function (a) {
                var b = "Embed";
                return ("fontawesome" == a || "object" == typeof a && a.fontawesome) && (b = '<i class="fa fa-code"></i>'), '<button data-addon="embeds" data-action="add" class="medium-editor-action mediumInsert-action">' + b + "</button>"
            },
            add: function (b) {
                a.fn.mediumInsert.insert.deselect();
                var c = '<div class="medium-editor-toolbar-form-anchor mediumInsert-embedsWire" style="display: block;"><input type="text" value="" placeholder="' + this.options.urlPlaceholder + '" class="mediumInsert-embedsText"></div>';
                a(c).appendTo(b.prev()), setTimeout(function () {
                    b.prev().find("input").focus()
                }, 50), a.fn.mediumInsert.insert.deselect(), this.currentPlaceholder = b, a(".mediumInsert-embedsText").focus()
            },
            preparePreviousEmbeds: function () {
                this.$el.find(".mediumInsert-embeds").each(function () {
                    var b = a(this).parent();
                    b.html('<div class="mediumInsert-placeholder" draggable="true">' + b.html() + "</div>")
                })
            },
            setEmbedButtonEvents: function () {
                var b = this;
                a(document).on("keypress", "input.mediumInsert-embedsText", function (a) {
                    (a.which && 13 == a.which || a.keyCode && 13 == a.keyCode) && (b.setEnterActionEvents(), b.removeToolbar())
                }), this.$el.on("blur", ".mediumInsert-embedsText", function () {
                    b.removeToolbar()
                })
            },
            setEnterActionEvents: function () {
                var b = this;
                if (a.fn.mediumInsert.settings.enabled === !1) return !1;
                var c = a("input.mediumInsert-embedsText").val();
                if (!c) return !1;
                var d = b.convertUrlToEmbedTag(c);
                return d ? (d = a('<div class="mediumInsert-embeds"></div>').append(d), b.currentPlaceholder.append(d), b.currentPlaceholder.closest("[data-medium-element]").trigger("keyup").trigger("input"), void 0) : (alert("Incorrect URL format specified"), !1)
            },
            removeToolbar: function () {
                a(".mediumInsert-embedsWire").remove()
            },
            convertUrlToEmbedTag: function (a) {
                var b = a.replace(/\n?/g, "").replace(/^((http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|v\/)?)([a-zA-Z0-9-_]+)(.*)?$/, '<div class="video"><iframe width="420" height="315" src="//www.youtube.com/embed/$7" frameborder="0" allowfullscreen></iframe></div>').replace(/http:\/\/vimeo\.com\/(\d+)$/, '<iframe src="//player.vimeo.com/video/$1" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').replace(/http:\/\/instagram\.com\/p\/(.+)\/?$/, '<span class="instagram"><iframe src="//instagram.com/p/$1/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe></span>');
                return /<("[^"]*"|'[^']*'|[^'">])*>/.test(b) ? b : !1
            }
        })
    }(jQuery),
    function (a) {
        a.fn.mediumInsert.registerAddon("tables", {
            "default": {
                defaultRows: 2,
                defaultCols: 2
            },
            init: function (b) {
                this.options = a.extend(this.
                    default, b), this.$el = a.fn.mediumInsert.insert.$el, this.setTableButtonEvents()
            },
            insertButton: function (a) {
                var b = "Table";
                return ("fontawesome" == a || "object" == typeof a && a.fontawesome) && (b = '<i class="fa fa-table"></i>'), '<button data-addon="tables" data-action="add" class="medium-editor-action mediumInsert-action">' + b + "</button>"
            },
            add: function (b) {
                a.fn.mediumInsert.insert.deselect();
                var c = '<div class="medium-editor-toolbar-form-anchor mediumInsert-tableDemoBox"><table><tr><td></td><td><label>cols:<input type="text" value="' + this.options.defaultCols + '" class="mediumInsert-tableCols" /></label></td></tr><tr><td><label>rows:<input type="text" value="' + this.options.defaultRows + '" class="mediumInsert-tableRows" /></label></td><td><table class="mediumInsert-demoTable"></table></td></tr><tr><td></td><td><label><button class="mediumInsert-tableReadyButton">insert</button></label></td></tr></table></</div>';
                a(c).appendTo(b.prev()), this.updateDemoTable(), setTimeout(function () {
                    b.prev().find("input").focus()
                }, 50), a.fn.mediumInsert.insert.deselect(), this.currentPlaceholder = b
            },
            setTableButtonEvents: function () {
                var b = this;
                a(document).on("keyup", "input.mediumInsert-tableRows, input.mediumInsert-tableCols", function () {
                    b.updateDemoTable()
                }), a(document).on("click", function (c) {
                    0 === a(c.target).parents(".mediumInsert-buttons").length && b.removeToolbar()
                }), a(document).on("click", "button.mediumInsert-tableReadyButton", function () {
                    b.setEnterActionEvents(), b.removeToolbar()
                })
            },
            getDimensions: function () {
                return {
                    rows: parseFloat(a("input.mediumInsert-tableRows").val()) || 1,
                    cols: parseFloat(a("input.mediumInsert-tableCols").val()) || 1
                }
            },
            buildTable: function (b) {
                var c, d, e, f = this.getDimensions(),
                    g = a(b);
                for (c = 0; c < f.rows; c++) {
                    for (e = a("<tr>"), d = 0; d < f.cols; d++) e.append("<td>");
                    g.append(e)
                }
            },
            updateDemoTable: function () {
                var b = a("table.mediumInsert-demoTable");
                b.empty(), this.buildTable(b)
            },
            setEnterActionEvents: function () {
                var b = this;
                if (a.fn.mediumInsert.settings.enabled === !1) return !1;
                var c = a('<table class="mediumInsert-table">');
                b.buildTable(c), b.currentPlaceholder.parent().after(c), b.currentPlaceholder.closest("[data-medium-element]").trigger("keyup").trigger("input")
            },
            removeToolbar: function () {
                a(".mediumInsert-tableDemoBox").remove()
            }
        })
    }(jQuery);