function initManageRepos() {
    log('initManageRepositories');

    var tableWrapper = $('#table-repo');
    var modal = $('#modal-new-repo');
    $('.btn-add-repo').on('click', function(e) {
        e.preventDefault();
        modal.modal('show');
    });

    modal.find('form').forms({
        callback: function(resp) {
            Msg.success($('#newName').val() + ' is created!');
            tableWrapper.reloadFragment({
                whenComplete: function () {
                    initSwitch();
                }
            });
            modal.modal('hide');
        }
    });

    tableWrapper.on('click', 'a.btn-delete-repo', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = getFileName(href);

        confirmDelete(href, name, function() {
            Msg.success('Repository "' + name + '" is deleted');
            btn.closest('tr').remove();
        });
    });
    
    tableWrapper.on('click', 'a.transfer-ownership', function(e) {
        e.preventDefault();

        var btn = $(this);
        var href = btn.attr('href');
        var name = getFileName(href);

        var destAdminDomain = prompt("Please enter the admin domain to transfer this repository to");
        if( destAdminDomain !== null ) {
            if( confirm("Are you sure you want to transfer ownership of the " + name + " repository? This action cannot be undone") ) {
                doTransferOwnership( href, destAdminDomain);
            }
        }
    });    

    flog("init switch", $('td.public input'));
    $('td.public input').on('change switchChange', function(e) {
        flog("switch", e.target);
        e.preventDefault();

        var label = $(this);
        var wrapper = label.parents('.make-switch');

        setTimeout(function() {
            var isChecked = wrapper.find('input:checked').val() === 'true';
            flog("checked=", isChecked);
            var href = wrapper.closest("tr").find("a.repo").attr("href");
            setRepoPublicAccess(href, isChecked);
        }, 0);
    });
}

function doTransferOwnership(href, destAdminDomain) {
    $.ajax({
        type: 'POST',
        data: {destAdminDomain: destAdminDomain},
        url: href,
        success: function(data) {
            alert("Ownership has been transferred");
            window.location.reload();
        },
        error: function(resp) {
            flog("error updating: ", href, resp);
            Msg.error('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}

function setRepoPublicAccess(href, isPublic) {
    $.ajax({
        type: 'POST',
        data: {isPublic: isPublic},
        url: href,
        success: function(data) {
        },
        error: function(resp) {
            flog("error updating: ", href, resp);
            Msg.error('Sorry, couldnt update public access: ' + resp);
            window.location.reload();
        }
    });
}