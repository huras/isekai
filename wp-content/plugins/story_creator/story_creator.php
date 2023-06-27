<?php
/*
Plugin Name: Story Element Type Metabox
Description: Adds a new post category metabox called "Story Element Type."
Version: 1.0
Author: Your Name
*/

// Add the metabox to the post editor screen
function set_story_element_type_metabox() {
    add_meta_box(
        'story_element_type_metabox',
        'Story Element Type',
        'render_story_element_type_metabox',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'set_story_element_type_metabox');

// Render the metabox content
function render_story_element_type_metabox($post) {
    // Retrieve the current category
    $selected_category = get_post_meta($post->ID, 'story_element_type', true);
    
    // Get all available categories
    $categories = get_categories();
    
    // Output the category dropdown
    ?>
    <label for="story_element_type">Select Story Element Type:</label>
    <select name="story_element_type" id="story_element_type">
        <option value="">None</option>
        <?php foreach ($categories as $category) : ?>
            <option value="<?php echo $category->term_id; ?>" <?php selected($selected_category, $category->term_id); ?>>
                <?php echo $category->name; ?>
            </option>
        <?php endforeach; ?>
    </select>
    <?php
}

// Save the selected category
function save_story_element_type($post_id) {
    if (isset($_POST['story_element_type'])) {
        update_post_meta($post_id, 'story_element_type', $_POST['story_element_type']);
    }
}
add_action('save_post', 'save_story_element_type');


// ==============================================================

// Add custom column to the post listing page
function custom_post_image_column($columns) {
    $new_columns = array();
    $new_columns['post_image'] = 'Image';

    return array_merge($new_columns, $columns);
}
add_filter('manage_posts_columns', 'custom_post_image_column');

// Populate the custom column with the post image miniature
function custom_post_image_column_content($column, $post_id) {
    if ($column == 'post_image') {
        $thumbnail = get_the_post_thumbnail($post_id, array(50, 50));
        echo $thumbnail;
    }
}
add_action('manage_posts_custom_column', 'custom_post_image_column_content', 10, 2);