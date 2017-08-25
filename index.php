<?php
/**
 * Plugin Name: Colby PDF embed
 * Description: A shortcode for embedding pdfs.
 */

add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_script( 'colby-wp-pdf-embed', plugin_dir_url( __FILE__ ) . '/dist/colby-wp-pdf-embed.js', [], '1', true );
} );

add_action( 'init', function() {
	add_shortcode( 'pdf-embed', function( $atts ) {
		if ( ! $atts['url'] ) {
			return '';
		}

		return "<div id=pdf-embed data-url=\"{$atts['url']}\"></div>";
	} );
});
