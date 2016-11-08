(function () {

    function initReopenTask() {
        $('body').on('click', '.btn-reopen-task', function (e) {
            e.preventDefault();

            var btn = $(this);
            var taskId = btn.data('taskid');

            $.ajax({
                type: 'POST',
                data: {
                    reopenTask: taskId
                },
                success: function () {
                    reloadTasks();
                }
            });
        });
    }

    function initFileNoteEdit() {
        var noteModal = $('#editFileNoteModal');
        var noteForm = noteModal.find('form');
        $('body').on('click', '.edit-file-note', function (e) {
            e.preventDefault();

            var btn = $(this);
            var span = btn.closest('td').find('span');
            var leadId = btn.attr('href');

            noteForm.attr('action', window.location.pathname + leadId);
            noteForm.find('textarea[name=updateNotes]').val(span.html());

            noteModal.modal('show');
        });

        noteForm.forms({
            onSuccess: function () {
                reloadFileList();
                noteModal.modal('hide');
            }
        });
    }

    function reloadFileList() {
        $('#files-body').reloadFragment({
            whenComplete: function () {
                $('#files-body abbr.timeago').timeago();
            }
        });
    }

    function initUpdateUserModal() {
        var profileSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?profileSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });

        var modal = $('#modal-change-profile');
        var form = modal.find('form');

        $('#updateUserFirstName', modal).typeahead({
            highlight: true
        }, {
            display: 'firstName',
            limit: 10,
            source: profileSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing contacts were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                    '<div>'
                    + '<div>{{name}}</div>'
                    + '<div>{{phone}}</div>'
                    + '<div>{{email}}</div>'
                    + '</div><hr>')
            }
        });

        $('#updateUserFirstName', modal).bind('typeahead:select', function (ev, sug) {
            form.find('input[name=nickName]').val(sug.name);
            form.find('input[name=firstName]').val(sug.firstName);
            form.find('input[name=surName]').val(sug.surName);
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
        });

        form.forms({
            onSuccess: function (resp) {
                modal.modal('hide');
                Msg.success(resp.messages);
                $('#profile-body').reloadFragment();
            }
        });
    }

    function initFileUploads() {
        var modal = $('#uploadFileModal');
        var form = modal.find('form');

        $('body').on('click', '.upload-files', function (e) {
            e.preventDefault();

            modal.modal('show');
        });

        form.forms({
            callback: function (resp) {
                Msg.info('Files Uploaded');
                reloadFileList();
                modal.modal('hide');
            }
        });
    }

    function assignTo(name) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                assignToName: name
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Assigned");
                    $("#assignedBlock").reloadFragment();
                } else {
                    Msg.error("Sorry, we couldnt change the assignment");
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt set the visibility ' + resp);
            }
        });
    }

    function reloadTable() {
        $("#tasksTableBody").reloadFragment({
            whenComplete: function () {
                $('abbr.timeago').timeago();
            }
        });
    }

    function initNewTaskModal() {
        var modal = $("#newTaskModal");
        var form = modal.find("form");
        form.forms({
            callback: function (resp) {
                Msg.info('Created new task');
                reloadTasks();
                modal.modal("hide");
            }
        });
    }

    function setLeadDescription(val) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                description: val
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Updated");
                } else {
                    Msg.error("Sorry, we couldnt change the description");
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt set the visibility ' + resp);
            }
        });
    }

    function setDealAmount(val) {
        $.ajax({
            type: 'POST',
            url: window.location.pathname,
            data: {
                dealAmount: val
            },
            dataType: 'json',
            success: function (resp) {
                if (resp && resp.status) {
                    Msg.info("Updated");
                } else {
                    Msg.error("Sorry, we couldnt change the deal amount");
                }
            },
            error: function (resp) {
                flog('error', resp);
                Msg.error('Sorry couldnt set the visibility ' + resp);
            }
        });
    }

    function initOrgSearchTab() {
        var orgSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/leads?orgSearch=%QUERY',
                wildcard: '%QUERY'
            }
        });
        var orgTitleSearch = $('#orgTitleSearch');
        var form = orgTitleSearch.closest('.form-horizontal');
        var btnCompanyDetails = form.find('.btn-company-details');
        var btnEditCompany = form.find('.btn-edit-company');
        var btnCreateCompany = form.find('.btn-create-company');

        orgTitleSearch.typeahead({
            highlight: true
        }, {
            display: 'title',
            limit: 10,
            source: orgSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing companies were found.',
                    '</div>'
                ].join('\n'),
                suggestion: Handlebars.compile(
                    '<div>'
                    + '<strong>{{title}}</strong>'
                    + '</br>'
                    + '<span>{{phone}}</span>'
                    + '</br>'
                    + '<span>{{address}}, {{addressLine2}}, {{addressState}}, {{postcode}}</span>'
                    + '</div>')
            }
        });

        var timer;
        orgTitleSearch.bind('typeahead:render', function (ev) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var ttMenu = orgTitleSearch.siblings('.tt-menu');
                var isSuggestionAvailable = ttMenu.find('.empty-message').length === 0;

                flog('typeahead:render Is suggestion available: ' + isSuggestionAvailable, ttMenu.find('.empty-message'));

                if (isSuggestionAvailable) {
                    btnCompanyDetails.css('display', 'inline');
                    btnEditCompany.css('display', 'inline-block');
                    btnCreateCompany.css('display', 'none');
                    form.find('input[name=email]').prop('disabled', true);
                    form.find('input[name=phone]').prop('disabled', true);
                    form.find('input[name=address]').prop('disabled', true);
                    form.find('input[name=addressLine2]').prop('disabled', true);
                    form.find('input[name=addressState]').prop('disabled', true);
                    form.find('input[name=postcode]').prop('disabled', true);
                    form.find('input[name=leadOrgId]').prop('disabled', true);
                    form.find('[name=notes]').prop('disabled', true);
                    form.find('select[name=country]').prop('disabled', true);
                } else {
                    btnCompanyDetails.css('display', 'none');
                    btnEditCompany.css('display', 'none');
                    btnCreateCompany.css('display', 'inline-block');
                    form.find('input[name=email]').prop('disabled', false);
                    form.find('input[name=phone]').prop('disabled', false);
                    form.find('input[name=address]').prop('disabled', false);
                    form.find('input[name=addressLine2]').prop('disabled', false);
                    form.find('input[name=addressState]').prop('disabled', false);
                    form.find('input[name=postcode]').prop('disabled', false);
                    form.find('input[name=leadOrgId]').prop('disabled', false);
                    form.find('[name=notes]').prop('disabled', false);
                    form.find('select[name=country]').prop('disabled', false);
                }
            }, 50);
        });

        orgTitleSearch.bind('typeahead:select', function (ev, sug) {
            form.find('input[name=email]').val(sug.email);
            form.find('input[name=phone]').val(sug.phone);
            form.find('input[name=address]').val(sug.address);
            form.find('input[name=addressLine2]').val(sug.addressLine2);
            form.find('input[name=addressState]').val(sug.state);
            form.find('input[name=postcode]').val(sug.postcode);
            form.find('input[name=leadOrgId]').val(sug.orgId);
        });

        orgTitleSearch.on({
            input: function () {
                if (!this.value) {
                    form.find('input[name=email]').val('');
                    form.find('input[name=phone]').val('');
                    form.find('input[name=address]').val('');
                    form.find('input[name=addressLine2]').val('');
                    form.find('input[name=addressState]').val('');
                    form.find('input[name=postcode]').val('');
                    form.find('input[name=leadOrgId]').val('');
                    form.find('[name=notes]').val('');
                    form.find('[name=country]').val('');
                }
            }
        });
    }

    function initJobTitleSearch() {
        var jobTitleSearch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: window.location.pathname + '?jobTitle&q=%QUERY',
                wildcard: '%QUERY',
                transform: function (resp) {
                    return resp.data;
                }
            }
        });

        $('#jobTitle').typeahead({
            highlight: true
        }, {
            limit: 10,
            source: jobTitleSearch,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'No existing job title were found.',
                    '</div>'
                ].join('\n')
            }
        });
    }

    function initBodyForm() {
        var form = $("#leadDetails");
        var body = $(document.body);
        form.forms({
            callback: function (resp) {
                Msg.info('Saved');
                // reloadTable();
            }
        });

        body.on('hide.bs.modal', '.modal', function () {
            $(this).find('input, select, textarea').not(':button, :image, :reset, :submit, :hidden').val('');
        });

        body.on("change", ".dealValue", function (e) {
            var val = $(e.target).val();
            setDealAmount(val);
        });

        var createDateTimer = null;
        body.on("dp.change", "#createDate", function (e) {
            var val = $(e.target).val();

            if (e.oldDate && e.date !== e.oldDate) {
                clearTimeout(createDateTimer);
                createDateTimer = setTimeout(function () {
                    $.ajax({
                        url: window.location.pathname,
                        data: {
                            createDate: val
                        },
                        type: 'post',
                        dataType: 'json',
                        success: function (resp) {
                            flog('Resp:', resp);

                            if (resp && resp.status) {
                                Msg.success('Created date is saved!');
                            } else {
                                if (resp.messages && resp.messages.length > 0) {
                                    Msg.error(resp.messages[0]);
                                } else {
                                    Msg.error('Error when saving created date. Please contact website administrators for resolving this problem!');
                                }
                            }
                        },
                        error: function (resp) {
                            flog('Error when saving created date', resp);
                            Msg.error('Error when saving created date. Please contact website administrators for resolving this problem!');
                        }
                    });
                }, 300);
            }
        });

        body.on("change", "#description", function (e) {
            var val = $(e.target).val();
            setLeadDescription(val);
        });

        $('#leadOrgDetails').forms({
            callback: function (resp) {
                $('#leadOrgDetailsPreview').reloadFragment({
                    whenComplete: function () {
                        Msg.info('Saved');

                        var btnEditCompany = $('.btn-edit-company');
                        var btnCreateCompany = $('.btn-create-company');
                        if (btnEditCompany.length > 0) {
                            btnEditCompany.css('display', 'inline-block');
                            btnCreateCompany.css('display', 'none');
                        }
                    }
                });
            }
        });

        $('#source-select').select2({
            tags: "true"
        });

        $(document.body).off('click', '.btn-reopen').on('click', '.btn-reopen', function (e) {
            e.preventDefault();

            if (confirm('Are you sure you want to reopen this lead?')) {
                $.ajax({
                    type: 'POST',
                    data: {
                        reopenDeal: true
                    },
                    dataType: 'json',
                    success: function (resp) {
                        if (resp.status) {
                            $('#maincontentContainer').reloadFragment({
                                whenComplete: function () {
                                    $('abbr.timeago').timeago();
                                }
                            });
                        }
                    },
                    error: function () {
                        Msg.error('Oh no! Something went wrong!');
                    }
                });
            }
        });
    }

    function initAddTag() {
        $('body').on('click', '.addTag a', function (e) {
            e.preventDefault();

            var btn = $(this);
            var groupName = btn.attr('href');

            doAddToGroup(groupName);
        });
    }

    function initDeleteTag() {
        $('body').on('click', '.btn-delete-tag', function (e) {
            e.preventDefault();

            var btn = $(this);
            var href = btn.attr('href');

            if (confirm('Are you sure you want to remove this tag?')) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        deleteTag: href
                    },
                    success: function (resp) {
                        if (resp.status) {
                            reloadTags();
                        } else {
                            Msg.error("Couldnt remove tag: " + resp.messages);
                        }
                    },
                    error: function (e) {
                        Msg.error(e.status + ': ' + e.statusText);
                    }
                });
            }
        });
    }

    function doAddToGroup(groupName) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                addTag: groupName
            },
            success: function (resp) {
                if (resp.status) {
                    reloadTags();
                } else {
                    Msg.error("Couldnt add tag: " + resp.messages);
                }
            },
            error: function (e) {
                Msg.error(e.status + ': ' + e.statusText);
            }
        })

    }

    function reloadTags() {
        $('#membershipsContainer').reloadFragment();
    }

    function initLeadTimerControls() {
        flog("initLeadTimerControls");
        $("body").on("click", ".timer-btn-stop", function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "stop"
                },
                success: function () {
                    Msg.info("Stopped timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });


        $("body").on("click", ".timer-btn-do-resched", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("button");
            var modal = btn.closest(".modal");
            var dateControl = modal.find(".date-time");
            
            var timerDate = dateControl.val();
            flog("reschdule", dateControl, timerDate);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "resched",
                    "timerDate": timerDate
                },
                success: function () {
                    Msg.info("Recheduled timer. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });

        $("body").on("click", ".timer-btn-go-next", function (e) {
            e.preventDefault();
            var btn = $(e.target).closest("a");
            var nextNodeId = btn.attr("href");
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    "timerCmd": "go",
                    "nextNodeId": nextNodeId
                },
                success: function () {
                    Msg.info("Done. Reloading page");
                    window.location.reload();
                },
                error: function () {
                    Msg.error('Oh No! Something went wrong');
                }
            });
        });
    }

    function initEditCompany() {
        flog('initEditCompany');

        var btnEditCompany = $('.btn-edit-company');
        if (btnEditCompany.length > 0) {
            var modal = $('#modalEditCompany');
            var modalBody = modal.find('.modal-body');
            var form = modal.find('form');
            var btnCompanyDetails = btnEditCompany.closest('.form-horizontal').find('.btn-company-details');

            form.forms({
                onSuccess: function () {
                    $('#leadOrgDetailsPreview').reloadFragment({
                        whenComplete: function () {
                            Msg.success('Company details is saved!');
                            modal.modal('hide');
                        }
                    });
                }
            });

            btnEditCompany.on('click', function (e) {
                e.preventDefault();

                modal.modal('show');
                modalBody.html('Loading...');
                modalBody.load(btnCompanyDetails.attr('href') + ' #leadOrgDetails > *')
            });
        }
    }

    // Run init functions
    $(function () {
        initNewTaskModal();
        initFileUploads();
        initFileNoteEdit();
        initUpdateUserModal();
        initOrgSearchTab();
        initReopenTask();
        initBodyForm();
        initAddTag();
        initDeleteTag();
        initJobTitleSearch();
        initLeadTimerControls();
        initEditCompany();
    });
})();