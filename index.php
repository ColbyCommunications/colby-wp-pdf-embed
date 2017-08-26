<?php
/**
 * Plugin Name: Colby PDF embed
 * Description: A WordPress shortcode for embedding pdfs. [pdf-embed url="//full-pdf-url"]
 * Author: John Watkins, Communications
 */

add_action( 'wp_enqueue_scripts', function() {
	global $post;

	if ( has_shortcode( $post->post_content, 'pdf-embed' ) ) {
		$package_json = json_decode( file_get_contents( __DIR__ . '/../../package.json' ) )
				?: (object) [ 'version' => '1.0.1' ];

		wp_enqueue_script(
			$package_json->name,
			plugin_dir_url( __FILE__ ) . "/dist/{$package_json->name}.min.js",
			[],
			$package_json->version,
			true
		);
	}
} );

function generate_random_string( $length = 10 ) {
	$characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$characters_ength = strlen( $characters );

	$random_string = '';
	for ( $i = 0; $i < $length; $i++ ) {
		$random_string .= $characters[ rand( 0, $characters_length - 1 ) ];
	}

	return $random_string;
}

add_action( 'init', function() {
	add_shortcode( 'pdf-embed', function( $atts ) {
		if ( ! $atts['url'] ) {
			return '';
		}

		$rand = generate_random_string();

		return "<div id=$rand data-pdf-embed data-url=\"{$atts['url']}\"></div>";
	} );
});
