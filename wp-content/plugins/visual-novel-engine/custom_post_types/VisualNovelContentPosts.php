<?php
class VisualNovelContentPosts {
    
    public function __construct() {
        add_action('init', array($this, 'register_custom_post_type'));
        add_action('add_meta_boxes', array($this, 'add_vne_content_metabox'));
        add_action('save_post', array($this, 'save_vne_content_metabox'));
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScreen' ] );
        add_action('manage_visual_novel_content_posts_custom_column', [$this, 'render_custom_column_data'], 10, 2);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_custom_scripts']);
    }

    function enqueue_custom_scripts() {
        $current_screen = get_current_screen();
    
        // Check if the current screen is the listing page for your custom post type
        if ($current_screen->post_type === 'visual_novel_content') {
            wp_enqueue_script('jquery');
            
            // Enqueue your custom JavaScript file
            wp_enqueue_script( 'visual_novel_content', VNE_THEME_URL . 'includes/js/visual_novel_content.js', array( 'jquery' ) );
        }
    }
    
    public function register_custom_post_type() {
        $labels = array(
            'name' => __('Visual Novel Content', 'text_domain'),
            'singular_name' => __('Visual Novel Content', 'text_domain'),
        );
        
        $args = array(
            'labels' => $labels,
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor'),
        );
        
        register_post_type('visual_novel_content', $args);
    }

    function render_custom_column_data($column, $post_id) {
        if ($column == 'post_image') {
              // Replace 'custom_data_column' with the name of the column you want to render
            // echo print_r(get_post_meta($post_id), true);

            ob_start();
            ?>
            <?php
                $maxWidth = floatval(110);
                $zoom = $maxWidth / floatval(100);
                $scale = (!empty(get_post_meta($post_id, '_vne_content_scale', true)) ? floatval(get_post_meta($post_id, '_vne_content_scale', true)) : 0.5) * $zoom;
                $x = !empty(get_post_meta($post_id, '_vne_content_x', true)) ? floatval(get_post_meta($post_id, '_vne_content_x', true)) : 0.5;
                $y = !empty(get_post_meta($post_id, '_vne_content_y', true)) ? floatval(get_post_meta($post_id, '_vne_content_y', true)) : 0.5;
                $size = $scale != 0 ? ((1/$scale) * ($maxWidth)) : $maxWidth;
                $url = get_post_meta($post_id, '_vne_content_url', true);
            ?>
            <div class='face_preview_wrapper admin_listing' style='width: <?= $maxWidth ?>px; height: <?= $maxWidth ?>px; position: relative;'>
                <div 
                    class='face_preview' 
                    style="
                        width: <?php echo $size; ?>px;
                        height: <?php echo $size; ?>px;
                        position: absolute; 
                        background-image: url('<?php echo $url; ?>'); 
                        background-position: <?php echo $x * 100; ?>% <?php echo $y * 100; ?>%; 
                        transform-origin: 0% 100%; 
                        transform: scale(<?php echo $scale; ?>);
                        left: 0;
                        bottom: 0;
                    "
                ></div>
            </div><?php
            $html = ob_get_clean();
            echo $html;
        }
    }
    
    public function add_vne_content_metabox() {
        add_meta_box('vne_content_metabox', __('Visual Novel Content Details', 'text_domain'), array($this, 'render_vne_content_metabox'), 'visual_novel_content', 'normal', 'high');
    }
    
    public function render_vne_content_metabox($post) {
        // Retrieve existing meta values if they exist
        $meta_url = get_post_meta($post->ID, '_vne_content_url', true);
        $meta_name = get_post_meta($post->ID, '_vne_content_name', true);
        $meta_scale = get_post_meta($post->ID, '_vne_content_scale', true);
        $meta_x = get_post_meta($post->ID, '_vne_content_x', true);
        $meta_y = get_post_meta($post->ID, '_vne_content_y', true);
        
        ?>
        <select name="vn_content_type">
            <option value="character">Character</option>
        </select>
        <div id='post_vne_content'>
            
            <div class='full_body_preview_wrapper'>    
                <img src="" alt="" id="full_body_preview">
                <label for="vne_content_url">Character Image URL:</label>
                <input type="text" name="vne_content_url" class="url" id="vne_content_url" value="<?php echo esc_attr($meta_url); ?>" /><br />
            </div>
            
            <div class='character_face_preview_wrapper'>
                <div id="character_face_preview"></div>
            </div>

            <div class='face_preview'>
                <label for="vne_content_scale">Scale:</label>
                <input type="number" step="0.01" name="vne_content_scale" class="vne_content_scale" value="<?php echo esc_attr($meta_scale); ?>" /><br />
                
                <label for="vne_content_x">X Coordinate:</label>
                <input type="number" step="0.01" name="vne_content_x" class="vne_content_x" value="<?php echo esc_attr($meta_x); ?>" /><br />
                
                <label for="vne_content_y">Y Coordinate:</label>
                <input type="number" step="0.01" name="vne_content_y" class="vne_content_y" value="<?php echo esc_attr($meta_y); ?>" /><br />

                <label for="vne_content_url">Face preview:</label>
            </div>
        </div>
        <?php
    }
    
    public function save_vne_content_metabox($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        
        // Save meta values
        if (isset($_POST['vne_content_url'])) {
            update_post_meta($post_id, '_vne_content_url', sanitize_text_field($_POST['vne_content_url']));
        }
        if (isset($_POST['vne_content_name'])) {
            update_post_meta($post_id, '_vne_content_name', sanitize_text_field($_POST['vne_content_name']));
            // Generate and save the slug from the name
            $slug = sanitize_title($_POST['vne_content_name']);
            wp_update_post(array('ID' => $post_id, 'post_name' => $slug));
        }
        if (isset($_POST['vne_content_scale'])) {
            update_post_meta($post_id, '_vne_content_scale', sanitize_text_field($_POST['vne_content_scale']));
        }
        if (isset($_POST['vne_content_x'])) {
            update_post_meta($post_id, '_vne_content_x', sanitize_text_field($_POST['vne_content_x']));
        }
        if (isset($_POST['vne_content_y'])) {
            update_post_meta($post_id, '_vne_content_y', sanitize_text_field($_POST['vne_content_y']));
        }
    }

    public static function enqueueScreen($post_id){
        //Check if is a page screen
        if (!is_admin()) {
            return;
        }
        $screen = get_current_screen();
        
        // Check if the current screen is the post or page editing screen
        if (!($screen && ($screen->base == 'post' || $screen->base == 'page'))) {
            return;
        }

        wp_enqueue_script( 'visual_novel_content', VNE_THEME_URL . 'includes/js/visual_novel_content.js', array( 'jquery' ) );

        $post_meta = get_post_meta($post_id);
        
        wp_localize_script('visual_novel_content', 'VNE', array(
            'post_meta'         => $post_meta,
            'post_id' => $post_id
        ));
    }
}
