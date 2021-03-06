function initManageWebsites() {
    flog('initManageWebsites');

    initAddWebsite();
    initRename();
    initSwitchPublic();
}

function initAddWebsite() {
    flog('initAddWebsite');

    var modal = $("#addWebsiteModal");
    var form = modal.find("form");

    form.forms({
        onSuccess: function (resp) {
            flog("done", resp);
            modal.modal('hide');
            Msg.success("Created website " + form.find('[name=newName]').val());
            var nextHref = "/websites/" + resp.nextHref + "/";
            window.location = nextHref;
        }
    });
}

function initRename() {
    flog('initRename');
    var modal = $("#renameWebsiteModal");
    var form = modal.find("form");

    $('body').on('click', '.btn-rename-website', function (e) {
        e.preventDefault();
        var btn = $(this);
        var href = btn.attr('href');
        form.find('#newWebName').val(href).trigger('focus');
        modal.modal('show');
        form.forms({
            allowPostForm: false,
            onValid: function (form, config) {
                doRename(window.location.pathname + href, form.find('#newWebName').val(), function () {
                    $('#website-wrapper').reloadFragment({
                        whenComplete: function () {
                            modal.modal('hide');
                            initSwitch();
                        }
                    });
                });
            }
        });

    });
}

function initSwitchPublic() {
    flog('initSwitchPublic');

    $(document.body).on('change switchChange', 'td.public input', function (e) {
        flog("switch", e.target);
        e.preventDefault();

        var label = $(this);
        var wrapper = label.parents('.make-switch');
        var href = wrapper.attr('data-link');

        setTimeout(function () {
            var isChecked = wrapper.find('input:checked').val() === 'true';
            flog("checked=", isChecked);
            setRepoPublicAccess(href, isChecked);
        }, 0);
    });
}

function setRepoPublicAccess(href, isPublic) {
    $.ajax({
        type: 'POST',
        data: {isPublic: isPublic},
        url: href,
        success: function (data) {
        },
        error: function (resp) {
            flog("error updating: ", href, resp);
            Msg.error('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}

function doRename(href, newName, callback) {
    var newUrl = getParentHref(href) + "/" + newName;
    var targetUrl = href;
    if (!targetUrl.endsWith("/")) {
        targetUrl += "/";
    }
    targetUrl += "_DAV/MOVE";
    flog("renameFile2", newUrl);
    $.ajax({
        type: 'POST',
        url: targetUrl,
        dataType: 'text',
        data: "destination=" + newUrl,
        success: function () {
            flog('success');
            if (callback) {
                log("callback1");
                callback();
            }
            Msg.success('Success');
        },
        error: function (resp) {
            flog("failed", resp);
            ajaxLoadingOff();
            Msg.error("Failed to rename website, a website with that name might already exist.");
        }
    });
}