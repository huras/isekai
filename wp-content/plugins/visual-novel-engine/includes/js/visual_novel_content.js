jQuery( document ).ready(() => {
    new VNEContent();
});

class VNEContent{
    constructor(){
        const face_preview = jQuery('#character_face_preview');
        const setMugShot = (url) => {
            jQuery(face_preview).css('background-image', 'url(' + url + ')');

            const maxWidth = jQuery(face_preview).parent().width();
            const zoom = maxWidth / 100;
            const scale = (jQuery("#post_vne_content").find('.vne_content_scale').val() ?? 0.5) * zoom;
            const x = jQuery("#post_vne_content").find('.vne_content_x').val() ?? 0;
            const y = jQuery("#post_vne_content").find('.vne_content_y').val() ?? 0;
            const size = (1/scale) * (maxWidth);
            
            jQuery(face_preview).css('width', `${size}px`);
            jQuery(face_preview).css('height', `${size}px`);
            jQuery(face_preview).css('transform', `scale(${scale}) `);
            jQuery(face_preview).css('transform-origin', '0% 100%');
            jQuery(face_preview).css('background-position', `${x*100}% ${y*100}%`);

            jQuery("#full_body_preview").attr('src', url);
        }
            
        jQuery('#vne_content_url').on('change,input, load', () => {
            const value = jQuery('#vne_content_url').val();
            setMugShot(value);
        });

        jQuery("#post_vne_content").find('.url, .name, .slug, .vne_content_scale, .vne_content_x, .vne_content_y').off('input').on('input', () => {
            const value = jQuery('#vne_content_url').val();
            setMugShot(value);
        });

        var src_value = jQuery('#vne_content_url').val();
        setMugShot(src_value);






        var customPostTypeTable = jQuery('table.wp-list-table');

        if (jQuery(customPostTypeTable).length) {
            // Set the maximum width for the first column
            var firstColumn = jQuery(customPostTypeTable).find('th:first-child, td:first-child');
            jQuery(firstColumn).css('max-width', '200px');
        }
    }
}