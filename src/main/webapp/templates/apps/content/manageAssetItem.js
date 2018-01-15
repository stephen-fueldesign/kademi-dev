(function ($) {
    $(function () {
        initForm();
        initRelationFields();
    });
    
    function initForm() {
        $(".form-edit").forms({
            onSuccess: function (resp) {
                if (resp.status) {
                    Msg.info(resp.messages[0]);
                }
            }
        });
    }
    
    function initRelationFields() {
        $(document.body).on('click', '.relation-field-switcher', function (e) {
            var radio = $(this);
            var inputGroup = radio.closest('.input-group');
            var wrapper = inputGroup.closest('.relation-field-wrapper');
            
            wrapper.find('input, button').not(':radio').prop('disabled', true);
            inputGroup.find('input, button').not(':radio').prop('disabled', false);
        });
        
        $('.btn-upload-image').each(function () {
            var btn = $(this);
            var mupload = $('<div style="display: none;"></div>');
            var inputGroup = btn.closest('.input-group');
            var realInput = inputGroup.find('.relation-field-input');
            var fakeInput = inputGroup.find('.relation-field-placeholder');
            
            mupload.mupload({
                url: '/assets/',
                buttonText: '<i class="fa fa-upload"></i> Upload',
                acceptedFiles: 'image/*',
                oncomplete: function (data, name, href) {
                    realInput.val(data.result.href.replace('/assets/', ''));
                    fakeInput.val(data.name);
                }
            });
            
            btn.on('click', function (e) {
                e.preventDefault();
                
                mupload.find('.btn').trigger('click');
            });
        });
    }
    
    
})(jQuery);