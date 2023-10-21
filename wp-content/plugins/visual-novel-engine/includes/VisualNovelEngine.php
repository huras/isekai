<?php



class VisualNovelEngine {

    public static function hooks(){
        add_action( 'admin_enqueue_scripts', [ 'VisualNovelEngine', 'enqueueScreen' ] );
        add_shortcode( 'VisualNovelEngine', [ 'VisualNovelEngine', 'renderScreen' ] );

        add_shortcode( 'ElysiumChronicles', [ 'VisualNovelEngine', 'ElysiumChronicles' ] );
        add_action('add_meta_boxes', [ 'VisualNovelEngine', 'add_custom_page_meta_box' ]);

        add_action('wp_ajax_get_vne_node_template', [ 'VisualNovelEngine', 'get_vne_node_template' ]);
        add_action('save_post_page', [ 'VisualNovelEngine', 'save_custom_page_meta_box_data' ]);
    }

    // Define a callback function to render the content of your meta box
    public static function custom_page_meta_box_content($post) {
        // Get the existing meta value, if any
        $scene_nodes = get_post_meta($post->ID, 'scene_nodes', true);
        if(!empty($scene_nodes)){
            $scene_nodes = json_decode($scene_nodes, true);
        }

        // $scene_nodes = [
        //     [
        //         'node_type' => 'set_background',
        //         'url' => 'http://isekai.hurast.com/wp-content/uploads/visual_novel_backgrounds/00041-2534950232.png'
        //     ]
        // ];
        echo print_r($scene_nodes, true);
        ?>
            <input type="hidden" id='scenes_nodes_json' name='scenes_nodes_json'>
            <div class='scene_nodes'>
                <?php
                    foreach($scene_nodes as $scene_node){
                        echo self::render_node($scene_node);
                    }
                ?>
            </div>
            <button type='button' class='button primary-button' id='add_scene_node_btn'>+ Add node</button>
        <?php
    }

    public static function get_vne_node_template(){
        wp_send_json_success([
            'html' => self::render_node()
        ]);
    }

    public static function render_node($scene_node = []){
        ob_start();
        ?>
        <div class='scene_node'>
            <?php
                $select_options = array(
                    'BG' => array(
                        'set_background' => 'Set background',
                        'define_actor' => 'Define actor'
                    ),
                    'Characters' => array(
                        'show_character' => 'Show Character',
                        'clean_characters' => 'Clean Characters',
                    ),
                    'Story' => array(
                        'show_narration' => 'Show Narration',
                        'show_dialog' => 'Show Dialog',
                    ),
                );
                
                // Output the select element
            ?>
            <div class='node_body'>
                <select name="node_type" class="node_type_select">
                    <?php
                    foreach ($select_options as $group_label => $options) {
                        echo '<optgroup label="' . esc_attr($group_label) . '">';
                        foreach ($options as $value => $label) {
                            echo '<option '.selected($value == $scene_node['node_type']).' value="' . esc_attr($value) . '">' . esc_html($label) . '</option>';
                        }
                        echo '</optgroup>';
                    }
                    ?>
                </select>
                <div class='contents'>
                    <div class='set_background'>
                        <img src="<?= $scene_node['url'] ?>" class='background_preview'>
                        <input class='url_input' value='<?= $scene_node['url'] ?>' type='text'></input>                    
                    </div>

                    <div class='show_narration'>
                        <textarea class='text_input'><?= $scene_node['text'] ?></textarea>
                    </div>

                    <div class='define_actor'>
                        <img src="<?= $scene_node['url'] ?>" class='actor_preview'>

                        <div class='input-column'>
                            <input class='url' value='<?= $scene_node['url'] ?>' type='text' placeholder='http://' title='http://'></input>
                            <input class='name' value='<?= $scene_node['name'] ?>' type='text' placeholder='name' title='name'></input>
                            <input class='slug' value='<?= $scene_node['slug'] ?>' type='text' placeholder='slug' title='slug'></input>
                        </div>
                        
                        <div class='face_preview_wrapper'>
                            <div class='face_preview'></div>
                        </div>

                        <div class='input-column'>                            
                            <input class='scale' value='<?= $scene_node['face_point']['scale'] ?>' type='number' step='0.01' type='text' placeholder='zoom' title='zoom'></input>
                            <input class='x' value='<?= $scene_node['face_point']['x'] ?>' type='number' step='0.01' placeholder='x' title='x'></input>
                            <input class='y' value='<?= $scene_node['face_point']['y'] ?>' type='number' step='0.01' placeholder='y' title='y'></input>
                        </div>
                    </div>
                </div>
                <button type='button' class='delete_node_btn'>Delete</button>
            </div>
            <button type='button' class='add_node_below_btn' title="Add event below"> + </button>
        </div>
        <?php
        return ob_get_clean();
    }

    // Define a function to save the meta box data
    public static function save_custom_page_meta_box_data($post_id) {
        // if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        // if (!current_user_can('edit_page', $post_id)) return;

        $custom_meta_value = $_POST['scenes_nodes_json'];
        // if(!empty($custom_meta_value)){
        //     $custom_meta_value = json_decode($custom_meta_value, true);
        // }
        update_post_meta($post_id, 'scene_nodes', $custom_meta_value);
    }    

    // Hook to add the meta box to the page editing screen
    public static function add_custom_page_meta_box() {
        add_meta_box(
            'custom_page_meta_box',
            'Scene Builder',
            ['VisualNovelEngine', 'custom_page_meta_box_content'],
            'page',
            'normal',
            'high'
        );
    }

    public static function renderScreen(){
        if (is_admin() || defined('DOING_AJAX')) {
            // If in the admin editor, return the shortcode as-is
            return "[VisualNovelEngine]";
        }

        global $post;
        self::enqueueScreen($post->ID);
        ?>
            <section id="screen">
                <div class="background">
                </div>
                <div class="characters">
                </div>
                <div class="dialog-window">
                    <div class="speaker vn-window">
                        <div class="mugshot-placeholder">
                            <div class="mugshot"></div>
                        </div>
                        <div class="name"></div>
                    </div>
                    <div class="text vn-window "></div>
                </div>
            </section>
            <div>
                Page <span class="page-number"></span> of <span class="total-pages"></span>
            </div>
        <?php
    }

    public static function enqueueScreen($post_id){
        //css
        wp_enqueue_style( 'visual_novel_story_engine', VNE_THEME_URL . 'includes/css/visual_novel_story_engine.css' );
        if(is_admin())
            wp_enqueue_style( 'visual_novel_story_creator', VNE_THEME_URL . 'includes/css/story_engine_creator.css' );

        //js
        if(is_admin())
            wp_enqueue_script( 'visual_novel_story_creator', VNE_THEME_URL . 'includes/js/story_engine_creator.js', array( 'jquery' ) );
        wp_enqueue_script( 'visual_novel_story_engine', VNE_THEME_URL . 'includes/js/visual_novel_story_engine.js', array( 'jquery' ) );

        $scene_nodes = get_post_meta($post_id, 'scene_nodes', true);
        if(!empty($scene_nodes)){
            $scene_nodes = json_decode($scene_nodes, true);
        }
        wp_localize_script('visual_novel_story_engine', 'VNE', array(
            'scene_nodes'         => $scene_nodes,
            'post_id' => $post_id
        ));
    }

    public static function ElysiumChronicles(){
        //js
        wp_enqueue_script( 'elysium-chronicles', VNE_THEME_URL . 'includes/js/stories/elysium.js', array( 'jquery' ) );
    }
    
}