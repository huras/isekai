<?php
/*
Plugin Name: Visual Novel Engine
Description: Adds a visual novel shortcode to run visual novels
Version: 1.0
Author: Huras Alexandre
*/

define( 'VNE_THEME_DIR', plugin_dir_path( __FILE__ ) );
define( 'VNE_THEME_URL', plugin_dir_url( __FILE__ ) );

if( !class_exists('VisualNovelEngine') ){
	include_once( __DIR__ . '/includes/VisualNovelEngine.php' );
    VisualNovelEngine::hooks();
}

if( !class_exists('VisualNovelContentPosts') ){
	include_once( __DIR__ . '/custom_post_types/VisualNovelContentPosts.php' );
    new VisualNovelContentPosts();
}