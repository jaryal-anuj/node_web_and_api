$(document).on('change','#upload_profile_image',function(e){
    const that = $(this);
    let formData = new FormData();
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    formData.append('file',e.target.files[0]);
    $.ajax({
        url:"/users/upload_profile_image",
        type:"POST",
        headers:{
            'CSRF-Token': token
        },
        data:formData,
        processData:false,
        contentType:false,
        success:function(response){
            if(response.status){
                $('#profile_img_view').html('<img src="/uploads/user_'+config.user_id+'/'+response.data.filename+'" height="200px">');
                that.val('');
            }
        },
        error:function(err){
            console.log(err);
        }
    });

});


$(document).on('change','.post_images',function(e){
    const that = $(this);
    console.log(that);
    let formData = new FormData();
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    console.log([...e.target.files])
    for(let i=0;i<e.target.files.length;i++){
        formData.append('files',e.target.files[i]);
    }
    
    //formData.append('files',e.target.files[1]);
    formData.append('title','sdfsd');
    $.ajax({
        url:"/post/post_file_upload",
        type:"POST",
        headers:{
            'CSRF-Token': token
        },
        data:formData,
        processData:false,
        contentType:false,
        success:function(response){
            that.parent('div').find('div.error').remove(); 
            that.val('');
            if(response.data.length){
                let html = '<h5>Files uploaded</h5><ul>';
                for([index,file] of response.data.entries()){
                    html+=`<li>${file.originalname}<input type="text" style="display:none;" name="images[${index}]" value="${file.filename}"></li>`;
                }
                html+='</ul>';
                $('.uploaded-file').html(html);
            }

        },
        error:function(err){
            that.parent('div').find('div.error').remove(); 
            that.val('');
            that.parent('div').append('<div class="error">'+err.responseJSON.errors+'</div>')    

        }
    });

});

$(document).on('click','.image-delete-button',function(e){
    const that = $(this);
    const id = that.data('id');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    $.ajax({
        url:"/post/post_image_delete",
        type:"DELETE",
        headers:{
            'CSRF-Token': token
        },
        data:{id:id},
        success:function(response){
            that.parent('.image-delete-container').remove();

        },
        error:function(err){
 

        }
    });

});