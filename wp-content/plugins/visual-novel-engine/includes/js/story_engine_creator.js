function onChangeNodeType(element){
    updateJsonString();
    const node_tyṕe = jQuery(element).find(".node_type_select").val();
    jQuery(element).attr('node_type', node_tyṕe)
    jQuery(element).find('.contents > *').hide();
    var elementInputsRoot = undefined;
    switch(node_tyṕe){
        case 'set_background':
                elementInputsRoot = '.contents .set_background';

                jQuery(element).find(elementInputsRoot).show();                
                var url_val = jQuery(element).find(elementInputsRoot + ' .url_input').val();
                jQuery(element).find(elementInputsRoot + ' .background_preview').attr('src', url_val);

                jQuery(element).find(elementInputsRoot + ' .url_input').off('input').on('input', () => {
                    url_val = jQuery(element).find(elementInputsRoot + ' .url_input').val();
                    jQuery(element).find(elementInputsRoot + ' .background_preview').attr('src', url_val);

                    updateJsonString();
                });
            break;
        case 'show_narration':
                elementInputsRoot = '.contents .show_narration';

                jQuery(element).find(elementInputsRoot).show();                
                var text_val = jQuery(element).find(elementInputsRoot + ' .text_input').val();

                jQuery(element).find(elementInputsRoot + ' .text_input').off('input').on('input', () => {
                    updateJsonString();
                });
            break;
        case 'define_actor':
                elementInputsRoot = '.contents .define_actor';

                jQuery(element).find(elementInputsRoot).show();                

                var url_val = jQuery(element).find(elementInputsRoot + ' .url').val();
                jQuery(element).find(elementInputsRoot + ' .actor_preview').attr('src', url_val);

                const face_preview = jQuery(element).find(elementInputsRoot + ' .face_preview');
                const setMugShot = (url) => {
                    jQuery(face_preview).css('background-image', 'url(' + url + ')');

                    const scale = jQuery(element).find(elementInputsRoot + ' .scale').val() ?? 0.5;
                    const x = jQuery(element).find(elementInputsRoot + ' .x').val() ?? 0;
                    const y = jQuery(element).find(elementInputsRoot + ' .y').val() ?? 0;
                    const size = (1/scale) * 100;
                    jQuery(face_preview).css('width', `${size}px`);
                    jQuery(face_preview).css('height', `${size}px`);
                    jQuery(face_preview).css('transform', `scale(${scale}) `);
                    jQuery(face_preview).css('transform-origin', '0% 100%');
                    jQuery(face_preview).css('background-position', `${x*100}% ${y*100}%`);
                }

                jQuery(face_preview).css('background-image', 'url(' + url_val + ')');

                jQuery(element).find(elementInputsRoot).find('.url').off('change').on('change', (event) => {
                    jQuery(element).find('.actor_preview').attr('src', jQuery(event.target).val());
                })

                setMugShot(jQuery(element).find(elementInputsRoot).find('.url').val());

                jQuery(element).find(elementInputsRoot).find('.url, .name, .slug, .scale, .x, .y').off('input').on('input', () => {
                    updateJsonString();
                    setMugShot(jQuery(element).find(elementInputsRoot).find('.url').val());
                });
            break;
    }
}

function attachEventsOnNodes(){
    jQuery(".scene_nodes .scene_node").each((index, element) => {
        jQuery(element).find(".node_type_select").off('change').on('change', () => {
            onChangeNodeType(element);
            const node_tyṕe = jQuery(element).find(".node_type_select").val();
        })
  
        onChangeNodeType(element);
  
        jQuery(element).find(".delete_node_btn").off('click').on('click', () => {
            //delete element
            jQuery(element).remove();
            onChangeNodeType(element);
        });
    });

    jQuery( ".scene_nodes" ).sortable({
        stop: (event, ui) => {
            updateJsonString();
        },
        // handle: ".handler"
    });
  }

function updateJsonString(){
    const scenes_nodes = [];

    jQuery('.scene_nodes .scene_node').each((index, element) => {
        const type = jQuery(element).find('.node_type_select').val();
        switch(type){
            case 'set_background':
                scenes_nodes.push({
                    node_type: 'set_background',
                    url: jQuery(element).find('.contents .set_background .url_input').val()
                })
                break;
            case 'show_narration':
                scenes_nodes.push({
                    node_type: 'show_narration',
                    text: jQuery(element).find('.contents .show_narration .text_input').val()
                })
                break;
            case 'define_actor':
                scenes_nodes.push({
                    node_type: 'define_actor',
                    url: jQuery(element).find('.contents .define_actor .url').val(),
                    name: jQuery(element).find('.contents .define_actor .name').val(),
                    slug: jQuery(element).find('.contents .define_actor .slug').val(),
                    face_point: {
                        scale: jQuery(element).find('.contents .define_actor .scale').val(),
                        x: jQuery(element).find('.contents .define_actor .x').val(),
                        y: jQuery(element).find('.contents .define_actor .y').val(),
                    }
                })
                break;
            default:
                scenes_nodes.push({
                    node_type: type,
                })
        }
    })

    jQuery("#scenes_nodes_json").val(JSON.stringify(scenes_nodes));
}

jQuery( document ).ready(() => {
    jQuery(".scene_nodes .scene_node").each((index, element) => {
        onChangeNodeType(element);
    });
    attachEventsOnNodes();

    jQuery("#add_scene_node_btn").on('click', () => {
        //make a JS call do wordpress ajax with action lalaps
        jQuery.ajax({
            url: ajaxurl, // Use the WordPress AJAX URL
            type: 'POST',
            data: {
                action: 'get_vne_node_template' // WordPress action name
                // You can add additional data here if needed
            },
            success: function(response) {
                jQuery(".scene_nodes").append(response.data.html)
                attachEventsOnNodes();
                // Handle the AJAX success response here
                console.log(response);
            },
            error: function(error) {
                // Handle the AJAX error here
                console.error(error);
            }
        });
    });
});